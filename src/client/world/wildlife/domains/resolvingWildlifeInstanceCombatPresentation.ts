/**
 * Per-instance combat and presentation stat resolvers.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeInstanceCombatPresentation
 */

import { checkingWildlifeIsAggressiveChicken } from '@/components/world/wildlife/domains/checkingWildlifeIsAggressiveChicken';
import {
  DEFINING_WILDLIFE_AGGRESSIVE_CHICKEN_ATTACK_POWER_MULTIPLIER,
  DEFINING_WILDLIFE_AGGRESSIVE_CHICKEN_HEALTH_MULTIPLIER,
  DEFINING_WILDLIFE_AGGRESSIVE_CHICKEN_SIZE_SCALE_MULTIPLIER,
  DEFINING_WILDLIFE_AGGRESSIVE_CHICKEN_SPEED_MULTIPLIER,
  DEFINING_WILDLIFE_AGGRESSIVE_CHICKEN_STAMINA_MULTIPLIER,
} from '@/components/world/wildlife/domains/definingWildlifeAggressiveChickenConstants';
import type {
  DefiningWildlifeSpeciesDefinition,
  DefiningWildlifeSpeciesStaminaConfig,
} from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';

/** Resolves render scale for one wildlife instance. */
export function resolvingWildlifeInstanceSizeScale(
  species: DefiningWildlifeSpeciesDefinition,
  instance: DefiningWildlifeInstance
): number {
  if (!checkingWildlifeIsAggressiveChicken(instance)) {
    return species.sizeScale;
  }

  return (
    species.sizeScale *
    DEFINING_WILDLIFE_AGGRESSIVE_CHICKEN_SIZE_SCALE_MULTIPLIER
  );
}

/** Resolves max health for one wildlife instance at spawn. */
export function resolvingWildlifeInstanceBaseMaxHealth(
  species: DefiningWildlifeSpeciesDefinition,
  instance: Pick<DefiningWildlifeInstance, 'speciesId' | 'aggressionLevel'>
): number {
  const baseMaxHealth = species.vitals.baseMaxHealth;

  if (!checkingWildlifeIsAggressiveChicken(instance)) {
    return baseMaxHealth;
  }

  return Math.round(
    baseMaxHealth * DEFINING_WILDLIFE_AGGRESSIVE_CHICKEN_HEALTH_MULTIPLIER
  );
}

/** Applies instance-specific melee damage multipliers. */
export function resolvingWildlifeInstanceAttackPowerMultiplier(
  instance: DefiningWildlifeInstance
): number {
  if (!checkingWildlifeIsAggressiveChicken(instance)) {
    return 1;
  }

  return DEFINING_WILDLIFE_AGGRESSIVE_CHICKEN_ATTACK_POWER_MULTIPLIER;
}

/** Resolves walk speed for one wildlife instance. */
export function resolvingWildlifeInstanceWalkSpeedGridPerSecond(
  species: DefiningWildlifeSpeciesDefinition,
  instance: DefiningWildlifeInstance
): number {
  if (!checkingWildlifeIsAggressiveChicken(instance)) {
    return species.vitals.walkSpeedGridPerSecond;
  }

  return (
    species.vitals.walkSpeedGridPerSecond *
    DEFINING_WILDLIFE_AGGRESSIVE_CHICKEN_SPEED_MULTIPLIER
  );
}

/** Resolves run speed for one wildlife instance. */
export function resolvingWildlifeInstanceRunSpeedGridPerSecond(
  species: DefiningWildlifeSpeciesDefinition,
  instance: DefiningWildlifeInstance
): number {
  if (!checkingWildlifeIsAggressiveChicken(instance)) {
    return species.vitals.runSpeedGridPerSecond;
  }

  return (
    species.vitals.runSpeedGridPerSecond *
    DEFINING_WILDLIFE_AGGRESSIVE_CHICKEN_SPEED_MULTIPLIER
  );
}

/** Resolves stamina tuning for one wildlife instance. */
export function resolvingWildlifeInstanceStaminaConfig(
  species: DefiningWildlifeSpeciesDefinition,
  instance: DefiningWildlifeInstance
): DefiningWildlifeSpeciesStaminaConfig {
  if (!checkingWildlifeIsAggressiveChicken(instance)) {
    return species.stamina;
  }

  return {
    drainMultiplier:
      species.stamina.drainMultiplier /
      DEFINING_WILDLIFE_AGGRESSIVE_CHICKEN_STAMINA_MULTIPLIER,
    regenMultiplier:
      species.stamina.regenMultiplier *
      DEFINING_WILDLIFE_AGGRESSIVE_CHICKEN_STAMINA_MULTIPLIER,
  };
}
