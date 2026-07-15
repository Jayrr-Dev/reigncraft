/**
 * Applies one Spritcore power-up purchase to a bonded companion instance.
 *
 * @module components/world/wildlife/pets/domains/applyingWildlifePetSpritcoreUpgradePurchase
 */

import {
  WORLD_PLAZA_SPRITCORE_UPGRADE_EMPTY_BONUSES,
  type WildlifePetSpritcoreUpgradeLaneId,
  type WorldPlazaSpritcoreUpgradeBonuses,
} from '@/components/world/spritcore/domains/definingWorldPlazaSpritcoreUpgradeTypes';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import {
  computingWildlifePetSpritcoreDefenseMaximum,
  computingWildlifePetSpritcoreMoveSpeedMaximum,
  computingWildlifePetSpritcoreUpgradeSteps,
} from '@/components/world/wildlife/pets/domains/computingWildlifePetSpritcoreUpgradeSteps';
import { DEFINING_WILDLIFE_PET_SPRITCORE_MAX_ATTACK_SPEED } from '@/components/world/wildlife/pets/domains/definingWildlifePetSpritcoreUpgradeConstants';
import { resolvingWildlifePetSpritcoreUpgradeOffers } from '@/components/world/wildlife/pets/domains/resolvingWildlifePetSpritcoreUpgradeOffers';

export type ApplyingWildlifePetSpritcoreUpgradePurchaseParams = {
  readonly instance: DefiningWildlifeInstance;
  readonly laneId: WildlifePetSpritcoreUpgradeLaneId;
  readonly price: number;
  readonly naturalMaxHealth: number;
  readonly naturalAttackPower: number;
  readonly naturalAttackSpeed: number;
  readonly naturalDefense: number;
  readonly naturalRunSpeed: number;
};

export type ApplyingWildlifePetSpritcoreUpgradePurchaseResult =
  | {
      readonly status: 'applied';
      readonly instance: DefiningWildlifeInstance;
      readonly bonuses: WorldPlazaSpritcoreUpgradeBonuses;
      readonly step: number;
    }
  | { readonly status: 'capped' }
  | { readonly status: 'invalid' };

function resolvingWildlifePetSpritcoreUpgradeBonuses(
  instance: DefiningWildlifeInstance
): WorldPlazaSpritcoreUpgradeBonuses {
  return (
    instance.petBond?.spritcoreUpgrades ??
    WORLD_PLAZA_SPRITCORE_UPGRADE_EMPTY_BONUSES
  );
}

/**
 * Spends the quoted price into the companion's invested Spritcore bonuses and
 * bumps live max HP (+ current HP) when the health lane is purchased.
 */
export function applyingWildlifePetSpritcoreUpgradePurchase(
  params: ApplyingWildlifePetSpritcoreUpgradePurchaseParams
): ApplyingWildlifePetSpritcoreUpgradePurchaseResult {
  const petBond = params.instance.petBond;

  if (!petBond || !Number.isFinite(params.price) || params.price <= 0) {
    return { status: 'invalid' };
  }

  const currentBonuses = resolvingWildlifePetSpritcoreUpgradeBonuses(
    params.instance
  );
  const offers = resolvingWildlifePetSpritcoreUpgradeOffers({
    bonuses: currentBonuses,
    naturalMaxHealth: params.naturalMaxHealth,
    naturalAttackPower: params.naturalAttackPower,
    naturalAttackSpeed: params.naturalAttackSpeed,
    naturalDefense: params.naturalDefense,
    naturalRunSpeed: params.naturalRunSpeed,
  });
  const offer = offers[params.laneId];

  if (offer.isCapped) {
    return { status: 'capped' };
  }

  if (Math.ceil(offer.price) !== Math.ceil(params.price)) {
    return { status: 'invalid' };
  }

  const steps = computingWildlifePetSpritcoreUpgradeSteps(
    params.naturalMaxHealth,
    params.naturalAttackPower,
    params.naturalDefense
  );

  if (params.laneId === 'attackSpeed') {
    const nextAttackSpeed =
      params.naturalAttackSpeed +
      currentBonuses.bonusAttackSpeed +
      steps.attackSpeedStep;

    if (nextAttackSpeed > DEFINING_WILDLIFE_PET_SPRITCORE_MAX_ATTACK_SPEED) {
      return { status: 'capped' };
    }
  }

  if (params.laneId === 'defense') {
    const defenseMaximum = computingWildlifePetSpritcoreDefenseMaximum(
      params.naturalDefense,
      steps.defenseStep
    );
    const nextDefense =
      params.naturalDefense + currentBonuses.bonusDefense + steps.defenseStep;

    if (params.naturalDefense <= 0 || nextDefense > defenseMaximum) {
      return { status: 'capped' };
    }
  }

  if (params.laneId === 'moveSpeed') {
    const moveSpeedMaximum = computingWildlifePetSpritcoreMoveSpeedMaximum(
      params.naturalRunSpeed
    );
    const nextRunSpeed =
      params.naturalRunSpeed +
      currentBonuses.bonusMoveSpeed +
      steps.moveSpeedStep;

    if (params.naturalRunSpeed <= 0 || nextRunSpeed > moveSpeedMaximum) {
      return { status: 'capped' };
    }
  }

  const nextBonuses: WorldPlazaSpritcoreUpgradeBonuses = {
    bonusMaxHealth:
      params.laneId === 'health'
        ? currentBonuses.bonusMaxHealth + steps.healthStep
        : currentBonuses.bonusMaxHealth,
    bonusAttackPower:
      params.laneId === 'damage'
        ? currentBonuses.bonusAttackPower + steps.damageStep
        : currentBonuses.bonusAttackPower,
    bonusAttackSpeed:
      params.laneId === 'attackSpeed'
        ? currentBonuses.bonusAttackSpeed + steps.attackSpeedStep
        : currentBonuses.bonusAttackSpeed,
    bonusDefense:
      params.laneId === 'defense'
        ? currentBonuses.bonusDefense + steps.defenseStep
        : currentBonuses.bonusDefense,
    bonusMoveSpeed:
      params.laneId === 'moveSpeed'
        ? currentBonuses.bonusMoveSpeed + steps.moveSpeedStep
        : currentBonuses.bonusMoveSpeed,
    totalSpritcoreInvested:
      currentBonuses.totalSpritcoreInvested + Math.ceil(params.price),
  };

  let nextHealthState = params.instance.healthState;

  if (params.laneId === 'health') {
    nextHealthState = {
      ...params.instance.healthState,
      baseMaxHealth:
        params.instance.healthState.baseMaxHealth + steps.healthStep,
      currentHealth:
        params.instance.healthState.currentHealth + steps.healthStep,
    };
  }

  return {
    status: 'applied',
    bonuses: nextBonuses,
    step: offer.step,
    instance: {
      ...params.instance,
      healthState: nextHealthState,
      petBond: {
        ...petBond,
        spritcoreUpgrades: nextBonuses,
      },
    },
  };
}
