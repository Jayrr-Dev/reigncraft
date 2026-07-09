/**
 * Tunable frostbite stack progression (gain, decay, percent damage, sleep spells).
 *
 * @module components/world/health/domains/definingWorldPlazaEntityFrostbiteConstants
 */

/** Hard cap on frostbite stacks (Necrotic Frostbite). */
export const DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_MAX_STACKS = 1000;

/**
 * Stacks gained per °C below comfort low on each environmental cold damage tick.
 * Comfort −10°C at local −20°C → deficit 10 → +10 stacks that tick.
 */
export const DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_STACKS_PER_DEFICIT_CELSIUS = 1;

/** Base warm decay rate (stacks/second) when exactly at comfort low. */
export const DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_WARM_DECAY_BASE_STACKS_PER_SECOND = 0.5;

/**
 * Extra stacks/second of decay per °C above comfort low.
 * Warmer = faster recovery.
 */
export const DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_WARM_DECAY_STACKS_PER_SECOND_PER_CELSIUS = 0.15;

/** Cap on warm decay rate (stacks/second). */
export const DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_WARM_DECAY_STACKS_PER_SECOND_MAX = 12;

/**
 * Frostnip+ percent-of-max-HP damage added on each cold tick:
 * `(base + stacks * STACK_PERCENT) / 100 * effectiveMaxHealth`.
 */
export const DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_PERCENT_DAMAGE_BASE = 0;

/** Percent of max HP per frostbite stack on Frostnip+ cold ticks. */
export const DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_PERCENT_DAMAGE_PER_STACK = 0.01;

/** Incoming frost damage multiplier while at Frostbite stage or higher. */
export const DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_FROST_DAMAGE_TAKEN_MULTIPLIER = 3;

/** Hypothermia sleep spell minimum duration (ms). */
export const DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_SLEEP_SPELL_DURATION_MIN_MS = 3_000;

/** Hypothermia sleep spell maximum duration (ms). */
export const DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_SLEEP_SPELL_DURATION_MAX_MS = 10_000;

/** Stack interval past hypothermia (500) that triggers another sleep spell. */
export const DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_SLEEP_SPELL_STACK_INTERVAL = 100;

/** Wake bonus EV when damaged out of a hypothermia sleep spell. */
export const DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_SLEEP_SPELL_WAKE_BONUS_DAMAGE = 8;

/** Confusion intensity while Hypothermia+ is active (0–100). */
export const DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_CONFUSION_INTENSITY = 45;

/** Scoped effect id prefix for frostbite-applied modifiers. */
export const DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_EFFECT_ID_PREFIX = 'frostbite-stage:';

/** Necrotic avatar tint (Pixi RGB packed). */
export const DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_NECROTIC_AVATAR_TINT = 0x7ec8e8;
