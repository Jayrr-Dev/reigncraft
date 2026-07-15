/**
 * Resolves Spritcore upgrade lane prices and availability for the panel.
 *
 * @module components/world/spritcore/domains/resolvingWorldPlazaSpritcoreUpgradeOffers
 */

import {
  computingWorldPlazaSpritcoreDefenseUpgradePrice,
  computingWorldPlazaSpritcoreHealthUpgradePrice,
  computingWorldPlazaSpritcoreMoveSpeedUpgradePrice,
  computingWorldPlazaSpritcoreOffensiveUpgradePrice,
} from '@/components/world/spritcore/domains/computingWorldPlazaSpritcoreUpgradePrice';
import {
  computingWorldPlazaSpritcoreDefenseMaximum,
  computingWorldPlazaSpritcoreMoveSpeedMaximum,
  computingWorldPlazaSpritcoreUpgradeSteps,
} from '@/components/world/spritcore/domains/computingWorldPlazaSpritcoreUpgradeSteps';
import {
  DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_ATTACK_SPEED_UPGRADE_STEP,
  DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_DAMAGE_UPGRADE_STEP,
  DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_HEALTH_UPGRADE_STEP,
  DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_MAX_ATTACK_SPEED,
} from '@/components/world/spritcore/domains/definingWorldPlazaSpritcoreLevelingConstants';
import type { WorldPlazaSpritcoreUpgradeBonuses } from '@/components/world/spritcore/domains/definingWorldPlazaSpritcoreUpgradeTypes';

export type ResolvingWorldPlazaSpritcoreUpgradeOffer = {
  readonly currentValue: number;
  readonly nextValue: number;
  readonly step: number;
  readonly price: number;
  readonly isCapped: boolean;
};

export type ResolvingWorldPlazaSpritcoreUpgradeOffersInput = {
  readonly bonuses: WorldPlazaSpritcoreUpgradeBonuses;
  readonly effectiveMaxHealth: number;
  readonly attackPower: number;
  readonly nominalAttackSpeed: number;
  /** Species/form Defense with no Spritcore investment. */
  readonly naturalDefense: number;
  /** Authored run speed with no Spritcore investment (grid/s). */
  readonly naturalRunSpeed: number;
};

/**
 * Builds upgrade lane offers from current effective combat and mobility stats.
 */
export function resolvingWorldPlazaSpritcoreUpgradeOffers(
  input: ResolvingWorldPlazaSpritcoreUpgradeOffersInput
): {
  readonly health: ResolvingWorldPlazaSpritcoreUpgradeOffer;
  readonly damage: ResolvingWorldPlazaSpritcoreUpgradeOffer;
  readonly attackSpeed: ResolvingWorldPlazaSpritcoreUpgradeOffer;
  readonly defense: ResolvingWorldPlazaSpritcoreUpgradeOffer;
  readonly moveSpeed: ResolvingWorldPlazaSpritcoreUpgradeOffer;
} {
  const steps = computingWorldPlazaSpritcoreUpgradeSteps(input.naturalDefense);
  const currentDefense = input.naturalDefense + input.bonuses.bonusDefense;
  const currentRunSpeed = input.naturalRunSpeed + input.bonuses.bonusMoveSpeed;
  const defenseMaximum = computingWorldPlazaSpritcoreDefenseMaximum(
    input.naturalDefense,
    steps.defenseStep
  );
  const moveSpeedMaximum = computingWorldPlazaSpritcoreMoveSpeedMaximum(
    input.naturalRunSpeed
  );
  const healthPrice = computingWorldPlazaSpritcoreHealthUpgradePrice(
    input.effectiveMaxHealth,
    DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_HEALTH_UPGRADE_STEP
  );
  const damagePrice = computingWorldPlazaSpritcoreOffensiveUpgradePrice(
    input.attackPower,
    input.nominalAttackSpeed,
    DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_DAMAGE_UPGRADE_STEP,
    0
  );
  const attackSpeedPrice = computingWorldPlazaSpritcoreOffensiveUpgradePrice(
    input.attackPower,
    input.nominalAttackSpeed,
    0,
    DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_ATTACK_SPEED_UPGRADE_STEP
  );
  const attackSpeedCapped =
    input.nominalAttackSpeed +
      DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_ATTACK_SPEED_UPGRADE_STEP >
    DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_MAX_ATTACK_SPEED;
  const defenseCapped =
    input.naturalDefense <= 0 ||
    currentDefense + steps.defenseStep > defenseMaximum;
  const moveSpeedCapped =
    input.naturalRunSpeed <= 0 ||
    currentRunSpeed + steps.moveSpeedStep > moveSpeedMaximum;

  return {
    health: {
      currentValue: input.effectiveMaxHealth,
      nextValue:
        input.effectiveMaxHealth +
        DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_HEALTH_UPGRADE_STEP,
      step: DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_HEALTH_UPGRADE_STEP,
      price: healthPrice,
      isCapped: false,
    },
    damage: {
      currentValue: input.attackPower,
      nextValue:
        input.attackPower +
        DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_DAMAGE_UPGRADE_STEP,
      step: DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_DAMAGE_UPGRADE_STEP,
      price: damagePrice,
      isCapped: false,
    },
    attackSpeed: {
      currentValue: input.nominalAttackSpeed,
      nextValue:
        input.nominalAttackSpeed +
        DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_ATTACK_SPEED_UPGRADE_STEP,
      step: DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_ATTACK_SPEED_UPGRADE_STEP,
      price: attackSpeedPrice,
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
