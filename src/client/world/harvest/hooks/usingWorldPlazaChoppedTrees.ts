'use client';

import type { DefiningWorldPlazaChoppedTreeTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalChoppedTrees';
import { listingWorldPlazaLocalChoppedTrees } from '@/components/world/harvest/domains/managingWorldPlazaLocalChoppedTrees';
import { useQuery } from '@tanstack/react-query';

export const DEFINING_WORLD_PLAZA_CHOPPED_TREES_QUERY_KEY_ROOT =
  'world-chopped-trees' as const;

export type UsingWorldPlazaChoppedTreesParams = {
  readonly enabled: boolean;
  readonly persistenceOwnerId: string | null;
};

export type UsingWorldPlazaChoppedTreesResult = {
  readonly choppedTreeStateByTileKey: ReadonlyMap<
    string,
    DefiningWorldPlazaChoppedTreeTileState
  >;
  readonly isReady: boolean;
};

/**
 * Loads chopped-tree state for rendering and collision.
 */
export function usingWorldPlazaChoppedTrees({
  enabled,
  persistenceOwnerId,
}: UsingWorldPlazaChoppedTreesParams): UsingWorldPlazaChoppedTreesResult {
  const choppedTreesQuery = useQuery({
    queryKey: [
      DEFINING_WORLD_PLAZA_CHOPPED_TREES_QUERY_KEY_ROOT,
      persistenceOwnerId,
    ],
    queryFn: () => listingWorldPlazaLocalChoppedTrees(persistenceOwnerId ?? ''),
    enabled: enabled && Boolean(persistenceOwnerId),
    staleTime: 500,
    refetchInterval: 1_000,
  });

  return {
    choppedTreeStateByTileKey:
      choppedTreesQuery.data?.choppedTreeStateByTileKey ?? new Map(),
    isReady: !enabled || !persistenceOwnerId || choppedTreesQuery.isSuccess,
  };
}
