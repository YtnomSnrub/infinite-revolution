import { Helper } from "../helper.js";
import { RollHelper } from "../chat/rollHelper.js";

import { ActorSheetIR } from "./actorSheet.js";

import { WEAPON_TRAITS } from "../item/weapon.js";

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class ActorSheetRevolver extends ActorSheetIR {
  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["infinite-revolution", "sheet", "actor"],
      template: "systems/infinite-revolution/templates/actor/actor-sheet-revolver.html",
      width: 600,
      height: 600,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "core" }],
      dragDrop: [{ dragSelector: ".item-list .item, .sheet-section.item", dropSelector: null }]
    });
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  getData() {
    const context = super.getData();
    context.actor = this.actor.data.toObject(false);
    context.systemData = context.data.data;

    // Add weapons
    context.items.weapons = context.data.items.filter(x => x.type === 'weapon').map(item => ({
      ...item,
      tagLabels: item.data.tags.map(x => ({ ...WEAPON_TRAITS.find(y => x.name === y.name), value: x.value })),
      hasParry: item.data.tags.some(x => x.name === "parry")
    }));

    // Add powers
    context.items.powers = context.data.items.filter(x => x.type === 'power');
    // Add sections
    context.items.sections = context.data.items.filter(x => x.type === 'section');

    return context;
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Form controls
    html.find(".title-color-indicator").on("click", this._onToggleTitleTheme.bind(this));
    html.find(".attribute label").on("click", this._onAttributeRoll.bind(this));

    // Weapon actions
    html.find(".weapon-attribute").on("click", this._onWeaponAttack.bind(this));
    html.find(".weapon-action[data-action='parry']").on("click", this._onWeaponParry.bind(this));
    // Item controls
    html.find(".item-name").on("click", this._onItemExpand.bind(this));
    html.find(".item-control[data-action='create']").on("click", this._onItemCreate.bind(this));
    html.find(".item-control[data-action='edit']").on("click", this._onItemEdit.bind(this));
    html.find(".item-control[data-action='delete']").on("click", this._onItemDelete.bind(this));
    html.find(".item-action[data-action='message']").on("click", this._onItemSendToChat.bind(this));
    html.find("input[data-action='resource-edit']").on("change", this._onChangeResourceValue.bind(this));
  }

  /**
   * Listen for click on toggle title theme button.
   * @param {MouseEvent} event The originating left click event
   */
  _onToggleTitleTheme(event) {
    event.preventDefault();
    if (this.object.data.data.titleTheme === "dark") {
      this.object.update({ "data.titleTheme": "light" });
    } else {
      this.object.update({ "data.titleTheme": "dark" });
    }
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
    RollHelper.createAttributeCheckRoll(attribute, title, attributeValue, this.actor.getRollData());
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

    Helper.sendItemToChat(item, this.object.data.data.color);
  }

  /**
   * Listen for resource value change events.
   * @param {MouseEvent} event The originating left click event
   */
  _onChangeResourceValue(event) {
    event.preventDefault();

    const input = event.currentTarget;
    const li = input.closest(".item");
    const item = this.actor.items.get(li?.dataset.itemId);
    item.update({ "data.resource.value": input.value });
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

  /**
   * Listen for parry events on weapons.
   * @param {MouseEvent} event The originating left click event
   */
  _onWeaponParry(event) {
    event.preventDefault();

    let button = event.currentTarget;
    const li = button.closest(".item");
    const item = this.actor.items.get(li?.dataset.itemId);

    RollHelper.createWeaponParryRoll(item, this.actor.getRollData());
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  _getSubmitData(updateData) {
    let formData = super._getSubmitData(updateData);
    return formData;
  }
}
