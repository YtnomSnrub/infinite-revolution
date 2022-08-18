/**
 * A simple and flexible system for world-building using an arbitrary collection of character and item attributes
 * Author: Atropos
 */

// Import Modules
import { ActorIR } from "./actor/entity.js";
import { ActorSheetRevolver } from "./actor/revolver.js";
import { ActorSheetVeil } from "./actor/veil.js";

import { ItemIR } from "./item/item.js";
import { ItemSheetWeapon } from "./item/weapon.js";

import { SimpleToken, SimpleTokenDocument } from "./token.js";

import { preloadHandlebarsTemplates } from "./templates.js";

/* -------------------------------------------- */
/*  Foundry VTT Initialization                  */
/* -------------------------------------------- */

/**
 * Init hook.
 */
Hooks.once("init", async function () {
  console.log(`Initializing Simple InfiniteRevolution System`);

  /**
   * Set an initiative formula for the system. This will be updated later.
   * @type {String}
   */
  CONFIG.Combat.initiative = {
    formula: "1d20",
    decimals: 2
  };

  game.infiniteRevolution = {
    ActorIR,
    useEntity: foundry.utils.isNewerVersion("9", game.version ?? game.data.version)
  };

  // Define custom Document classes
  CONFIG.Actor.documentClass = ActorIR;
  CONFIG.Item.documentClass = ItemIR;
  CONFIG.Token.documentClass = SimpleTokenDocument;
  CONFIG.Token.objectClass = SimpleToken;

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("infinite-revolution", ActorSheetRevolver, { types: ["revolver"], makeDefault: true });
  Actors.registerSheet("infinite-revolution", ActorSheetVeil, { types: ["veil"], makeDefault: true });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("infinite-revolution", ItemSheetWeapon, { types: ["weapon"], makeDefault: true });

  /**
   * Slugify a string.
   */
  Handlebars.registerHelper('slugify', function (value) {
    return value.slugify({ strict: true });
  });

  // Preload template partials
  await preloadHandlebarsTemplates();
});
