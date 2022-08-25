
/**
 * Extend the basic ActorSheet with some very simple modifications
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
