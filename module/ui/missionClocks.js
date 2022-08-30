export class MissionClocks extends FormApplication {
  async _render(force = false, options = {}) {
    await super._render(force, options);
    // Remove the window from candidates for closing via Escape.
    delete ui.windows[this.appId];
    // Update position
    this.updatePosition();
  }

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: [],
      template: "systems/infinite-revolution/templates/ui/mission-clocks.html",
      popOut: false,
      minimizable: false,
      resizable: false,
      background: "none"
    });
  }

  updatePosition() {
    $(this.form).css("right", $(document).find("#ui-right").outerWidth());
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Form controls
    html.find("[data-action]").on("click", this._onAction.bind(this));
  }

  _onAction(event) {
    event.preventDefault();

    let button = event.currentTarget;
    let value = game.settings.get("infinite-revolution", button.dataset.key);
    switch (button.dataset.action) {
      case "add":
        value += 1;
        break;
      case "subtract":
        value -= 1;
        break;
      case "reset":
        value = 0;
        break;
    }

    game.settings.set("infinite-revolution", button.dataset.key, value);
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  getData() {
    const context = super.getData();
    context.showTensionClock = game.settings.get("infinite-revolution", "tensionClock");
    context.showIncusionClock = game.settings.get("infinite-revolution", "incursionClock");
    context.tension = game.settings.get("infinite-revolution", "tensionClock.value");
    context.incursion = game.settings.get("infinite-revolution", "incursionClock.value");
    context.isEditable = game.user.isGM;

    return context;
  }
}
