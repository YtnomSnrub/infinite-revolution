import { WEAPON_TRAITS } from "../item/weapon.js";

export class RollHelper {
    static async createCheckRoll(r, htmlHeader, htmlContent, options = {}) {
        // Perform roll
        const roll = await r.roll({ async: true });
        // Get number of each hit type
        const results = roll.dice[0].results.filter(x => x.active !== false);
        const weakHits = results.filter(x => x.result >= (options.weakHitMinimum || 4)).length;
        const strongHits = results.filter(x => x.result >= (options.strongHitMinimum || 6)).length;

        // Calculate hit type
        let hitType = game.i18n.localize("IR.CheckResultNull");
        let hitClass = "hit-null";
        if (strongHits >= 2) {
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

    static async createAttributeCheckRoll(attributeName, attributeTitle, attributeValue, rollData) {
        const r = new Roll(`${attributeValue}d6`, rollData);
        const header = await renderTemplate("systems/infinite-revolution/templates/chat/action/attribute-header.html", { attributeName, attributeTitle });
        this.createCheckRoll(r, header);
    }

    static async createWeaponCheckRoll(item, attributeValue, rollData) {
        let dice = attributeValue;
        if (item.data.data.tags.some(x => x.name === "precise"))
            dice += 1;

        const r = new Roll(`${dice}d6`, rollData);
        const tagLabels = item.data.data.tags.map(x => ({ ...WEAPON_TRAITS.find(y => x.name === y.name), value: x.value }));
        const header = await renderTemplate("systems/infinite-revolution/templates/chat/action/attack-header.html", { item: item.data, tagLabels });
        const content = await renderTemplate("systems/infinite-revolution/templates/chat/action/attack-body.html", { item: item.data, tagLabels });
        this.createCheckRoll(r, header, content, { strongHitMinimum: item.data.data.strongHitMinimum });
    }

    static async createWeaponParryRoll(item, rollData) {
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
        const html = content + `<div class="result-data"><p class="check-hit ${hitClass}">${hitType}</p>${await roll.getTooltip()}</div>`;

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
