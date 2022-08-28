import { Helper } from "../util/helper.js";

export class RollHelper {
  static async createCheckRoll(r, htmlHeader, htmlContent, options = {}) {
    // Perform roll
    const roll = await r.roll({ async: true });
    // Get number of each hit type
    const results = roll.dice[0].results.filter(x => x.active !== false);
    const weakHits = results.filter(x => x.result >= (options.weakHitMinimum || 4)).length;
    const strongHits = results.filter(x => x.result >= (options.strongHitMinimum || 6)).length;
    const criticalHits = results.filter(x => x.result >= 6).length;

    // Calculate hit type
    let hitType = game.i18n.localize("IR.CheckResultNull");
    let hitClass = "hit-null";
    if (criticalHits >= 2) {
      hitType = game.i18n.localize("IR.CheckResultCrit");
      hitClass = "hit-crit";
    } else if (strongHits >= 1) {
      hitType = game.i18n.localize("IR.CheckResultStrong");
      hitClass = "hit-strong";
    } else if (weakHits >= 1) {
      hitType = game.i18n.localize("IR.CheckResultWeak");
      hitClass = "hit-weak";
    }

    let html = htmlContent || "";
    html += `<div class="result-data"><p class="check-hit ${hitClass}">${hitType}</p>${await roll.getTooltip()}</div>`;

    // Send roll message
    await ChatMessage.create({
      roll: roll,
      type: CONST.CHAT_MESSAGE_TYPES.ROLL,
      rollMode: game.settings.get("core", "rollMode"),
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      flavor: htmlHeader,
      content: html
    });
  }

  static async getRollFromValue(value, rollData, useModifiers) {
    let modifier = 0;
    if (useModifiers) {
      const dialogHtml = await renderTemplate("systems/infinite-revolution/templates/dialogs/dialog-check-modifiers.html");

      modifier = await new Promise(resolve => {
        const dialog = new Dialog({
          title: game.i18n.localize("IR.CheckModifier"),
          content: dialogHtml,
          buttons: {
            roll: {
              label: game.i18n.localize("IR.CheckRoll"),
              callback: html => resolve(Number.parseInt(html[0].querySelector("form")["modifier-value"].value, 10))
            }
          },
          default: "roll",
          close: () => resolve(null),
          render: () => {
            dialog.element.find("[data-modifier]").on("click", event => {
              event.preventDefault();
              const button = event.currentTarget;
              resolve(Number.parseInt(button.dataset.modifier, 10));
              dialog.close();
            });
          }
        }, { width: 280 }).render(true);
      });
    }

    if (modifier === null) return;

    if (!Number.isSafeInteger(modifier)) modifier = 0;

    if (value + modifier > 0) {
      return new Roll(`${value + modifier}d6`, rollData);
    } else {
      return new Roll("2d6kl", rollData);
    }
  }

  static async createAttributeCheckRoll(attributeName, attributeTitle, attributeValue, rollData, useModifiers) {
    const r = await this.getRollFromValue(attributeValue, rollData, useModifiers);
    if (r) {
      const header = await renderTemplate("systems/infinite-revolution/templates/chat/action/attribute-header.html", { attributeName, attributeTitle });
      this.createCheckRoll(r, header);
    }
  }

  static async createWeaponCheckRoll(item, actor, attributeValue, useModifiers) {
    const rollData = actor.getRollData();

    // Apply modifiers
    const dice = attributeValue + Helper.getAttackModifier(item, actor);
    // Determine harm
    let harm = item.data.data.harm;
    const harmBonus = Helper.getHarmModifier(item, actor);
    if (Number.isNumeric(item.data.data.harm)) {
      const harmValue = Number.parseInt(item.data.data.harm, 10);
      harm = harmValue + harmBonus;
    } else if (harmBonus > 0) {
      harm = `${item.data.data.harm} [+${harmBonus}]`;
    } else if (harmBonus < 0) {
      harm = `${item.data.data.harm} [-${-harmBonus}]`;
    }

    const r = await this.getRollFromValue(dice, rollData, useModifiers);
    if (r) {
      const weaponTags = Helper.modifyItemLabels(item, actor);
      const tagLabels = weaponTags.map(x => ({ ...CONFIG.IR.weaponTraits.find(y => x.name === y.name), value: x.value }));

      const header = await renderTemplate("systems/infinite-revolution/templates/chat/action/attack-header.html", { item: item.data, tagLabels });
      const content = await renderTemplate("systems/infinite-revolution/templates/chat/action/attack-body.html", { item: item.data, harm, tagLabels });
      this.createCheckRoll(r, header, content, { strongHitMinimum: item.data.data.strongHitMinimum });
    }
  }

  static async createWeaponParryRoll(item, actor) {
    const rollData = actor.getRollData();

    const parryDice = item.data.data.parryDice || 1;
    const r = new Roll(`${parryDice}d6`, rollData);
    // Perform roll
    const roll = await r.roll({ async: true });
    // Get number of each hit type
    const results = roll.dice[0].results.filter(x => x.active !== false);
    const strongHits = results.filter(x => x.result >= 6).length;

    // Calculate hit type
    let hitType = game.i18n.localize("IR.CheckResultFailure");
    let hitClass = "hit-failure";
    if (strongHits >= 1) {
      hitType = game.i18n.localize("IR.CheckResultSuccess");
      hitClass = "hit-success";
    }

    const header = await renderTemplate("systems/infinite-revolution/templates/chat/action/parry-header.html", { item: item.data });
    const content = await renderTemplate("systems/infinite-revolution/templates/chat/action/parry-body.html", { item: item.data });
    const html = `${content}<div class="result-data"><p class="check-hit ${hitClass}">${hitType}</p>${await roll.getTooltip()}</div>`;

    // Send roll message
    await ChatMessage.create({
      roll: roll,
      type: CONST.CHAT_MESSAGE_TYPES.ROLL,
      rollMode: game.settings.get("core", "rollMode"),
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      flavor: header,
      content: html
    });
  }
}
