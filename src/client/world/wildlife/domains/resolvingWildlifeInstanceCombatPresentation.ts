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
import {
  computingWildlifeSizeCombatStatMultiplierFromVisualMultiplier,
  computingWildlifeSizeSpeedStatMultiplierFromVisualMultiplier,
  resolvingWildlifeSizeScaleMultiplierFromSample,
} from '@/components/world/wildlife/domains/resolvingWildlifeSizeScaleMultiplierFromSample';

type DefiningWildlifeInstancePresentationProfile = Pick<
  DefiningWildlifeInstance,
  'speciesId' | 'aggressionLevel' | 'sizeScaleSample'
>;

/** Resolves the bell-curve visual size multiplier for one wildlife instance. */
export function resolvingWildlifeInstanceSizeMultiplier(
  species: DefiningWildlifeSpeciesDefinition,
  instance: Pick<DefiningWildlifeInstance, 'sizeScaleSample'>
): number {
  return resolvingWildlifeSizeScaleMultiplierFromSample(
    instance.sizeScaleSample,
    species
  );
}

/** Resolves HP / damage / stamina scaling from visual size. */
export function resolvingWildlifeInstanceCombatStatMultiplier(
  species: DefiningWildlifeSpeciesDefinition,
  instance: Pick<DefiningWildlifeInstance, 'sizeScaleSample'>
): number {
  return computingWildlifeSizeCombatStatMultiplierFromVisualMultiplier(
    resolvingWildlifeInstanceSizeMultiplier(species, instance)
  );
}

/** Resolves walk/run speed scaling from visual size (milder than combat stats). */
export function resolvingWildlifeInstanceSpeedStatMultiplier(
  species: DefiningWildlifeSpeciesDefinition,
  instance: Pick<DefiningWildlifeInstance, 'sizeScaleSample'>
): number {
  return computingWildlifeSizeSpeedStatMultiplierFromVisualMultiplier(
    resolvingWildlifeInstanceSizeMultiplier(species, instance)
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
    resolvingWildlifeInstanceCombatStatMultiplier(species, instance);

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
  let multiplier = resolvingWildlifeInstanceCombatStatMultiplier(
    species,
    instance
  );

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
  const speedMultiplier = resolvingWildlifeInstanceSpeedStatMultiplier(
    species,
    instance
  );
  let walkSpeed = species.vitals.walkSpeedGridPerSecond * speedMultiplier;

  if (checkingWildlifeIsAggressiveChicken(instance)) {
    walkSpeed *= DEFINING_WILDLIFE_AGGRESSIVE_CHICKEN_SPEED_MULTIPLIER;
  }

  return walkSpeed;
}

/** Resolves run speed for one wildlife instance. */
export function resolvingWildlifeInstanceRunSpeedGridPerSecond(
  species: DefiningWildlifeSpeciesDefinition,
  instance: DefiningWildlifeInstance
): number {
  const speedMultiplier = resolvingWildlifeInstanceSpeedStatMultiplier(
    species,
    instance
  );
  let runSpeed = species.vitals.runSpeedGridPerSecond * speedMultiplier;

  if (checkingWildlifeIsAggressiveChicken(instance)) {
    runSpeed *= DEFINING_WILDLIFE_AGGRESSIVE_CHICKEN_SPEED_MULTIPLIER;
  }

  return runSpeed;
}

/** Resolves stamina tuning for one wildlife instance. */
export function resolvingWildlifeInstanceStaminaConfig(
  species: DefiningWildlifeSpeciesDefinition,
  instance: DefiningWildlifeInstance
): DefiningWildlifeSpeciesStaminaConfig {
  const combatMultiplier = resolvingWildlifeInstanceCombatStatMultiplier(
    species,
    instance
  );
  let drainMultiplier = species.stamina.drainMultiplier / combatMultiplier;
  let regenMultiplier = species.stamina.regenMultiplier * combatMultiplier;

  if (checkingWildlifeIsAggressiveChicken(instance)) {
    drainMultiplier /= DEFINING_WILDLIFE_AGGRESSIVE_CHICKEN_STAMINA_MULTIPLIER;
    regenMultiplier *= DEFINING_WILDLIFE_AGGRESSIVE_CHICKEN_STAMINA_MULTIPLIER;
  }

  return {
    drainMultiplier,
    regenMultiplier,
    ...(species.stamina.exhaustedRecoveryRatio !== undefined
      ? { exhaustedRecoveryRatio: species.stamina.exhaustedRecoveryRatio }
      : {}),
  };
}
