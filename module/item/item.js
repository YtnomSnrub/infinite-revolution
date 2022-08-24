import { Helper } from "../helper.js";

/**
 * Extend the base Item document for Infinite Revolution
 * @extends {Item}
 */
export class ItemIR extends Item {
  /** @override */
  static async createDialog(data = {}, options = {}) {
    return Helper.createDialog.call(this, data, options);
  }

  /** @inheritdoc */
  async _preCreate(data, options, user) {
    await super._preCreate(data, options, user);

    if (this.type === "weapon") {
      this.data.update({ img: "icons/svg/sword.svg" });
    }
  }
}
