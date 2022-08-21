import { WEAPON_TRAITS } from "../item/weapon.js";

export class RollHelper {
    static async createCheckRoll(r, htmlHeader, htmlContent) {
        // Perform roll
        const roll = await r.roll({ async: true });
        // Get number of each hit type
        const weakHits = roll.dice[0].results.filter(x => x.result === 4 || x.result === 5).length;
        const strongHits = roll.dice[0].results.filter(x => x.result === 6).length;

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

        let html = "";
        html += `<p class="check-hit ${hitClass}">${hitType}</p>`;
        html += await roll.getTooltip();

        if (htmlContent) {
            html += htmlContent;
        }

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

    static createAttributeCheckRoll(attributeName, attributeValue, rollData) {
        const r = new Roll(`${attributeValue}d6`, rollData);
        this.createCheckRoll(r, `<h4 class="action">Attribute: ${attributeName}</h4>`);
    }

    static async createWeaponCheckRoll(item, attributeValue, rollData) {
        let dice = attributeValue;
        if (item.data.data.tags.some(x => x.name === "precise"))
            dice += 1;

        const r = new Roll(`${dice}d6`, rollData);
        const tagLabels = item.data.data.tags.map(x => ({ ...WEAPON_TRAITS.find(y => x.name === y.name), value: x.value }));
        const content = await renderTemplate("systems/infinite-revolution/templates/chat/action/attack.html", { item: item.data, tagLabels });
        this.createCheckRoll(r, content);
    }
}