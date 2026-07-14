'use client';

import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { notifyingWorldPlazaInventoryItemAdded } from '@/components/world/inventory/domains/notifyingWorldPlazaInventoryItemAdded';
import { checkingWorldPlazaWetClayEligibility } from '@/components/world/wet-clay/domains/checkingWorldPlazaWetClayEligibility';
import type { ListingWorldPlazaWetClayTilesInInteractionRangeEntry } from '@/components/world/wet-clay/domains/listingWorldPlazaWetClayTilesInInteractionRange';
import {
  checkingWorldPlazaInventoryHasClay,
  wettingWorldPlazaClayInInventory,
} from '@/components/world/wet-clay/domains/wettingWorldPlazaClayInInventory';
import { useCallback, type RefObject } from 'react';

export type UpdatingWorldPlazaWetClayInventoryState = (
  updater: (
    currentState: DefiningInventoryState
  ) => DefiningInventoryState | null
) => void;

export type UsingWorldPlazaWetClayInteractionParams = {
  readonly playerPositionRef: RefObject<DefiningWorldPlazaWorldPoint>;
  readonly inventoryState: DefiningInventoryState;
  readonly updatingInventoryState: UpdatingWorldPlazaWetClayInventoryState;
  readonly showingGameplayHudToast: (message: string) => void;
  /**
   * Kept in sync on complete so queued wet repeats see clay left immediately
   * (before the next React render).
   */
  readonly hasClayInInventoryRef: RefObject<boolean>;
};

export type UsingWorldPlazaWetClayInteractionResult = {
  readonly validatingWetClayStart: (
    entry: ListingWorldPlazaWetClayTilesInInteractionRangeEntry
  ) => boolean;
  readonly completingWetClay: (
    entry: ListingWorldPlazaWetClayTilesInInteractionRangeEntry
  ) => void;
};

/**
 * Validates and completes clay wetting after the progress ring finishes.
 */
export function usingWorldPlazaWetClayInteraction({
  playerPositionRef,
  inventoryState,
  updatingInventoryState,
  showingGameplayHudToast,
  hasClayInInventoryRef,
}: UsingWorldPlazaWetClayInteractionParams): UsingWorldPlazaWetClayInteractionResult {
  const validatingWetClayStart = useCallback(
    (entry: ListingWorldPlazaWetClayTilesInInteractionRangeEntry): boolean => {
      const playerPosition = playerPositionRef.current;

      if (!playerPosition) {
        return false;
      }

      if (!checkingWorldPlazaInventoryHasClay(inventoryState)) {
        showingGameplayHudToast('Need clay to wet.');
        return false;
      }

      const eligibility = checkingWorldPlazaWetClayEligibility(
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
    [inventoryState, playerPositionRef, showingGameplayHudToast]
  );

  const completingWetClay = useCallback(
    (entry: ListingWorldPlazaWetClayTilesInInteractionRangeEntry): void => {
      const playerPosition = playerPositionRef.current;

      if (!playerPosition) {
        return;
      }

      const eligibility = checkingWorldPlazaWetClayEligibility(
        playerPosition,
        entry.tileX,
        entry.tileY
      );

      if (!eligibility.isEligible) {
        return;
      }

      let outcome: 'wetted' | 'no-clay' | 'inventory-full' | null = null;

      updatingInventoryState((currentState) => {
        const result = wettingWorldPlazaClayInInventory(currentState);
        outcome = result.outcome;

        if (result.outcome === 'wetted') {
          hasClayInInventoryRef.current = checkingWorldPlazaInventoryHasClay(
            result.nextState
          );
          return result.nextState;
        }

        if (result.outcome === 'no-clay') {
          hasClayInInventoryRef.current = false;
        }

        return null;
      });

      if (outcome === 'wetted') {
        notifyingWorldPlazaInventoryItemAdded(1);
        showingGameplayHudToast('Wet clay ready.');
        return;
      }

      if (outcome === 'inventory-full') {
        showingGameplayHudToast('Inventory is full.');
        return;
      }

      if (outcome === 'no-clay') {
        showingGameplayHudToast('Need clay to wet.');
      }
    },
    [
      hasClayInInventoryRef,
      playerPositionRef,
      showingGameplayHudToast,
      updatingInventoryState,
    ]
  );

  return {
    validatingWetClayStart,
    completingWetClay,
  };
}
