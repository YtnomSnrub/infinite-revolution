export class EntitySheetHelper {
  /**
   * @see ClientDocumentMixin.createDialog
   */
  static async createDialog(data = {}, options = {}) {
    // Collect data
    const documentName = this.metadata.name;
    const folders = game.folders.filter(f => (f.data.type === documentName) && f.displayed);
    const label = game.i18n.localize(this.metadata.label);
    const title = game.i18n.format("DOCUMENT.Create", { type: label });

    // Identify the template Actor types
    const collection = game.collections.get(this.documentName);
    const collectionType = this.metadata.collection;
    const types = {
      "actors": {
        "revolver": game.i18n.localize("IR.ActorTypeRevolver"),
        "veil": game.i18n.localize("IR.ActorTypeVeil"),
      },
      "items": {
        "weapon": game.i18n.localize("IR.ItemTypeWeapon"),
      }
    };

    // Render the document creation form
    const useEntity = game.infiniteRevolution.useEntity;
    const template = `templates/sidebar/${useEntity ? "entity" : "document"}-create.html`;
    const html = await renderTemplate(template, {
      name: data.name || game.i18n.format("DOCUMENT.New", { type: label }),
      folder: data.folder,
      folders: folders,
      hasFolders: folders.length > 1,
      type: data.type || types[collectionType][0] || "",
      types: types[collectionType],
      hasTypes: true
    });

    // Render the confirmation dialog window
    return Dialog.prompt({
      title: title,
      content: html,
      label: title,
      callback: html => {
        // Get the form data
        const form = html[0].querySelector("form");
        const fd = new FormDataExtended(form);
        let createData = fd.toObject();

        // Merge with template data
        const template = collection.get(form.type.value);
        if (template) {
          createData = foundry.utils.mergeObject(template.toObject(), createData);
          createData.type = template.data.type;
          delete createData.flags.infiniteRevolution.isTemplate;
        }

        // Merge provided override data
        createData = foundry.utils.mergeObject(createData, data);
        return this.create(createData, { renderSheet: true });
      },
      rejectClose: false,
      options: options
    });
  }
}
