/**
 * Applies Spritcore death spill: inventory cores + committed upgrade spend.
 *
 * @module components/world/spritcore/domains/applyingWorldPlazaPlayerDeathSpritcorePenalty
 */

import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { computingWorldPlazaSpritcoreDeathDropQuantities } from '@/components/world/spritcore/domains/computingWorldPlazaSpritcoreDeathDropQuantities';
import {
  consumingWorldPlazaSpritcoreInventoryQuantity,
  countingWorldPlazaSpritcoreInventoryQuantity,
} from '@/components/world/spritcore/domains/countingWorldPlazaSpritcoreInventoryQuantity';
import { droppingWorldPlazaPlayerDeathSpritcoreGroundItem } from '@/components/world/spritcore/domains/droppingWorldPlazaPlayerDeathSpritcoreGroundItem';
import {
  applyingWorldPlazaSpritcoreDeathCommittedPenalty,
  gettingWorldPlazaSpritcoreUpgradeSnapshot,
} from '@/components/world/spritcore/domains/managingWorldPlazaSpritcoreUpgradeStore';
import type { PlazaSaveSlotIndex } from '../../../../shared/plazaGameSession';

export type ApplyingWorldPlazaPlayerDeathSpritcorePenaltyParams = {
  readonly inventoryState: DefiningInventoryState;
  readonly deathPosition: DefiningWorldPlazaWorldPoint;
  readonly localPersistenceOwnerId: string | null;
  readonly redditUserId: string | null;
  readonly saveSlotIndex: PlazaSaveSlotIndex | null;
  readonly onInventoryStateChange: (nextState: DefiningInventoryState) => void;
};

export type ApplyingWorldPlazaPlayerDeathSpritcorePenaltyResult = {
  readonly carriedDropQuantity: number;
  readonly committedDropQuantity: number;
  readonly totalDropQuantity: number;
  readonly groundDropOutcome: 'dropped' | 'none' | 'failed';
};

/**
 * Weakens the player on death: 12% carried SC and 8% committed SC spill.
 */
export async function applyingWorldPlazaPlayerDeathSpritcorePenalty({
  inventoryState,
  deathPosition,
  localPersistenceOwnerId,
  redditUserId,
  saveSlotIndex,
  onInventoryStateChange,
}: ApplyingWorldPlazaPlayerDeathSpritcorePenaltyParams): Promise<ApplyingWorldPlazaPlayerDeathSpritcorePenaltyResult> {
  const carriedQuantity =
    countingWorldPlazaSpritcoreInventoryQuantity(inventoryState);
  const committedQuantity =
    gettingWorldPlazaSpritcoreUpgradeSnapshot().totalSpritcoreInvested;
  const dropQuantities = computingWorldPlazaSpritcoreDeathDropQuantities(
    carriedQuantity,
    committedQuantity
  );

  let carriedDropQuantity = 0;

  if (dropQuantities.carriedDropQuantity > 0) {
    const consumeResult = consumingWorldPlazaSpritcoreInventoryQuantity(
      inventoryState,
      dropQuantities.carriedDropQuantity
    );

    if (consumeResult.consumed) {
      carriedDropQuantity = dropQuantities.carriedDropQuantity;
      onInventoryStateChange(consumeResult.nextState);
    }
  }

  const committedDropQuantity =
    applyingWorldPlazaSpritcoreDeathCommittedPenalty();
  const totalDropQuantity = carriedDropQuantity + committedDropQuantity;

  if (totalDropQuantity <= 0) {
    return {
      carriedDropQuantity,
      committedDropQuantity,
      totalDropQuantity: 0,
      groundDropOutcome: 'none',
    };
  }

  const groundDrop = await droppingWorldPlazaPlayerDeathSpritcoreGroundItem({
    localPersistenceOwnerId,
    redditUserId,
    saveSlotIndex,
    quantity: totalDropQuantity,
    deathPosition,
  });

  return {
    carriedDropQuantity,
    committedDropQuantity,
    totalDropQuantity,
    groundDropOutcome: groundDrop.outcome,
  };
}
