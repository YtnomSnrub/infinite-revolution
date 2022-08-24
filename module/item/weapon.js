import { Helper } from "../helper.js";
import { TraitSelector } from "../traitSelector.js";

export const WEAPON_TRAITS = [
  { "name": "agile", "label": "IR.WeaponTagAgile", "description": "IR.WeaponTagAgileDescription", "type": "boolean" },
  { "name": "anchor", "label": "IR.WeaponTagAnchor", "description": "IR.WeaponTagAnchorDescription", "type": "number" },
  { "name": "burst", "label": "IR.WeaponTagBurst", "description": "IR.WeaponTagBurstDescription", "type": "boolean" },
  { "name": "cooldown", "label": "IR.WeaponTagCooldown", "description": "IR.WeaponTagCooldownDescription", "type": "boolean" },
  { "name": "fracture", "label": "IR.WeaponTagFracture", "description": "IR.WeaponTagFractureDescription", "type": "boolean" },
  { "name": "decel", "label": "IR.WeaponTagDecel", "description": "IR.WeaponTagDecelDescription", "type": "number" },
  { "name": "disrupt", "label": "IR.WeaponTagDisrupt", "description": "IR.WeaponTagDisruptDescription", "type": "boolean" },
  { "name": "leech", "label": "IR.WeaponTagLeech", "description": "IR.WeaponTagLeechDescription", "type": "boolean" },
  { "name": "lock", "label": "IR.WeaponTagLock", "description": "IR.WeaponTagLockDescription", "type": "boolean" },
  { "name": "massless", "label": "IR.WeaponTagMassless", "description": "IR.WeaponTagMasslessDescription", "type": "boolean" },
  { "name": "overwhelm", "label": "IR.WeaponTagOverwhelm", "description": "IR.WeaponTagOverwhelmDescription", "type": "boolean" },
  { "name": "parry", "label": "IR.WeaponTagParry", "description": "IR.WeaponTagParryDescription", "type": "boolean" },
  { "name": "pierce", "label": "IR.WeaponTagPierce", "description": "IR.WeaponTagPierceDescription", "type": "boolean" },
  { "name": "precise", "label": "IR.WeaponTagPrecise", "description": "IR.WeaponTagPreciseDescription", "type": "boolean" },
  { "name": "prime", "label": "IR.WeaponTagPrime", "description": "IR.WeaponTagPrimeDescription", "type": "boolean" },
  { "name": "slowing", "label": "IR.WeaponTagSlowing", "description": "IR.WeaponTagSlowingDescription", "type": "boolean" },
  { "name": "stun", "label": "IR.WeaponTagStun", "description": "IR.WeaponTagStunDescription", "type": "boolean" },
  { "name": "taxing", "label": "IR.WeaponTagTaxing", "description": "IR.WeaponTagTaxingDescription", "type": "boolean" },
  { "name": "weaken", "label": "IR.WeaponTagWeaken", "description": "IR.WeaponTagWeakenDescription", "type": "boolean" },
];

/**
 * ItemSheet for weapons used by actors
 * @extends {ItemSheet}
 */
export class ItemSheetWeapon extends ItemSheet {

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["infinite-revolution", "sheet", "item"],
      template: "systems/infinite-revolution/templates/item/item-sheet-weapon.html",
      width: 520,
      height: 480,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }],
    });
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  getData() {
    const context = super.getData();
    context.systemData = context.data.data;
    context.tagLabels = context.systemData.tags.map(x => ({...WEAPON_TRAITS.find(y => x.name === y.name), value: x.value}));
    return context;
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    html.find(".weapon-control[data-action='tags']").on("click", this._onTagSelector.bind(this));
  }

  /* -------------------------------------------- */

  _onTagSelector(event) {
    event.preventDefault();
    const selectorOptions = {
      title: "Weapon Tags",
      traits: WEAPON_TRAITS,
      objectProperty: "data.tags",
    };

    new TraitSelector(this.item, selectorOptions).render(true);
  }

  /* -------------------------------------------- */

  /** @override */
  _getSubmitData(updateData) {
    let formData = super._getSubmitData(updateData);
    return formData;
  }
}
