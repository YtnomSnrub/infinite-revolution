export class Helper {
  /**
   * @param data
   * @param options
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
      actors: {
        revolver: game.i18n.localize("IR.ActorTypeRevolver"),
        veil: game.i18n.localize("IR.ActorTypeVeil")
      },
      items: {
        weapon: game.i18n.localize("IR.ItemTypeWeapon"),
        power: game.i18n.localize("IR.ItemTypePower"),
        attack: game.i18n.localize("IR.ItemTypeAttack"),
        section: game.i18n.localize("IR.ItemTypeSection")
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

  static async sendItemToChat(item, color) {
    const content = await renderTemplate(`systems/infinite-revolution/templates/chat/item-card-${item.type}.html`, { item: item.data, color });
    // Play item animation
    if ("AutoAnimations" in window && canvas.tokens.controlled?.length) {
      AutoAnimations.playAnimation(canvas.tokens.controlled[0], Array.from(game.user.targets), item);
    }

    await ChatMessage.create({
      rollMode: game.settings.get("core", "rollMode"),
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content: content
    });
  }

  static async sendEffectToChat(effect, color) {
    console.log(effect);
    const content = await renderTemplate("systems/infinite-revolution/templates/chat/card-effect.html", { effect, color });

    await ChatMessage.create({
      rollMode: game.settings.get("core", "rollMode"),
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content: content
    });
  }

  static getAttackModifier(item, actor) {
    let modifier = 0;
    const itemData = item.data.data;
    // Get tags
    const tags = itemData.tags;
    // Apply tags
    if (tags.some(x => x.name === "precise")) modifier += 1;

    // Get flags
    const flags = actor.data.flags.ir || {};
    // Apply flags
    modifier += flags.bonusAttack || 0;
    if (itemData.rangeType === "melee") modifier += flags.bonusAttackMelee || 0;
    if (itemData.rangeType === "ranged") modifier += flags.bonusAttackRanged || 0;
    if (itemData.category === "mounted") modifier += flags.bonusAttackMounted || 0;
    if (itemData.category === "projected") modifier += flags.bonusAttackProjected || 0;

    return modifier;
  }

  static getHarmModifier(item, actor) {
    let modifier = 0;
    const itemData = item.data.data;
    // Get flags
    const flags = actor.data.flags.ir || {};
    // Apply flags
    modifier += flags.bonusHarm || 0;
    if (itemData.rangeType === "melee") modifier += flags.bonusHarmMelee || 0;
    if (itemData.rangeType === "ranged") modifier += flags.bonusHarmRanged || 0;
    if (itemData.category === "mounted") modifier += flags.bonusHarmMounted || 0;
    if (itemData.category === "projected") modifier += flags.bonusHarmProjected || 0;
    if (itemData.category === "projected" && itemData.rangeType === "melee") modifier += flags.bonusHarmProjectedMelee || 0;
    if (itemData.category === "projected" && itemData.rangeType === "ranged") modifier += flags.bonusHarmProjectedRanged || 0;

    return modifier;
  }

  static modifyItemLabels(item, actor) {
    const itemData = item.data.data;
    const itemTags = [...itemData.tags];
    const flags = actor.data.flags.ir || {};

    let bonusTagArray = [flags.bonusTags];
    if (itemData.rangeType === "melee" && flags.bonusTagsMelee) bonusTagArray.push(flags.bonusTagsMelee);
    if (itemData.rangeType === "ranged" && flags.bonusTagsRanged) bonusTagArray.push(flags.bonusTagsRanged);
    if (itemData.category === "mounted" && flags.bonusTagsMounted) bonusTagArray.push(flags.bonusTagsMounted);
    if (itemData.category === "projected" && flags.bonusTagsProjected) bonusTagArray.push(flags.bonusTagsProjected);
    if (itemData.category === "projected" && itemData.rangeType === "melee" && flags.bonusTagsProjectedMelee) bonusTagArray.push(flags.bonusTagsProjectedMelee);
    if (itemData.category === "projected" && itemData.rangeType === "ranged" && flags.bonusTagsProjectedRanged) bonusTagArray.push(flags.bonusTagsProjectedRanged);

    bonusTagArray.forEach(bonusTags => {
      if (bonusTags) {
        Object.keys(bonusTags).forEach(tag => {
          const index = itemTags.findIndex(x => x.name === tag);
          if (index >= 0) {
            if (Number.isNumeric(itemTags[index].value) && Number.isNumeric(bonusTags[tag])) {
              const currentValue = Number.parseInt(itemTags[index].value);
              const bonusValue = Number.parseInt(bonusTags[tag]);
              itemTags[index] = {name: tag, value: currentValue + bonusValue};
            } else {
              itemTags[index] = {name: tag, value: `${itemTags[index].value} + ${bonusTags[tag]}`};
            }
          } else {
            itemTags.push({name: tag, value: bonusTags[tag]});
          }
        });
      }
    });

    return itemTags;
  }
}
