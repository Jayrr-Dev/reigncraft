'use client';

import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { notifyingWorldPlazaInventoryItemAdded } from '@/components/world/inventory/domains/notifyingWorldPlazaInventoryItemAdded';
import { checkingWorldPlazaInventoryHasEmptyClayTeaPot } from '@/components/world/tea-brewing/domains/fillingWorldPlazaTeaPotWithWater';
import { fillingWorldPlazaTeaPotWithWater } from '@/components/world/tea-brewing/domains/fillingWorldPlazaTeaPotWithWater';
import { checkingWorldPlazaTeaPotAddWaterEligibility } from '@/components/world/tea-brewing/domains/checkingWorldPlazaTeaPotAddWaterEligibility';
import type { ListingWorldPlazaTeaPotAddWaterTilesInInteractionRangeEntry } from '@/components/world/tea-brewing/domains/listingWorldPlazaTeaPotAddWaterTilesInInteractionRange';
import { listingWorldPlazaTeaPotAddWaterTilesInInteractionRange } from '@/components/world/tea-brewing/domains/listingWorldPlazaTeaPotAddWaterTilesInInteractionRange';
import { useCallback, type RefObject } from 'react';

export type UpdatingWorldPlazaTeaPotAddWaterInventoryState = (
  updater: (
    currentState: DefiningInventoryState
  ) => DefiningInventoryState | null
) => void;

export type UsingWorldPlazaTeaPotAddWaterInteractionParams = {
  readonly playerPositionRef: RefObject<DefiningWorldPlazaWorldPoint>;
  readonly inventoryState: DefiningInventoryState;
  readonly updatingInventoryState: UpdatingWorldPlazaTeaPotAddWaterInventoryState;
  readonly showingGameplayHudToast: (message: string) => void;
  readonly hasEmptyTeaPotInInventoryRef: RefObject<boolean>;
};

export type UsingWorldPlazaTeaPotAddWaterInteractionResult = {
  readonly validatingTeaPotAddWaterStart: (
    entry: ListingWorldPlazaTeaPotAddWaterTilesInInteractionRangeEntry,
    preferredSlotIndex?: number
  ) => boolean;
  readonly completingTeaPotAddWater: (
    entry: ListingWorldPlazaTeaPotAddWaterTilesInInteractionRangeEntry,
    preferredSlotIndex?: number
  ) => void;
  readonly completingTeaPotAddWaterFromHotbarSlot: (
    preferredSlotIndex: number
  ) => void;
};

/**
 * Validates and completes empty teapot fills after shore interaction or hotbar action.
 */
export function usingWorldPlazaTeaPotAddWaterInteraction({
  playerPositionRef,
  inventoryState,
  updatingInventoryState,
  showingGameplayHudToast,
  hasEmptyTeaPotInInventoryRef,
}: UsingWorldPlazaTeaPotAddWaterInteractionParams): UsingWorldPlazaTeaPotAddWaterInteractionResult {
  const validatingTeaPotAddWaterStart = useCallback(
    (
      entry: ListingWorldPlazaTeaPotAddWaterTilesInInteractionRangeEntry,
      preferredSlotIndex?: number
    ): boolean => {
      const playerPosition = playerPositionRef.current;

      if (!playerPosition) {
        return false;
      }

      if (!checkingWorldPlazaInventoryHasEmptyClayTeaPot(inventoryState)) {
        showingGameplayHudToast('Need an empty clay teapot.');
        return false;
      }

      const eligibility = checkingWorldPlazaTeaPotAddWaterEligibility(
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

      const fillProbe = fillingWorldPlazaTeaPotWithWater(
        inventoryState,
        preferredSlotIndex
      );

      if (fillProbe.outcome === 'inventory-full') {
        showingGameplayHudToast('Inventory is full.');
        return false;
      }

      if (fillProbe.outcome === 'no-empty-teapot') {
        showingGameplayHudToast('Need an empty clay teapot.');
        return false;
      }

      return true;
    },
    [inventoryState, playerPositionRef, showingGameplayHudToast]
  );

  const completingTeaPotAddWater = useCallback(
    (
      entry: ListingWorldPlazaTeaPotAddWaterTilesInInteractionRangeEntry,
      preferredSlotIndex?: number
    ): void => {
      const playerPosition = playerPositionRef.current;

      if (!playerPosition) {
        return;
      }

      const eligibility = checkingWorldPlazaTeaPotAddWaterEligibility(
        playerPosition,
        entry.tileX,
        entry.tileY
      );

      if (!eligibility.isEligible) {
        return;
      }

      let outcome:
        | 'filled'
        | 'no-empty-teapot'
        | 'inventory-full'
        | null = null;

      updatingInventoryState((currentState) => {
        const result = fillingWorldPlazaTeaPotWithWater(
          currentState,
          preferredSlotIndex
        );
        outcome = result.outcome;

        if (result.outcome === 'filled') {
          hasEmptyTeaPotInInventoryRef.current =
            checkingWorldPlazaInventoryHasEmptyClayTeaPot(result.nextState);
          return result.nextState;
        }

        if (result.outcome === 'no-empty-teapot') {
          hasEmptyTeaPotInInventoryRef.current = false;
        }

        return null;
      });

      if (outcome === 'filled') {
        notifyingWorldPlazaInventoryItemAdded(1);
        showingGameplayHudToast('Teapot filled with water.');
        return;
      }

      if (outcome === 'inventory-full') {
        showingGameplayHudToast('Inventory is full.');
        return;
      }

      if (outcome === 'no-empty-teapot') {
        showingGameplayHudToast('Need an empty clay teapot.');
      }
    },
    [
      hasEmptyTeaPotInInventoryRef,
      playerPositionRef,
      showingGameplayHudToast,
      updatingInventoryState,
    ]
  );

  const completingTeaPotAddWaterFromHotbarSlot = useCallback(
    (preferredSlotIndex: number): void => {
      const playerPosition = playerPositionRef.current;

      if (!playerPosition) {
        showingGameplayHudToast('Move closer to the water.');
        return;
      }

      const eligibleTiles =
        listingWorldPlazaTeaPotAddWaterTilesInInteractionRange(playerPosition);

      if (eligibleTiles.length === 0) {
        showingGameplayHudToast('Move closer to the water.');
        return;
      }

      let outcome:
        | 'filled'
        | 'no-empty-teapot'
        | 'inventory-full'
        | null = null;

      updatingInventoryState((currentState) => {
        const result = fillingWorldPlazaTeaPotWithWater(
          currentState,
          preferredSlotIndex
        );
        outcome = result.outcome;

        if (result.outcome === 'filled') {
          hasEmptyTeaPotInInventoryRef.current =
            checkingWorldPlazaInventoryHasEmptyClayTeaPot(result.nextState);
          return result.nextState;
        }

        if (result.outcome === 'no-empty-teapot') {
          hasEmptyTeaPotInInventoryRef.current = false;
        }

        return null;
      });

      if (outcome === 'filled') {
        notifyingWorldPlazaInventoryItemAdded(1);
        showingGameplayHudToast('Teapot filled with water.');
        return;
      }

      if (outcome === 'inventory-full') {
        showingGameplayHudToast('Inventory is full.');
        return;
      }

      if (outcome === 'no-empty-teapot') {
        showingGameplayHudToast('Need an empty clay teapot.');
      }
    },
    [
      hasEmptyTeaPotInInventoryRef,
      playerPositionRef,
      showingGameplayHudToast,
      updatingInventoryState,
    ]
  );

  return {
    validatingTeaPotAddWaterStart,
    completingTeaPotAddWater,
    completingTeaPotAddWaterFromHotbarSlot,
  };
}
