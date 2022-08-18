import { EntitySheetHelper } from "../helper.js";

/**
 * Extend the base Item document to support attributes and groups with a custom template creation dialog.
 * @extends {Item}
 */
export class ItemIR extends Item {
  /** @override */
  static async createDialog(data = {}, options = {}) {
    return EntitySheetHelper.createDialog.call(this, data, options);
  }

  /** @inheritdoc */
  async _preCreate(data, options, user) {
    await super._preCreate(data, options, user);
    // Item configuration
    switch (data.type) {
      case "weapon":
        break;
    }
    if (this.type === "weapon") {
      this.data.update({ img: "icons/svg/sword.svg" });
    }
  }
}
