import { advancingWorldPlazaEntityHealthTick } from '@/components/world/health/domains/advancingWorldPlazaEntityHealthTick';
import { applyingWorldPlazaEntityHealthBleedStack } from '@/components/world/health/domains/applyingWorldPlazaEntityHealthBleedStack';
import { applyingWorldPlazaEntityHealthPoisonStack } from '@/components/world/health/domains/applyingWorldPlazaEntityHealthPoisonStack';
import { applyingWorldPlazaEntityHealthPotentialDamage } from '@/components/world/health/domains/applyingWorldPlazaEntityHealthPotentialDamage';
import { clampingWorldPlazaEntityHealthCurrentToEffectiveMax } from '@/components/world/health/domains/clampingWorldPlazaEntityHealthCurrentToEffectiveMax';
import { computingWorldPlazaEntityHealthDamageWithSleepWake } from '@/components/world/health/domains/computingWorldPlazaEntityHealthDamageWithSleepWake';
import { computingWorldPlazaEntityHealthEffectiveMax } from '@/components/world/health/domains/computingWorldPlazaEntityHealthEffectiveMax';
import { computingWorldPlazaEntityHealthAmplifiedHealAmount } from '@/components/world/health/domains/computingWorldPlazaEntityHealthHealAmplifier';
import type { DefiningWorldPlazaEntityBleedSeverity } from '@/components/world/health/domains/definingWorldPlazaEntityBleedSeverityRegistry';
import {
  DEFINING_WORLD_PLAZA_ENTITY_HEALTH_DOT_TICK_INTERVAL_MS,
  DEFINING_WORLD_PLAZA_ENTITY_HEALTH_FALL_DAMAGE_PER_LAYER,
  DEFINING_WORLD_PLAZA_ENTITY_HEALTH_FALL_SAFE_LAYER_DELTA,
  DEFINING_WORLD_PLAZA_ENTITY_HEALTH_INITIAL_STATE,
} from '@/components/world/health/domains/definingWorldPlazaEntityHealthConstants';
import type { DefiningWorldPlazaEntityHealthDamageRollPreset } from '@/components/world/health/domains/definingWorldPlazaEntityHealthDamageRollPresets';
import { creatingWorldPlazaEntityHealthDamageRollPresetModifierId } from '@/components/world/health/domains/definingWorldPlazaEntityHealthDamageRollPresets';
import type {
  DefiningWorldPlazaEntityDamageKind,
  DefiningWorldPlazaEntityHealthDamageOptions,
  DefiningWorldPlazaEntityHealthDamageRollModifier,
  DefiningWorldPlazaEntityHealthIncomingDamageHealModifier,
  DefiningWorldPlazaEntityHealthIncomingDamageModifier,
  DefiningWorldPlazaEntityHealthIncomingHealAmplifierModifier,
  DefiningWorldPlazaEntityHealthConfusionEffect,
  DefiningWorldPlazaEntityHealthSleepEffect,
  DefiningWorldPlazaEntityHealthStunEffect,
  DefiningWorldPlazaEntityHealthMovementModifier,
  DefiningWorldPlazaEntityHealthOutgoingHealAmplifierModifier,
  DefiningWorldPlazaEntityHealthPhysicalDamageLifestealModifier,
  DefiningWorldPlazaEntityHealthState,
  DefiningWorldPlazaEntityHealthSyncSnapshot,
  DefiningWorldPlazaEntityTemperatureResistance,
} from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import type { DefiningWorldPlazaEntityPoisonPotency } from '@/components/world/health/domains/definingWorldPlazaEntityPoisonPotencyRegistry';

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
    poisonEffects: [],
    bleedEffects: [],
    potentialDamageEffects: [],
    incomingDamageModifiers: [],
    physicalDamageLifestealModifiers: [],
    incomingDamageHealModifiers: [],
    incomingHealAmplifiers: [],
    outgoingHealAmplifiers: [],
    movementModifiers: [],
    confusionEffects: [],
    sleepEffects: [],
    stunEffects: [],
    damageRollModifiers: [],
    temperatureResistance: {
      ...DEFINING_WORLD_PLAZA_ENTITY_HEALTH_INITIAL_STATE.temperatureResistance,
    },
    damageKindImmunities: [],
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
  return computingWorldPlazaEntityHealthDamageWithSleepWake({
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

export type HealingWorldPlazaEntityHealthWithAmplifiersParams = {
  receiverState: DefiningWorldPlazaEntityHealthState;
  baseHealAmount: number;
  nowMs: number;
  giverOutgoingHealAmplifiers?: readonly DefiningWorldPlazaEntityHealthOutgoingHealAmplifierModifier[];
  applyOutgoingAmplifier?: boolean;
};

/** Applies Blessing/Mending amplifiers, then restores health. */
export function healingWorldPlazaEntityHealthWithAmplifiers({
  receiverState,
  baseHealAmount,
  nowMs,
  giverOutgoingHealAmplifiers = receiverState.outgoingHealAmplifiers,
  applyOutgoingAmplifier = true,
}: HealingWorldPlazaEntityHealthWithAmplifiersParams): {
  state: DefiningWorldPlazaEntityHealthState;
  amplifiedHealAmount: number;
} {
  const amplifiedHealAmount =
    computingWorldPlazaEntityHealthAmplifiedHealAmount({
      baseHealAmount,
      receiverIncomingHealAmplifiers: receiverState.incomingHealAmplifiers,
      giverOutgoingHealAmplifiers,
      nowMs,
      applyOutgoingAmplifier,
    });

  return {
    state: healingWorldPlazaEntityHealth(
      receiverState,
      amplifiedHealAmount,
      nowMs
    ),
    amplifiedHealAmount,
  };
}

/** Sets the max-health scale multiplier (e.g. 2 = double, 0.5 = halve). */
export function scalingWorldPlazaEntityHealthMax(
  state: DefiningWorldPlazaEntityHealthState,
  maxHealthScale: number,
  nowMs: number
): DefiningWorldPlazaEntityHealthState {
  const previousEffectiveMax = computingWorldPlazaEntityHealthEffectiveMax(
    state,
    nowMs
  );
  const healthRatio =
    previousEffectiveMax > 0 ? state.currentHealth / previousEffectiveMax : 1;

  const nextState = {
    ...state,
    maxHealthScale: Math.max(0.1, maxHealthScale),
  };
  const effectiveMax = computingWorldPlazaEntityHealthEffectiveMax(
    nextState,
    nowMs
  );
  const scaledCurrentHealth = healthRatio * effectiveMax;

  return {
    ...nextState,
    currentHealth: Math.min(effectiveMax, Math.max(0, scaledCurrentHealth)),
    isDead: scaledCurrentHealth <= 0,
  };
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
  nowMs: number,
  bonusId?: string
): DefiningWorldPlazaEntityHealthState {
  const nextState: DefiningWorldPlazaEntityHealthState = {
    ...state,
    temporaryMaxHealthBonuses: [
      ...state.temporaryMaxHealthBonuses,
      {
        id: bonusId ?? creatingWorldPlazaEntityHealthUniqueId('temp-max'),
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

/** Schedules delayed potential damage that resolves after a timer. */
export function applyingWorldPlazaEntityHealthPotentialDamageFromState(
  state: DefiningWorldPlazaEntityHealthState,
  flatExpectedDamage: number,
  resolveDelayMs: number,
  nowMs: number
): DefiningWorldPlazaEntityHealthState {
  return applyingWorldPlazaEntityHealthPotentialDamage({
    state,
    pendingExpectedDamage: Math.max(0, flatExpectedDamage),
    resolveDelayMs,
    nowMs,
  });
}

/** Adds or stacks a poison pool with a back-loaded ramp. */
export function applyingWorldPlazaEntityHealthPoison(
  state: DefiningWorldPlazaEntityHealthState,
  potency: DefiningWorldPlazaEntityPoisonPotency,
  totalPoisonDamage: number,
  nowMs: number,
  tickIntervalMs: number = DEFINING_WORLD_PLAZA_ENTITY_HEALTH_DOT_TICK_INTERVAL_MS
): DefiningWorldPlazaEntityHealthState {
  return applyingWorldPlazaEntityHealthPoisonStack(
    state,
    potency,
    totalPoisonDamage,
    nowMs,
    tickIntervalMs
  );
}

/** Adds or stacks a bleed pool and escalates severity at stack thresholds. */
export function applyingWorldPlazaEntityHealthBleed(
  state: DefiningWorldPlazaEntityHealthState,
  severity: DefiningWorldPlazaEntityBleedSeverity,
  totalBleedDamage: number,
  nowMs: number,
  tickIntervalMs: number = DEFINING_WORLD_PLAZA_ENTITY_HEALTH_DOT_TICK_INTERVAL_MS
): DefiningWorldPlazaEntityHealthState {
  return applyingWorldPlazaEntityHealthBleedStack(
    state,
    severity,
    totalBleedDamage,
    nowMs,
    tickIntervalMs
  );
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

/** Registers a physical damage lifesteal modifier. */
export function addingWorldPlazaEntityHealthPhysicalDamageLifestealModifier(
  state: DefiningWorldPlazaEntityHealthState,
  modifier: DefiningWorldPlazaEntityHealthPhysicalDamageLifestealModifier
): DefiningWorldPlazaEntityHealthState {
  const withoutExisting = state.physicalDamageLifestealModifiers.filter(
    (existingModifier) => existingModifier.id !== modifier.id
  );

  return {
    ...state,
    physicalDamageLifestealModifiers: [...withoutExisting, modifier],
  };
}

/** Removes a physical damage lifesteal modifier by id. */
export function removingWorldPlazaEntityHealthPhysicalDamageLifestealModifier(
  state: DefiningWorldPlazaEntityHealthState,
  modifierId: string
): DefiningWorldPlazaEntityHealthState {
  return {
    ...state,
    physicalDamageLifestealModifiers:
      state.physicalDamageLifestealModifiers.filter(
        (modifier) => modifier.id !== modifierId
      ),
  };
}

/** Registers an incoming physical damage heal modifier. */
export function addingWorldPlazaEntityHealthIncomingDamageHealModifier(
  state: DefiningWorldPlazaEntityHealthState,
  modifier: DefiningWorldPlazaEntityHealthIncomingDamageHealModifier
): DefiningWorldPlazaEntityHealthState {
  const withoutExisting = state.incomingDamageHealModifiers.filter(
    (existingModifier) => existingModifier.id !== modifier.id
  );

  return {
    ...state,
    incomingDamageHealModifiers: [...withoutExisting, modifier],
  };
}

/** Removes an incoming physical damage heal modifier by id. */
export function removingWorldPlazaEntityHealthIncomingDamageHealModifier(
  state: DefiningWorldPlazaEntityHealthState,
  modifierId: string
): DefiningWorldPlazaEntityHealthState {
  return {
    ...state,
    incomingDamageHealModifiers: state.incomingDamageHealModifiers.filter(
      (modifier) => modifier.id !== modifierId
    ),
  };
}

/** Registers an incoming heal amplifier (Blessing). */
export function addingWorldPlazaEntityHealthIncomingHealAmplifier(
  state: DefiningWorldPlazaEntityHealthState,
  modifier: DefiningWorldPlazaEntityHealthIncomingHealAmplifierModifier
): DefiningWorldPlazaEntityHealthState {
  const withoutExisting = state.incomingHealAmplifiers.filter(
    (existingModifier) => existingModifier.id !== modifier.id
  );

  return {
    ...state,
    incomingHealAmplifiers: [...withoutExisting, modifier],
  };
}

/** Removes an incoming heal amplifier by id. */
export function removingWorldPlazaEntityHealthIncomingHealAmplifier(
  state: DefiningWorldPlazaEntityHealthState,
  modifierId: string
): DefiningWorldPlazaEntityHealthState {
  return {
    ...state,
    incomingHealAmplifiers: state.incomingHealAmplifiers.filter(
      (modifier) => modifier.id !== modifierId
    ),
  };
}

/** Registers an outgoing heal amplifier (Mending). */
export function addingWorldPlazaEntityHealthOutgoingHealAmplifier(
  state: DefiningWorldPlazaEntityHealthState,
  modifier: DefiningWorldPlazaEntityHealthOutgoingHealAmplifierModifier
): DefiningWorldPlazaEntityHealthState {
  const withoutExisting = state.outgoingHealAmplifiers.filter(
    (existingModifier) => existingModifier.id !== modifier.id
  );

  return {
    ...state,
    outgoingHealAmplifiers: [...withoutExisting, modifier],
  };
}

/** Removes an outgoing heal amplifier by id. */
export function removingWorldPlazaEntityHealthOutgoingHealAmplifier(
  state: DefiningWorldPlazaEntityHealthState,
  modifierId: string
): DefiningWorldPlazaEntityHealthState {
  return {
    ...state,
    outgoingHealAmplifiers: state.outgoingHealAmplifiers.filter(
      (modifier) => modifier.id !== modifierId
    ),
  };
}

/** Registers a movement speed or jump multiplier buff. */
export function addingWorldPlazaEntityHealthMovementModifier(
  state: DefiningWorldPlazaEntityHealthState,
  modifier: DefiningWorldPlazaEntityHealthMovementModifier
): DefiningWorldPlazaEntityHealthState {
  const withoutExisting = state.movementModifiers.filter(
    (existingModifier) =>
      !(
        existingModifier.id === modifier.id &&
        existingModifier.kind === modifier.kind
      )
  );

  return {
    ...state,
    movementModifiers: [...withoutExisting, modifier],
  };
}

/** Removes a movement modifier by id. */
export function removingWorldPlazaEntityHealthMovementModifier(
  state: DefiningWorldPlazaEntityHealthState,
  modifierId: string
): DefiningWorldPlazaEntityHealthState {
  return {
    ...state,
    movementModifiers: state.movementModifiers.filter(
      (modifier) => modifier.id !== modifierId
    ),
  };
}

/** Registers or replaces a confusion effect on the entity. */
export function addingWorldPlazaEntityHealthConfusionEffect(
  state: DefiningWorldPlazaEntityHealthState,
  effect: DefiningWorldPlazaEntityHealthConfusionEffect
): DefiningWorldPlazaEntityHealthState {
  return {
    ...state,
    confusionEffects: [
      ...state.confusionEffects.filter((existing) => existing.id !== effect.id),
      effect,
    ],
  };
}

/** Removes a confusion effect by id. */
export function removingWorldPlazaEntityHealthConfusionEffect(
  state: DefiningWorldPlazaEntityHealthState,
  effectId: string
): DefiningWorldPlazaEntityHealthState {
  return {
    ...state,
    confusionEffects: state.confusionEffects.filter(
      (effect) => effect.id !== effectId
    ),
  };
}

/** Registers or replaces a sleep effect on the entity. */
export function addingWorldPlazaEntityHealthSleepEffect(
  state: DefiningWorldPlazaEntityHealthState,
  effect: DefiningWorldPlazaEntityHealthSleepEffect
): DefiningWorldPlazaEntityHealthState {
  return {
    ...state,
    sleepEffects: [
      ...state.sleepEffects.filter((existing) => existing.id !== effect.id),
      effect,
    ],
  };
}

/** Removes a sleep effect by id. */
export function removingWorldPlazaEntityHealthSleepEffect(
  state: DefiningWorldPlazaEntityHealthState,
  effectId: string
): DefiningWorldPlazaEntityHealthState {
  return {
    ...state,
    sleepEffects: state.sleepEffects.filter((effect) => effect.id !== effectId),
  };
}

/** Registers or replaces a stun effect on the entity. */
export function addingWorldPlazaEntityHealthStunEffect(
  state: DefiningWorldPlazaEntityHealthState,
  effect: DefiningWorldPlazaEntityHealthStunEffect
): DefiningWorldPlazaEntityHealthState {
  return {
    ...state,
    stunEffects: [
      ...state.stunEffects.filter((existing) => existing.id !== effect.id),
      effect,
    ],
  };
}

/** Removes a stun effect by id. */
export function removingWorldPlazaEntityHealthStunEffect(
  state: DefiningWorldPlazaEntityHealthState,
  effectId: string
): DefiningWorldPlazaEntityHealthState {
  return {
    ...state,
    stunEffects: state.stunEffects.filter((effect) => effect.id !== effectId),
  };
}

/** Registers a damage-roll modifier (expected, variance, stability, luck). */
export function addingWorldPlazaEntityHealthDamageRollModifier(
  state: DefiningWorldPlazaEntityHealthState,
  modifier: DefiningWorldPlazaEntityHealthDamageRollModifier
): DefiningWorldPlazaEntityHealthState {
  const withoutExisting = state.damageRollModifiers.filter(
    (existingModifier) => existingModifier.id !== modifier.id
  );

  return {
    ...state,
    damageRollModifiers: [...withoutExisting, modifier],
  };
}

/** Removes a damage-roll modifier by id. */
export function removingWorldPlazaEntityHealthDamageRollModifier(
  state: DefiningWorldPlazaEntityHealthState,
  modifierId: string
): DefiningWorldPlazaEntityHealthState {
  return {
    ...state,
    damageRollModifiers: state.damageRollModifiers.filter(
      (modifier) => modifier.id !== modifierId
    ),
  };
}

/** Toggles a damage-roll modifier on or off by id. */
export function togglingWorldPlazaEntityHealthDamageRollModifier(
  state: DefiningWorldPlazaEntityHealthState,
  modifier: DefiningWorldPlazaEntityHealthDamageRollModifier
): DefiningWorldPlazaEntityHealthState {
  const hasModifier = state.damageRollModifiers.some(
    (existingModifier) => existingModifier.id === modifier.id
  );

  if (hasModifier) {
    return removingWorldPlazaEntityHealthDamageRollModifier(state, modifier.id);
  }

  return addingWorldPlazaEntityHealthDamageRollModifier(state, modifier);
}

/** Toggles a named armour/buff preset on or off. */
export function togglingWorldPlazaEntityHealthDamageRollPreset(
  state: DefiningWorldPlazaEntityHealthState,
  preset: DefiningWorldPlazaEntityHealthDamageRollPreset
): DefiningWorldPlazaEntityHealthState {
  const isActive = state.damageRollModifiers.some((modifier) =>
    modifier.id.startsWith(`${preset.id}:`)
  );

  if (isActive) {
    return {
      ...state,
      damageRollModifiers: state.damageRollModifiers.filter(
        (modifier) => !modifier.id.startsWith(`${preset.id}:`)
      ),
    };
  }

  const presetModifiers: DefiningWorldPlazaEntityHealthDamageRollModifier[] =
    preset.modifiers.map((modifier, modifierIndex) => ({
      id: creatingWorldPlazaEntityHealthDamageRollPresetModifierId(
        preset.id,
        modifierIndex
      ),
      kind: modifier.kind,
      value: modifier.value,
      expiresAtMs: null,
    }));

  return {
    ...state,
    damageRollModifiers: [...state.damageRollModifiers, ...presetModifiers],
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
    poisonEffects: [],
    bleedEffects: [],
    potentialDamageEffects: [],
    isDead: false,
    lastDamagedAtMs: null,
    lastDamageKind: null,
  };
}

/** Advances timed effects, DoT, and regen. */
export function tickingWorldPlazaEntityHealthState(
  state: DefiningWorldPlazaEntityHealthState,
  nowMs: number,
  deltaMs: number,
  isRegenAllowed = true
): DefiningWorldPlazaEntityHealthState {
  return advancingWorldPlazaEntityHealthTick({
    state,
    nowMs,
    deltaMs,
    isRegenAllowed,
  });
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

function clampingWorldPlazaEntityTemperatureResistanceFraction(
  resistance: number
): number {
  return Math.min(1, Math.max(0, resistance));
}

/** Updates heat/cold resistance fractions on the entity. */
export function settingWorldPlazaEntityTemperatureResistance(
  state: DefiningWorldPlazaEntityHealthState,
  patch: Partial<DefiningWorldPlazaEntityTemperatureResistance>
): DefiningWorldPlazaEntityHealthState {
  return {
    ...state,
    temperatureResistance: {
      heatResistance:
        patch.heatResistance === undefined
          ? state.temperatureResistance.heatResistance
          : clampingWorldPlazaEntityTemperatureResistanceFraction(
              patch.heatResistance
            ),
      coldResistance:
        patch.coldResistance === undefined
          ? state.temperatureResistance.coldResistance
          : clampingWorldPlazaEntityTemperatureResistanceFraction(
              patch.coldResistance
            ),
      isHeatImmune:
        patch.isHeatImmune ?? state.temperatureResistance.isHeatImmune,
      isColdImmune:
        patch.isColdImmune ?? state.temperatureResistance.isColdImmune,
    },
  };
}

/** Adds 25% heat resistance (capped at 100%). */
export function increasingWorldPlazaEntityHeatResistance(
  state: DefiningWorldPlazaEntityHealthState,
  amount: number
): DefiningWorldPlazaEntityHealthState {
  return settingWorldPlazaEntityTemperatureResistance(state, {
    heatResistance: state.temperatureResistance.heatResistance + amount,
  });
}

/** Adds 25% cold resistance (capped at 100%). */
export function increasingWorldPlazaEntityColdResistance(
  state: DefiningWorldPlazaEntityHealthState,
  amount: number
): DefiningWorldPlazaEntityHealthState {
  return settingWorldPlazaEntityTemperatureResistance(state, {
    coldResistance: state.temperatureResistance.coldResistance + amount,
  });
}

/** Toggles heat immunity. */
export function togglingWorldPlazaEntityHeatImmunity(
  state: DefiningWorldPlazaEntityHealthState
): DefiningWorldPlazaEntityHealthState {
  return settingWorldPlazaEntityTemperatureResistance(state, {
    isHeatImmune: !state.temperatureResistance.isHeatImmune,
  });
}

/** Toggles cold immunity. */
export function togglingWorldPlazaEntityColdImmunity(
  state: DefiningWorldPlazaEntityHealthState
): DefiningWorldPlazaEntityHealthState {
  return settingWorldPlazaEntityTemperatureResistance(state, {
    isColdImmune: !state.temperatureResistance.isColdImmune,
  });
}
