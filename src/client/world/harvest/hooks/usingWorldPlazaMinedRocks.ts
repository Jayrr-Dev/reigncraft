'use client';

import type { DefiningWorldPlazaMinedRockTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalMinedRocks';
import { listingWorldPlazaLocalMinedRocks } from '@/components/world/harvest/domains/managingWorldPlazaLocalMinedRocks';
import { fetchingWorldHarvestDevvitMinedRocks } from '@/components/world/harvest/repositories/callingWorldHarvestDevvitApi';
import { useQuery } from '@tanstack/react-query';
import {
  WORLD_HARVEST_DEVVIT_MINED_ROCKS_API_PATH,
  WORLD_HARVEST_DEVVIT_MINED_ROCKS_POLL_INTERVAL_MS,
} from '../../../../shared/worldHarvestDevvit';

export const DEFINING_WORLD_PLAZA_MINED_ROCKS_QUERY_KEY_ROOT =
  'world-mined-rocks' as const;

export type UsingWorldPlazaMinedRocksParams = {
  readonly enabled: boolean;
  readonly localPersistenceOwnerId?: string | null;
  readonly redditUserId?: string | null;
  readonly saveSlotIndex?: number | null;
};

export type UsingWorldPlazaMinedRocksResult = {
  readonly minedRockStateByTileKey: ReadonlyMap<
    string,
    DefiningWorldPlazaMinedRockTileState
  >;
  readonly isReady: boolean;
};

/**
 * Returns true when mined rocks should persist locally instead of via Devvit.
 */
export function checkingWorldPlazaMinedRocksUseLocalPersistence(
  localPersistenceOwnerId: string | null | undefined,
  redditUserId: string | null | undefined,
): boolean {
  return (
    typeof localPersistenceOwnerId === 'string' &&
    localPersistenceOwnerId.length > 0 &&
    (redditUserId == null || redditUserId.length === 0)
  );
}

function mappingWorldHarvestDevvitMinedRocks(
  tiles: Awaited<ReturnType<typeof fetchingWorldHarvestDevvitMinedRocks>>,
): ListingWorldPlazaMinedRocksMappedResult {
  const minedRockStateByTileKey = new Map<
    string,
    DefiningWorldPlazaMinedRockTileState
  >();

  for (const tile of tiles) {
    minedRockStateByTileKey.set(tile.tileKey, {
      remainingVisualLayer: tile.remainingVisualLayer,
      isDepleted: tile.isDepleted,
    });
  }

  return { minedRockStateByTileKey };
}

type ListingWorldPlazaMinedRocksMappedResult = {
  readonly minedRockStateByTileKey: ReadonlyMap<
    string,
    DefiningWorldPlazaMinedRockTileState
  >;
};

/**
 * Loads mined-rock state for rendering and collision.
 */
export function usingWorldPlazaMinedRocks({
  enabled,
  localPersistenceOwnerId = null,
  redditUserId = null,
  saveSlotIndex = null,
}: UsingWorldPlazaMinedRocksParams): UsingWorldPlazaMinedRocksResult {
  const useLocalPersistence = checkingWorldPlazaMinedRocksUseLocalPersistence(
    localPersistenceOwnerId,
    redditUserId,
  );

  const localMinedRocksQuery = useQuery({
    queryKey: [
      DEFINING_WORLD_PLAZA_MINED_ROCKS_QUERY_KEY_ROOT,
      'local',
      localPersistenceOwnerId,
    ],
    queryFn: () =>
      listingWorldPlazaLocalMinedRocks(localPersistenceOwnerId ?? ''),
    enabled: enabled && useLocalPersistence && Boolean(localPersistenceOwnerId),
    staleTime: 500,
    refetchInterval: WORLD_HARVEST_DEVVIT_MINED_ROCKS_POLL_INTERVAL_MS,
  });

  const devvitMinedRocksQuery = useQuery({
    queryKey: [
      DEFINING_WORLD_PLAZA_MINED_ROCKS_QUERY_KEY_ROOT,
      'devvit',
      redditUserId,
      saveSlotIndex,
    ],
    queryFn: async () =>
      mappingWorldHarvestDevvitMinedRocks(
        await fetchingWorldHarvestDevvitMinedRocks(
          WORLD_HARVEST_DEVVIT_MINED_ROCKS_API_PATH,
          saveSlotIndex,
        ),
      ),
    enabled: enabled && !useLocalPersistence && Boolean(redditUserId),
    staleTime: 500,
    refetchInterval: WORLD_HARVEST_DEVVIT_MINED_ROCKS_POLL_INTERVAL_MS,
  });

  if (useLocalPersistence) {
    return {
      minedRockStateByTileKey:
        localMinedRocksQuery.data?.minedRockStateByTileKey ?? new Map(),
      isReady:
        !enabled ||
        !localPersistenceOwnerId ||
        localMinedRocksQuery.isSuccess,
    };
  }

  return {
    minedRockStateByTileKey:
      devvitMinedRocksQuery.data?.minedRockStateByTileKey ?? new Map(),
    isReady: !enabled || !redditUserId || devvitMinedRocksQuery.isSuccess,
  };
}
