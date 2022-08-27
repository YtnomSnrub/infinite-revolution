export const IR = {};

IR.weaponTraits = [
  { name: "agile", label: "IR.WeaponTagAgile", description: "IR.WeaponTagAgileDescription", type: "boolean" },
  { name: "anchor", label: "IR.WeaponTagAnchor", description: "IR.WeaponTagAnchorDescription", type: "number" },
  { name: "burst", label: "IR.WeaponTagBurst", description: "IR.WeaponTagBurstDescription", type: "boolean" },
  { name: "cooldown", label: "IR.WeaponTagCooldown", description: "IR.WeaponTagCooldownDescription", type: "boolean" },
  { name: "fracture", label: "IR.WeaponTagFracture", description: "IR.WeaponTagFractureDescription", type: "boolean" },
  { name: "decel", label: "IR.WeaponTagDecel", description: "IR.WeaponTagDecelDescription", type: "number" },
  { name: "disrupt", label: "IR.WeaponTagDisrupt", description: "IR.WeaponTagDisruptDescription", type: "boolean" },
  { name: "leech", label: "IR.WeaponTagLeech", description: "IR.WeaponTagLeechDescription", type: "boolean" },
  { name: "lock", label: "IR.WeaponTagLock", description: "IR.WeaponTagLockDescription", type: "boolean" },
  { name: "massless", label: "IR.WeaponTagMassless", description: "IR.WeaponTagMasslessDescription", type: "boolean" },
  { name: "overwhelm", label: "IR.WeaponTagOverwhelm", description: "IR.WeaponTagOverwhelmDescription", type: "boolean" },
  { name: "parry", label: "IR.WeaponTagParry", description: "IR.WeaponTagParryDescription", type: "boolean" },
  { name: "pierce", label: "IR.WeaponTagPierce", description: "IR.WeaponTagPierceDescription", type: "boolean" },
  { name: "precise", label: "IR.WeaponTagPrecise", description: "IR.WeaponTagPreciseDescription", type: "boolean" },
  { name: "prime", label: "IR.WeaponTagPrime", description: "IR.WeaponTagPrimeDescription", type: "boolean" },
  { name: "slowing", label: "IR.WeaponTagSlowing", description: "IR.WeaponTagSlowingDescription", type: "boolean" },
  { name: "stun", label: "IR.WeaponTagStun", description: "IR.WeaponTagStunDescription", type: "boolean" },
  { name: "stun-crit", label: "IR.WeaponTagStunCritOnly", description: "IR.WeaponTagStunCritOnlyDescription", type: "boolean" },
  { name: "taxing", label: "IR.WeaponTagTaxing", description: "IR.WeaponTagTaxingDescription", type: "boolean" },
  { name: "weaken", label: "IR.WeaponTagWeaken", description: "IR.WeaponTagWeakenDescription", type: "boolean" }
];

/**
* Special character flags.
* @enum {{
*   name: string,
*   hint: string,
*   [abilities]: string[],
*   [choices]: object<string, string>,
*   [skills]: string[],
*   section: string,
*   type: any,
*   placeholder: any
* }}
*/
IR.characterFlags = {
  bonusAttackRanged: {
    name: "IR.FlagsBonusAttackRanged",
    hint: "IR.FlagsBonusAttackRangedHint",
    section: "IR.SectionBonuses",
    type: Number
  }
};
