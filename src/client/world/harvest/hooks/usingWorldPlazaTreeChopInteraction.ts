'use client';

import { droppingWorldPlazaRecipePageLootGroundItem } from '@/components/world/crafting/domains/droppingWorldPlazaRecipePageLootGroundItem';
import {
  resolvingWorldPlazaRecipePageLootDrop,
  resolvingWorldPlazaRecipePageLootExcludedAttachedRecipeIds,
} from '@/components/world/crafting/domains/resolvingWorldPlazaRecipePageLootDrop';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { droppingWorldPlazaTreeChopGroundItem } from '@/components/world/harvest/domains/droppingWorldPlazaTreeChopWoodGroundItem';
import type { ListingWorldPlazaTreesInInteractionRangeEntry } from '@/components/world/harvest/domains/listingWorldPlazaTreesInInteractionRange';
import type { DefiningWorldPlazaChoppedTreeTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalChoppedTrees';
import {
  checkingWorldPlazaTreeChopLayerEligibility,
  choppingWorldPlazaLocalTreeLayer,
  formattingWorldPlazaChoppedTreeTileKey,
} from '@/components/world/harvest/domains/managingWorldPlazaLocalChoppedTrees';
import { resolvingWorldPlazaTreeChopBonusDrop } from '@/components/world/harvest/domains/resolvingWorldPlazaTreeChopBonusDrop';
import {
  checkingWorldPlazaChoppedTreesUseLocalPersistence,
  DEFINING_WORLD_PLAZA_CHOPPED_TREES_QUERY_KEY_ROOT,
} from '@/components/world/harvest/hooks/usingWorldPlazaChoppedTrees';
import { choppingWorldHarvestDevvitTreeLayer } from '@/components/world/harvest/repositories/callingWorldHarvestDevvitApi';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useRef, type RefObject } from 'react';
import type { PlazaSaveSlotIndex } from '../../../../shared/plazaGameSession';
import { WORLD_HARVEST_DEVVIT_CHOP_TREE_API_PATH } from '../../../../shared/worldHarvestDevvit';
import {
  resolvingWorldToolHarvestSwingYield,
  type WorldToolHarvestTier,
} from '../../../../shared/worldToolHarvestYield';

export type UsingWorldPlazaTreeChopInteractionParams = {
  readonly localPersistenceOwnerId: string | null;
  readonly redditUserId: string | null;
  readonly saveSlotIndex: PlazaSaveSlotIndex | null;
  readonly choppedTreeStateByTileKey: ReadonlyMap<
    string,
    DefiningWorldPlazaChoppedTreeTileState
  >;
  readonly playerPositionRef: RefObject<DefiningWorldPlazaWorldPoint>;
  readonly showingGameplayHudToast: (message: string) => void;
  /** Equipped axe tier; missing → wood baseline yield. */
  readonly resolvingHarvestToolTier?: () => WorldToolHarvestTier | null;
  /** Called after a tree layer is successfully chopped. */
  readonly onTreeChopLayerSucceeded?: () => void;
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
  showingGameplayHudToast,
  resolvingHarvestToolTier,
  onTreeChopLayerSucceeded,
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
        const toolTier = resolvingHarvestToolTier?.() ?? null;
        const baseChopRequest = {
          tileX: entry.tileX,
          tileY: entry.tileY,
          playerX: playerPosition.x,
          playerY: playerPosition.y,
          currentVisualLayer,
          standingSurfaceLayer,
        };

        const chopResult =
          useLocalPersistence && localPersistenceOwnerId
            ? choppingWorldPlazaLocalTreeLayer(localPersistenceOwnerId, {
                ...baseChopRequest,
                ...resolvingWorldToolHarvestSwingYield(toolTier),
              })
            : await choppingWorldHarvestDevvitTreeLayer(
                WORLD_HARVEST_DEVVIT_CHOP_TREE_API_PATH,
                {
                  ...baseChopRequest,
                  toolTier,
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

        const dropResult = await droppingWorldPlazaTreeChopGroundItem({
          localPersistenceOwnerId,
          redditUserId,
          saveSlotIndex,
          tileX: entry.tileX,
          tileY: entry.tileY,
          layer: standingSurfaceLayer,
          itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
          quantity: chopResult.woodQuantity ?? 0,
          playerPosition,
        });

        if (dropResult.outcome === 'failed') {
          showingGameplayHudToast('Could not drop wood from this tree.');
        }

        const bonusDrop = resolvingWorldPlazaTreeChopBonusDrop(
          entry.tree.variant
        );

        if (bonusDrop) {
          const bonusDropResult = await droppingWorldPlazaTreeChopGroundItem({
            localPersistenceOwnerId,
            redditUserId,
            saveSlotIndex,
            tileX: entry.tileX,
            tileY: entry.tileY,
            layer: standingSurfaceLayer,
            itemTypeId: bonusDrop.itemTypeId,
            quantity: bonusDrop.quantity,
            playerPosition,
          });

          if (bonusDropResult.outcome === 'failed') {
            showingGameplayHudToast('Could not drop loot from this tree.');
          }
        }

        const recipePageLootDrop = resolvingWorldPlazaRecipePageLootDrop({
          source: 'treeChop',
          excludedRecipeIds:
            resolvingWorldPlazaRecipePageLootExcludedAttachedRecipeIds(),
        });

        if (recipePageLootDrop) {
          await droppingWorldPlazaRecipePageLootGroundItem({
            localPersistenceOwnerId,
            redditUserId,
            saveSlotIndex,
            tileX: entry.tileX,
            tileY: entry.tileY,
            layer: standingSurfaceLayer,
            itemTypeId: recipePageLootDrop.itemTypeId,
            playerPosition,
          });
        }

        onTreeChopLayerSucceeded?.();

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
      resolvingHarvestToolTier,
      saveSlotIndex,
      showingGameplayHudToast,
      onTreeChopLayerSucceeded,
      useLocalPersistence,
    ]
  );

  return {
    validatingTreeChopStart,
    completingTreeChopLayer,
  };
}
