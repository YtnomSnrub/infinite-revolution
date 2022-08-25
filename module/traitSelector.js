export class TraitSelector extends FormApplication {
    /** @inheritdoc */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["infinite-revolution"],
            template: "systems/infinite-revolution/templates/trait-selector/basic.html",
            width: 200,
            height: 500,
        });
    }

    /* -------------------------------------------- */

    /** @inheritdoc */
    activateListeners(html) {
        super.activateListeners(html);

        // Everything below here is only needed if the sheet is editable
        if (!this.isEditable) return;

        html.find("input[type='checkbox']").on("change", this._onCheckboxChange.bind(this));
    }

    _onCheckboxChange(event) {
        const checkbox = $(event.currentTarget);
        const parent = $(checkbox.parent());
        const numberInput = parent.children(`input[type="number"], input[type="text"]`);
        if (checkbox.prop("checked")) {
            numberInput.val(1);
            numberInput.prop("disabled", false);
        } else {
            numberInput.val(null);
            numberInput.prop("disabled", true);
        }
    }

    /* -------------------------------------------- */

    /** @inheritdoc */
    getData() {
        const context = super.getData();
        const systemData = this.object.data.data;
        context.traits = this.options.traits.map(trait => ({
            ...trait,
            selected: systemData.tags.some(x => x.name === trait.name),
            value: systemData.tags.find(x => x.name === trait.name)?.value,
        }));

        return context;
    }

    async _updateObject(event, formData) {
        const value = Object.keys(formData).map(x => ({
            "name": x,
            "value": Array.isArray(formData[x]) ? formData[x][1] : formData[x]
        })).filter(x => x.value);

        await this.object.update({ [this.options.objectProperty]: value });
    }
}
