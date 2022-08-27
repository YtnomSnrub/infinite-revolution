import { Helper } from "../util/helper.js";

/**
 * Extend the basic ActorSheet for Infinite Revolution.
 * @extends {ActorSheet}
 */
export class ActorSheetIR extends ActorSheet {
  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      scrollY: [".sheet-body"]
    });
  }

  /** @inheritdoc */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    html.find("input").on("focus", this._onInputClick.bind(this));
    // Item controls
    html.find(".item-name").on("click", this._onItemExpand.bind(this));
    html.find(".item-control[data-action='create']").on("click", this._onItemCreate.bind(this));
    html.find(".item-control[data-action='edit']").on("click", this._onItemEdit.bind(this));
    html.find(".item-control[data-action='delete']").on("click", this._onItemDelete.bind(this));
    html.find(".item-action[data-action='message']").on("click", this._onItemSendToChat.bind(this));
    html.find(".effect-action[data-action='message']").on("click", this._onEffectSendToChat.bind(this));
    html.find("input[data-action='resource-edit']").on("change", this._onChangeResourceValue.bind(this));
  }

  /**
   * Listen for click events on item send to chat button.
   * @param {MouseEvent} event The originating left click event
   */
  _onItemSendToChat(event) {
    event.preventDefault();

    const button = event.currentTarget;
    const li = button.closest(".item");
    const item = this.actor.items.get(li?.dataset.itemId);
    if (item.data.data.tags) {
      item.data.data.tagLabels = item.data.data.tags.map(x => ({ ...CONFIG.IR.weaponTraits.find(y => x.name === y.name), value: x.value }));
    }

    Helper.sendItemToChat(item, this.object.data.data.color);
  }

  /**
   * Listen for click events on effect send to chat button.
   * @param {MouseEvent} event The originating left click event
   */
  _onEffectSendToChat(event) {
    event.preventDefault();

    const button = event.currentTarget;
    const li = button.closest(".effect");
    const effect = this.actor.effects.get(li?.dataset.effectId);
    Helper.sendEffectToChat(effect, this.object.data.data.color);
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
   * Listen for click events on inputs.
   * @param {MouseEvent} event The originating left click event
   */
  _onInputClick(event) {
    event.preventDefault();
    event.currentTarget.select();
  }
}
