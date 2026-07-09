/**
 * Declarative tuning and types for the entity strength index.
 *
 * The strength index is a single comparable number for any combat-capable
 * entity (player characters and wildlife mobs). It is normalized so the
 * baseline player profile scores exactly 100.
 *
 * Extending the index for new features (equipment, buffs, diseases, ranged
 * weapons, etc.) should NOT change the core formula: append entries to the
 * profile's `modifiers` list instead. Each modifier multiplies one scope of
 * the score and is reported in the breakdown for explainability.
 *
 * @module components/world/strength/domains/definingWorldPlazaStrengthIndexConstants
 */

/** Which part of the score a modifier multiplies. */
export type DefiningWorldPlazaStrengthModifierScope =
  | 'survival'
  | 'offense'
  | 'mobility'
  | 'total';

/** One declarative multiplier applied on top of the base profile numbers. */
export type DefiningWorldPlazaStrengthModifier = {
  readonly id: string;
  readonly label: string;
  readonly scope: DefiningWorldPlazaStrengthModifierScope;
  readonly multiplier: number;
};

/** What kind of entity a strength profile describes. */
export type DefiningWorldPlazaStrengthSubjectKind =
  | 'player-character'
  | 'wildlife';

/**
 * Normalized combat snapshot shared by every entity kind.
 * Resolvers translate character-engine or wildlife definitions into this
 * shape; the scoring math only ever sees this profile.
 */
export type DefiningWorldPlazaStrengthProfile = {
  readonly subjectId: string;
  readonly subjectKind: DefiningWorldPlazaStrengthSubjectKind;
  readonly displayName: string;
  /** Effective max health after level / size scaling. */
  readonly maxHealth: number;
  /** Passive HP regen per second (0 when the entity has none). */
  readonly healthRegenPerSecond: number;
  /** Flat defense stat after level scaling. */
  readonly defense: number;
  /** Damage per melee swing after all static multipliers. */
  readonly attackPower: number;
  /** Melee swings per second (1000 / attack interval ms). */
  readonly attacksPerSecond: number;
  readonly walkSpeedGridPerSecond: number;
  readonly runSpeedGridPerSecond: number;
  /** Extension point: future features append modifiers instead of new math. */
  readonly modifiers: readonly DefiningWorldPlazaStrengthModifier[];
};

/** One named tier band on the strength scale. */
export type DefiningWorldPlazaStrengthTier = {
  readonly tierId: string;
  readonly label: string;
  /** Inclusive lower bound on the normalized strength index. */
  readonly minStrengthIndex: number;
};

/**
 * Baseline reference stats that pin the scale.
 * Mirrors the default player (girl-sample at level 1, bare hands) so that
 * profile scores exactly 100. Retune here if the default player changes.
 */
export const DEFINING_WORLD_PLAZA_STRENGTH_BASELINE_REFERENCE = {
  maxHealth: 1000,
  healthRegenPerSecond: 2,
  defense: 5,
  attackPower: 10,
  attacksPerSecond: 1,
  runSpeedGridPerSecond: 3,
} as const;

/**
 * Baseline melee swing interval for player characters (ms).
 * The character engine expresses attack speed as a multiplier on default
 * strip timing; this constant anchors that multiplier to swings per second.
 */
export const DEFINING_WORLD_PLAZA_STRENGTH_PLAYER_BASELINE_ATTACK_INTERVAL_MS = 1000;

/**
 * Nominal fight length used to convert passive regen into effective health.
 * Regen contributes `regenPerSecond * this` extra HP to the survival score.
 */
export const DEFINING_WORLD_PLAZA_STRENGTH_NOMINAL_FIGHT_SECONDS = 30;

/**
 * Flat defense worth one full extra health bar.
 * Survival is multiplied by `1 + defense / pivot`, so 50 defense doubles
 * effective health. Keeps small stat values (0-10 today) gently weighted.
 */
export const DEFINING_WORLD_PLAZA_STRENGTH_DEFENSE_PIVOT = 50;

/**
 * How strongly run speed sways the final score.
 * Mobility factor is `1 + weight * (runSpeed / baselineRun - 1)`, clamped.
 */
export const DEFINING_WORLD_PLAZA_STRENGTH_MOBILITY_WEIGHT = 0.25;

/** Clamp bounds for the mobility factor. */
export const DEFINING_WORLD_PLAZA_STRENGTH_MOBILITY_FACTOR_MIN = 0.7;
export const DEFINING_WORLD_PLAZA_STRENGTH_MOBILITY_FACTOR_MAX = 1.5;

/** Score the baseline reference profile normalizes to. */
export const DEFINING_WORLD_PLAZA_STRENGTH_BASELINE_INDEX = 100;

/**
 * Named tier bands, ascending by threshold.
 * Resolution picks the highest tier whose `minStrengthIndex` fits the score.
 */
export const DEFINING_WORLD_PLAZA_STRENGTH_TIER_REGISTRY: readonly DefiningWorldPlazaStrengthTier[] =
  [
    { tierId: 'harmless', label: 'Harmless', minStrengthIndex: 0 },
    { tierId: 'feeble', label: 'Feeble', minStrengthIndex: 20 },
    { tierId: 'weak', label: 'Weak', minStrengthIndex: 45 },
    { tierId: 'average', label: 'Average', minStrengthIndex: 80 },
    { tierId: 'strong', label: 'Strong', minStrengthIndex: 130 },
    { tierId: 'formidable', label: 'Formidable', minStrengthIndex: 200 },
    { tierId: 'deadly', label: 'Deadly', minStrengthIndex: 330 },
    { tierId: 'apex', label: 'Apex', minStrengthIndex: 500 },
  ];
