/**
 * Extend the base TokenDocument to support resource type attributes.
 * @extends {TokenDocument}
 */
export class SimpleTokenDocument extends TokenDocument {
  /** @inheritdoc */
  getBarAttribute(barName, { alternative } = {}) {
    const data = super.getBarAttribute(barName, { alternative });
    const attr = alternative || this.data[barName]?.attribute;
    if (!data || !attr || !this.actor) return data;
    const current = foundry.utils.getProperty(this.actor.data.data, attr);
    if (current?.dtype === "Resource") data.min = parseInt(current.min || 0);
    data.editable = true;

    return data;
  }

  /* -------------------------------------------- */

  static getTrackedAttributes(data, _path = []) {
    if (data || _path.length) return super.getTrackedAttributes(data, _path);
    data = {};
    for (const model of Object.values(game.system.model.Actor)) {
      foundry.utils.mergeObject(data, model);
    }
    for (const actor of game.actors) {
      if (actor.isTemplate) foundry.utils.mergeObject(data, actor.toObject().data);
    }

    return super.getTrackedAttributes(data);
  }
}


/* -------------------------------------------- */


/**
 * Extend the base Token class to implement additional system-specific logic.
 * @extends {Token}
 */
export class SimpleToken extends Token {
  _drawBar(number, bar, data) {
    return super._drawBar(number, bar, data);
  }
}
