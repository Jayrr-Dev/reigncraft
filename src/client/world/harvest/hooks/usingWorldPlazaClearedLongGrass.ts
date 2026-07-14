'use client';

import { useQuery } from '@tanstack/react-query';
import type { DefiningWorldPlazaClearedLongGrassTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalClearedLongGrass';
import { listingWorldPlazaLocalClearedLongGrassByOwner } from '@/components/world/harvest/domains/managingWorldPlazaLocalClearedLongGrass';
import { DEFINING_WORLD_PLAZA_CLEARED_LONG_GRASS_QUERY_KEY_ROOT } from '@/components/world/harvest/hooks/usingWorldPlazaLongGrassSearchInteraction';

export type UsingWorldPlazaClearedLongGrassParams = {
  readonly enabled: boolean;
  readonly localPersistenceOwnerId?: string | null;
};

export type UsingWorldPlazaClearedLongGrassResult = {
  readonly clearedLongGrassStateByTileKey: ReadonlyMap<
    string,
    DefiningWorldPlazaClearedLongGrassTileState
  >;
  readonly isReady: boolean;
};

export function usingWorldPlazaClearedLongGrass({
  enabled,
  localPersistenceOwnerId = null,
}: UsingWorldPlazaClearedLongGrassParams): UsingWorldPlazaClearedLongGrassResult {
  const clearedLongGrassQuery = useQuery({
    queryKey: [
      DEFINING_WORLD_PLAZA_CLEARED_LONG_GRASS_QUERY_KEY_ROOT,
      localPersistenceOwnerId,
    ],
    queryFn: () =>
      listingWorldPlazaLocalClearedLongGrassByOwner(localPersistenceOwnerId ?? ''),
    enabled: enabled && Boolean(localPersistenceOwnerId),
    staleTime: 500,
    refetchInterval: 2_000,
  });

  return {
    clearedLongGrassStateByTileKey:
      clearedLongGrassQuery.data ?? new Map(),
    isReady:
      !enabled ||
      !localPersistenceOwnerId ||
      clearedLongGrassQuery.isSuccess,
  };
}
