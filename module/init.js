/**
 * An implementation of the Infinite Revolution: First Flight system by Gwendolyn Clark
 * Author: Joel Launder
 */

// Import Modules
import { ActorIR } from "./actor/entity.js";
import { ActorSheetRevolver } from "./actor/revolver.js";
import { ActorSheetVeil } from "./actor/veil.js";

import { ItemIR } from "./item/item.js";
import { ItemSheetWeapon } from "./item/weapon.js";
import { ItemSheetAttack } from "./item/attack.js";
import { ItemSheetPower } from "./item/power.js";
import { ItemSheetSection } from "./item/section.js";

import { ChatLogIR } from "./chat/chatLog.js";

import { TokenIR, TokenDocumentIR } from "./token.js";

import { preloadHandlebarsTemplates } from "./templates.js";

/* -------------------------------------------- */
/*  Foundry VTT Initialization                  */
/* -------------------------------------------- */

/**
 * Init hook.
 */
Hooks.once("init", async function() {
  console.log("Initializing Infinite Revolution System");

  /**
   * Set an initiative formula for the system. This will be updated later.
   * @type {string}
   */
  CONFIG.Combat.initiative = {
    formula: "0",
    decimals: 0
  };

  game.infiniteRevolution = {
    ActorIR,
    useEntity: foundry.utils.isNewerVersion("9", game.version ?? game.data.version)
  };

  // Define custom Document classes
  CONFIG.Actor.documentClass = ActorIR;
  CONFIG.Item.documentClass = ItemIR;
  CONFIG.Token.documentClass = TokenDocumentIR;
  CONFIG.Token.objectClass = TokenIR;

  CONFIG.ui.chat = ChatLogIR;

  // TinyMCE
  CONFIG.TinyMCE.content_css = CONFIG.TinyMCE.content_css.concat("systems/infinite-revolution/styles/_styles.css");
  CONFIG.TinyMCE.style_formats = (CONFIG.TinyMCE.style_formats ?? []).concat({
    title: "Infinite Revolution",
    items: [
      {
        title: "Highlight",
        inline: "span",
        classes: "infinite-revolution-highlight"
      }
    ]
  });

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("infinite-revolution", ActorSheetRevolver, { types: ["revolver"], makeDefault: true });
  Actors.registerSheet("infinite-revolution", ActorSheetVeil, { types: ["veil"], makeDefault: true });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("infinite-revolution", ItemSheetWeapon, { types: ["weapon"], makeDefault: true });
  Items.registerSheet("infinite-revolution", ItemSheetAttack, { types: ["attack"], makeDefault: true });
  Items.registerSheet("infinite-revolution", ItemSheetPower, { types: ["power"], makeDefault: true });
  Items.registerSheet("infinite-revolution", ItemSheetSection, { types: ["section"], makeDefault: true });

  /**
   * Slugify a string.
   */
  Handlebars.registerHelper("slugify", function(value) {
    return value.slugify({ strict: true });
  });

  // Preload template partials
  await preloadHandlebarsTemplates();
});