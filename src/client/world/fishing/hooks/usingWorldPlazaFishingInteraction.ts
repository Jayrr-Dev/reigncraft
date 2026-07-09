'use client';

import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import { addingInventoryItemWithStacking } from '@/components/inventory/domains/reducingInventoryState';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { checkingWorldPlazaFishingCastEligibility } from '@/components/world/fishing/domains/checkingWorldPlazaFishingCastEligibility';
import { DEFINING_WORLD_PLAZA_FISHING_CATCH_QUANTITY } from '@/components/world/fishing/domains/definingWorldPlazaFishingConstants';
import type { ListingWorldPlazaFishingTilesInInteractionRangeEntry } from '@/components/world/fishing/domains/listingWorldPlazaFishingTilesInInteractionRange';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FISH } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypes';
import { wearingWorldPlazaEquippedInventoryToolDurability } from '@/components/world/inventory/domains/wearingWorldPlazaEquippedInventoryToolDurability';
import { useCallback, type RefObject } from 'react';

export type UsingWorldPlazaFishingInteractionParams = {
  readonly playerPositionRef: RefObject<DefiningWorldPlazaWorldPoint>;
  readonly inventoryState: DefiningInventoryState;
  readonly updatingInventoryState: (next: DefiningInventoryState) => void;
  readonly selectedSlotIndex: number | null;
  readonly showingGameplayHudToast: (message: string) => void;
};

export type UsingWorldPlazaFishingInteractionResult = {
  readonly validatingFishingCastStart: (
    entry: ListingWorldPlazaFishingTilesInInteractionRangeEntry
  ) => boolean;
  readonly completingFishingCast: (
    entry: ListingWorldPlazaFishingTilesInInteractionRangeEntry
  ) => void;
};

/**
 * Validates and completes fishing casts after the progress ring finishes.
 */
export function usingWorldPlazaFishingInteraction({
  playerPositionRef,
  inventoryState,
  updatingInventoryState,
  selectedSlotIndex,
  showingGameplayHudToast,
}: UsingWorldPlazaFishingInteractionParams): UsingWorldPlazaFishingInteractionResult {
  const validatingFishingCastStart = useCallback(
    (entry: ListingWorldPlazaFishingTilesInInteractionRangeEntry): boolean => {
      const playerPosition = playerPositionRef.current;

      if (!playerPosition) {
        return false;
      }

      const eligibility = checkingWorldPlazaFishingCastEligibility(
        playerPosition,
        entry.tileX,
        entry.tileY
      );

      if (!eligibility.isEligible) {
        if (eligibility.reason) {
          showingGameplayHudToast(eligibility.reason);
        }

        return false;
      }

      return true;
    },
    [playerPositionRef, showingGameplayHudToast]
  );

  const completingFishingCast = useCallback(
    (entry: ListingWorldPlazaFishingTilesInInteractionRangeEntry): void => {
      const playerPosition = playerPositionRef.current;

      if (!playerPosition) {
        return;
      }

      const eligibility = checkingWorldPlazaFishingCastEligibility(
        playerPosition,
        entry.tileX,
        entry.tileY
      );

      if (!eligibility.isEligible) {
        return;
      }

      const wearResult = wearingWorldPlazaEquippedInventoryToolDurability(
        inventoryState,
        selectedSlotIndex,
        'fishrod'
      );

      const withFish = addingInventoryItemWithStacking(
        wearResult.nextState,
        {
          id: `fishing-catch-${entry.tileX}-${entry.tileY}`,
          itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FISH,
          quantity: DEFINING_WORLD_PLAZA_FISHING_CATCH_QUANTITY,
        },
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
      );

      if (withFish.quantityOverflow > 0) {
        showingGameplayHudToast('Inventory is full.');
        return;
      }

      updatingInventoryState(withFish.state);

      if (wearResult.broken) {
        showingGameplayHudToast('Your fishing rod broke.');
      } else {
        showingGameplayHudToast('Caught a fish.');
      }
    },
    [
      inventoryState,
      playerPositionRef,
      selectedSlotIndex,
      showingGameplayHudToast,
      updatingInventoryState,
    ]
  );

  return {
    validatingFishingCastStart,
    completingFishingCast,
  };
}
