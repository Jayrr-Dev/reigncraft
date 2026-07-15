/**
 * Entity health state shapes for the plaza health engine.
 *
 * @module components/world/health/domains/definingWorldPlazaEntityHealthTypes
 */

import type { DefiningWorldPlazaEntityTemperatureResistance } from '@/components/world/health/domains/definingWorldPlazaTemperatureTypes';

export type { DefiningWorldPlazaEntityTemperatureResistance };

import type { DefiningWorldPlazaEntityBleedSeverity } from '@/components/world/health/domains/definingWorldPlazaEntityBleedSeverityRegistry';
import type { DefiningWorldPlazaEntityDiseaseId } from '@/components/world/health/domains/definingWorldPlazaEntityDiseaseRegistry';
import type { DefiningWorldPlazaEntityFrostbiteState } from '@/components/world/health/domains/definingWorldPlazaEntityFrostbiteTypes';
import type { DefiningWorldPlazaEntityPoisonPotency } from '@/components/world/health/domains/definingWorldPlazaEntityPoisonPotencyRegistry';

/** Damage and healing source categories. */
export type DefiningWorldPlazaEntityDamageKind =
  | 'physical'
  | 'environmental_lava'
  | 'environmental_heat'
  | 'environmental_cold'
  | 'fall'
  | 'toxic'
  | 'venomous'
  | 'lethal'
  | 'bleeding'
  | 'hemorrhaging'
  | 'exsanguinating'
  | 'potential_damage'
  | 'soulbreak'
  | 'healing'
  | 'starvation';

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

/** Back-loaded poison pool that ramps damage toward the end of its duration. */
export type DefiningWorldPlazaEntityHealthPoisonEffect = {
  id: string;
  potency: DefiningWorldPlazaEntityPoisonPotency;
  remainingPoisonDamage: number;
  totalPoisonDamage: number;
  /** Number of poison applications stacked on this potency tier. */
  stackCount: number;
  startedAtMs: number;
  expiresAtMs: number;
  tickIntervalMs: number;
  lastTickAtMs: number;
};

/** Pending hit that resolves for stored EV damage after a delay (curses, debuffs, etc.). */
export type DefiningWorldPlazaEntityHealthPotentialDamageEffect = {
  id: string;
  pendingExpectedDamage: number;
  appliedAtMs: number;
  resolvesAtMs: number;
};

/** Front-loaded bleed pool that drains over a severity-specific duration. */
export type DefiningWorldPlazaEntityHealthBleedEffect = {
  id: string;
  severity: DefiningWorldPlazaEntityBleedSeverity;
  remainingBleedDamage: number;
  totalBleedDamage: number;
  /** Number of bleed applications stacked on this severity tier. */
  stackCount: number;
  startedAtMs: number;
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

/** Converts a fraction of physical damage dealt into healing. */
export type DefiningWorldPlazaEntityHealthPhysicalDamageLifestealModifier = {
  id: string;
  ratio: number;
  expiresAtMs: number | null;
};

/** Converts a fraction of physical damage received into healing. */
export type DefiningWorldPlazaEntityHealthIncomingDamageHealModifier = {
  id: string;
  ratio: number;
  expiresAtMs: number | null;
};

/** Increases healing received (Blessing). */
export type DefiningWorldPlazaEntityHealthIncomingHealAmplifierModifier = {
  id: string;
  ratio: number;
  expiresAtMs: number | null;
};

/** Increases healing given (Mending). */
export type DefiningWorldPlazaEntityHealthOutgoingHealAmplifierModifier = {
  id: string;
  ratio: number;
  expiresAtMs: number | null;
};

/** Movement / combat cadence stats adjusted by timed or toggle buffs. */
export type DefiningWorldPlazaEntityHealthMovementModifierKind =
  | 'speed'
  | 'walk_speed'
  | 'jump_distance'
  | 'jump_arc'
  | 'jump_layer_reach'
  | 'stamina_drain'
  | 'stamina_regen'
  | 'stamina_jump_cost'
  | 'stamina_max'
  | 'attack_speed';

/** Multiplier applied to walk/run speed, jump reach/height, or attack cadence. */
export type DefiningWorldPlazaEntityHealthMovementModifier = {
  id: string;
  kind: DefiningWorldPlazaEntityHealthMovementModifierKind;
  multiplier: number;
  expiresAtMs: number | null;
};

/** Blocks healing while active (Necrotic Frostbite). */
export type DefiningWorldPlazaEntityHealthHealBlockModifier = {
  id: string;
  expiresAtMs: number | null;
};

/** Timed confusion effect that warps walk movement into a sine-wave path. */
export type DefiningWorldPlazaEntityHealthConfusionEffect = {
  id: string;
  targetIntensity: number;
  appliedAtMs: number;
  expiresAtMs: number | null;
  phaseSeed: number;
  /**
   * Optional day/night intensity scale (e.g. Moonblight).
   * Multiplies effective intensity from the live day/night cycle.
   */
  dayNightIntensityScale?: {
    readonly nightMultiplier: number;
    readonly dayMultiplier: number;
  };
};

/** Timed sleep effect that incapacitates the entity until expiry (or damage wake). */
export type DefiningWorldPlazaEntityHealthSleepEffect = {
  id: string;
  appliedAtMs: number;
  expiresAtMs: number;
  wakeBonusDamage: number;
  /**
   * When false, damage cannot clear this sleep (deep sleep).
   * Defaults to true when omitted (normal sleep).
   */
  canWakeFromDamage?: boolean;
  /** Multiplies passive regen while this sleep is active (valerian). */
  regenMultiplier?: number;
  /** Total max-HP percent healed evenly across the sleep duration (chamomile). */
  passiveHealPercentOfMaxTotal?: number;
};

/** Timed stun effect that locks the player in a wobbly idle until expiry. */
export type DefiningWorldPlazaEntityHealthStunEffect = {
  id: string;
  appliedAtMs: number;
  expiresAtMs: number;
  phaseSeed: number;
};

/** Active disease scheduler entry with pending staged grants. */
export type DefiningWorldPlazaEntityHealthDiseaseEffect = {
  id: string;
  diseaseId: string;
  /** Wall epoch when raw meat infection was contracted. */
  contractedAtMs: number;
  /** Wall epoch when symptoms and staged grants begin. */
  symptomsStartAtMs: number;
  /** Wall epoch when the illness ends (after symptomatic duration). */
  expiresAtMs: number;
  /** Snapshot at contraction: scales symptom damage and debuff strength. */
  symptomStrengthMultiplier: number;
  /** Snapshot at contraction: scales staged grant delays and durations. */
  durationMultiplier: number;
  /**
   * Whole in-game infection hours already credited to Pathology for this
   * instance (avoids double-awarding across ticks and save/load).
   */
  pathologyStudyHoursCredited: number;
  pendingGrants: readonly {
    grantIndex: number;
    fireAtMs: number;
  }[];
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
  | 'chaotic'
  | 'forced_tier';

/** Buff/debuff that adjusts expected damage, variance, or luck skew. */
export type DefiningWorldPlazaEntityHealthDamageRollModifier = {
  id: string;
  kind: DefiningWorldPlazaEntityHealthDamageRollModifierKind;
  /** Multiplier for expected/variance/stability; additive for luck. */
  value: number;
  expiresAtMs: number | null;
};

/** Timed temperature / infection modifiers from consumables (flowers, etc.). */
export type DefiningWorldPlazaEntityHealthTimedTemperatureModifier = {
  readonly id: string;
  readonly heatComfortBonusCelsius: number;
  readonly coldComfortBonusCelsius: number;
  readonly heatResistance: number;
  readonly coldResistance: number;
  /** Multiplier on disease contraction chance (1 = unchanged). */
  readonly diseaseContractionChanceMultiplier: number;
  readonly expiresAtMs: number;
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
  poisonEffects: DefiningWorldPlazaEntityHealthPoisonEffect[];
  bleedEffects: DefiningWorldPlazaEntityHealthBleedEffect[];
  potentialDamageEffects: DefiningWorldPlazaEntityHealthPotentialDamageEffect[];
  incomingDamageModifiers: DefiningWorldPlazaEntityHealthIncomingDamageModifier[];
  physicalDamageLifestealModifiers: DefiningWorldPlazaEntityHealthPhysicalDamageLifestealModifier[];
  incomingDamageHealModifiers: DefiningWorldPlazaEntityHealthIncomingDamageHealModifier[];
  incomingHealAmplifiers: DefiningWorldPlazaEntityHealthIncomingHealAmplifierModifier[];
  outgoingHealAmplifiers: DefiningWorldPlazaEntityHealthOutgoingHealAmplifierModifier[];
  movementModifiers: DefiningWorldPlazaEntityHealthMovementModifier[];
  healBlockModifiers: DefiningWorldPlazaEntityHealthHealBlockModifier[];
  confusionEffects: DefiningWorldPlazaEntityHealthConfusionEffect[];
  sleepEffects: DefiningWorldPlazaEntityHealthSleepEffect[];
  stunEffects: DefiningWorldPlazaEntityHealthStunEffect[];
  diseaseEffects: DefiningWorldPlazaEntityHealthDiseaseEffect[];
  /** Frostbite stack meter from environmental cold ticks. */
  frostbite: DefiningWorldPlazaEntityFrostbiteState | null;
  /** Grows when diseases clear; lowers contraction risk and symptom severity. */
  immuneSystemFactor: number;
  /** Per-disease ids the player cannot contract again. */
  diseaseImmunityIds: readonly DefiningWorldPlazaEntityDiseaseId[];
  damageRollModifiers: DefiningWorldPlazaEntityHealthDamageRollModifier[];
  regen: DefiningWorldPlazaEntityHealthRegenConfig;
  invincibleUntilMs: number | null;
  lastDamagedAtMs: number | null;
  lastDamageKind: DefiningWorldPlazaEntityDamageKind | null;
  isDead: boolean;
  temperatureResistance: DefiningWorldPlazaEntityTemperatureResistance;
  /** Expiring comfort/resist bonuses from herbs and similar. */
  timedTemperatureModifiers: readonly DefiningWorldPlazaEntityHealthTimedTemperatureModifier[];
  /**
   * Transient °C offset from combat on-hit heat/cold impulses.
   * Positive heats; negative cools. Decays toward 0 each health tick.
   */
  combatTemperatureOffsetCelsius: number;
  /** Damage kinds fully blocked by character immunities or buffs. */
  damageKindImmunities: readonly DefiningWorldPlazaEntityDamageKind[];
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
  /** Skips the statistical damage roll and girl-sample hit/pain voice SFX (DoT / per-second environmental ticks). */
  skipDamageRoll?: boolean;
  /** Attacker-side roll modifiers (True Strike, All-or-Nothing, Power, etc.). */
  attackerDamageRollModifiers?: DefiningWorldPlazaEntityHealthDamageRollModifier[];
  /** Defender-side modifiers for one hit only (e.g. legacy roll EV tuning). */
  ephemeralDefenderDamageRollModifiers?: DefiningWorldPlazaEntityHealthDamageRollModifier[];
  /** One-shot multiplier on final incoming damage after buff modifiers (e.g. roll dodge). */
  ephemeralIncomingDamageMultiplier?: number;
  /**
   * Floors rolled outcome so connected hits cannot land below this tier.
   * Skipped when `forcedDeviationScore` or `forcedRollMode` is set (dev / Ultra Instinct).
   */
  minimumOutcomeTier?: DefiningWorldPlazaDamageOutcomeTier;
  /** Dev/tests: force a specific deviation score instead of rolling randomly. */
  forcedDeviationScore?: number;
  /** Dev/tests: override roll mode (e.g. lock_in for True Strike). */
  forcedRollMode?: 'normal' | 'lock_in' | 'chaotic';
  /** Injectable RNG for deterministic tests. */
  random?: () => number;
};
