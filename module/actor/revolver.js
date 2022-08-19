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
    context.items.weapons = context.data.items.filter(x => x.type === 'weapon');
    return context;
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Form controls
    html.find(".attribute label").on("click", this._onAttributeRoll.bind(this));
    html.find("input").on("focus", this._onInputClick.bind(this));

    // Item attacks
    html.find(".weapon-attribute").on("click", this._onWeaponAttack.bind(this));
    // Item controls
    html.find(".weapon-control[data-action='create']").on("click", this._onWeaponCreate.bind(this));
    html.find(".weapon-control[data-action='edit']").on("click", this._onWeaponEdit.bind(this));
    html.find(".weapon-control[data-action='delete']").on("click", this._onWeaponDelete.bind(this));
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
    RollHelper.createAttributeCheckRoll(title, attributeValue, this.actor.getRollData());
  }

  /**
   * Listen for click events on inputs.
   * @param {MouseEvent} event The originating left click event
   */
  _onInputClick(event) {
    event.currentTarget.select();
  }

  /**
   * Listen for click events on weapon create button.
   * @param {MouseEvent} event The originating left click event
   */
  _onWeaponCreate(event) {
    const cls = getDocumentClass("Item");
    return cls.create({name: game.i18n.localize("IR.ItemNew"), type: "weapon"}, {parent: this.actor});
  }

  /**
   * Listen for click events on weapon edit button.
   * @param {MouseEvent} event The originating left click event
   */
  _onWeaponEdit(event) {
    event.preventDefault();
    
    const button = event.currentTarget;
    const li = button.closest(".item");
    const item = this.actor.items.get(li?.dataset.itemId);
    return item.sheet.render(true);
  }

  /**
   * Listen for click events on weapon delete button.
   * @param {MouseEvent} event The originating left click event
   */
  _onWeaponDelete(event) {
    event.preventDefault();

    const button = event.currentTarget;
    const li = button.closest(".item");
    const item = this.actor.items.get(li?.dataset.itemId);
    return item.delete();
  }

  /**
   * Listen for attack events on weapons.
   * @param {MouseEvent} event The originating left click event
   */
  _onWeaponAttack(event) {
    let button = event.currentTarget;
    const attribute = button?.dataset.attribute;
    const attributeValue = this.getData().systemData.attributes[attribute].value;

    const li = button.closest(".item");
    const item = this.actor.items.get(li?.dataset.itemId);

    RollHelper.createWeaponCheckRoll(item, attributeValue, this.actor.getRollData());
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  _getSubmitData(updateData) {
    let formData = super._getSubmitData(updateData);
    return formData;
  }
}
