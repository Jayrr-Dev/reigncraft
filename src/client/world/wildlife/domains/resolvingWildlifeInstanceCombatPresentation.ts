/**
 * Per-instance combat and presentation stat resolvers.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeInstanceCombatPresentation
 */

import { resolvingWorldPlazaScaledAttackIntervalMs } from '@/components/world/domains/resolvingWorldPlazaGlobalAttackSpeedScale';
import { resolvingWorldPlazaEntityHealthMovementMultipliers } from '@/components/world/health/domains/resolvingWorldPlazaEntityHealthMovementMultipliers';
import { resolvingWildlifeSpritcoreFeastAttackPowerMultiplier } from '@/components/world/wildlife/domains/applyingWildlifeSpritcoreFeast';
import { checkingWildlifeIsAggressiveChicken } from '@/components/world/wildlife/domains/checkingWildlifeIsAggressiveChicken';
import {
  DEFINING_WILDLIFE_AGGRESSIVE_CHICKEN_ATTACK_POWER_MULTIPLIER,
  DEFINING_WILDLIFE_AGGRESSIVE_CHICKEN_HEALTH_MULTIPLIER,
  DEFINING_WILDLIFE_AGGRESSIVE_CHICKEN_SIZE_SCALE_MULTIPLIER,
  DEFINING_WILDLIFE_AGGRESSIVE_CHICKEN_SPEED_MULTIPLIER,
  DEFINING_WILDLIFE_AGGRESSIVE_CHICKEN_STAMINA_MULTIPLIER,
} from '@/components/world/wildlife/domains/definingWildlifeAggressiveChickenConstants';
import {
  checkingWildlifeSizeTierHasLargeSizeFrame,
  DEFINING_WILDLIFE_APEX_MAX_STAMINA_RATIO,
  DEFINING_WILDLIFE_APEX_STAMINA_REGEN_MULTIPLIER,
  DEFINING_WILDLIFE_OBESE_SPEED_MULTIPLIER,
  DEFINING_WILDLIFE_OBESE_STAMINA_REGEN_MULTIPLIER,
  mappingWildlifeLargeSizeFrameObeseHealthMultiplier,
} from '@/components/world/wildlife/domains/definingWildlifeLargeSizeFrameConstants';
import {
  checkingWildlifeSpeciesHasObeseTurtleBoost,
  DEFINING_WILDLIFE_TURTLE_OBESE_SIZE_AND_HEALTH_BOOST_MULTIPLIER,
} from '@/components/world/wildlife/domains/definingWildlifeSpeciesPassiveTraitConstants';
import type {
  DefiningWildlifeSpeciesDefinition,
  DefiningWildlifeSpeciesStaminaConfig,
} from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { resolvingWildlifeInstanceSizeTierFromSample } from '@/components/world/wildlife/domains/resolvingWildlifeInstanceSizeTierFromSample';

import {
  computingWildlifeSizeCombatStatMultiplierFromVisualMultiplier,
  computingWildlifeSizeSpeedStatMultiplierFromVisualMultiplier,
  resolvingWildlifeSizeScaleMultiplierFromSample,
} from '@/components/world/wildlife/domains/resolvingWildlifeSizeScaleMultiplierFromSample';

type DefiningWildlifeInstancePresentationProfile = Pick<
  DefiningWildlifeInstance,
  'speciesId' | 'aggressionLevel' | 'sizeScaleSample' | 'largeSizeFrame'
> &
  Partial<Pick<DefiningWildlifeInstance, 'petBond'>>;

function resolvingWildlifeInstanceSpritcoreUpgradeBonusMaxHealth(
  instance: Partial<Pick<DefiningWildlifeInstance, 'petBond'>>
): number {
  const bonus = instance.petBond?.spritcoreUpgrades?.bonusMaxHealth;

  return typeof bonus === 'number' && Number.isFinite(bonus) && bonus > 0
    ? bonus
    : 0;
}

function resolvingWildlifeInstanceSpritcoreUpgradeBonusAttackPower(
  instance: Partial<Pick<DefiningWildlifeInstance, 'petBond'>>
): number {
  const bonus = instance.petBond?.spritcoreUpgrades?.bonusAttackPower;

  return typeof bonus === 'number' && Number.isFinite(bonus) && bonus > 0
    ? bonus
    : 0;
}

function resolvingWildlifeInstanceSpritcoreUpgradeBonusAttackSpeed(
  instance: Partial<Pick<DefiningWildlifeInstance, 'petBond'>>
): number {
  const bonus = instance.petBond?.spritcoreUpgrades?.bonusAttackSpeed;

  return typeof bonus === 'number' && Number.isFinite(bonus) && bonus > 0
    ? bonus
    : 0;
}

function resolvingWildlifeInstanceSpritcoreUpgradeBonusDefense(
  instance: Partial<Pick<DefiningWildlifeInstance, 'petBond'>>
): number {
  const bonus = instance.petBond?.spritcoreUpgrades?.bonusDefense;

  return typeof bonus === 'number' && Number.isFinite(bonus) && bonus > 0
    ? bonus
    : 0;
}

function resolvingWildlifeInstanceSpritcoreUpgradeBonusMoveSpeed(
  instance: Partial<Pick<DefiningWildlifeInstance, 'petBond'>>
): number {
  const bonus = instance.petBond?.spritcoreUpgrades?.bonusMoveSpeed;

  return typeof bonus === 'number' && Number.isFinite(bonus) && bonus > 0
    ? bonus
    : 0;
}

function checkingWildlifeInstanceIsObeseTurtle(
  species: DefiningWildlifeSpeciesDefinition,
  instance: Pick<DefiningWildlifeInstance, 'largeSizeFrame'>
): boolean {
  return (
    instance.largeSizeFrame === 'obese' &&
    checkingWildlifeSpeciesHasObeseTurtleBoost(species.speciesId)
  );
}

/** Extra render/collision scale for obese turtles (does not feed combat size math). */
function resolvingWildlifeInstanceObeseTurtlePresentationMultiplier(
  species: DefiningWildlifeSpeciesDefinition,
  instance: Pick<DefiningWildlifeInstance, 'largeSizeFrame'>
): number {
  return checkingWildlifeInstanceIsObeseTurtle(species, instance)
    ? DEFINING_WILDLIFE_TURTLE_OBESE_SIZE_AND_HEALTH_BOOST_MULTIPLIER
    : 1;
}

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
  instance: Pick<DefiningWildlifeInstance, 'sizeScaleSample' | 'largeSizeFrame'>
): number {
  let multiplier =
    computingWildlifeSizeCombatStatMultiplierFromVisualMultiplier(
      resolvingWildlifeInstanceSizeMultiplier(species, instance)
    );

  if (instance.largeSizeFrame === 'obese') {
    const sizeTier = resolvingWildlifeInstanceSizeTierFromSample(
      instance.sizeScaleSample,
      species
    );

    if (checkingWildlifeSizeTierHasLargeSizeFrame(sizeTier)) {
      multiplier *=
        mappingWildlifeLargeSizeFrameObeseHealthMultiplier(sizeTier);
    }
  }

  return multiplier;
}

/**
 * Resolves walk/run speed scaling from the individual size roll only.
 *
 * The species-level bell-curve shift (e.g. Omega Wolf +3σ) is intentionally
 * excluded: it scales visuals and combat stats, but movement must keep the
 * authored `vitals` speeds or elites outrun their own run animation and jump
 * tuning (foot-slide, pounce slower than ground speed).
 */
export function resolvingWildlifeInstanceSpeedStatMultiplier(
  species: DefiningWildlifeSpeciesDefinition,
  instance: Pick<DefiningWildlifeInstance, 'sizeScaleSample' | 'largeSizeFrame'>
): number {
  let multiplier = computingWildlifeSizeSpeedStatMultiplierFromVisualMultiplier(
    resolvingWildlifeSizeScaleMultiplierFromSample(instance.sizeScaleSample)
  );

  if (instance.largeSizeFrame === 'obese') {
    multiplier *= DEFINING_WILDLIFE_OBESE_SPEED_MULTIPLIER;
  }

  return multiplier;
}

/** Resolves render scale for one wildlife instance. */
export function resolvingWildlifeInstanceSizeScale(
  species: DefiningWildlifeSpeciesDefinition,
  instance: DefiningWildlifeInstance
): number {
  let scale =
    species.sizeScale *
    resolvingWildlifeInstanceSizeMultiplier(species, instance) *
    resolvingWildlifeInstanceObeseTurtlePresentationMultiplier(
      species,
      instance
    );

  if (checkingWildlifeIsAggressiveChicken(instance)) {
    scale *= DEFINING_WILDLIFE_AGGRESSIVE_CHICKEN_SIZE_SCALE_MULTIPLIER;
  }

  return scale;
}

/** Resolves collision radius for one wildlife instance. */
export function resolvingWildlifeInstanceCollisionRadiusGrid(
  species: DefiningWildlifeSpeciesDefinition,
  instance: Pick<DefiningWildlifeInstance, 'sizeScaleSample' | 'largeSizeFrame'>
): number {
  return (
    species.collisionRadiusGrid *
    resolvingWildlifeInstanceSizeMultiplier(species, instance) *
    resolvingWildlifeInstanceObeseTurtlePresentationMultiplier(
      species,
      instance
    )
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

  if (checkingWildlifeInstanceIsObeseTurtle(species, instance)) {
    baseMaxHealth *=
      DEFINING_WILDLIFE_TURTLE_OBESE_SIZE_AND_HEALTH_BOOST_MULTIPLIER;
  }

  if (checkingWildlifeIsAggressiveChicken(instance)) {
    baseMaxHealth *= DEFINING_WILDLIFE_AGGRESSIVE_CHICKEN_HEALTH_MULTIPLIER;
  }

  return (
    Math.round(baseMaxHealth) +
    resolvingWildlifeInstanceSpritcoreUpgradeBonusMaxHealth(instance)
  );
}

/** Applies instance-specific melee damage multipliers. */
export function resolvingWildlifeInstanceAttackPowerMultiplier(
  species: DefiningWildlifeSpeciesDefinition,
  instance: DefiningWildlifeInstance,
  nowMs: number = Number.MAX_SAFE_INTEGER
): number {
  let multiplier = resolvingWildlifeInstanceCombatStatMultiplier(
    species,
    instance
  );

  if (checkingWildlifeIsAggressiveChicken(instance)) {
    multiplier *= DEFINING_WILDLIFE_AGGRESSIVE_CHICKEN_ATTACK_POWER_MULTIPLIER;
  }

  multiplier *= resolvingWildlifeSpritcoreFeastAttackPowerMultiplier(
    instance,
    nowMs
  );

  return multiplier;
}

/** Flat Attack EV from companion Spritcore power-ups (0 for wild creatures). */
export function resolvingWildlifeInstanceSpritcoreUpgradeAttackPowerBonus(
  instance: Partial<Pick<DefiningWildlifeInstance, 'petBond'>>
): number {
  return resolvingWildlifeInstanceSpritcoreUpgradeBonusAttackPower(instance);
}

/** Species+size Defense before companion Spritcore defense purchases. */
export function resolvingWildlifeInstanceBaseDefense(
  species: DefiningWildlifeSpeciesDefinition,
  instance: Pick<DefiningWildlifeInstance, 'sizeScaleSample' | 'largeSizeFrame'>
): number {
  return Math.round(
    species.vitals.defense *
      resolvingWildlifeInstanceCombatStatMultiplier(species, instance)
  );
}

/** Live Defense EV including companion Spritcore defense purchases. */
export function resolvingWildlifeInstanceEffectiveDefense(
  species: DefiningWildlifeSpeciesDefinition,
  instance: Pick<
    DefiningWildlifeInstance,
    'sizeScaleSample' | 'largeSizeFrame'
  > &
    Partial<Pick<DefiningWildlifeInstance, 'petBond'>>
): number {
  return (
    resolvingWildlifeInstanceBaseDefense(species, instance) +
    resolvingWildlifeInstanceSpritcoreUpgradeBonusDefense(instance)
  );
}

/**
 * Authored run speed for one wildlife instance (size + obese/chicken only).
 * Excludes health movement debuffs and Spritcore move-speed purchases.
 */
export function resolvingWildlifeInstanceNaturalRunSpeedGridPerSecond(
  species: DefiningWildlifeSpeciesDefinition,
  instance: Pick<
    DefiningWildlifeInstance,
    'sizeScaleSample' | 'largeSizeFrame' | 'aggressionLevel' | 'speciesId'
  >
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

/**
 * Authored walk speed for one wildlife instance (size + obese/chicken only).
 * Excludes health movement debuffs and Spritcore move-speed purchases.
 */
export function resolvingWildlifeInstanceNaturalWalkSpeedGridPerSecond(
  species: DefiningWildlifeSpeciesDefinition,
  instance: Pick<
    DefiningWildlifeInstance,
    'sizeScaleSample' | 'largeSizeFrame' | 'aggressionLevel' | 'speciesId'
  >
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

function applyingWildlifeInstanceSpritcoreMoveSpeedBonus(
  naturalWalkSpeed: number,
  naturalRunSpeed: number,
  bonusMoveSpeed: number
): { walkSpeed: number; runSpeed: number } {
  if (bonusMoveSpeed <= 0 || naturalRunSpeed <= 0) {
    return {
      walkSpeed: naturalWalkSpeed,
      runSpeed: naturalRunSpeed,
    };
  }

  const walkBonus =
    naturalRunSpeed > 0
      ? bonusMoveSpeed * (naturalWalkSpeed / naturalRunSpeed)
      : bonusMoveSpeed;

  return {
    walkSpeed: naturalWalkSpeed + walkBonus,
    runSpeed: naturalRunSpeed + bonusMoveSpeed,
  };
}

/**
 * Resolves effective melee attack interval for one wildlife instance, including
 * companion Spritcore attack-speed purchases.
 */
export function resolvingWildlifeInstanceEffectiveAttackIntervalMs(
  species: DefiningWildlifeSpeciesDefinition,
  instance: Partial<Pick<DefiningWildlifeInstance, 'petBond'>>,
  attackSpeedMultiplier: number = 1
): number {
  const naturalIntervalMs = resolvingWorldPlazaScaledAttackIntervalMs(
    species.vitals.attackIntervalMs
  );
  const naturalAttackSpeed = 1000 / Math.max(1, naturalIntervalMs);
  const bonusAttackSpeed =
    resolvingWildlifeInstanceSpritcoreUpgradeBonusAttackSpeed(instance);
  const effectiveAttackSpeed = Math.max(
    0.05,
    naturalAttackSpeed + bonusAttackSpeed
  );
  const scaledMultiplier = Math.max(0.05, attackSpeedMultiplier);

  return 1000 / (effectiveAttackSpeed * scaledMultiplier);
}

/** Resolves walk speed for one wildlife instance. */
export function resolvingWildlifeInstanceWalkSpeedGridPerSecond(
  species: DefiningWildlifeSpeciesDefinition,
  instance: DefiningWildlifeInstance,
  nowMs: number = Number.MAX_SAFE_INTEGER
): number {
  const naturalWalkSpeed =
    resolvingWildlifeInstanceNaturalWalkSpeedGridPerSecond(species, instance);
  const naturalRunSpeed = resolvingWildlifeInstanceNaturalRunSpeedGridPerSecond(
    species,
    instance
  );
  const spritcoreSpeed = applyingWildlifeInstanceSpritcoreMoveSpeedBonus(
    naturalWalkSpeed,
    naturalRunSpeed,
    resolvingWildlifeInstanceSpritcoreUpgradeBonusMoveSpeed(instance)
  );
  let walkSpeed = spritcoreSpeed.walkSpeed;

  const healthMovement = resolvingWorldPlazaEntityHealthMovementMultipliers(
    instance.healthState,
    nowMs
  );
  walkSpeed *=
    healthMovement.speedMultiplier * healthMovement.walkSpeedMultiplier;

  return walkSpeed;
}

/** Resolves run speed for one wildlife instance. */
export function resolvingWildlifeInstanceRunSpeedGridPerSecond(
  species: DefiningWildlifeSpeciesDefinition,
  instance: DefiningWildlifeInstance,
  nowMs: number = Number.MAX_SAFE_INTEGER
): number {
  const naturalWalkSpeed =
    resolvingWildlifeInstanceNaturalWalkSpeedGridPerSecond(species, instance);
  const naturalRunSpeed = resolvingWildlifeInstanceNaturalRunSpeedGridPerSecond(
    species,
    instance
  );
  const spritcoreSpeed = applyingWildlifeInstanceSpritcoreMoveSpeedBonus(
    naturalWalkSpeed,
    naturalRunSpeed,
    resolvingWildlifeInstanceSpritcoreUpgradeBonusMoveSpeed(instance)
  );
  let runSpeed = spritcoreSpeed.runSpeed;

  const healthMovement = resolvingWorldPlazaEntityHealthMovementMultipliers(
    instance.healthState,
    nowMs
  );
  runSpeed *= healthMovement.speedMultiplier;

  return runSpeed;
}

/** Resolves stamina tuning for one wildlife instance. */
export function resolvingWildlifeInstanceStaminaConfig(
  species: DefiningWildlifeSpeciesDefinition,
  instance: DefiningWildlifeInstance,
  nowMs: number = Number.MAX_SAFE_INTEGER
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

  if (instance.largeSizeFrame === 'obese') {
    regenMultiplier *= DEFINING_WILDLIFE_OBESE_STAMINA_REGEN_MULTIPLIER;
  }

  if (instance.largeSizeFrame === 'apex') {
    regenMultiplier *= DEFINING_WILDLIFE_APEX_STAMINA_REGEN_MULTIPLIER;
  }

  const healthMovement = resolvingWorldPlazaEntityHealthMovementMultipliers(
    instance.healthState,
    nowMs
  );
  drainMultiplier *= healthMovement.staminaDrainMultiplier;
  regenMultiplier *= healthMovement.staminaRegenMultiplier;

  const baseMaxStaminaRatio = species.stamina.maxStaminaRatio ?? 1;
  const maxStaminaRatio =
    baseMaxStaminaRatio * healthMovement.staminaMaxMultiplier;

  return {
    drainMultiplier,
    regenMultiplier,
    ...(maxStaminaRatio !== 1 ? { maxStaminaRatio } : {}),
  };
}

/** Resolves the stamina cap for one wildlife instance. */
export function resolvingWildlifeInstanceMaxStaminaRatio(
  instance: Pick<DefiningWildlifeInstance, 'largeSizeFrame'>,
  species?: Pick<DefiningWildlifeSpeciesDefinition, 'stamina'>
): number {
  const speciesCap = species?.stamina.maxStaminaRatio ?? 1;
  const apexMultiplier =
    instance.largeSizeFrame === 'apex'
      ? DEFINING_WILDLIFE_APEX_MAX_STAMINA_RATIO
      : 1;

  return speciesCap * apexMultiplier;
}
