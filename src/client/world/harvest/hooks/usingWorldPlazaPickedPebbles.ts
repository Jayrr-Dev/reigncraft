'use client';

import type { DefiningWorldPlazaPickedPebbleTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalPickedPebbles';
import { listingWorldPlazaLocalPickedPebbles } from '@/components/world/harvest/domains/managingWorldPlazaLocalPickedPebbles';
import { fetchingWorldHarvestDevvitPickedPebbles } from '@/components/world/harvest/repositories/callingWorldHarvestDevvitApi';
import { useQuery } from '@tanstack/react-query';
import {
  WORLD_HARVEST_DEVVIT_PICKED_PEBBLES_API_PATH,
  WORLD_HARVEST_DEVVIT_PICKED_PEBBLES_POLL_INTERVAL_MS,
} from '../../../../shared/worldHarvestDevvit';

export const DEFINING_WORLD_PLAZA_PICKED_PEBBLES_QUERY_KEY_ROOT =
  'world-picked-pebbles' as const;

export type UsingWorldPlazaPickedPebblesParams = {
  readonly enabled: boolean;
  readonly localPersistenceOwnerId?: string | null;
  readonly redditUserId?: string | null;
  readonly saveSlotIndex?: number | null;
};

export type UsingWorldPlazaPickedPebblesResult = {
  readonly pickedPebbleStateByTileKey: ReadonlyMap<
    string,
    DefiningWorldPlazaPickedPebbleTileState
  >;
  readonly isReady: boolean;
};

/**
 * Returns true when picked pebbles should persist locally instead of via Devvit.
 */
export function checkingWorldPlazaPickedPebblesUseLocalPersistence(
  localPersistenceOwnerId: string | null | undefined,
  redditUserId: string | null | undefined
): boolean {
  return (
    typeof localPersistenceOwnerId === 'string' &&
    localPersistenceOwnerId.length > 0 &&
    (redditUserId == null || redditUserId.length === 0)
  );
}

function mappingWorldHarvestDevvitPickedPebbles(
  tiles: Awaited<ReturnType<typeof fetchingWorldHarvestDevvitPickedPebbles>>
): ListingWorldPlazaPickedPebblesMappedResult {
  const pickedPebbleStateByTileKey = new Map<
    string,
    DefiningWorldPlazaPickedPebbleTileState
  >();

  for (const tile of tiles) {
    pickedPebbleStateByTileKey.set(tile.tileKey, {
      isPicked: true,
    });
  }

  return { pickedPebbleStateByTileKey };
}

type ListingWorldPlazaPickedPebblesMappedResult = {
  readonly pickedPebbleStateByTileKey: ReadonlyMap<
    string,
    DefiningWorldPlazaPickedPebbleTileState
  >;
};

/**
 * Loads picked-pebble state for rendering and interaction.
 */
export function usingWorldPlazaPickedPebbles({
  enabled,
  localPersistenceOwnerId = null,
  redditUserId = null,
  saveSlotIndex = null,
}: UsingWorldPlazaPickedPebblesParams): UsingWorldPlazaPickedPebblesResult {
  const useLocalPersistence = checkingWorldPlazaPickedPebblesUseLocalPersistence(
    localPersistenceOwnerId,
    redditUserId
  );

  const localPickedPebblesQuery = useQuery({
    queryKey: [
      DEFINING_WORLD_PLAZA_PICKED_PEBBLES_QUERY_KEY_ROOT,
      'local',
      localPersistenceOwnerId,
    ],
    queryFn: () =>
      listingWorldPlazaLocalPickedPebbles(localPersistenceOwnerId ?? ''),
    enabled: enabled && useLocalPersistence && Boolean(localPersistenceOwnerId),
    staleTime: 500,
    refetchInterval: WORLD_HARVEST_DEVVIT_PICKED_PEBBLES_POLL_INTERVAL_MS,
  });

  const devvitPickedPebblesQuery = useQuery({
    queryKey: [
      DEFINING_WORLD_PLAZA_PICKED_PEBBLES_QUERY_KEY_ROOT,
      'devvit',
      redditUserId,
      saveSlotIndex,
    ],
    queryFn: async () =>
      mappingWorldHarvestDevvitPickedPebbles(
        await fetchingWorldHarvestDevvitPickedPebbles(
          WORLD_HARVEST_DEVVIT_PICKED_PEBBLES_API_PATH,
          saveSlotIndex
        )
      ),
    enabled: enabled && !useLocalPersistence && Boolean(redditUserId),
    staleTime: 500,
    refetchInterval: WORLD_HARVEST_DEVVIT_PICKED_PEBBLES_POLL_INTERVAL_MS,
  });

  if (useLocalPersistence) {
    return {
      pickedPebbleStateByTileKey:
        localPickedPebblesQuery.data?.pickedPebbleStateByTileKey ?? new Map(),
      isReady:
        !enabled ||
        !localPersistenceOwnerId ||
        localPickedPebblesQuery.isSuccess,
    };
  }

  return {
    pickedPebbleStateByTileKey:
      devvitPickedPebblesQuery.data?.pickedPebbleStateByTileKey ?? new Map(),
    isReady: !enabled || !redditUserId || devvitPickedPebblesQuery.isSuccess,
  };
}
