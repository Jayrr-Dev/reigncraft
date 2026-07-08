import {
  DEFINING_WORLD_PLAZA_CONFUSION_INTENSITY_MAX,
  DEFINING_WORLD_PLAZA_CONFUSION_INTENSITY_MIN,
} from '@/components/world/health/domains/definingWorldPlazaEntityConfusionConstants';
import { checkingWorldPlazaEntityPlayerSleepIsActive } from '@/components/world/health/domains/checkingWorldPlazaEntityPlayerSleepIsActive';
import { computingWorldPlazaEntityHealthRolledExpectedAmount } from '@/components/world/health/domains/computingWorldPlazaEntityHealthRolledExpectedAmount';
import {
  resolvingWorldPlazaEntityBuffDescriptor,
  type DefiningWorldPlazaEntityBuffDescriptor,
} from '@/components/world/health/domains/definingWorldPlazaEntityBuffRegistry';
import { creatingWorldPlazaEntityHealthDamageRollPresetModifierId } from '@/components/world/health/domains/definingWorldPlazaEntityHealthDamageRollPresets';
import type {
  DefiningWorldPlazaEntityHealthDamageRollModifier,
  DefiningWorldPlazaEntityHealthState,
} from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import {
  addingWorldPlazaEntityHealthConfusionEffect,
  addingWorldPlazaEntityHealthIncomingDamageHealModifier,
  addingWorldPlazaEntityHealthIncomingDamageModifier,
  addingWorldPlazaEntityHealthIncomingHealAmplifier,
  addingWorldPlazaEntityHealthMovementModifier,
  addingWorldPlazaEntityHealthOutgoingHealAmplifier,
  addingWorldPlazaEntityHealthPhysicalDamageLifestealModifier,
  addingWorldPlazaEntityHealthSleepEffect,
  addingWorldPlazaEntityHealthTemporaryMax,
  doublingWorldPlazaEntityHealthMax,
  halvingWorldPlazaEntityHealthMax,
  increasingWorldPlazaEntityColdResistance,
  increasingWorldPlazaEntityHeatResistance,
  removingWorldPlazaEntityHealthConfusionEffect,
  removingWorldPlazaEntityHealthIncomingDamageHealModifier,
  removingWorldPlazaEntityHealthIncomingDamageModifier,
  removingWorldPlazaEntityHealthIncomingHealAmplifier,
  removingWorldPlazaEntityHealthMovementModifier,
  removingWorldPlazaEntityHealthOutgoingHealAmplifier,
  removingWorldPlazaEntityHealthPhysicalDamageLifestealModifier,
  removingWorldPlazaEntityHealthSleepEffect,
  togglingWorldPlazaEntityColdImmunity,
  togglingWorldPlazaEntityHealthInvincible,
  togglingWorldPlazaEntityHeatImmunity,
} from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';

export type ApplyingWorldPlazaEntityBuffContext = {
  attackerDamageRollModifiers?: readonly DefiningWorldPlazaEntityHealthDamageRollModifier[];
};

/**
 * Whether a timed incoming-damage buff is currently active on the entity.
 */
export function checkingWorldPlazaEntityIncomingDamageBuffIsActive(
  state: DefiningWorldPlazaEntityHealthState,
  buffId: string,
  nowMs: number
): boolean {
  const modifier = state.incomingDamageModifiers.find(
    (entry) => entry.id === buffId
  );

  if (!modifier) {
    return false;
  }

  return modifier.expiresAtMs === null || modifier.expiresAtMs > nowMs;
}

/**
 * Whether a sleep buff is currently active on the entity.
 */
export function checkingWorldPlazaEntitySleepBuffIsActive(
  state: DefiningWorldPlazaEntityHealthState,
  buffId: string,
  nowMs: number
): boolean {
  if (!checkingWorldPlazaEntityPlayerSleepIsActive(state, nowMs)) {
    return false;
  }

  return state.sleepEffects.some(
    (effect) => effect.id === buffId && effect.expiresAtMs > nowMs
  );
}

/**
 * Whether a confusion buff is currently active on the entity.
 */
export function checkingWorldPlazaEntityConfusionBuffIsActive(
  state: DefiningWorldPlazaEntityHealthState,
  buffId: string,
  nowMs: number
): boolean {
  const effect = state.confusionEffects.find((entry) => entry.id === buffId);

  if (!effect) {
    return false;
  }

  return effect.expiresAtMs === null || effect.expiresAtMs > nowMs;
}

/**
 * Whether a movement buff is currently active on the entity.
 */
export function checkingWorldPlazaEntityMovementBuffIsActive(
  state: DefiningWorldPlazaEntityHealthState,
  buffId: string,
  nowMs: number
): boolean {
  const modifier = state.movementModifiers.find((entry) => entry.id === buffId);

  if (!modifier) {
    return false;
  }

  return modifier.expiresAtMs === null || modifier.expiresAtMs > nowMs;
}

/**
 * Whether a physical damage lifesteal buff is currently active on the entity.
 */
export function checkingWorldPlazaEntityPhysicalDamageLifestealBuffIsActive(
  state: DefiningWorldPlazaEntityHealthState,
  buffId: string,
  nowMs: number
): boolean {
  const modifier = state.physicalDamageLifestealModifiers.find(
    (entry) => entry.id === buffId
  );

  if (!modifier) {
    return false;
  }

  return modifier.expiresAtMs === null || modifier.expiresAtMs > nowMs;
}

/**
 * Whether an incoming damage heal buff is currently active on the entity.
 */
export function checkingWorldPlazaEntityIncomingDamageHealBuffIsActive(
  state: DefiningWorldPlazaEntityHealthState,
  buffId: string,
  nowMs: number
): boolean {
  const modifier = state.incomingDamageHealModifiers.find(
    (entry) => entry.id === buffId
  );

  if (!modifier) {
    return false;
  }

  return modifier.expiresAtMs === null || modifier.expiresAtMs > nowMs;
}

/**
 * Whether an incoming heal amplifier buff is currently active on the entity.
 */
export function checkingWorldPlazaEntityIncomingHealAmplifierBuffIsActive(
  state: DefiningWorldPlazaEntityHealthState,
  buffId: string,
  nowMs: number
): boolean {
  const modifier = state.incomingHealAmplifiers.find(
    (entry) => entry.id === buffId
  );

  if (!modifier) {
    return false;
  }

  return modifier.expiresAtMs === null || modifier.expiresAtMs > nowMs;
}

/**
 * Whether an outgoing heal amplifier buff is currently active on the entity.
 */
export function checkingWorldPlazaEntityOutgoingHealAmplifierBuffIsActive(
  state: DefiningWorldPlazaEntityHealthState,
  buffId: string,
  nowMs: number
): boolean {
  const modifier = state.outgoingHealAmplifiers.find(
    (entry) => entry.id === buffId
  );

  if (!modifier) {
    return false;
  }

  return modifier.expiresAtMs === null || modifier.expiresAtMs > nowMs;
}

/**
 * Applies or toggles a registered buff/debuff on entity health state.
 */
export function applyingWorldPlazaEntityBuff(
  state: DefiningWorldPlazaEntityHealthState,
  buffId: string,
  nowMs: number,
  context: ApplyingWorldPlazaEntityBuffContext = {}
): DefiningWorldPlazaEntityHealthState {
  const descriptor = resolvingWorldPlazaEntityBuffDescriptor(buffId);

  if (!descriptor) {
    return state;
  }

  return applyingWorldPlazaEntityBuffDescriptor(
    state,
    descriptor,
    nowMs,
    context
  );
}

function applyingWorldPlazaEntityBuffDescriptor(
  state: DefiningWorldPlazaEntityHealthState,
  descriptor: DefiningWorldPlazaEntityBuffDescriptor,
  nowMs: number,
  context: ApplyingWorldPlazaEntityBuffContext
): DefiningWorldPlazaEntityHealthState {
  const { effect } = descriptor;

  if (effect.kind === 'incoming_damage_multiplier') {
    const isActive = checkingWorldPlazaEntityIncomingDamageBuffIsActive(
      state,
      descriptor.id,
      nowMs
    );

    if (isActive) {
      return removingWorldPlazaEntityHealthIncomingDamageModifier(
        state,
        descriptor.id
      );
    }

    return addingWorldPlazaEntityHealthIncomingDamageModifier(state, {
      id: descriptor.id,
      multiplier: effect.multiplier,
      expiresAtMs:
        descriptor.durationKind === 'timed' && descriptor.durationMs !== null
          ? nowMs + descriptor.durationMs
          : null,
    });
  }

  if (effect.kind === 'physical_damage_lifesteal') {
    const isActive =
      checkingWorldPlazaEntityPhysicalDamageLifestealBuffIsActive(
        state,
        descriptor.id,
        nowMs
      );

    if (isActive) {
      return removingWorldPlazaEntityHealthPhysicalDamageLifestealModifier(
        state,
        descriptor.id
      );
    }

    return addingWorldPlazaEntityHealthPhysicalDamageLifestealModifier(state, {
      id: descriptor.id,
      ratio: effect.ratio,
      expiresAtMs:
        descriptor.durationKind === 'timed' && descriptor.durationMs !== null
          ? nowMs + descriptor.durationMs
          : null,
    });
  }

  if (effect.kind === 'incoming_physical_damage_heal') {
    const isActive = checkingWorldPlazaEntityIncomingDamageHealBuffIsActive(
      state,
      descriptor.id,
      nowMs
    );

    if (isActive) {
      return removingWorldPlazaEntityHealthIncomingDamageHealModifier(
        state,
        descriptor.id
      );
    }

    return addingWorldPlazaEntityHealthIncomingDamageHealModifier(state, {
      id: descriptor.id,
      ratio: effect.ratio,
      expiresAtMs:
        descriptor.durationKind === 'timed' && descriptor.durationMs !== null
          ? nowMs + descriptor.durationMs
          : null,
    });
  }

  if (effect.kind === 'incoming_heal_amplifier') {
    const isActive = checkingWorldPlazaEntityIncomingHealAmplifierBuffIsActive(
      state,
      descriptor.id,
      nowMs
    );

    if (isActive) {
      return removingWorldPlazaEntityHealthIncomingHealAmplifier(
        state,
        descriptor.id
      );
    }

    return addingWorldPlazaEntityHealthIncomingHealAmplifier(state, {
      id: descriptor.id,
      ratio: effect.ratio,
      expiresAtMs:
        descriptor.durationKind === 'timed' && descriptor.durationMs !== null
          ? nowMs + descriptor.durationMs
          : null,
    });
  }

  if (effect.kind === 'outgoing_heal_amplifier') {
    const isActive = checkingWorldPlazaEntityOutgoingHealAmplifierBuffIsActive(
      state,
      descriptor.id,
      nowMs
    );

    if (isActive) {
      return removingWorldPlazaEntityHealthOutgoingHealAmplifier(
        state,
        descriptor.id
      );
    }

    return addingWorldPlazaEntityHealthOutgoingHealAmplifier(state, {
      id: descriptor.id,
      ratio: effect.ratio,
      expiresAtMs:
        descriptor.durationKind === 'timed' && descriptor.durationMs !== null
          ? nowMs + descriptor.durationMs
          : null,
    });
  }

  if (effect.kind === 'temporary_max_health') {
    const rollResult = computingWorldPlazaEntityHealthRolledExpectedAmount({
      state,
      baseExpectedAmount: effect.baseExpectedAmount,
      attackerModifiers: context.attackerDamageRollModifiers ?? [],
      nowMs,
    });

    return addingWorldPlazaEntityHealthTemporaryMax(
      state,
      rollResult.rolledDamage,
      descriptor.durationMs ?? 0,
      nowMs,
      descriptor.id
    );
  }

  if (effect.kind === 'max_health_scale') {
    if (effect.multiplier >= 2) {
      return doublingWorldPlazaEntityHealthMax(state, nowMs);
    }

    return halvingWorldPlazaEntityHealthMax(state, nowMs);
  }

  if (effect.kind === 'heat_resistance') {
    return increasingWorldPlazaEntityHeatResistance(state, effect.amount);
  }

  if (effect.kind === 'cold_resistance') {
    return increasingWorldPlazaEntityColdResistance(state, effect.amount);
  }

  if (effect.kind === 'toggle_heat_immunity') {
    return togglingWorldPlazaEntityHeatImmunity(state);
  }

  if (effect.kind === 'toggle_cold_immunity') {
    return togglingWorldPlazaEntityColdImmunity(state);
  }

  if (effect.kind === 'invincibility_toggle') {
    return togglingWorldPlazaEntityHealthInvincible(state, nowMs);
  }

  if (effect.kind === 'movement_modifier') {
    const isActive = checkingWorldPlazaEntityMovementBuffIsActive(
      state,
      descriptor.id,
      nowMs
    );

    if (isActive) {
      return removingWorldPlazaEntityHealthMovementModifier(
        state,
        descriptor.id
      );
    }

    const expiresAtMs =
      descriptor.durationKind === 'timed' && descriptor.durationMs !== null
        ? nowMs + descriptor.durationMs
        : null;

    const modifiersToApply = [
      {
        id: descriptor.id,
        kind: effect.modifierKind,
        multiplier: effect.multiplier,
        expiresAtMs,
      },
      ...(effect.companionModifiers ?? []).map((companionModifier) => ({
        id: descriptor.id,
        kind: companionModifier.modifierKind,
        multiplier: companionModifier.multiplier,
        expiresAtMs,
      })),
    ];

    return modifiersToApply.reduce(
      (nextState, modifier) =>
        addingWorldPlazaEntityHealthMovementModifier(nextState, modifier),
      state
    );
  }

  if (effect.kind === 'movement_confusion') {
    const isActive = checkingWorldPlazaEntityConfusionBuffIsActive(
      state,
      descriptor.id,
      nowMs
    );

    if (isActive) {
      return removingWorldPlazaEntityHealthConfusionEffect(state, descriptor.id);
    }

    const expiresAtMs =
      descriptor.durationKind === 'timed' && descriptor.durationMs !== null
        ? nowMs + descriptor.durationMs
        : null;

    const targetIntensity = Math.max(
      DEFINING_WORLD_PLAZA_CONFUSION_INTENSITY_MIN,
      Math.min(DEFINING_WORLD_PLAZA_CONFUSION_INTENSITY_MAX, effect.intensity)
    );

    return addingWorldPlazaEntityHealthConfusionEffect(state, {
      id: descriptor.id,
      targetIntensity,
      appliedAtMs: nowMs,
      expiresAtMs,
      phaseSeed: Math.random() * Math.PI * 2,
    });
  }

  if (effect.kind === 'incapacitate_sleep') {
    const isActive = checkingWorldPlazaEntitySleepBuffIsActive(
      state,
      descriptor.id,
      nowMs
    );

    if (isActive) {
      return removingWorldPlazaEntityHealthSleepEffect(state, descriptor.id);
    }

    if (descriptor.durationMs === null) {
      return state;
    }

    return addingWorldPlazaEntityHealthSleepEffect(state, {
      id: descriptor.id,
      appliedAtMs: nowMs,
      expiresAtMs: nowMs + descriptor.durationMs,
      wakeBonusDamage: effect.wakeBonusDamage,
    });
  }

  return state;
}

/**
 * Builds damage-roll modifier ids for one buff preset.
 */
export function listingWorldPlazaEntityBuffDamageRollModifierIds(
  buffId: string
): string[] {
  const descriptor = resolvingWorldPlazaEntityBuffDescriptor(buffId);

  if (!descriptor || descriptor.effect.kind !== 'damage_roll_modifiers') {
    return [];
  }

  return descriptor.effect.modifiers.map((_, modifierIndex) =>
    creatingWorldPlazaEntityHealthDamageRollPresetModifierId(
      buffId,
      modifierIndex
    )
  );
}
