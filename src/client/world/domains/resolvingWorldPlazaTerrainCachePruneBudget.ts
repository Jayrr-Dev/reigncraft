import {
  DEFINING_WORLD_PLAZA_TERRAIN_CACHE_PRUNE_BURST_MAX,
  DEFINING_WORLD_PLAZA_TERRAIN_CACHE_PRUNE_BURST_MULTIPLIER,
  DEFINING_WORLD_PLAZA_TERRAIN_CACHE_PRUNE_BURST_STALE_COUNT,
  DEFINING_WORLD_PLAZA_TERRAIN_CACHE_PRUNE_BURST_STALE_RATIO,
  DEFINING_WORLD_PLAZA_TERRAIN_CACHE_PRUNE_DEFER_BUILDS_STALE_COUNT,
} from '@/components/world/domains/definingWorldPlazaTerrainCachePruneConstants';

/**
 * Resolves an effective terrain cache prune budget from backlog size.
 *
 * @module components/world/domains/resolvingWorldPlazaTerrainCachePruneBudget
 */

/** Input for {@link resolvingWorldPlazaTerrainCachePruneBudget}. */
export type ResolvingWorldPlazaTerrainCachePruneBudgetInput = {
  /** Profile / caller base prune budget for a normal sync call. */
  readonly basePruneBudget: number;
  /** Graphics (or pending builds) no longer in the needed set. */
  readonly staleCount: number;
  /** Entries the visible window currently needs. */
  readonly neededCount: number;
};

/** Result from {@link resolvingWorldPlazaTerrainCachePruneBudget}. */
export type ResolvingWorldPlazaTerrainCachePruneBudgetResult = {
  /** Max stale entries to destroy this call. */
  readonly pruneBudget: number;
  /** When true, skip starting new builds so prune can catch up. */
  readonly shouldDeferBuilds: boolean;
};

/**
 * Picks prune budget and whether builds should wait on a stale backlog.
 *
 * Continuous movement can leave more stale Pixi children than the base prune
 * budget clears per frame. Burst prune when absolute or relative backlog is
 * high; defer builds when the backlog is severe.
 */
export function resolvingWorldPlazaTerrainCachePruneBudget(
  input: ResolvingWorldPlazaTerrainCachePruneBudgetInput
): ResolvingWorldPlazaTerrainCachePruneBudgetResult {
  const basePruneBudget = Math.max(0, input.basePruneBudget);
  const staleCount = Math.max(0, input.staleCount);
  const neededCount = Math.max(0, input.neededCount);

  if (staleCount <= 0 || basePruneBudget <= 0) {
    return {
      pruneBudget: basePruneBudget,
      shouldDeferBuilds: false,
    };
  }

  const staleRatio =
    neededCount > 0 ? staleCount / neededCount : Number.POSITIVE_INFINITY;
  const shouldBurst =
    staleCount >= DEFINING_WORLD_PLAZA_TERRAIN_CACHE_PRUNE_BURST_STALE_COUNT ||
    staleRatio >= DEFINING_WORLD_PLAZA_TERRAIN_CACHE_PRUNE_BURST_STALE_RATIO;

  if (!shouldBurst) {
    return {
      pruneBudget: basePruneBudget,
      shouldDeferBuilds: false,
    };
  }

  const burstBudget = Math.min(
    DEFINING_WORLD_PLAZA_TERRAIN_CACHE_PRUNE_BURST_MAX,
    Math.max(
      basePruneBudget *
        DEFINING_WORLD_PLAZA_TERRAIN_CACHE_PRUNE_BURST_MULTIPLIER,
      staleCount
    )
  );

  return {
    pruneBudget: burstBudget,
    shouldDeferBuilds:
      staleCount >=
      DEFINING_WORLD_PLAZA_TERRAIN_CACHE_PRUNE_DEFER_BUILDS_STALE_COUNT,
  };
}
