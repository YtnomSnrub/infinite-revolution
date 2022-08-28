/**
 * An implementation of the Infinite Revolution: First Flight system by Gwendolyn Clark
 * Author: Joel Launder
 */

import { IR } from "./config.js";

import { ActiveEffectIR } from "./effects/activeEffect.js";

import { ActorIR } from "./actor/entity.js";
import { ActorSheetRevolver } from "./actor/revolver.js";
import { ActorSheetVeil } from "./actor/veil.js";

import { ItemIR } from "./item/item.js";
import { ItemSheetWeapon } from "./item/weapon.js";
import { ItemSheetAttack } from "./item/attack.js";
import { ItemSheetPower } from "./item/power.js";
import { ItemSheetTab } from "./item/section.js";

import { ChatLogIR } from "./chat/chatLog.js";

import { TokenIR, TokenDocumentIR } from "./token/token.js";

import { preloadHandlebarsTemplates } from "./util/templates.js";

/* -------------------------------------------- */
/*  Foundry VTT Initialization                  */
/* -------------------------------------------- */

/**
 * Init hook.
 */
Hooks.once("init", async function() {
  console.log("Initializing Infinite Revolution System");

  CONFIG.IR = IR;

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
  CONFIG.ActiveEffect.documentClass = ActiveEffectIR;
  CONFIG.Actor.documentClass = ActorIR;
  CONFIG.Item.documentClass = ItemIR;
  CONFIG.Token.documentClass = TokenDocumentIR;
  CONFIG.Token.objectClass = TokenIR;

  CONFIG.ui.chat = ChatLogIR;

  // TinyMCE
  CONFIG.TinyMCE.content_css = CONFIG.TinyMCE.content_css.concat("systems/infinite-revolution/infinite-revolution.css");
  CONFIG.TinyMCE.style_formats = (CONFIG.TinyMCE.style_formats ?? []).concat({
    title: "Infinite Revolution",
    items: [
      {
        title: "Highlight",
        inline: "span",
        classes: "infinite-revolution-highlight"
      },
      {
        title: "Hot",
        inline: "span",
        classes: "infinite-revolution-hot"
      },
      {
        title: "Quick",
        inline: "span",
        classes: "infinite-revolution-quick"
      },
      {
        title: "Bright",
        inline: "span",
        classes: "infinite-revolution-bright"
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
  Items.registerSheet("infinite-revolution", ItemSheetTab, { types: ["section"], makeDefault: true });

  /**
   * Slugify a string.
   */
  Handlebars.registerHelper("slugify", function(value) {
    return value.slugify({ strict: true });
  });

  // Preload template partials
  await preloadHandlebarsTemplates();
});

Hooks.once("canvasReady", async () => {
  const statusIconFolder = "systems/infinite-revolution/icons/status";
  const statusEffects = [
    { id: "disrupted", label: "IR.StatusEffectDisrupted" },
    { id: "fractured", label: "IR.StatusEffectFrcatured" },
    { id: "locked", label: "IR.StatusEffectLocked" },
    { id: "primed", label: "IR.StatusEffectPrimed" },
    { id: "slowed", label: "IR.StatusEffectSlowed" },
    { id: "strained", label: "IR.StatusEffectStrained" },
    { id: "stunned", label: "IR.StatusEffectStunned" },
    { id: "weakened", label: "IR.StatusEffectWeakened" },

    { id: "antimatter-shell", label: "IR.StatusEffectAntimatterShell" },
    { id: "dead-zone", label: "IR.StatusEffectDeadZone" },
    { id: "inertia-charge", label: "IR.StatusEffectInertiaCharge" },
    { id: "quantum-double", label: "IR.StatusEffectQuantumDouble" },
    { id: "radiance", label: "IR.StatusEffectRadiance" },
    { id: "sequenced", label: "IR.StatusEffectSequenced" }
  ].sort((a, b) => game.i18n.localize(a.label).localeCompare(game.i18n.localize(b.label)));
  statusEffects.unshift({ id: "dead", label: "IR.StatusEffectDead" });

  statusEffects.forEach(status => {
    status.icon = `${statusIconFolder}/${status.id}.svg`;
  });

  CONFIG.statusEffects = statusEffects;
});
