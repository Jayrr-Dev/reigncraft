'use client';

import { DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND } from '@/components/world/building/domains/definingWorldBuildingWorldLayerConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
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
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useRef, type RefObject } from 'react';
import type { PlazaSaveSlotIndex } from '../../../../shared/plazaGameSession';
import { WORLD_HARVEST_DEVVIT_MINE_ROCK_API_PATH } from '../../../../shared/worldHarvestDevvit';

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
        showingGameplayHudToast(
          'Rock mining is unavailable in this session.'
        );
        return false;
      }

      const playerPosition = playerPositionRef.current;

      if (!playerPosition) {
        return false;
      }

      const standingSurfaceLayer = DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND;
      const currentVisualLayer = entry.rock.surfaceWorldLayer;
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
        const currentVisualLayer = entry.rock.surfaceWorldLayer;
        const mineRequest = {
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
            ? miningWorldPlazaLocalRockLayer(
                localPersistenceOwnerId,
                mineRequest
              )
            : await miningWorldHarvestDevvitRockLayer(
                WORLD_HARVEST_DEVVIT_MINE_ROCK_API_PATH,
                {
                  ...mineRequest,
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

        const dropResult = await droppingWorldPlazaRockMineStoneGroundItem({
          localPersistenceOwnerId,
          redditUserId,
          saveSlotIndex,
          tileX: entry.tileX,
          tileY: entry.tileY,
          layer: standingSurfaceLayer,
          stoneQuantity: mineResult.stoneQuantity ?? 0,
          playerPosition,
        });

        if (dropResult.outcome === 'failed') {
          showingGameplayHudToast('Could not drop stone from this rock.');
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
