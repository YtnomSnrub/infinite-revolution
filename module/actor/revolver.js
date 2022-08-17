import { EntitySheetHelper } from "../helper.js";
import { RollHelper } from "../rollHelper.js";

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class ActorSheetRevolver extends ActorSheet {

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["infinite-revolution", "sheet", "actor"],
      template: "systems/infinite-revolution/templates/actor/actor-sheet-revolver.html",
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
    return context;
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Item Controls
    html.find(".attribute label").on("click", this._onAttributeRoll.bind(this));
  }

  /**
   * Listen for roll buttons on attributes.
   * @param {MouseEvent} event The originating left click event
   */
  _onAttributeRoll(event) {
    let button = $(event.currentTarget);
    const title = button.text();
    const attribute = button.data("attribute");
    const attributeValue = this.getData().systemData.attributes[attribute].value;
    RollHelper.createCheckRoll(title, attributeValue, this.actor.getRollData());
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  _getSubmitData(updateData) {
    let formData = super._getSubmitData(updateData);
    return formData;
  }
}
