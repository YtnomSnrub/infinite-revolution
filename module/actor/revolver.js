import { Helper } from "../helper.js";
import { RollHelper } from "../chat/rollHelper.js";

import { WEAPON_TRAITS } from "../item/weapon.js";

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

    context.items.weapons = context.data.items.filter(x => x.type === 'weapon').map(item => ({
      ...item,
      tagLabels: item.data.tags.map(x => ({ ...WEAPON_TRAITS.find(y => x.name === y.name), value: x.value }))
    }));

    context.items.powers = context.data.items.filter(x => x.type === 'power');
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
    html.find(".item-icon").on("click", this._onItemSendToChat.bind(this));
    html.find(".item-name").on("click", this._onItemExpand.bind(this));
    html.find(".item-control[data-action='create']").on("click", this._onItemCreate.bind(this));
    html.find(".item-control[data-action='edit']").on("click", this._onItemEdit.bind(this));
    html.find(".item-control[data-action='delete']").on("click", this._onItemDelete.bind(this));
    
    html.find("[data-action='message']").on("click", this._onSendToChat.bind(this));
  }

  /**
   * Listen for roll buttons on attributes.
   * @param {MouseEvent} event The originating left click event
   */
  _onAttributeRoll(event) {
    event.preventDefault();
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
    event.preventDefault();
    event.currentTarget.select();
  }

  /**
   * Listen for click events on item expand button.
   * @param {MouseEvent} event The originating left click event
   */
  _onItemSendToChat(event) {
    event.preventDefault();

    const button = event.currentTarget;
    const li = button.closest(".item");
    const item = this.actor.items.get(li?.dataset.itemId);
    if (item.data.data.tags) {
      item.data.data.tagLabels = item.data.data.tags.map(x => ({ ...WEAPON_TRAITS.find(y => x.name === y.name), value: x.value }));
    }

    Helper.sendItemToChat(item);
  }

  /**
   * Listen for click events on item expand button.
   * @param {MouseEvent} event The originating left click event
   */
  async _onSendToChat(event) {
    event.preventDefault();

    const button = event.currentTarget;
    await ChatMessage.create({
      rollMode: game.settings.get("core", "rollMode"),
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content: this.object.data.data[button?.dataset.attribute]
  });
  }

  /**
   * Listen for click events on item expand button.
   * @param {MouseEvent} event The originating left click event
   */
  _onItemExpand(event) {
    event.preventDefault();

    const button = event.currentTarget;
    const $li = $(button.closest(".item"));

    if ($li.hasClass("expanded")) {
      $li.children(".item-summary").slideUp(200);
      $li.removeClass("expanded");
    } else {
      $li.children(".item-summary").slideDown(200);
      $li.addClass("expanded");
    }
  }

  /**
   * Listen for click events on item create button.
   * @param {MouseEvent} event The originating left click event
   */
  _onItemCreate(event) {
    event.preventDefault();

    const button = event.currentTarget;
    const cls = getDocumentClass("Item");
    return cls.create({ name: game.i18n.localize("IR.ItemNew"), type: button.dataset.itemType }, { parent: this.actor });
  }

  /**
   * Listen for click events on item edit button.
   * @param {MouseEvent} event The originating left click event
   */
  _onItemEdit(event) {
    event.preventDefault();

    const button = event.currentTarget;
    const li = button.closest(".item");
    const item = this.actor.items.get(li?.dataset.itemId);
    return item.sheet.render(true);
  }

  /**
   * Listen for click events on item delete button.
   * @param {MouseEvent} event The originating left click event
   */
  _onItemDelete(event) {
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
    event.preventDefault();

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
