'use client';

import type { DefiningWorldPlazaPickedShrubTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalPickedShrubs';
import { listingWorldPlazaLocalPickedShrubs } from '@/components/world/harvest/domains/managingWorldPlazaLocalPickedShrubs';
import { DEFINING_WORLD_PLAZA_PICKED_SHRUBS_QUERY_KEY_ROOT } from '@/components/world/harvest/hooks/usingWorldPlazaShrubPickInteraction';
import { useQuery } from '@tanstack/react-query';

const EMPTY_PICKED_SHRUB_STATE_BY_TILE_KEY: ReadonlyMap<
  string,
  DefiningWorldPlazaPickedShrubTileState
> = new Map();

export type UsingWorldPlazaPickedShrubsParams = {
  readonly enabled: boolean;
  readonly localPersistenceOwnerId?: string | null;
};

export type UsingWorldPlazaPickedShrubsResult = {
  readonly pickedShrubStateByTileKey: ReadonlyMap<
    string,
    DefiningWorldPlazaPickedShrubTileState
  >;
  readonly isReady: boolean;
};

/**
 * Loads picked-shrub state for rendering and interaction (localStorage only).
 */
export function usingWorldPlazaPickedShrubs({
  enabled,
  localPersistenceOwnerId = null,
}: UsingWorldPlazaPickedShrubsParams): UsingWorldPlazaPickedShrubsResult {
  const pickedShrubsQuery = useQuery({
    queryKey: [
      DEFINING_WORLD_PLAZA_PICKED_SHRUBS_QUERY_KEY_ROOT,
      localPersistenceOwnerId,
    ],
    queryFn: () =>
      listingWorldPlazaLocalPickedShrubs(localPersistenceOwnerId ?? ''),
    enabled: enabled && Boolean(localPersistenceOwnerId),
    staleTime: 500,
    refetchInterval: 2_000,
  });

  return {
    pickedShrubStateByTileKey:
      pickedShrubsQuery.data?.pickedShrubStateByTileKey ??
      EMPTY_PICKED_SHRUB_STATE_BY_TILE_KEY,
    isReady:
      !enabled || !localPersistenceOwnerId || pickedShrubsQuery.isSuccess,
  };
}
