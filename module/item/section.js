import { ItemSheetIR } from "./itemSheet.js";

import { ActiveEffectIR } from "../effects/activeEffect.js";

/**
 * ItemSheet for sections within actor sheets
 * @extends {ItemSheet}
 */
export class ItemSheetTab extends ItemSheetIR {

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["infinite-revolution", "sheet", "item"],
      template: "systems/infinite-revolution/templates/item/item-sheet-section.html",
      width: 520,
      height: 520,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
    });
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  getData() {
    const context = super.getData();
    context.systemData = context.data.data;
    // Prepare active effects
    context.effectCategories = ActiveEffectIR.prepareActiveEffectCategories(this.item.effects);
    return context;
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Active Effect management
    html.find(".effect-control").click(ev => ActiveEffectIR.onManageActiveEffect(ev, this.item));
  }

  /* -------------------------------------------- */

  /** @override */
  _getSubmitData(updateData) {
    let formData = super._getSubmitData(updateData);
    return formData;
  }
}
