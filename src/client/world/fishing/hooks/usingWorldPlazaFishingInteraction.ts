'use client';

import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import { addingInventoryItemWithStacking } from '@/components/inventory/domains/reducingInventoryState';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { recordingWorldPlazaBestiarySpeciesSighted } from '@/components/world/domains/managingWorldPlazaBestiaryDiscoveryStore';
import { checkingWorldPlazaFishingCastEligibility } from '@/components/world/fishing/domains/checkingWorldPlazaFishingCastEligibility';
import { rollingWorldPlazaFishingCatchEscaped } from '@/components/world/fishing/domains/computingWorldPlazaFishingCatchEscapeChance';
import type { DefiningWorldPlazaFishingCastSessionContext } from '@/components/world/fishing/domains/definingWorldPlazaFishingCastSessionContext';
import { DEFINING_WORLD_PLAZA_FISHING_CATCH_QUANTITY } from '@/components/world/fishing/domains/definingWorldPlazaFishingConstants';
import type { EnqueueingWorldPlazaFishingCatchRarityFloat } from '@/components/world/fishing/domains/enqueueingWorldPlazaFishingCatchRarityFloatFeedback';
import { enqueueingWorldPlazaFishingCatchRarityFloatFeedback } from '@/components/world/fishing/domains/enqueueingWorldPlazaFishingCatchRarityFloatFeedback';
import type { ListingWorldPlazaFishingTilesInInteractionRangeEntry } from '@/components/world/fishing/domains/listingWorldPlazaFishingTilesInInteractionRange';
import { resettingWorldPlazaFishingReelCastState } from '@/components/world/fishing/domains/managingWorldPlazaFishingReelCastState';
import { playingWorldPlazaFishingSfx } from '@/components/world/fishing/domains/playingWorldPlazaFishingSfx';
import { resolvingWorldPlazaFishingCatchGrant } from '@/components/world/fishing/domains/resolvingWorldPlazaFishingCatchRoll';
import { resolvingWorldPlazaFishingCatchSpritcoreDrop } from '@/components/world/fishing/domains/resolvingWorldPlazaFishingCatchSpritcoreDrop';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypes';
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
  readonly resolvingEquippedFishrodCatchEscapeChance: () => number;
  readonly showingGameplayHudToast: (message: string) => void;
  /** Fired when a creature catch records a Bestiary sighting. */
  readonly onWildlifeSpeciesSighted?: () => void;
  /** Rising rarity float above the player (landed or escaped). */
  readonly enqueueFishingCatchRarityFloat?: EnqueueingWorldPlazaFishingCatchRarityFloat;
};

export type UsingWorldPlazaFishingInteractionResult = {
  readonly validatingFishingCastStart: (
    entry: ListingWorldPlazaFishingTilesInInteractionRangeEntry
  ) => boolean;
  readonly completingFishingCast: (
    session: DefiningWorldPlazaFishingCastSessionContext
  ) => void;
};

/**
 * Validates and completes fishing casts after the progress ring finishes.
 */
export function usingWorldPlazaFishingInteraction({
  playerPositionRef,
  updatingInventoryState,
  selectedSlotIndex,
  resolvingEquippedFishrodCatchEscapeChance,
  showingGameplayHudToast,
  onWildlifeSpeciesSighted,
  enqueueFishingCatchRarityFloat,
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
    (session: DefiningWorldPlazaFishingCastSessionContext): void => {
      try {
        const playerPosition = playerPositionRef.current;

        if (!playerPosition) {
          return;
        }

        const eligibility = checkingWorldPlazaFishingCastEligibility(
          playerPosition,
          session.tileX,
          session.tileY
        );

        if (!eligibility.isEligible) {
          return;
        }

        const catchEntry = session.pendingCatch;
        const grant = resolvingWorldPlazaFishingCatchGrant(catchEntry);
        const spritcoreDrop =
          resolvingWorldPlazaFishingCatchSpritcoreDrop(catchEntry);
        const didCreatureEscape =
          catchEntry.kind === 'creature' &&
          rollingWorldPlazaFishingCatchEscaped(
            resolvingEquippedFishrodCatchEscapeChance()
          );

        let didBreak = false;
        let quantityAccepted = 0;
        let spritcoreAccepted = 0;
        let wasInventoryFull = false;

        if (didCreatureEscape) {
          updatingInventoryState((currentState) => {
            const wearResult = wearingWorldPlazaEquippedInventoryToolDurability(
              currentState,
              selectedSlotIndex,
              'fishrod'
            );

            didBreak = wearResult.broken;
            return wearResult.nextState;
          });

          if (enqueueFishingCatchRarityFloat) {
            enqueueingWorldPlazaFishingCatchRarityFloatFeedback(
              enqueueFishingCatchRarityFloat,
              catchEntry.rarity,
              { escaped: true }
            );
          }

          if (didBreak) {
            showingGameplayHudToast('Your fishing rod broke.');
          } else {
            showingGameplayHudToast('It got away.');
          }

          return;
        }

        updatingInventoryState((currentState) => {
          const wearResult = wearingWorldPlazaEquippedInventoryToolDurability(
            currentState,
            selectedSlotIndex,
            'fishrod'
          );

          const withCatch = addingInventoryItemWithStacking(
            wearResult.nextState,
            {
              id: `fishing-catch-${catchEntry.catchId}-${session.tileX}-${session.tileY}`,
              itemTypeId: grant.itemTypeId,
              quantity: DEFINING_WORLD_PLAZA_FISHING_CATCH_QUANTITY,
            },
            DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
          );

          if (withCatch.quantityOverflow > 0) {
            wasInventoryFull = true;
            return null;
          }

          let nextState = withCatch.state;

          if (spritcoreDrop) {
            const withSpritcore = addingInventoryItemWithStacking(
              nextState,
              {
                id: `fishing-spritcore-${catchEntry.catchId}-${session.tileX}-${session.tileY}`,
                itemTypeId: spritcoreDrop.itemTypeId,
                quantity: spritcoreDrop.amount,
              },
              DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
            );

            // Fish still lands even if Spritcore cannot fit; keep the catch.
            if (withSpritcore.quantityOverflow === 0) {
              nextState = withSpritcore.state;
              spritcoreAccepted = withSpritcore.quantityAccepted;
            }
          }

          didBreak = wearResult.broken;
          quantityAccepted = withCatch.quantityAccepted;
          return nextState;
        });

        if (wasInventoryFull) {
          showingGameplayHudToast('Inventory is full.');
          return;
        }

        if (quantityAccepted > 0) {
          playingWorldPlazaFishingSfx({
            actionId: 'catch',
            catchEntry,
          });

          if (enqueueFishingCatchRarityFloat) {
            enqueueingWorldPlazaFishingCatchRarityFloatFeedback(
              enqueueFishingCatchRarityFloat,
              catchEntry.rarity
            );
          }

          if (catchEntry.kind === 'creature') {
            recordingWorldPlazaBestiarySpeciesSighted(catchEntry.catchId);
            onWildlifeSpeciesSighted?.();
          }
        }

        if (didBreak) {
          showingGameplayHudToast('Your fishing rod broke.');
        } else if (catchEntry.kind === 'junk') {
          showingGameplayHudToast(`Fished up ${grant.displayName}.`);
        } else if (spritcoreAccepted > 0) {
          showingGameplayHudToast(
            `Caught ${grant.displayName} (+${spritcoreAccepted} Spritcore).`
          );
        } else {
          showingGameplayHudToast(`Caught ${grant.displayName}.`);
        }
      } finally {
        resettingWorldPlazaFishingReelCastState();
      }
    },
    [
      enqueueFishingCatchRarityFloat,
      onWildlifeSpeciesSighted,
      playerPositionRef,
      resolvingEquippedFishrodCatchEscapeChance,
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
