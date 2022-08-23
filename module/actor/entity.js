import { Helper } from "../helper.js";

/**
 * Extend the base Actor document to support attributes and groups with a custom template creation dialog.
 * @extends {Actor}
 */
export class ActorIR extends Actor {
  /** @override */
  static async createDialog(data = {}, options = {}) {
    return Helper.createDialog.call(this, data, options);
  }

  /** @inheritdoc */
  async _preCreate(data, options, user) {
    await super._preCreate(data, options, user);
    // Player character configuration
    if (this.type === "revolver") {
      this.data.token.update({ actorLink: true, disposition: 1 });
    }
  }

  /* -------------------------------------------- */
  /*  Roll Data Preparation                       */
  /* -------------------------------------------- */

  /** @inheritdoc */
  getRollData() {
    // Copy the actor's system data
    const data = this.toObject(false).data;
    return data;
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  async modifyTokenAttribute(attribute, value, isDelta = false, isBar = true) {
    const current = foundry.utils.getProperty(this.data.data, attribute);
    if (!isBar || !isDelta || (current?.dtype !== "Resource")) {
      return super.modifyTokenAttribute(attribute, value, isDelta, isBar);
    }
    const updates = { [`data.${attribute}.value`]: Math.clamped(current.value + value, current.min, current.max) };
    const allowed = Hooks.call("modifyTokenAttribute", { attribute, value, isDelta, isBar }, updates);
    return allowed !== false ? this.update(updates) : this;
  }
}
