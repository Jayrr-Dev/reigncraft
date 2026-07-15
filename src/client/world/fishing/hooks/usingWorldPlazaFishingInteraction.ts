'use client';

import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import { addingInventoryItemWithStacking } from '@/components/inventory/domains/reducingInventoryState';
import { resolvingWorldPlazaBiomeAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaBiomeAtTileIndex';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaWaterAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaWaterAtTileIndex';
import { checkingWorldPlazaFishingCastEligibility } from '@/components/world/fishing/domains/checkingWorldPlazaFishingCastEligibility';
import { DEFINING_WORLD_PLAZA_FISHING_CATCH_QUANTITY } from '@/components/world/fishing/domains/definingWorldPlazaFishingConstants';
import type { ListingWorldPlazaFishingTilesInInteractionRangeEntry } from '@/components/world/fishing/domains/listingWorldPlazaFishingTilesInInteractionRange';
import {
  resolvingWorldPlazaFishingCatchGrant,
  resolvingWorldPlazaFishingCatchRoll,
} from '@/components/world/fishing/domains/resolvingWorldPlazaFishingCatchRoll';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypes';
import { notifyingWorldPlazaInventoryItemAdded } from '@/components/world/inventory/domains/notifyingWorldPlazaInventoryItemAdded';
import { wearingWorldPlazaEquippedInventoryToolDurability } from '@/components/world/inventory/domains/wearingWorldPlazaEquippedInventoryToolDurability';
import { useCallback, type RefObject } from 'react';

export type UpdatingWorldPlazaFishingInventoryState = (
  updater: (
    currentState: DefiningInventoryState
  ) => DefiningInventoryState | null
) => void;

export type UsingWorldPlazaFishingInteractionParams = {
  readonly playerPositionRef: RefObject<DefiningWorldPlazaWorldPoint>;
  readonly updatingInventoryState: UpdatingWorldPlazaFishingInventoryState;
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

      const waterTile = resolvingWorldPlazaWaterAtTileIndex(
        entry.tileX,
        entry.tileY
      );

      if (!waterTile) {
        return;
      }

      const biomeKind = resolvingWorldPlazaBiomeAtTileIndex(
        entry.tileX,
        entry.tileY
      ).kind;

      const catchEntry = resolvingWorldPlazaFishingCatchRoll({
        waterKind: waterTile.kind,
        biomeKind,
      });

      if (!catchEntry) {
        showingGameplayHudToast('Nothing bites.');
        return;
      }

      const grant = resolvingWorldPlazaFishingCatchGrant(catchEntry);

      let didBreak = false;
      let quantityAccepted = 0;
      let wasInventoryFull = false;

      updatingInventoryState((currentState) => {
        const wearResult = wearingWorldPlazaEquippedInventoryToolDurability(
          currentState,
          selectedSlotIndex,
          'fishrod'
        );

        const withCatch = addingInventoryItemWithStacking(
          wearResult.nextState,
          {
            id: `fishing-catch-${catchEntry.catchId}-${entry.tileX}-${entry.tileY}`,
            itemTypeId: grant.itemTypeId,
            quantity: DEFINING_WORLD_PLAZA_FISHING_CATCH_QUANTITY,
          },
          DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
        );

        if (withCatch.quantityOverflow > 0) {
          wasInventoryFull = true;
          return null;
        }

        didBreak = wearResult.broken;
        quantityAccepted = withCatch.quantityAccepted;
        return withCatch.state;
      });

      if (wasInventoryFull) {
        showingGameplayHudToast('Inventory is full.');
        return;
      }

      if (quantityAccepted > 0) {
        notifyingWorldPlazaInventoryItemAdded(quantityAccepted);
      }

      if (didBreak) {
        showingGameplayHudToast('Your fishing rod broke.');
      } else if (catchEntry.kind === 'junk') {
        showingGameplayHudToast(`Fished up ${grant.displayName}.`);
      } else {
        showingGameplayHudToast(`Caught ${grant.displayName}.`);
      }
    },
    [
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
