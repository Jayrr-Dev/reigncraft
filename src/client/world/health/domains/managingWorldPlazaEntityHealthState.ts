import { advancingWorldPlazaEntityHealthTick } from '@/components/world/health/domains/advancingWorldPlazaEntityHealthTick';
import { clampingWorldPlazaEntityHealthCurrentToEffectiveMax } from '@/components/world/health/domains/clampingWorldPlazaEntityHealthCurrentToEffectiveMax';
import { computingWorldPlazaEntityHealthDamage } from '@/components/world/health/domains/computingWorldPlazaEntityHealthDamage';
import { computingWorldPlazaEntityHealthEffectiveMax } from '@/components/world/health/domains/computingWorldPlazaEntityHealthEffectiveMax';
import {
  DEFINING_WORLD_PLAZA_ENTITY_HEALTH_DOT_TICK_INTERVAL_MS,
  DEFINING_WORLD_PLAZA_ENTITY_HEALTH_FALL_DAMAGE_PER_LAYER,
  DEFINING_WORLD_PLAZA_ENTITY_HEALTH_FALL_SAFE_LAYER_DELTA,
  DEFINING_WORLD_PLAZA_ENTITY_HEALTH_INITIAL_STATE,
} from '@/components/world/health/domains/definingWorldPlazaEntityHealthConstants';
import type {
  DefiningWorldPlazaEntityDamageKind,
  DefiningWorldPlazaEntityHealthDamageOptions,
  DefiningWorldPlazaEntityHealthIncomingDamageModifier,
  DefiningWorldPlazaEntityHealthState,
  DefiningWorldPlazaEntityHealthSyncSnapshot,
} from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';

let managingWorldPlazaEntityHealthStateNextId = 0;

function creatingWorldPlazaEntityHealthUniqueId(prefix: string): string {
  managingWorldPlazaEntityHealthStateNextId += 1;
  return `${prefix}-${managingWorldPlazaEntityHealthStateNextId}`;
}

/** Returns a fresh player health state. */
export function creatingWorldPlazaEntityHealthInitialState(): DefiningWorldPlazaEntityHealthState {
  return {
    ...DEFINING_WORLD_PLAZA_ENTITY_HEALTH_INITIAL_STATE,
    temporaryMaxHealthBonuses: [],
    damageOverTimeEffects: [],
    incomingDamageModifiers: [],
  };
}

/** Maps live state to the network sync snapshot. */
export function serializingWorldPlazaEntityHealthSyncSnapshot(
  state: DefiningWorldPlazaEntityHealthState,
  nowMs: number
): DefiningWorldPlazaEntityHealthSyncSnapshot {
  const effectiveMax = computingWorldPlazaEntityHealthEffectiveMax(
    state,
    nowMs
  );

  return {
    healthCurrent: Math.max(0, Math.round(state.currentHealth)),
    healthEffectiveMax: Math.max(1, Math.round(effectiveMax)),
    shieldPoints: Math.max(0, Math.round(state.shieldPoints)),
    isInvincible:
      state.invincibleUntilMs !== null && nowMs < state.invincibleUntilMs,
  };
}

/** Applies damage through the full pipeline. */
export function takingWorldPlazaEntityHealthDamage(
  state: DefiningWorldPlazaEntityHealthState,
  amount: number,
  kind: DefiningWorldPlazaEntityDamageKind,
  nowMs: number,
  options?: DefiningWorldPlazaEntityHealthDamageOptions
): DefiningWorldPlazaEntityHealthState {
  return computingWorldPlazaEntityHealthDamage({
    state,
    rawAmount: amount,
    kind,
    nowMs,
    options,
  }).state;
}

/** Restores health up to the effective max. */
export function healingWorldPlazaEntityHealth(
  state: DefiningWorldPlazaEntityHealthState,
  amount: number,
  nowMs: number
): DefiningWorldPlazaEntityHealthState {
  const effectiveMax = computingWorldPlazaEntityHealthEffectiveMax(
    state,
    nowMs
  );

  return {
    ...state,
    currentHealth: Math.min(
      effectiveMax,
      state.currentHealth + Math.max(0, amount)
    ),
    isDead: false,
  };
}

/** Sets the max-health scale multiplier (e.g. 2 = double, 0.5 = halve). */
export function scalingWorldPlazaEntityHealthMax(
  state: DefiningWorldPlazaEntityHealthState,
  maxHealthScale: number,
  nowMs: number
): DefiningWorldPlazaEntityHealthState {
  const nextState = {
    ...state,
    maxHealthScale: Math.max(0.1, maxHealthScale),
  };
  const effectiveMax = computingWorldPlazaEntityHealthEffectiveMax(
    nextState,
    nowMs
  );

  return clampingWorldPlazaEntityHealthCurrentToEffectiveMax(
    nextState,
    effectiveMax
  );
}

/** Doubles effective max health via scale. */
export function doublingWorldPlazaEntityHealthMax(
  state: DefiningWorldPlazaEntityHealthState,
  nowMs: number
): DefiningWorldPlazaEntityHealthState {
  return scalingWorldPlazaEntityHealthMax(
    state,
    state.maxHealthScale * 2,
    nowMs
  );
}

/** Halves effective max health via scale. */
export function halvingWorldPlazaEntityHealthMax(
  state: DefiningWorldPlazaEntityHealthState,
  nowMs: number
): DefiningWorldPlazaEntityHealthState {
  return scalingWorldPlazaEntityHealthMax(
    state,
    state.maxHealthScale * 0.5,
    nowMs
  );
}

/** Adds a temporary max-health bonus that expires at a timestamp. */
export function addingWorldPlazaEntityHealthTemporaryMax(
  state: DefiningWorldPlazaEntityHealthState,
  amount: number,
  durationMs: number,
  nowMs: number
): DefiningWorldPlazaEntityHealthState {
  const nextState: DefiningWorldPlazaEntityHealthState = {
    ...state,
    temporaryMaxHealthBonuses: [
      ...state.temporaryMaxHealthBonuses,
      {
        id: creatingWorldPlazaEntityHealthUniqueId('temp-max'),
        amount: Math.max(0, amount),
        expiresAtMs: nowMs + Math.max(0, durationMs),
      },
    ],
  };
  const effectiveMax = computingWorldPlazaEntityHealthEffectiveMax(
    nextState,
    nowMs
  );

  return clampingWorldPlazaEntityHealthCurrentToEffectiveMax(
    nextState,
    effectiveMax
  );
}

/** Adds shield points on top of health. */
export function addingWorldPlazaEntityHealthShield(
  state: DefiningWorldPlazaEntityHealthState,
  amount: number
): DefiningWorldPlazaEntityHealthState {
  return {
    ...state,
    shieldPoints: state.shieldPoints + Math.max(0, amount),
  };
}

/** Grants invincibility for a duration or forever when durationMs is null. */
export function settingWorldPlazaEntityHealthInvincible(
  state: DefiningWorldPlazaEntityHealthState,
  durationMs: number | null,
  nowMs: number
): DefiningWorldPlazaEntityHealthState {
  return {
    ...state,
    invincibleUntilMs:
      durationMs === null
        ? Number.POSITIVE_INFINITY
        : nowMs + Math.max(0, durationMs),
  };
}

/** Clears the invincibility buff. */
export function clearingWorldPlazaEntityHealthInvincible(
  state: DefiningWorldPlazaEntityHealthState
): DefiningWorldPlazaEntityHealthState {
  return {
    ...state,
    invincibleUntilMs: null,
  };
}

/** Toggles invincibility buff on or off. */
export function togglingWorldPlazaEntityHealthInvincible(
  state: DefiningWorldPlazaEntityHealthState,
  nowMs: number
): DefiningWorldPlazaEntityHealthState {
  const isInvincible =
    state.invincibleUntilMs !== null && nowMs < state.invincibleUntilMs;

  if (isInvincible) {
    return clearingWorldPlazaEntityHealthInvincible(state);
  }

  return settingWorldPlazaEntityHealthInvincible(state, null, nowMs);
}

/** Adds or refreshes a damage-over-time effect. */
export function addingWorldPlazaEntityHealthDamageOverTime(
  state: DefiningWorldPlazaEntityHealthState,
  kind: DefiningWorldPlazaEntityDamageKind,
  damagePerSecond: number,
  durationMs: number,
  nowMs: number,
  tickIntervalMs: number = DEFINING_WORLD_PLAZA_ENTITY_HEALTH_DOT_TICK_INTERVAL_MS
): DefiningWorldPlazaEntityHealthState {
  const effectId = creatingWorldPlazaEntityHealthUniqueId('dot');

  return {
    ...state,
    damageOverTimeEffects: [
      ...state.damageOverTimeEffects.filter((effect) => effect.kind !== kind),
      {
        id: effectId,
        kind,
        damagePerSecond: Math.max(0, damagePerSecond),
        expiresAtMs: nowMs + Math.max(0, durationMs),
        tickIntervalMs,
        lastTickAtMs: nowMs,
      },
    ],
  };
}

/** Registers an incoming damage multiplier (armor, buffs, post-action reduction). */
export function addingWorldPlazaEntityHealthIncomingDamageModifier(
  state: DefiningWorldPlazaEntityHealthState,
  modifier: DefiningWorldPlazaEntityHealthIncomingDamageModifier
): DefiningWorldPlazaEntityHealthState {
  const withoutExisting = state.incomingDamageModifiers.filter(
    (existingModifier) => existingModifier.id !== modifier.id
  );

  return {
    ...state,
    incomingDamageModifiers: [...withoutExisting, modifier],
  };
}

/** Removes an incoming damage modifier by id. */
export function removingWorldPlazaEntityHealthIncomingDamageModifier(
  state: DefiningWorldPlazaEntityHealthState,
  modifierId: string
): DefiningWorldPlazaEntityHealthState {
  return {
    ...state,
    incomingDamageModifiers: state.incomingDamageModifiers.filter(
      (modifier) => modifier.id !== modifierId
    ),
  };
}

/** Restores health and shield to full effective max. */
export function revivingWorldPlazaEntityHealthToFull(
  state: DefiningWorldPlazaEntityHealthState,
  nowMs: number
): DefiningWorldPlazaEntityHealthState {
  const effectiveMax = computingWorldPlazaEntityHealthEffectiveMax(
    state,
    nowMs
  );

  return {
    ...state,
    currentHealth: effectiveMax,
    shieldPoints: 0,
    damageOverTimeEffects: [],
    isDead: false,
    lastDamagedAtMs: null,
    lastDamageKind: null,
    invincibilityFrameUntilMs: 0,
  };
}

/** Advances timed effects, DoT, and regen. */
export function tickingWorldPlazaEntityHealthState(
  state: DefiningWorldPlazaEntityHealthState,
  nowMs: number,
  deltaMs: number
): DefiningWorldPlazaEntityHealthState {
  return advancingWorldPlazaEntityHealthTick({ state, nowMs, deltaMs });
}

/** Computes fall damage from layers dropped beyond the safe threshold. */
export function computingWorldPlazaEntityHealthFallDamage(
  layerDelta: number
): number {
  if (layerDelta <= DEFINING_WORLD_PLAZA_ENTITY_HEALTH_FALL_SAFE_LAYER_DELTA) {
    return 0;
  }

  const damagingLayers =
    layerDelta - DEFINING_WORLD_PLAZA_ENTITY_HEALTH_FALL_SAFE_LAYER_DELTA;

  return (
    damagingLayers * DEFINING_WORLD_PLAZA_ENTITY_HEALTH_FALL_DAMAGE_PER_LAYER
  );
}
