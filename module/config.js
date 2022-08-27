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
  bonusAttack: {
    name: "IR.FlagsBonusAttack",
    hint: "IR.FlagsBonusAttackHint",
    section: "IR.SectionBonuses",
    type: Number
  },
  bonusAttackMelee: {
    name: "IR.FlagsBonusAttackMelee",
    hint: "IR.FlagsBonusAttackMeleeHint",
    section: "IR.SectionBonuses",
    type: Number
  },
  bonusAttackRanged: {
    name: "IR.FlagsBonusAttackRanged",
    hint: "IR.FlagsBonusAttackRangedHint",
    section: "IR.SectionBonuses",
    type: Number
  },
  bonusAttackMounted: {
    name: "IR.FlagsBonusAttackMounted",
    hint: "IR.FlagsBonusAttackMountedHint",
    section: "IR.SectionBonuses",
    type: Number
  },
  bonusAttackProjected: {
    name: "IR.FlagsBonusAttackProjected",
    hint: "IR.FlagsBonusAttackProjectedHint",
    section: "IR.SectionBonuses",
    type: Number
  },
  bonusHarm: {
    name: "IR.FlagsBonusHarm",
    hint: "IR.FlagsBonusHarmHint",
    section: "IR.SectionBonuses",
    type: Number
  },
  bonusHarmMelee: {
    name: "IR.FlagsBonusHarmMelee",
    hint: "IR.FlagsBonusHarmMeleeHint",
    section: "IR.SectionBonuses",
    type: Number
  },
  bonusHarmRanged: {
    name: "IR.FlagsBonusHarmRanged",
    hint: "IR.FlagsBonusHarmRangedHint",
    section: "IR.SectionBonuses",
    type: Number
  },
  bonusHarmMounted: {
    name: "IR.FlagsBonusHarmMounted",
    hint: "IR.FlagsBonusHarmMountedHint",
    section: "IR.SectionBonuses",
    type: Number
  },
  bonusHarmProjected: {
    name: "IR.FlagsBonusHarmProjected",
    hint: "IR.FlagsBonusHarmProjectedHint",
    section: "IR.SectionBonuses",
    type: Number
  },
  bonusHarmProjectedMelee: {
    name: "IR.FlagsBonusHarmProjectedMelee",
    hint: "IR.FlagsBonusHarmProjectedMeleeHint",
    section: "IR.SectionBonuses",
    type: Number
  },
  bonusHarmProjectedRanged: {
    name: "IR.FlagsBonusHarmProjectedRanged",
    hint: "IR.FlagsBonusHarmProjectedRangedHint",
    section: "IR.SectionBonuses",
    type: Number
  },
  bonusTags: {
    name: "IR.FlagsBonusTags",
    hint: "IR.FlagsBonusTagsHint",
    section: "IR.SectionBonuses",
    type: String
  },
  bonusTagsMelee: {
    name: "IR.FlagsBonusTagsMelee",
    hint: "IR.FlagsBonusTagsMeleeHint",
    section: "IR.SectionBonuses",
    type: String
  },
  bonusTagsRanged: {
    name: "IR.FlagsBonusTagsRanged",
    hint: "IR.FlagsBonusTagsRangedHint",
    section: "IR.SectionBonuses",
    type: String
  },
  bonusTagsMounted: {
    name: "IR.FlagsBonusTagsMounted",
    hint: "IR.FlagsBonusTagsMountedHint",
    section: "IR.SectionBonuses",
    type: String
  },
  bonusTagsProjected: {
    name: "IR.FlagsBonusTagsProjected",
    hint: "IR.FlagsBonusTagsProjectedHint",
    section: "IR.SectionBonuses",
    type: String
  },
  bonusTagsProjectedMelee: {
    name: "IR.FlagsBonusTagsProjectedMelee",
    hint: "IR.FlagsBonusTagsProjectedMeleeHint",
    section: "IR.SectionBonuses",
    type: String
  },
  bonusTagsProjectedRanged: {
    name: "IR.FlagsBonusTagsProjectedRanged",
    hint: "IR.FlagsBonusTagsProjectedRangedHint",
    section: "IR.SectionBonuses",
    type: String
  }
};
