import { ActorSheetIR } from "./actorSheet.js";

/**
 * Extend the basic ActorSheet with Veil functionality.
 * @extends {ActorSheet}
 */
export class ActorSheetVeil extends ActorSheetIR {

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["infinite-revolution", "sheet", "actor"],
      template: "systems/infinite-revolution/templates/actor/actor-sheet-veil.html",
      width: 600,
      height: 600,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "core" }]
    });
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  getData() {
    const context = super.getData();
    context.actor = this.actor.data.toObject(false);
    context.systemData = context.data.data;

    // Add attacks
    context.items.attacks = context.data.items.filter(x => x.type === "attack").map(item => ({
      ...item,
      tagLabels: item.data.tags.map(x => ({ ...CONFIG.IR.weaponTraits.find(y => x.name === y.name), value: x.value }))
    }));

    // Add powers
    context.items.powers = context.data.items.filter(x => x.type === "power");
    // Add sections
    context.items.sections = context.data.items.filter(x => x.type === "section");

    return context;
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;
  }

  /** @inheritdoc */
  _getSubmitData(updateData) {
    let formData = super._getSubmitData(updateData);
    return formData;
  }
}
