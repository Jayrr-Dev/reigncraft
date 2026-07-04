/**
 * Entity health state shapes for the plaza health engine.
 *
 * @module components/world/health/domains/definingWorldPlazaEntityHealthTypes
 */

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
  regen: DefiningWorldPlazaEntityHealthRegenConfig;
  invincibleUntilMs: number | null;
  invincibilityFrameUntilMs: number;
  lastDamagedAtMs: number | null;
  lastDamageKind: DefiningWorldPlazaEntityDamageKind | null;
  isDead: boolean;
};

/** Breakdown returned after the damage pipeline runs. */
export type DefiningWorldPlazaEntityHealthAppliedDamage = {
  rawAmount: number;
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
};
