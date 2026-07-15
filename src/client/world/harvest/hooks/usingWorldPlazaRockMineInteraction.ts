'use client';

import { DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND } from '@/components/world/building/domains/definingWorldBuildingWorldLayerConstants';
import { droppingWorldPlazaRecipePageLootGroundItem } from '@/components/world/crafting/domains/droppingWorldPlazaRecipePageLootGroundItem';
import {
  resolvingWorldPlazaRecipePageLootDrop,
  resolvingWorldPlazaRecipePageLootExcludedAttachedRecipeIds,
} from '@/components/world/crafting/domains/resolvingWorldPlazaRecipePageLootDrop';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { recordingWorldPlazaLapidaryOreStudied } from '@/components/world/domains/managingWorldPlazaLapidaryDiscoveryStore';
import { droppingWorldPlazaRockMineStoneGroundItem } from '@/components/world/harvest/domains/droppingWorldPlazaRockMineStoneGroundItem';
import type { DefiningWorldPlazaMinedRockTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalMinedRocks';
import {
  checkingWorldPlazaRockMineLayerEligibility,
  formattingWorldPlazaMinedRockTileKey,
  miningWorldPlazaLocalRockLayer,
} from '@/components/world/harvest/domains/managingWorldPlazaLocalMinedRocks';
import {
  checkingWorldPlazaMinedRocksUseLocalPersistence,
  DEFINING_WORLD_PLAZA_MINED_ROCKS_QUERY_KEY_ROOT,
} from '@/components/world/harvest/hooks/usingWorldPlazaMinedRocks';
import type { ListingWorldPlazaRocksInInteractionRangeEntry } from '@/components/world/harvest/hooks/usingWorldPlazaRockMineProgress';
import { miningWorldHarvestDevvitRockLayer } from '@/components/world/harvest/repositories/callingWorldHarvestDevvitApi';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_STONE } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { resolvingWorldPlazaOreItemTypeIdFromSpeciesId } from '@/components/world/inventory/domains/definingWorldPlazaInventoryOreSpriteSheetConstants';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useRef, type RefObject } from 'react';
import type { PlazaSaveSlotIndex } from '../../../../shared/plazaGameSession';
import { WORLD_HARVEST_DEVVIT_MINE_ROCK_API_PATH } from '../../../../shared/worldHarvestDevvit';
import {
  resolvingWorldToolHarvestSwingYield,
  type WorldToolHarvestTier,
} from '../../../../shared/worldToolHarvestYield';

export type UsingWorldPlazaRockMineInteractionParams = {
  readonly localPersistenceOwnerId: string | null;
  readonly redditUserId: string | null;
  readonly saveSlotIndex: PlazaSaveSlotIndex | null;
  readonly minedRockStateByTileKey: ReadonlyMap<
    string,
    DefiningWorldPlazaMinedRockTileState
  >;
  readonly playerPositionRef: RefObject<DefiningWorldPlazaWorldPoint>;
  readonly showingGameplayHudToast: (message: string) => void;
  /** Equipped pickaxe tier; missing → wood baseline yield. */
  readonly resolvingHarvestToolTier?: () => WorldToolHarvestTier | null;
  /** Called after a rock layer is successfully mined. */
  readonly onRockMineLayerSucceeded?: () => void;
};

export type UsingWorldPlazaRockMineInteractionResult = {
  readonly validatingRockMineStart: (
    entry: ListingWorldPlazaRocksInInteractionRangeEntry
  ) => boolean;
  readonly completingRockMineLayer: (
    entry: ListingWorldPlazaRocksInInteractionRangeEntry
  ) => Promise<void>;
};

/**
 * Validates and completes rock mines after the progress indicator finishes.
 */
export function usingWorldPlazaRockMineInteraction({
  localPersistenceOwnerId,
  redditUserId,
  saveSlotIndex,
  minedRockStateByTileKey,
  playerPositionRef,
  showingGameplayHudToast,
  resolvingHarvestToolTier,
  onRockMineLayerSucceeded,
}: UsingWorldPlazaRockMineInteractionParams): UsingWorldPlazaRockMineInteractionResult {
  const queryClient = useQueryClient();
  const isCompletionPendingRef = useRef(false);
  const useLocalPersistence = checkingWorldPlazaMinedRocksUseLocalPersistence(
    localPersistenceOwnerId,
    redditUserId
  );
  const persistenceOwnerId = useLocalPersistence
    ? localPersistenceOwnerId
    : redditUserId;

  const validatingRockMineStart = useCallback(
    (entry: ListingWorldPlazaRocksInInteractionRangeEntry): boolean => {
      if (!persistenceOwnerId) {
        showingGameplayHudToast('Rock mining is unavailable in this session.');
        return false;
      }

      const playerPosition = playerPositionRef.current;

      if (!playerPosition) {
        return false;
      }

      const standingSurfaceLayer = DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND;
      const currentVisualLayer = entry.metadata.surfaceWorldLayer;
      const tileKey = formattingWorldPlazaMinedRockTileKey(
        entry.tileX,
        entry.tileY
      );

      const rangeCheck = checkingWorldPlazaRockMineLayerEligibility({
        persistenceOwnerId,
        tileX: entry.tileX,
        tileY: entry.tileY,
        targetCenterX: entry.targetCenterX,
        targetCenterY: entry.targetCenterY,
        playerX: playerPosition.x,
        playerY: playerPosition.y,
        currentVisualLayer,
        standingSurfaceLayer,
        existingTileState: minedRockStateByTileKey.get(tileKey),
      });

      if (rangeCheck.outcome === 'out-of-range') {
        showingGameplayHudToast('Move closer to mine this rock.');
        return false;
      }

      if (rangeCheck.outcome === 'already-depleted') {
        showingGameplayHudToast('This rock is already depleted.');
        return false;
      }

      return true;
    },
    [
      minedRockStateByTileKey,
      persistenceOwnerId,
      playerPositionRef,
      showingGameplayHudToast,
    ]
  );

  const completingRockMineLayer = useCallback(
    async (
      entry: ListingWorldPlazaRocksInInteractionRangeEntry
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
        const standingSurfaceLayer = DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND;
        const currentVisualLayer = entry.metadata.surfaceWorldLayer;
        const toolTier = resolvingHarvestToolTier?.() ?? null;
        const baseMineRequest = {
          tileX: entry.tileX,
          tileY: entry.tileY,
          targetCenterX: entry.targetCenterX,
          targetCenterY: entry.targetCenterY,
          playerX: playerPosition.x,
          playerY: playerPosition.y,
          currentVisualLayer,
          standingSurfaceLayer,
        };

        const mineResult =
          useLocalPersistence && localPersistenceOwnerId
            ? miningWorldPlazaLocalRockLayer(localPersistenceOwnerId, {
                ...baseMineRequest,
                ...resolvingWorldToolHarvestSwingYield(toolTier),
              })
            : await miningWorldHarvestDevvitRockLayer(
                WORLD_HARVEST_DEVVIT_MINE_ROCK_API_PATH,
                {
                  ...baseMineRequest,
                  toolTier,
                  saveSlotIndex,
                }
              );

        if (mineResult.outcome !== 'mined') {
          if (mineResult.outcome === 'out-of-range') {
            showingGameplayHudToast('Move closer to mine this rock.');
          } else if (mineResult.outcome === 'already-depleted') {
            showingGameplayHudToast('This rock is already depleted.');
          }

          return;
        }

        const dropItemTypeId = entry.metadata.oreSpeciesId
          ? resolvingWorldPlazaOreItemTypeIdFromSpeciesId(
              entry.metadata.oreSpeciesId
            )
          : DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_STONE;

        if (entry.metadata.oreSpeciesId) {
          recordingWorldPlazaLapidaryOreStudied(entry.metadata.oreSpeciesId);
        }

        const dropResult = await droppingWorldPlazaRockMineStoneGroundItem({
          localPersistenceOwnerId,
          redditUserId,
          saveSlotIndex,
          tileX: entry.tileX,
          tileY: entry.tileY,
          layer: standingSurfaceLayer,
          stoneQuantity: mineResult.stoneQuantity ?? 0,
          playerPosition,
          itemTypeId: dropItemTypeId,
        });

        if (dropResult.outcome === 'failed') {
          showingGameplayHudToast(
            dropItemTypeId === DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_STONE
              ? 'Could not drop stone from this rock.'
              : 'Could not drop ore from this rock.'
          );
        }

        const recipePageLootDrop = resolvingWorldPlazaRecipePageLootDrop({
          source: 'mining',
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

        onRockMineLayerSucceeded?.();

        void queryClient.invalidateQueries({
          queryKey: [DEFINING_WORLD_PLAZA_MINED_ROCKS_QUERY_KEY_ROOT],
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
      onRockMineLayerSucceeded,
      useLocalPersistence,
    ]
  );

  return {
    validatingRockMineStart,
    completingRockMineLayer,
  };
}
