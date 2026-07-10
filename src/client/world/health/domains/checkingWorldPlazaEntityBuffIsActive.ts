import {
  checkingWorldPlazaEntityConfusionBuffIsActive,
  checkingWorldPlazaEntityIncomingDamageBuffIsActive,
  checkingWorldPlazaEntityIncomingDamageHealBuffIsActive,
  checkingWorldPlazaEntityIncomingHealAmplifierBuffIsActive,
  checkingWorldPlazaEntityMovementBuffIsActive,
  checkingWorldPlazaEntityOutgoingHealAmplifierBuffIsActive,
  checkingWorldPlazaEntityPhysicalDamageLifestealBuffIsActive,
  checkingWorldPlazaEntitySleepBuffIsActive,
  checkingWorldPlazaEntityStunBuffIsActive,
} from '@/components/world/health/domains/applyingWorldPlazaEntityBuff';
import type { DefiningWorldPlazaEntityBuffCategoryId } from '@/components/world/health/domains/definingWorldPlazaEntityBuffCategoryRegistry';
import {
  listingWorldPlazaEntityBuffsByCategory,
  resolvingWorldPlazaEntityBuffDescriptor,
  type DefiningWorldPlazaEntityBuffDescriptor,
} from '@/components/world/health/domains/definingWorldPlazaEntityBuffRegistry';
import { checkingWorldPlazaEntityHealthDamageRollPresetIsActive } from '@/components/world/health/domains/definingWorldPlazaEntityHealthDamageRollPresets';
import type { DefiningWorldPlazaEntityHealthState } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';

/**
 * Whether a registered buff is currently active on the entity or attacker sim.
 */
export function checkingWorldPlazaEntityBuffIsActive({
  buffId,
  state,
  nowMs,
  defenderModifierIds,
  attackerModifierIds,
}: {
  buffId: string;
  state: DefiningWorldPlazaEntityHealthState;
  nowMs: number;
  defenderModifierIds: readonly string[];
  attackerModifierIds: readonly string[];
}): boolean {
  const descriptor = resolvingWorldPlazaEntityBuffDescriptor(buffId);

  if (!descriptor) {
    return false;
  }

  return checkingWorldPlazaEntityBuffDescriptorIsActive({
    descriptor,
    state,
    nowMs,
    defenderModifierIds,
    attackerModifierIds,
  });
}

function checkingWorldPlazaEntityBuffDescriptorIsActive({
  descriptor,
  state,
  nowMs,
  defenderModifierIds,
  attackerModifierIds,
}: {
  descriptor: DefiningWorldPlazaEntityBuffDescriptor;
  state: DefiningWorldPlazaEntityHealthState;
  nowMs: number;
  defenderModifierIds: readonly string[];
  attackerModifierIds: readonly string[];
}): boolean {
  const { effect } = descriptor;

  if (effect.kind === 'damage_roll_modifiers') {
    const modifierIds =
      effect.side === 'attacker' ? attackerModifierIds : defenderModifierIds;

    return checkingWorldPlazaEntityHealthDamageRollPresetIsActive(
      descriptor.id,
      modifierIds
    );
  }

  if (effect.kind === 'incoming_damage_multiplier') {
    return checkingWorldPlazaEntityIncomingDamageBuffIsActive(
      state,
      descriptor.id,
      nowMs
    );
  }

  if (effect.kind === 'physical_damage_lifesteal') {
    return checkingWorldPlazaEntityPhysicalDamageLifestealBuffIsActive(
      state,
      descriptor.id,
      nowMs
    );
  }

  if (effect.kind === 'incoming_physical_damage_heal') {
    return checkingWorldPlazaEntityIncomingDamageHealBuffIsActive(
      state,
      descriptor.id,
      nowMs
    );
  }

  if (effect.kind === 'incoming_heal_amplifier') {
    return checkingWorldPlazaEntityIncomingHealAmplifierBuffIsActive(
      state,
      descriptor.id,
      nowMs
    );
  }

  if (effect.kind === 'outgoing_heal_amplifier') {
    return checkingWorldPlazaEntityOutgoingHealAmplifierBuffIsActive(
      state,
      descriptor.id,
      nowMs
    );
  }

  if (effect.kind === 'invincibility_toggle') {
    return state.invincibleUntilMs !== null && nowMs < state.invincibleUntilMs;
  }

  if (effect.kind === 'heat_tolerance') {
    return (
      state.temperatureResistance.heatComfortBonusCelsius >=
      effect.amountCelsius
    );
  }

  if (effect.kind === 'cold_tolerance') {
    return (
      state.temperatureResistance.coldComfortBonusCelsius >=
      effect.amountCelsius
    );
  }

  if (effect.kind === 'toggle_heat_immunity') {
    return state.temperatureResistance.isHeatImmune;
  }

  if (effect.kind === 'toggle_cold_immunity') {
    return state.temperatureResistance.isColdImmune;
  }

  if (effect.kind === 'temporary_max_health') {
    return state.temporaryMaxHealthBonuses.some(
      (bonus) => bonus.id === descriptor.id && bonus.expiresAtMs > nowMs
    );
  }

  if (effect.kind === 'movement_modifier') {
    return checkingWorldPlazaEntityMovementBuffIsActive(
      state,
      descriptor.id,
      nowMs
    );
  }

  if (effect.kind === 'movement_confusion') {
    return checkingWorldPlazaEntityConfusionBuffIsActive(
      state,
      descriptor.id,
      nowMs
    );
  }

  if (effect.kind === 'incapacitate_sleep') {
    return checkingWorldPlazaEntitySleepBuffIsActive(
      state,
      descriptor.id,
      nowMs
    );
  }

  if (effect.kind === 'incapacitate_stun') {
    return checkingWorldPlazaEntityStunBuffIsActive(
      state,
      descriptor.id,
      nowMs
    );
  }

  if (effect.kind === 'heal_block') {
    return state.healBlockModifiers.some(
      (modifier) =>
        modifier.id === descriptor.id &&
        (modifier.expiresAtMs === null || modifier.expiresAtMs > nowMs)
    );
  }

  return false;
}

/**
 * Lists toggleable buffs for one dev panel category tab.
 */
export function listingWorldPlazaEntityToggleBuffsForCategory(
  category: DefiningWorldPlazaEntityBuffCategoryId
): DefiningWorldPlazaEntityBuffDescriptor[] {
  return listingWorldPlazaEntityBuffsByCategory(category).filter(
    (descriptor) =>
      descriptor.durationKind !== 'instant' && descriptor.hideFromHud !== true
  );
}

/**
 * Lists one-shot buffs for one dev panel category tab.
 */
export function listingWorldPlazaEntityInstantBuffsForCategory(
  category: DefiningWorldPlazaEntityBuffCategoryId
): DefiningWorldPlazaEntityBuffDescriptor[] {
  return listingWorldPlazaEntityBuffsByCategory(category).filter(
    (descriptor) => descriptor.durationKind === 'instant'
  );
}
