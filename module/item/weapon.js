import { ItemSheetIR } from "./itemSheet.js";

import { TraitSelector } from "../util/traitSelector.js";

/**
 * ItemSheet for weapons used by actors
 * @extends {ItemSheet}
 */
export class ItemSheetWeapon extends ItemSheetIR {

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["infinite-revolution", "sheet", "item"],
      template: "systems/infinite-revolution/templates/item/item-sheet-weapon.html",
      width: 520,
      height: 480,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
    });
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  getData() {
    const context = super.getData();
    context.systemData = context.data.data;
    context.tagLabels = context.systemData.tags.map(x => ({ ...CONFIG.IR.weaponTraits.find(y => x.name === y.name), value: x.value }));
    context.hasParry = context.systemData.tags.some(x => x.name === "parry");
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
      traits: CONFIG.IR.weaponTraits,
      objectProperty: "data.tags"
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
