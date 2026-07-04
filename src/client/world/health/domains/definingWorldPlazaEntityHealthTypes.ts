/**
 * Entity health state shapes for the plaza health engine.
 *
 * @module components/world/health/domains/definingWorldPlazaEntityHealthTypes
 */

import type { DefiningWorldPlazaEntityTemperatureResistance } from '@/components/world/health/domains/definingWorldPlazaTemperatureTypes';

export type { DefiningWorldPlazaEntityTemperatureResistance };

/** Damage and healing source categories. */
export type DefiningWorldPlazaEntityDamageKind =
  | 'physical'
  | 'environmental_lava'
  | 'environmental_heat'
  | 'environmental_cold'
  | 'fall'
  | 'poison'
  | 'healing';

/** Temporary max-health bonus from potions or buffs. */
export type DefiningWorldPlazaEntityHealthTemporaryMaxBonus = {
  id: string;
  amount: number;
  expiresAtMs: number;
};

/** Damage-over-time effect applied to an entity. */
export type DefiningWorldPlazaEntityHealthDamageOverTimeEffect = {
  id: string;
  kind: DefiningWorldPlazaEntityDamageKind;
  damagePerSecond: number;
  expiresAtMs: number;
  tickIntervalMs: number;
  lastTickAtMs: number;
};

/** Multiplier applied to incoming damage (armor, buffs, post-action reduction). */
export type DefiningWorldPlazaEntityHealthIncomingDamageModifier = {
  id: string;
  multiplier: number;
  expiresAtMs: number | null;
};

/** Outcome tier from a randomized damage roll. */
export type DefiningWorldPlazaDamageOutcomeTier =
  | 'fatal'
  | 'lethal'
  | 'critical'
  | 'normal'
  | 'true_strike'
  | 'softened'
  | 'blocked'
  | 'dodged';

/** Modifier kind for the statistical damage roll engine. */
export type DefiningWorldPlazaEntityHealthDamageRollModifierKind =
  | 'expected'
  | 'variance'
  | 'stability'
  | 'luck'
  | 'block_bias'
  | 'dodge_bias'
  | 'critical_bias'
  | 'lock_in'
  | 'chaotic';

/** Buff/debuff that adjusts expected damage, variance, or luck skew. */
export type DefiningWorldPlazaEntityHealthDamageRollModifier = {
  id: string;
  kind: DefiningWorldPlazaEntityHealthDamageRollModifierKind;
  /** Multiplier for expected/variance/stability; additive for luck. */
  value: number;
  expiresAtMs: number | null;
};

/** Passive health regeneration configuration. */
export type DefiningWorldPlazaEntityHealthRegenConfig = {
  healthPerSecond: number;
  delayAfterDamageMs: number;
};

/** Authoritative per-entity health state. */
export type DefiningWorldPlazaEntityHealthState = {
  baseMaxHealth: number;
  maxHealthScale: number;
  temporaryMaxHealthBonuses: DefiningWorldPlazaEntityHealthTemporaryMaxBonus[];
  currentHealth: number;
  shieldPoints: number;
  damageOverTimeEffects: DefiningWorldPlazaEntityHealthDamageOverTimeEffect[];
  incomingDamageModifiers: DefiningWorldPlazaEntityHealthIncomingDamageModifier[];
  damageRollModifiers: DefiningWorldPlazaEntityHealthDamageRollModifier[];
  regen: DefiningWorldPlazaEntityHealthRegenConfig;
  invincibleUntilMs: number | null;
  invincibilityFrameUntilMs: number;
  lastDamagedAtMs: number | null;
  lastDamageKind: DefiningWorldPlazaEntityDamageKind | null;
  isDead: boolean;
  temperatureResistance: DefiningWorldPlazaEntityTemperatureResistance;
};

/** Breakdown returned after the damage pipeline runs. */
export type DefiningWorldPlazaEntityHealthAppliedDamage = {
  rawAmount: number;
  expectedDamage: number | null;
  rolledDamage: number | null;
  deviationScore: number | null;
  tier: DefiningWorldPlazaDamageOutcomeTier | null;
  afterModifiers: number;
  absorbedByShield: number;
  healthDamage: number;
  wasBlocked: boolean;
};

/** Lightweight snapshot synced to other clients. */
export type DefiningWorldPlazaEntityHealthSyncSnapshot = {
  healthCurrent: number;
  healthEffectiveMax: number;
  shieldPoints: number;
  isInvincible: boolean;
};

/** Options when applying damage through the pipeline. */
export type DefiningWorldPlazaEntityHealthDamageOptions = {
  /** DoT and environmental ticks skip post-hit invincibility frames. */
  bypassInvincibilityFrames?: boolean;
  /** Instant hits grant i-frames after damage (default true). */
  grantInvincibilityFrames?: boolean;
  /** Skips the statistical damage roll (DoT / per-second environmental ticks). */
  skipDamageRoll?: boolean;
  /** Attacker-side roll modifiers (True Strike, All-or-Nothing, Power, etc.). */
  attackerDamageRollModifiers?: DefiningWorldPlazaEntityHealthDamageRollModifier[];
  /** Dev/tests: force a specific deviation score instead of rolling randomly. */
  forcedDeviationScore?: number;
  /** Dev/tests: override roll mode (e.g. lock_in for True Strike). */
  forcedRollMode?: 'normal' | 'lock_in' | 'chaotic';
  /** Injectable RNG for deterministic tests. */
  random?: () => number;
};
