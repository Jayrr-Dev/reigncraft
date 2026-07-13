'use client';

import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import { addingInventoryItemWithStacking } from '@/components/inventory/domains/reducingInventoryState';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { checkingWorldPlazaFarmingTillEligibility } from '@/components/world/farming/domains/checkingWorldPlazaFarmingTillEligibility';
import {
  DEFINING_WORLD_PLAZA_CROP_REGISTRY,
  DEFINING_WORLD_PLAZA_CROP_WHEAT_ID,
} from '@/components/world/farming/domains/definingWorldPlazaCropRegistry';
import type { ListingWorldPlazaFarmlandTilesInInteractionRangeEntry } from '@/components/world/farming/domains/listingWorldPlazaFarmlandTilesInInteractionRange';
import {
  formattingWorldPlazaFarmlandTileKey,
  readingWorldPlazaLocalFarmlandByTileKey,
  writingWorldPlazaLocalFarmlandTileState,
} from '@/components/world/farming/domains/managingWorldPlazaLocalFarmland';
import { consumingWorldPlazaInventoryItemByType } from '@/components/world/inventory/domains/consumingWorldPlazaInventoryItemByType';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WHEAT_SEED } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypes';
import { notifyingWorldPlazaInventoryItemAdded } from '@/components/world/inventory/domains/notifyingWorldPlazaInventoryItemAdded';
import { wearingWorldPlazaEquippedInventoryToolDurability } from '@/components/world/inventory/domains/wearingWorldPlazaEquippedInventoryToolDurability';
import { useCallback } from 'react';

export type UpdatingWorldPlazaFarmingInventoryState = (
  updater: (
    currentState: DefiningInventoryState
  ) => DefiningInventoryState | null
) => void;

export type UsingWorldPlazaFarmingInteractionParams = {
  readonly persistenceOwnerId: string | null;
  readonly playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>;
  readonly inventoryState: DefiningInventoryState;
  readonly updatingInventoryState: UpdatingWorldPlazaFarmingInventoryState;
  readonly selectedSlotIndex: number | null;
  readonly showingGameplayHudToast: (message: string) => void;
  readonly onFarmlandStateChanged?: () => void;
};

export type UsingWorldPlazaFarmingInteractionResult = {
  readonly validatingFarmingActionStart: (
    entry: ListingWorldPlazaFarmlandTilesInInteractionRangeEntry
  ) => boolean;
  readonly completingFarmingAction: (
    entry: ListingWorldPlazaFarmlandTilesInInteractionRangeEntry
  ) => void;
};

/**
 * Validates and completes till, plant, and harvest farmland actions.
 */
export function usingWorldPlazaFarmingInteraction({
  persistenceOwnerId,
  playerPositionRef,
  inventoryState,
  updatingInventoryState,
  selectedSlotIndex,
  showingGameplayHudToast,
  onFarmlandStateChanged,
}: UsingWorldPlazaFarmingInteractionParams): UsingWorldPlazaFarmingInteractionResult {
  const validatingFarmingActionStart = useCallback(
    (entry: ListingWorldPlazaFarmlandTilesInInteractionRangeEntry): boolean => {
      if (!persistenceOwnerId) {
        showingGameplayHudToast('Farming is unavailable in this session.');
        return false;
      }

      const playerPosition = playerPositionRef.current;

      if (!playerPosition) {
        return false;
      }

      if (entry.interactionKind === 'till') {
        const farmland =
          readingWorldPlazaLocalFarmlandByTileKey(persistenceOwnerId);
        const tileKey = formattingWorldPlazaFarmlandTileKey(
          entry.tileX,
          entry.tileY
        );
        const eligibility = checkingWorldPlazaFarmingTillEligibility(
          playerPosition,
          entry.tileX,
          entry.tileY,
          farmland.get(tileKey)
        );

        if (!eligibility.isEligible) {
          if (eligibility.reason) {
            showingGameplayHudToast(eligibility.reason);
          }

          return false;
        }

        return true;
      }

      if (entry.interactionKind === 'plant') {
        const totalSeeds = inventoryState.slots.reduce(
          (total, slot) =>
            slot !== null &&
            slot.itemTypeId ===
              DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WHEAT_SEED
              ? total + slot.quantity
              : total,
          0
        );

        if (totalSeeds < 1) {
          showingGameplayHudToast('You need wheat seeds.');
          return false;
        }

        return true;
      }

      return entry.tileState?.phase === 'mature';
    },
    [
      inventoryState,
      persistenceOwnerId,
      playerPositionRef,
      showingGameplayHudToast,
    ]
  );

  const completingFarmingAction = useCallback(
    (entry: ListingWorldPlazaFarmlandTilesInInteractionRangeEntry): void => {
      if (!persistenceOwnerId) {
        return;
      }

      const nowMs = performance.now();
      const crop =
        DEFINING_WORLD_PLAZA_CROP_REGISTRY[DEFINING_WORLD_PLAZA_CROP_WHEAT_ID];

      if (entry.interactionKind === 'till') {
        let didBreak = false;

        updatingInventoryState((currentState) => {
          const wearResult = wearingWorldPlazaEquippedInventoryToolDurability(
            currentState,
            selectedSlotIndex,
            'hoe'
          );

          if (!wearResult.applied) {
            return null;
          }

          didBreak = wearResult.broken;
          return wearResult.nextState;
        });

        writingWorldPlazaLocalFarmlandTileState(
          persistenceOwnerId,
          entry.tileX,
          entry.tileY,
          {
            phase: 'tilled',
            cropId: DEFINING_WORLD_PLAZA_CROP_WHEAT_ID,
            phaseStartedAtMs: nowMs,
          }
        );

        onFarmlandStateChanged?.();

        if (didBreak) {
          showingGameplayHudToast('Your hoe broke.');
        } else {
          showingGameplayHudToast('Soil tilled.');
        }

        return;
      }

      if (entry.interactionKind === 'plant') {
        let didConsume = false;

        updatingInventoryState((currentState) => {
          const consumeSeed = consumingWorldPlazaInventoryItemByType(
            currentState,
            DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WHEAT_SEED,
            1
          );

          if (!consumeSeed.consumed) {
            return null;
          }

          didConsume = true;
          return consumeSeed.nextState;
        });

        if (!didConsume) {
          showingGameplayHudToast('You need wheat seeds.');
          return;
        }

        writingWorldPlazaLocalFarmlandTileState(
          persistenceOwnerId,
          entry.tileX,
          entry.tileY,
          {
            phase: 'planted',
            cropId: DEFINING_WORLD_PLAZA_CROP_WHEAT_ID,
            phaseStartedAtMs: nowMs,
          }
        );

        onFarmlandStateChanged?.();
        showingGameplayHudToast('Seeds planted.');
        return;
      }

      if (entry.interactionKind === 'harvest' && crop) {
        let didBreak = false;
        let quantityAccepted = 0;
        let wasInventoryFull = false;

        updatingInventoryState((currentState) => {
          const wearResult = wearingWorldPlazaEquippedInventoryToolDurability(
            currentState,
            selectedSlotIndex,
            'scythe'
          );

          const withHarvest = addingInventoryItemWithStacking(
            wearResult.nextState,
            {
              id: `farming-harvest-${entry.tileX}-${entry.tileY}`,
              itemTypeId: crop.harvestItemTypeId,
              quantity: crop.harvestQuantity,
            },
            DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
          );

          if (withHarvest.quantityOverflow > 0) {
            wasInventoryFull = true;
            return null;
          }

          didBreak = wearResult.broken;
          quantityAccepted = withHarvest.quantityAccepted;
          return withHarvest.state;
        });

        if (wasInventoryFull) {
          showingGameplayHudToast('Inventory is full.');
          return;
        }

        writingWorldPlazaLocalFarmlandTileState(
          persistenceOwnerId,
          entry.tileX,
          entry.tileY,
          null
        );

        if (quantityAccepted > 0) {
          notifyingWorldPlazaInventoryItemAdded(quantityAccepted);
        }

        onFarmlandStateChanged?.();

        if (didBreak) {
          showingGameplayHudToast('Your scythe broke.');
        } else {
          showingGameplayHudToast('Crop harvested.');
        }
      }
    },
    [
      onFarmlandStateChanged,
      persistenceOwnerId,
      selectedSlotIndex,
      showingGameplayHudToast,
      updatingInventoryState,
    ]
  );

  return {
    validatingFarmingActionStart,
    completingFarmingAction,
  };
}
