/**
 * Extend the base ActiveEffect class to implement system-specific logic.
 * @extends {ActiveEffect}
 */
export class ActiveEffectIR extends ActiveEffect {

  /**
   * Is this active effect currently suppressed?
   * @type {boolean}
   */
  isSuppressed = false;

  /* --------------------------------------------- */

  /** @inheritdoc */
  apply(actor, change) {
    if (this.isSuppressed) return null;

    if (change.key.startsWith("flags.ir.")) change = this._prepareFlagChange(actor, change);

    return super.apply(actor, change);
  }

  /* --------------------------------------------- */

  /**
   * Transform the data type of the change to match the type expected for flags.
   * @param {Actor} actor              The Actor to whom this effect should be applied.
   * @param {EffectChangeData} change  The change being applied.
   * @returns {EffectChangeData}       The change with altered types if necessary.
   */
  _prepareFlagChange(actor, change) {
    const { key, value } = change;
    const data = CONFIG.IR.characterFlags[key.replace("flags.ir.", "")];
    if (!data) return change;

    // Set flag to initial value if it isn't present
    const current = foundry.utils.getProperty(actor.data, key) ?? null;
    if (current === null) {
      let initialValue = null;
      if (data.placeholder) initialValue = data.placeholder;
      else if (data.type === Boolean) initialValue = false;
      else if (data.type === Number) initialValue = 0;
      foundry.utils.setProperty(actor.data, key, initialValue);
    }

    // Coerce change data into the correct type
    if (data.type === Boolean) {
      if (value === "false") change.value = false;
      else change.value = Boolean(value);
    } else if (data.type === Number) {
      change.value = Number.parseInt(value, 10);
    }

    return change;
  }

  /* --------------------------------------------- */

  /**
   * Determine whether this Active Effect is suppressed or not.
   */
  determineSuppression() {
    this.isSuppressed = false;
    if (this.data.disabled || (this.parent.documentName !== "Actor")) return;
    const [parentType, parentId, documentType, documentId] = this.data.origin?.split(".") ?? [];
    if ((parentType !== "Actor") || (parentId !== this.parent.id) || (documentType !== "Item")) return;
    const item = this.parent.items.get(documentId);
    if (!item) return;
    this.isSuppressed = item.areEffectsSuppressed;
  }

  /* --------------------------------------------- */

  /**
   * Manage Active Effect instances through the Actor Sheet via effect control buttons.
   * @param {MouseEvent} event      The left-click event on the effect control
   * @param {Actor|Item} owner      The owning document which manages this effect
   * @returns {Promise|null}        Promise that resolves when the changes are complete.
   */
  static onManageActiveEffect(event, owner) {
    event.preventDefault();
    const a = event.currentTarget;
    const item = a.closest(".item");
    const itemList = a.closest(".item-list");
    const effect = item && item.dataset.effectId ? owner.effects.get(item.dataset.effectId) : null;

    switch (a.dataset.action) {
      case "create":
        return owner.createEmbeddedDocuments("ActiveEffect", [{
          label: game.i18n.localize("IR.EffectNew"),
          icon: "icons/svg/aura.svg",
          origin: owner.uuid,
          "duration.rounds": itemList.dataset.effectType === "temporary" ? 1 : undefined,
          disabled: itemList.dataset.effectType === "inactive"
        }]);
      case "edit":
        return effect.sheet.render(true);
      case "delete":
        return effect.delete();
      case "toggle":
        return effect.update({ disabled: !effect.data.disabled });
    }
  }

  /* --------------------------------------------- */

  /**
   * Prepare the data structure for Active Effects which are currently applied to an Actor or Item.
   * @param {ActiveEffect[]} effects    The array of Active Effect instances to prepare sheet data for
   * @returns {object}                  Data for rendering
   */
  static prepareActiveEffectCategories(effects) {
    // Define effect header categories
    const categories = {
      temporary: {
        type: "temporary",
        label: game.i18n.localize("IR.EffectTemporary"),
        effects: []
      },
      passive: {
        type: "passive",
        label: game.i18n.localize("IR.EffectPassive"),
        effects: []
      },
      inactive: {
        type: "inactive",
        label: game.i18n.localize("IR.EffectInactive"),
        effects: []
      },
      suppressed: {
        type: "suppressed",
        label: game.i18n.localize("IR.EffectUnavailable"),
        effects: [],
        info: [game.i18n.localize("IR.EffectUnavailableInfo")]
      }
    };

    // Iterate over active effects, classifying them into categories
    for (let e of effects) {
      e._getSourceName(); // Trigger a lookup for the source name
      if (e.isSuppressed) categories.suppressed.effects.push(e);
      else if (e.data.disabled) categories.inactive.effects.push(e);
      else if (e.isTemporary) categories.temporary.effects.push(e);
      else categories.passive.effects.push(e);
    }

    categories.suppressed.hidden = !categories.suppressed.effects.length;
    return categories;
  }
}
