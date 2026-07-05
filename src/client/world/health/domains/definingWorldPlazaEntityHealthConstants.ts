/**
 * Default tuning for the plaza entity health engine.
 *
 * @module components/world/health/domains/definingWorldPlazaEntityHealthConstants
 */

import type { DefiningWorldPlazaEntityHealthState } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import { DEFINING_WORLD_PLAZA_ENTITY_TEMPERATURE_RESISTANCE_DEFAULT } from '@/components/world/health/domains/definingWorldPlazaTemperatureConstants';

/** Default starting max health for players. */
export const DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BASE_MAX = 1000;

/** Invincibility frames after a direct hit (ms). */
export const DEFINING_WORLD_PLAZA_ENTITY_HEALTH_INVINCIBILITY_FRAME_MS = 200;

/** Brief invincibility granted on respawn after death (ms). */
export const DEFINING_WORLD_PLAZA_ENTITY_HEALTH_RESPAWN_INVINCIBILITY_MS = 10_000;

/** Respawn invincibility sprite blink cycle length (ms). */
export const DEFINING_WORLD_PLAZA_ENTITY_HEALTH_RESPAWN_INVINCIBILITY_BLINK_PERIOD_MS = 180;

/** Sprite alpha during the dim phase of respawn invincibility blink. */
export const DEFINING_WORLD_PLAZA_ENTITY_HEALTH_RESPAWN_INVINCIBILITY_BLINK_DIM_ALPHA = 0.2;

/** Health ratio below which bonus damage reduction applies. */
export const DEFINING_WORLD_PLAZA_ENTITY_HEALTH_LOW_RATIO_THRESHOLD = 0.5;

/** Incoming damage multiplier while below half health (0.75 = 25% reduction). */
export const DEFINING_WORLD_PLAZA_ENTITY_HEALTH_LOW_RATIO_DAMAGE_MULTIPLIER = 0.75;

/** Passive regen rate (HP per second). */
export const DEFINING_WORLD_PLAZA_ENTITY_HEALTH_REGEN_PER_SECOND = 2;

/** Delay after taking damage before regen resumes (ms). */
export const DEFINING_WORLD_PLAZA_ENTITY_HEALTH_REGEN_DELAY_AFTER_DAMAGE_MS = 5000;

/** Default DoT tick interval (ms). */
export const DEFINING_WORLD_PLAZA_ENTITY_HEALTH_DOT_TICK_INTERVAL_MS = 1000;

/** Environmental hazard damage per second. */
export const DEFINING_WORLD_PLAZA_ENTITY_HEALTH_LAVA_DAMAGE_PER_SECOND = 25;
export const DEFINING_WORLD_PLAZA_ENTITY_HEALTH_HEAT_DAMAGE_PER_SECOND = 8;
export const DEFINING_WORLD_PLAZA_ENTITY_HEALTH_COLD_DAMAGE_PER_SECOND = 6;

/** Instant damage when entering a lava tile. */
export const DEFINING_WORLD_PLAZA_ENTITY_HEALTH_LAVA_INSTANT_DAMAGE = 15;

/** Fall damage: layers fallen without damage (falls of 6+ blocks deal damage). */
export const DEFINING_WORLD_PLAZA_ENTITY_HEALTH_FALL_SAFE_LAYER_DELTA = 5;

/** HP lost per layer beyond the safe threshold. */
export const DEFINING_WORLD_PLAZA_ENTITY_HEALTH_FALL_DAMAGE_PER_LAYER = 15;

/** Climate thresholds for environmental hazards (0..1). */
export const DEFINING_WORLD_PLAZA_ENTITY_HEALTH_HEAT_CLIMATE_TEMPERATURE_MIN = 0.72;
export const DEFINING_WORLD_PLAZA_ENTITY_HEALTH_LAVA_CLIMATE_TEMPERATURE_MIN = 0.88;
export const DEFINING_WORLD_PLAZA_ENTITY_HEALTH_COLD_CLIMATE_TEMPERATURE_MAX = 0.3;

/** Lava tile noise threshold for sparse lava placement. */
export const DEFINING_WORLD_PLAZA_ENTITY_HEALTH_LAVA_TILE_NOISE_THRESHOLD = 0.82;

/** Health HUD push interval for React state (ms). */
export const DEFINING_WORLD_PLAZA_ENTITY_HEALTH_HUD_PUSH_INTERVAL_MS = 100;

/** Minimum health-ratio delta worth a HUD re-render. */
export const DEFINING_WORLD_PLAZA_ENTITY_HEALTH_HUD_EPSILON = 0.005;

/** Default initial health state for a new player. */
export const DEFINING_WORLD_PLAZA_ENTITY_HEALTH_INITIAL_STATE: DefiningWorldPlazaEntityHealthState =
  {
    baseMaxHealth: DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BASE_MAX,
    maxHealthScale: 1,
    temporaryMaxHealthBonuses: [],
    currentHealth: DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BASE_MAX,
    shieldPoints: 0,
    damageOverTimeEffects: [],
    poisonEffects: [],
    bleedEffects: [],
    potentialDamageEffects: [],
    incomingDamageModifiers: [],
    movementModifiers: [],
    damageRollModifiers: [],
    regen: {
      healthPerSecond: DEFINING_WORLD_PLAZA_ENTITY_HEALTH_REGEN_PER_SECOND,
      delayAfterDamageMs:
        DEFINING_WORLD_PLAZA_ENTITY_HEALTH_REGEN_DELAY_AFTER_DAMAGE_MS,
    },
    invincibleUntilMs: null,
    invincibilityFrameUntilMs: 0,
    lastDamagedAtMs: null,
    lastDamageKind: null,
    isDead: false,
    temperatureResistance: {
      ...DEFINING_WORLD_PLAZA_ENTITY_TEMPERATURE_RESISTANCE_DEFAULT,
    },
  };
