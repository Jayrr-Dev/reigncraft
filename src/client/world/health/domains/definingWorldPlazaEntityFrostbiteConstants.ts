/**
 * Tunable frostbite stack progression (gain, decay, percent damage, sleep spells).
 *
 * @module components/world/health/domains/definingWorldPlazaEntityFrostbiteConstants
 */

/** Hard cap on frostbite stacks (Necrotic Frostbite). */
export const DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_MAX_STACKS = 1000;

/**
 * Maximum movement slow at max stacks (0.5 = 50% slower, speed multiplier 0.5).
 * Scales linearly: `1 - fraction * (stacks / MAX_STACKS)`.
 */
export const DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_MAX_SPEED_SLOW_FRACTION = 0.5;

/**
 * Maximum stamina regen slow at max stacks (0.5 = 50% slower regen, multiplier 0.5).
 * Scales linearly: `1 - fraction * (stacks / MAX_STACKS)`.
 */
export const DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_MAX_STAMINA_REGEN_SLOW_FRACTION = 0.5;

/**
 * Stacks gained per °C below comfort low on each environmental cold damage tick.
 * Comfort −10°C at local −20°C → deficit 10 → +10 stacks that tick.
 */
export const DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_STACKS_PER_DEFICIT_CELSIUS = 1;

/**
 * Warm decay mirrors cold gain on the same environmental tick interval.
 * Loss per warm tick = warmth°C × STACKS_PER_DEFICIT (default 1 stack per °C above comfort low).
 * No loss exactly at comfort low; warmer = faster recovery.
 */

/**
 * Freezing+ percent-of-max-HP damage added on each cold tick:
 * `(base + stacks * STACK_PERCENT) / 100 * effectiveMaxHealth`.
 */
export const DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_PERCENT_DAMAGE_BASE = 0;

/** Percent of max HP per frostbite stack on Freezing+ cold ticks. */
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

/** Wake bonus EV if necrotic frostbite sleep is ever damage-wakeable. */
export const DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_NECROTIC_SLEEP_WAKE_BONUS_DAMAGE = 8;

/** Scoped effect id prefix for frostbite-applied modifiers. */
export const DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_EFFECT_ID_PREFIX = 'frostbite-stage:';

/** Scoped movement modifier id for stack-linear frostbite speed. */
export const DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_LINEAR_SPEED_EFFECT_INSTANCE_ID = `${DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_EFFECT_ID_PREFIX}linear-speed`;

/** Scoped movement modifier id for stack-linear frostbite stamina regen. */
export const DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_LINEAR_STAMINA_REGEN_EFFECT_INSTANCE_ID = `${DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_EFFECT_ID_PREFIX}linear-stamina-regen`;

/**
 * Full icy avatar tint at max stacks (Pixi RGB packed).
 * Freezing+ blends white toward this color by stack progress.
 */
export const DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_ICY_AVATAR_TINT = 0x7ec8e8;

/** @deprecated Prefer {@link DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_ICY_AVATAR_TINT}. */
export const DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_NECROTIC_AVATAR_TINT =
  DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_ICY_AVATAR_TINT;
