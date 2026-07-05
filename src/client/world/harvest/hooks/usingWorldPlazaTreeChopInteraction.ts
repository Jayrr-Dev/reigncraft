'use client';

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import type { CheckingWorldPlazaEquippedSlotHasToolKindResult } from '@/components/world/equipment/domains/checkingWorldPlazaEquippedSlotHasToolKind';
import { droppingWorldPlazaTreeChopWoodGroundItem } from '@/components/world/harvest/domains/droppingWorldPlazaTreeChopWoodGroundItem';
import type { ListingWorldPlazaTreesInInteractionRangeEntry } from '@/components/world/harvest/domains/listingWorldPlazaTreesInInteractionRange';
import type { DefiningWorldPlazaChoppedTreeTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalChoppedTrees';
import {
  checkingWorldPlazaTreeChopLayerEligibility,
  choppingWorldPlazaLocalTreeLayer,
  formattingWorldPlazaChoppedTreeTileKey,
} from '@/components/world/harvest/domains/managingWorldPlazaLocalChoppedTrees';
import {
  checkingWorldPlazaChoppedTreesUseLocalPersistence,
  DEFINING_WORLD_PLAZA_CHOPPED_TREES_QUERY_KEY_ROOT,
} from '@/components/world/harvest/hooks/usingWorldPlazaChoppedTrees';
import { choppingWorldHarvestDevvitTreeLayer } from '@/components/world/harvest/repositories/callingWorldHarvestDevvitApi';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useRef, type RefObject } from 'react';
import type { PlazaSaveSlotIndex } from '../../../../shared/plazaGameSession';
import { WORLD_HARVEST_DEVVIT_CHOP_TREE_API_PATH } from '../../../../shared/worldHarvestDevvit';

export type UsingWorldPlazaTreeChopInteractionParams = {
  readonly localPersistenceOwnerId: string | null;
  readonly redditUserId: string | null;
  readonly saveSlotIndex: PlazaSaveSlotIndex | null;
  readonly choppedTreeStateByTileKey: ReadonlyMap<
    string,
    DefiningWorldPlazaChoppedTreeTileState
  >;
  readonly playerPositionRef: RefObject<DefiningWorldPlazaWorldPoint>;
  readonly checkingEquippedToolKind: (
    toolKind: 'axe'
  ) => CheckingWorldPlazaEquippedSlotHasToolKindResult;
  readonly showingGameplayHudToast: (message: string) => void;
};

export type UsingWorldPlazaTreeChopInteractionResult = {
  readonly validatingTreeChopStart: (
    entry: ListingWorldPlazaTreesInInteractionRangeEntry
  ) => boolean;
  readonly completingTreeChopLayer: (
    entry: ListingWorldPlazaTreesInInteractionRangeEntry
  ) => Promise<void>;
};

/**
 * Validates and completes tree chops after the progress indicator finishes.
 */
export function usingWorldPlazaTreeChopInteraction({
  localPersistenceOwnerId,
  redditUserId,
  saveSlotIndex,
  choppedTreeStateByTileKey,
  playerPositionRef,
  checkingEquippedToolKind,
  showingGameplayHudToast,
}: UsingWorldPlazaTreeChopInteractionParams): UsingWorldPlazaTreeChopInteractionResult {
  const queryClient = useQueryClient();
  const isCompletionPendingRef = useRef(false);
  const useLocalPersistence = checkingWorldPlazaChoppedTreesUseLocalPersistence(
    localPersistenceOwnerId,
    redditUserId
  );
  const persistenceOwnerId = useLocalPersistence
    ? localPersistenceOwnerId
    : redditUserId;

  const validatingTreeChopStart = useCallback(
    (entry: ListingWorldPlazaTreesInInteractionRangeEntry): boolean => {
      const equipment = checkingEquippedToolKind('axe');

      if (!equipment.hasToolKind) {
        showingGameplayHudToast('Equip an axe from your hotbar to chop trees.');
        return false;
      }

      if (!persistenceOwnerId) {
        showingGameplayHudToast(
          'Tree chopping is unavailable in this session.'
        );
        return false;
      }

      const playerPosition = playerPositionRef.current;

      if (!playerPosition) {
        return false;
      }

      const standingSurfaceLayer = entry.tree.standingSurfaceLayer ?? 1;
      const currentVisualLayer =
        entry.tree.visualSurfaceLayer ?? standingSurfaceLayer;
      const tileKey = formattingWorldPlazaChoppedTreeTileKey(
        entry.tileX,
        entry.tileY
      );

      const rangeCheck = checkingWorldPlazaTreeChopLayerEligibility({
        persistenceOwnerId,
        tileX: entry.tileX,
        tileY: entry.tileY,
        playerX: playerPosition.x,
        playerY: playerPosition.y,
        currentVisualLayer,
        standingSurfaceLayer,
        existingTileState: choppedTreeStateByTileKey.get(tileKey),
      });

      if (rangeCheck.outcome === 'out-of-range') {
        showingGameplayHudToast('Move closer to chop this tree.');
        return false;
      }

      if (rangeCheck.outcome === 'already-felled') {
        showingGameplayHudToast('This tree is already felled.');
        return false;
      }

      return true;
    },
    [
      checkingEquippedToolKind,
      choppedTreeStateByTileKey,
      persistenceOwnerId,
      playerPositionRef,
      showingGameplayHudToast,
    ]
  );

  const completingTreeChopLayer = useCallback(
    async (
      entry: ListingWorldPlazaTreesInInteractionRangeEntry
    ): Promise<void> => {
      if (isCompletionPendingRef.current || !persistenceOwnerId) {
        return;
      }

      const playerPosition = playerPositionRef.current;

      if (!playerPosition) {
        return;
      }

      isCompletionPendingRef.current = true;

      try {
        const standingSurfaceLayer = entry.tree.standingSurfaceLayer ?? 1;
        const currentVisualLayer =
          entry.tree.visualSurfaceLayer ?? standingSurfaceLayer;
        const chopRequest = {
          tileX: entry.tileX,
          tileY: entry.tileY,
          playerX: playerPosition.x,
          playerY: playerPosition.y,
          currentVisualLayer,
          standingSurfaceLayer,
        };

        const chopResult =
          useLocalPersistence && localPersistenceOwnerId
            ? choppingWorldPlazaLocalTreeLayer(
                localPersistenceOwnerId,
                chopRequest
              )
            : await choppingWorldHarvestDevvitTreeLayer(
                WORLD_HARVEST_DEVVIT_CHOP_TREE_API_PATH,
                {
                  ...chopRequest,
                  saveSlotIndex,
                }
              );

        if (chopResult.outcome !== 'chopped') {
          if (chopResult.outcome === 'out-of-range') {
            showingGameplayHudToast('Move closer to chop this tree.');
          } else if (chopResult.outcome === 'already-felled') {
            showingGameplayHudToast('This tree is already felled.');
          }

          return;
        }

        const dropResult = await droppingWorldPlazaTreeChopWoodGroundItem({
          localPersistenceOwnerId,
          redditUserId,
          saveSlotIndex,
          tileX: entry.tileX,
          tileY: entry.tileY,
          layer: standingSurfaceLayer,
          woodQuantity: chopResult.woodQuantity,
          playerPosition,
        });

        if (dropResult.outcome === 'failed') {
          showingGameplayHudToast('Could not drop wood from this tree.');
        }

        void queryClient.invalidateQueries({
          queryKey: [DEFINING_WORLD_PLAZA_CHOPPED_TREES_QUERY_KEY_ROOT],
        });
      } finally {
        isCompletionPendingRef.current = false;
      }
    },
    [
      localPersistenceOwnerId,
      persistenceOwnerId,
      playerPositionRef,
      queryClient,
      redditUserId,
      saveSlotIndex,
      showingGameplayHudToast,
      useLocalPersistence,
    ]
  );

  return {
    validatingTreeChopStart,
    completingTreeChopLayer,
  };
}
