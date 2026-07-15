/**

 * Resolves companion Spritcore power-up prices from natural + invested stats.

 *

 * @module components/world/wildlife/pets/domains/resolvingWildlifePetSpritcoreUpgradeOffers

 */

import { computingWorldPlazaSpritcoreEquivalentValue } from '@/components/world/spritcore/domains/computingWorldPlazaSpritcoreEquivalentValue';
import {
  computingWorldPlazaSpritcoreDefenseUpgradePrice,
  computingWorldPlazaSpritcoreMoveSpeedUpgradePrice,
} from '@/components/world/spritcore/domains/computingWorldPlazaSpritcoreUpgradePrice';

import type { WorldPlazaSpritcoreUpgradeBonuses } from '@/components/world/spritcore/domains/definingWorldPlazaSpritcoreUpgradeTypes';

import {
  computingWildlifePetSpritcoreDefenseMaximum,
  computingWildlifePetSpritcoreMoveSpeedMaximum,
  computingWildlifePetSpritcoreUpgradeSteps,
} from '@/components/world/wildlife/pets/domains/computingWildlifePetSpritcoreUpgradeSteps';

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

  /** Species+size Defense with no Spritcore investment. */

  readonly naturalDefense: number;

  /** Authored run speed with no Spritcore investment (grid/s). */

  readonly naturalRunSpeed: number;
};

function computingWildlifePetSpritcoreUpgradeDeltaPrice(
  beforeValue: number,

  afterValue: number,

  baseValue: number,

  maximumValue: number
): number {
  if (afterValue <= beforeValue) {
    return 0;
  }

  return Math.max(
    0,

    computingWorldPlazaSpritcoreEquivalentValue(
      afterValue,

      baseValue,

      maximumValue
    ) -
      computingWorldPlazaSpritcoreEquivalentValue(
        beforeValue,

        baseValue,

        maximumValue
      )
  );
}

function computingWildlifePetSpritcoreHealthUpgradePrice(
  naturalMaxHealth: number,

  currentMaxHealth: number,

  healthStep: number
): number {
  const curveMax = Math.max(
    naturalMaxHealth + healthStep,

    naturalMaxHealth * DEFINING_WILDLIFE_PET_SPRITCORE_CURVE_MAX_MULTIPLIER
  );

  return computingWildlifePetSpritcoreUpgradeDeltaPrice(
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
  const naturalDps = Math.max(0.01, naturalAttackPower * naturalAttackSpeed);

  const currentDps = currentAttackPower * currentAttackSpeed;

  const nextDps =
    (currentAttackPower + damageStep) * (currentAttackSpeed + attackSpeedStep);

  const curveMax = Math.max(
    naturalDps + 1,

    naturalDps * DEFINING_WILDLIFE_PET_SPRITCORE_CURVE_MAX_MULTIPLIER
  );

  return computingWildlifePetSpritcoreUpgradeDeltaPrice(
    currentDps,

    nextDps,

    naturalDps,

    curveMax
  );
}

/**

 * Builds health / damage / attack-speed / defense / move-speed offers for one companion.

 */

export function resolvingWildlifePetSpritcoreUpgradeOffers(
  input: ResolvingWildlifePetSpritcoreUpgradeOffersInput
): {
  readonly health: ResolvingWildlifePetSpritcoreUpgradeOffer;

  readonly damage: ResolvingWildlifePetSpritcoreUpgradeOffer;

  readonly attackSpeed: ResolvingWildlifePetSpritcoreUpgradeOffer;

  readonly defense: ResolvingWildlifePetSpritcoreUpgradeOffer;

  readonly moveSpeed: ResolvingWildlifePetSpritcoreUpgradeOffer;
} {
  const steps = computingWildlifePetSpritcoreUpgradeSteps(
    input.naturalMaxHealth,

    input.naturalAttackPower,

    input.naturalDefense
  );

  const currentMaxHealth =
    input.naturalMaxHealth + input.bonuses.bonusMaxHealth;

  const currentAttackPower =
    input.naturalAttackPower + input.bonuses.bonusAttackPower;

  const currentAttackSpeed =
    input.naturalAttackSpeed + input.bonuses.bonusAttackSpeed;

  const currentDefense = input.naturalDefense + input.bonuses.bonusDefense;

  const currentRunSpeed = input.naturalRunSpeed + input.bonuses.bonusMoveSpeed;

  const defenseMaximum = computingWildlifePetSpritcoreDefenseMaximum(
    input.naturalDefense,

    steps.defenseStep
  );

  const moveSpeedMaximum = computingWildlifePetSpritcoreMoveSpeedMaximum(
    input.naturalRunSpeed
  );

  const attackSpeedCapped =
    currentAttackSpeed + steps.attackSpeedStep >
    DEFINING_WILDLIFE_PET_SPRITCORE_MAX_ATTACK_SPEED;

  const defenseCapped =
    input.naturalDefense <= 0 ||
    currentDefense + steps.defenseStep > defenseMaximum;

  const moveSpeedCapped =
    input.naturalRunSpeed <= 0 ||
    currentRunSpeed + steps.moveSpeedStep > moveSpeedMaximum;

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

    defense: {
      currentValue: currentDefense,

      nextValue: currentDefense + steps.defenseStep,

      step: steps.defenseStep,

      price: computingWorldPlazaSpritcoreDefenseUpgradePrice(
        input.naturalDefense,

        currentDefense,

        steps.defenseStep,

        defenseMaximum
      ),

      isCapped: defenseCapped,
    },

    moveSpeed: {
      currentValue: currentRunSpeed,

      nextValue: currentRunSpeed + steps.moveSpeedStep,

      step: steps.moveSpeedStep,

      price: computingWorldPlazaSpritcoreMoveSpeedUpgradePrice(
        input.naturalRunSpeed,

        currentRunSpeed,

        steps.moveSpeedStep,

        moveSpeedMaximum
      ),

      isCapped: moveSpeedCapped,
    },
  };
}
