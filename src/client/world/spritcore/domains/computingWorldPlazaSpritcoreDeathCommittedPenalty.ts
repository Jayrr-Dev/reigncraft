/**
 * Pure committed-upgrade death penalty: scale bonuses down and spill invested SC.
 *
 * @module components/world/spritcore/domains/computingWorldPlazaSpritcoreDeathCommittedPenalty
 */

import { DEFINING_WORLD_PLAZA_SPRITCORE_DEATH_COMMITTED_DROP_FRACTION } from '@/components/world/spritcore/domains/definingWorldPlazaSpritcoreDeathDropConstants';
import type { WorldPlazaSpritcoreUpgradeBonuses } from '@/components/world/spritcore/domains/definingWorldPlazaSpritcoreUpgradeTypes';

export type ComputingWorldPlazaSpritcoreDeathCommittedPenaltyResult = {
  readonly nextBonuses: WorldPlazaSpritcoreUpgradeBonuses;
  readonly droppedQuantity: number;
};

/**
 * Strips a fraction of invested Spritcore and scales purchased bonuses to match.
 */
export function computingWorldPlazaSpritcoreDeathCommittedPenalty(
  bonuses: WorldPlazaSpritcoreUpgradeBonuses,
  dropFraction: number = DEFINING_WORLD_PLAZA_SPRITCORE_DEATH_COMMITTED_DROP_FRACTION
): ComputingWorldPlazaSpritcoreDeathCommittedPenaltyResult {
  if (
    !Number.isFinite(dropFraction) ||
    dropFraction <= 0 ||
    dropFraction >= 1
  ) {
    return { nextBonuses: bonuses, droppedQuantity: 0 };
  }

  const invested = Math.max(0, Math.floor(bonuses.totalSpritcoreInvested));
  const droppedQuantity = Math.floor(invested * dropFraction);

  if (droppedQuantity <= 0) {
    return { nextBonuses: bonuses, droppedQuantity: 0 };
  }

  const keepFraction = 1 - dropFraction;

  return {
    droppedQuantity,
    nextBonuses: {
      bonusMaxHealth: Math.max(
        0,
        Math.floor(bonuses.bonusMaxHealth * keepFraction)
      ),
      bonusAttackPower: Math.max(
        0,
        Math.floor(bonuses.bonusAttackPower * keepFraction)
      ),
      bonusAttackSpeed: Math.max(
        0,
        Number((bonuses.bonusAttackSpeed * keepFraction).toFixed(4))
      ),
      bonusDefense: Math.max(
        0,
        Math.floor(bonuses.bonusDefense * keepFraction)
      ),
      bonusMoveSpeed: Math.max(
        0,
        Number((bonuses.bonusMoveSpeed * keepFraction).toFixed(4))
      ),
      totalSpritcoreInvested: Math.max(0, invested - droppedQuantity),
    },
  };
}
