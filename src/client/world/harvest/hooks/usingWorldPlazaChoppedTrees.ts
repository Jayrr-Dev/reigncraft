'use client';

import type { DefiningWorldPlazaChoppedTreeTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalChoppedTrees';
import { listingWorldPlazaLocalChoppedTrees } from '@/components/world/harvest/domains/managingWorldPlazaLocalChoppedTrees';
import { fetchingWorldHarvestDevvitChoppedTrees } from '@/components/world/harvest/repositories/callingWorldHarvestDevvitApi';
import { useQuery } from '@tanstack/react-query';
import {
  WORLD_HARVEST_DEVVIT_CHOPPED_TREES_API_PATH,
  WORLD_HARVEST_DEVVIT_CHOPPED_TREES_POLL_INTERVAL_MS,
} from '../../../../shared/worldHarvestDevvit';

export const DEFINING_WORLD_PLAZA_CHOPPED_TREES_QUERY_KEY_ROOT =
  'world-chopped-trees' as const;

export type UsingWorldPlazaChoppedTreesParams = {
  readonly enabled: boolean;
  readonly localPersistenceOwnerId?: string | null;
  readonly redditUserId?: string | null;
  readonly saveSlotIndex?: number | null;
};

export type UsingWorldPlazaChoppedTreesResult = {
  readonly choppedTreeStateByTileKey: ReadonlyMap<
    string,
    DefiningWorldPlazaChoppedTreeTileState
  >;
  readonly isReady: boolean;
};

/**
 * Returns true when chopped trees should persist locally instead of via Devvit.
 */
export function checkingWorldPlazaChoppedTreesUseLocalPersistence(
  localPersistenceOwnerId: string | null | undefined,
  redditUserId: string | null | undefined,
): boolean {
  return (
    typeof localPersistenceOwnerId === 'string' &&
    localPersistenceOwnerId.length > 0 &&
    (redditUserId == null || redditUserId.length === 0)
  );
}

function mappingWorldHarvestDevvitChoppedTrees(
  tiles: Awaited<ReturnType<typeof fetchingWorldHarvestDevvitChoppedTrees>>,
): ListingWorldPlazaChoppedTreesMappedResult {
  const choppedTreeStateByTileKey = new Map<
    string,
    DefiningWorldPlazaChoppedTreeTileState
  >();

  for (const tile of tiles) {
    choppedTreeStateByTileKey.set(tile.tileKey, {
      remainingVisualLayer: tile.remainingVisualLayer,
      isStump: tile.isStump,
    });
  }

  return { choppedTreeStateByTileKey };
}

type ListingWorldPlazaChoppedTreesMappedResult = {
  readonly choppedTreeStateByTileKey: ReadonlyMap<
    string,
    DefiningWorldPlazaChoppedTreeTileState
  >;
};

/**
 * Loads chopped-tree state for rendering and collision.
 */
export function usingWorldPlazaChoppedTrees({
  enabled,
  localPersistenceOwnerId = null,
  redditUserId = null,
  saveSlotIndex = null,
}: UsingWorldPlazaChoppedTreesParams): UsingWorldPlazaChoppedTreesResult {
  const useLocalPersistence = checkingWorldPlazaChoppedTreesUseLocalPersistence(
    localPersistenceOwnerId,
    redditUserId,
  );

  const localChoppedTreesQuery = useQuery({
    queryKey: [
      DEFINING_WORLD_PLAZA_CHOPPED_TREES_QUERY_KEY_ROOT,
      'local',
      localPersistenceOwnerId,
    ],
    queryFn: () =>
      listingWorldPlazaLocalChoppedTrees(localPersistenceOwnerId ?? ''),
    enabled: enabled && useLocalPersistence && Boolean(localPersistenceOwnerId),
    staleTime: 500,
    refetchInterval: WORLD_HARVEST_DEVVIT_CHOPPED_TREES_POLL_INTERVAL_MS,
  });

  const devvitChoppedTreesQuery = useQuery({
    queryKey: [
      DEFINING_WORLD_PLAZA_CHOPPED_TREES_QUERY_KEY_ROOT,
      'devvit',
      redditUserId,
      saveSlotIndex,
    ],
    queryFn: async () =>
      mappingWorldHarvestDevvitChoppedTrees(
        await fetchingWorldHarvestDevvitChoppedTrees(
          WORLD_HARVEST_DEVVIT_CHOPPED_TREES_API_PATH,
          saveSlotIndex,
        ),
      ),
    enabled: enabled && !useLocalPersistence && Boolean(redditUserId),
    staleTime: 500,
    refetchInterval: WORLD_HARVEST_DEVVIT_CHOPPED_TREES_POLL_INTERVAL_MS,
  });

  if (useLocalPersistence) {
    return {
      choppedTreeStateByTileKey:
        localChoppedTreesQuery.data?.choppedTreeStateByTileKey ?? new Map(),
      isReady:
        !enabled ||
        !localPersistenceOwnerId ||
        localChoppedTreesQuery.isSuccess,
    };
  }

  return {
    choppedTreeStateByTileKey:
      devvitChoppedTreesQuery.data?.choppedTreeStateByTileKey ?? new Map(),
    isReady: !enabled || !redditUserId || devvitChoppedTreesQuery.isSuccess,
  };
}
