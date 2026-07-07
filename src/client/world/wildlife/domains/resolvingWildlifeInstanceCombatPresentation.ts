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
import { resolvingWildlifeSizeScaleMultiplierFromSample } from '@/components/world/wildlife/domains/resolvingWildlifeSizeScaleMultiplierFromSample';

type DefiningWildlifeInstancePresentationProfile = Pick<
  DefiningWildlifeInstance,
  'speciesId' | 'aggressionLevel' | 'sizeScaleSample'
>;

/** Resolves the bell-curve size multiplier for one wildlife instance. */
export function resolvingWildlifeInstanceSizeMultiplier(
  species: DefiningWildlifeSpeciesDefinition,
  instance: Pick<DefiningWildlifeInstance, 'sizeScaleSample'>
): number {
  return resolvingWildlifeSizeScaleMultiplierFromSample(
    instance.sizeScaleSample,
    species
  );
}

/** Resolves render scale for one wildlife instance. */
export function resolvingWildlifeInstanceSizeScale(
  species: DefiningWildlifeSpeciesDefinition,
  instance: DefiningWildlifeInstance
): number {
  let scale =
    species.sizeScale *
    resolvingWildlifeInstanceSizeMultiplier(species, instance);

  if (checkingWildlifeIsAggressiveChicken(instance)) {
    scale *= DEFINING_WILDLIFE_AGGRESSIVE_CHICKEN_SIZE_SCALE_MULTIPLIER;
  }

  return scale;
}

/** Resolves collision radius for one wildlife instance. */
export function resolvingWildlifeInstanceCollisionRadiusGrid(
  species: DefiningWildlifeSpeciesDefinition,
  instance: Pick<DefiningWildlifeInstance, 'sizeScaleSample'>
): number {
  return (
    species.collisionRadiusGrid *
    resolvingWildlifeInstanceSizeMultiplier(species, instance)
  );
}

/** Resolves max health for one wildlife instance at spawn. */
export function resolvingWildlifeInstanceBaseMaxHealth(
  species: DefiningWildlifeSpeciesDefinition,
  instance: DefiningWildlifeInstancePresentationProfile
): number {
  let baseMaxHealth =
    species.vitals.baseMaxHealth *
    resolvingWildlifeInstanceSizeMultiplier(species, instance);

  if (checkingWildlifeIsAggressiveChicken(instance)) {
    baseMaxHealth *= DEFINING_WILDLIFE_AGGRESSIVE_CHICKEN_HEALTH_MULTIPLIER;
  }

  return Math.round(baseMaxHealth);
}

/** Applies instance-specific melee damage multipliers. */
export function resolvingWildlifeInstanceAttackPowerMultiplier(
  species: DefiningWildlifeSpeciesDefinition,
  instance: DefiningWildlifeInstance
): number {
  let multiplier = resolvingWildlifeInstanceSizeMultiplier(species, instance);

  if (checkingWildlifeIsAggressiveChicken(instance)) {
    multiplier *= DEFINING_WILDLIFE_AGGRESSIVE_CHICKEN_ATTACK_POWER_MULTIPLIER;
  }

  return multiplier;
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
