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
  addingWorldPlazaEntityHealthIncomingDamageModifier,
  addingWorldPlazaEntityHealthTemporaryMax,
  doublingWorldPlazaEntityHealthMax,
  halvingWorldPlazaEntityHealthMax,
  increasingWorldPlazaEntityColdResistance,
  increasingWorldPlazaEntityHeatResistance,
  removingWorldPlazaEntityHealthIncomingDamageModifier,
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
