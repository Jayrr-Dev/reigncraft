/**
 * Resolves companion Spritcore power-up prices from natural + invested stats.
 *
 * @module components/world/wildlife/pets/domains/resolvingWildlifePetSpritcoreUpgradeOffers
 */

import { computingWorldPlazaSpritcoreUpgradeDeltaPrice } from '@/components/world/spritcore/domains/computingWorldPlazaSpritcoreUpgradePrice';
import type { WorldPlazaSpritcoreUpgradeBonuses } from '@/components/world/spritcore/domains/definingWorldPlazaSpritcoreUpgradeTypes';
import { computingWildlifePetSpritcoreUpgradeSteps } from '@/components/world/wildlife/pets/domains/computingWildlifePetSpritcoreUpgradeSteps';
import {
  DEFINING_WILDLIFE_PET_SPRITCORE_CURVE_MAX_MULTIPLIER,
  DEFINING_WILDLIFE_PET_SPRITCORE_MAX_ATTACK_SPEED,
} from '@/components/world/wildlife/pets/domains/definingWildlifePetSpritcoreUpgradeConstants';

export type ResolvingWildlifePetSpritcoreUpgradeOffer = {
  readonly currentValue: number;
  readonly nextValue: number;
  readonly step: number;
  readonly price: number;
  readonly isCapped: boolean;
};

export type ResolvingWildlifePetSpritcoreUpgradeOffersInput = {
  readonly bonuses: WorldPlazaSpritcoreUpgradeBonuses;
  /** Species+size max HP with no Spritcore investment. */
  readonly naturalMaxHealth: number;
  /** Species+size attack EV with no Spritcore investment. */
  readonly naturalAttackPower: number;
  /** Nominal APS from species interval (global scale applied, no APS bonus). */
  readonly naturalAttackSpeed: number;
};

function computingWildlifePetSpritcoreHealthUpgradePrice(
  naturalMaxHealth: number,
  currentMaxHealth: number,
  healthStep: number
): number {
  const curveMax = Math.max(
    naturalMaxHealth + healthStep,
    naturalMaxHealth * DEFINING_WILDLIFE_PET_SPRITCORE_CURVE_MAX_MULTIPLIER
  );

  return computingWorldPlazaSpritcoreUpgradeDeltaPrice(
    currentMaxHealth,
    currentMaxHealth + healthStep,
    naturalMaxHealth,
    curveMax
  );
}

function computingWildlifePetSpritcoreOffensiveUpgradePrice(
  naturalAttackPower: number,
  naturalAttackSpeed: number,
  currentAttackPower: number,
  currentAttackSpeed: number,
  damageStep: number,
  attackSpeedStep: number
): number {
  const naturalDps = naturalAttackPower * naturalAttackSpeed;
  const currentDps = currentAttackPower * currentAttackSpeed;
  const nextDps =
    (currentAttackPower + damageStep) * (currentAttackSpeed + attackSpeedStep);
  const curveMax = Math.max(
    naturalDps + 1,
    naturalDps * DEFINING_WILDLIFE_PET_SPRITCORE_CURVE_MAX_MULTIPLIER
  );

  return computingWorldPlazaSpritcoreUpgradeDeltaPrice(
    currentDps,
    nextDps,
    naturalDps,
    curveMax
  );
}

/**
 * Builds health / damage / attack-speed offers for one companion.
 */
export function resolvingWildlifePetSpritcoreUpgradeOffers(
  input: ResolvingWildlifePetSpritcoreUpgradeOffersInput
): {
  readonly health: ResolvingWildlifePetSpritcoreUpgradeOffer;
  readonly damage: ResolvingWildlifePetSpritcoreUpgradeOffer;
  readonly attackSpeed: ResolvingWildlifePetSpritcoreUpgradeOffer;
} {
  const steps = computingWildlifePetSpritcoreUpgradeSteps(
    input.naturalMaxHealth,
    input.naturalAttackPower
  );
  const currentMaxHealth =
    input.naturalMaxHealth + input.bonuses.bonusMaxHealth;
  const currentAttackPower =
    input.naturalAttackPower + input.bonuses.bonusAttackPower;
  const currentAttackSpeed =
    input.naturalAttackSpeed + input.bonuses.bonusAttackSpeed;
  const attackSpeedCapped =
    currentAttackSpeed + steps.attackSpeedStep >
    DEFINING_WILDLIFE_PET_SPRITCORE_MAX_ATTACK_SPEED;

  return {
    health: {
      currentValue: currentMaxHealth,
      nextValue: currentMaxHealth + steps.healthStep,
      step: steps.healthStep,
      price: computingWildlifePetSpritcoreHealthUpgradePrice(
        input.naturalMaxHealth,
        currentMaxHealth,
        steps.healthStep
      ),
      isCapped: false,
    },
    damage: {
      currentValue: currentAttackPower,
      nextValue: currentAttackPower + steps.damageStep,
      step: steps.damageStep,
      price: computingWildlifePetSpritcoreOffensiveUpgradePrice(
        input.naturalAttackPower,
        input.naturalAttackSpeed,
        currentAttackPower,
        currentAttackSpeed,
        steps.damageStep,
        0
      ),
      isCapped: false,
    },
    attackSpeed: {
      currentValue: currentAttackSpeed,
      nextValue: currentAttackSpeed + steps.attackSpeedStep,
      step: steps.attackSpeedStep,
      price: computingWildlifePetSpritcoreOffensiveUpgradePrice(
        input.naturalAttackPower,
        input.naturalAttackSpeed,
        currentAttackPower,
        currentAttackSpeed,
        0,
        steps.attackSpeedStep
      ),
      isCapped: attackSpeedCapped,
    },
  };
}
