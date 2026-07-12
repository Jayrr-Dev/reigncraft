import type { CreatingWorldPlazaGrassFloorChunkDrawPassContext } from '@/components/world/domains/creatingWorldPlazaGrassFloorChunkDrawPassContext';
import { DEFINING_WORLD_PLAZA_FLOOR_CHUNK_RETENTION_MARGIN_TILES } from '@/components/world/domains/definingWorldPlazaTerrainCachePruneConstants';
import type { DefiningWorldPlazaVisibleTileBounds } from '@/components/world/domains/definingWorldPlazaVisibleTileBounds';
import {
  drawingWorldPlazaGrassFloorChunkOnGraphics,
  drawingWorldPlazaGrassFloorChunkTilesOnGraphics,
} from '@/components/world/domains/drawingWorldPlazaGrassFloorChunkOnGraphics';
import type { DrawingWorldPlazaGrassFloorTileDrawOptions } from '@/components/world/domains/drawingWorldPlazaGrassFloorTileOnGraphics';
import { formattingWorldPlazaTileChunkCacheKey } from '@/components/world/domains/formattingWorldPlazaTileChunkCacheKey';
import {
  listingWorldPlazaTileChunkOriginsInBounds,
  resolvingWorldPlazaGrassFloorChunkGraphicsZIndex,
} from '@/components/world/domains/listingWorldPlazaTileChunkOriginsInBounds';
import {
  checkingWorldPlazaTerrainFrameWorkBudgetExpired,
  type ManagingWorldPlazaTerrainFrameWorkBudget,
} from '@/components/world/domains/managingWorldPlazaTerrainFrameWorkBudget';
import { markingWorldPlazaPixiDisplayObjectCullable } from '@/components/world/domains/markingWorldPlazaPixiDisplayObjectCullable';
import { resolvingWorldPlazaTerrainCachePruneBudget } from '@/components/world/domains/resolvingWorldPlazaTerrainCachePruneBudget';
import type { Container } from 'pixi.js';
import { Graphics } from 'pixi.js';

/**
 * Incrementally syncs batched floor chunks for the visible tile window.
 *
 * @module components/world/domains/syncingWorldPlazaVisibleTileChunkGraphicsLayer
 */

/** Default cap on new chunk builds per call when no budget is supplied. */
const SYNCING_WORLD_PLAZA_VISIBLE_TILE_CHUNK_DEFAULT_BUILD_BUDGET = 4;

/** Default cap on stale chunk destroys per call when no budget is supplied. */
const SYNCING_WORLD_PLAZA_VISIBLE_TILE_CHUNK_DEFAULT_PRUNE_BUDGET = 6;

/** How often to re-check the ms budget while drawing tiles. */
const SYNCING_WORLD_PLAZA_VISIBLE_TILE_CHUNK_BUDGET_CHECK_TILE_STRIDE = 4;

/** Minimum tiles drawn per call so a saturated budget still makes progress. */
const SYNCING_WORLD_PLAZA_VISIBLE_TILE_CHUNK_MIN_TILES_PER_CALL = 16;

/** In-progress floor chunk bake resumed across frames. */
export type SyncingWorldPlazaVisibleTileChunkPendingBuild = {
  readonly graphics: Graphics;
  readonly chunkOriginTileX: number;
  readonly chunkOriginTileY: number;
  nextTileOffset: number;
  drawPassContext: CreatingWorldPlazaGrassFloorChunkDrawPassContext | null;
};

/** Input for {@link syncingWorldPlazaVisibleTileChunkGraphicsLayer}. */
export interface SyncingWorldPlazaVisibleTileChunkGraphicsLayerInput {
  readonly parentContainer: Container;
  readonly bounds: DefiningWorldPlazaVisibleTileBounds;
  readonly chunkSizeTiles: number;
  readonly chunkGraphicsByKey: Map<string, Graphics>;
  readonly drawOptions: DrawingWorldPlazaGrassFloorTileDrawOptions;
  /** Center grid point used to build the nearest chunks first. */
  readonly centerTileX: number;
  readonly centerTileY: number;
  /** Max chunks to start or resume this call. */
  readonly maxChunkBuildsPerCall?: number;
  /** Max stale chunks to destroy this call; spreads prune cost across frames. */
  readonly maxChunkPrunesPerCall?: number;
  /** When false, caller runs sortChildren once after all mutations this tick. */
  readonly shouldSortChildrenImmediately?: boolean;
  /**
   * When false, keep baking needed chunks even if trailing stale backlog is
   * high. Floor uses false so run-in holes cannot open while prune catches up.
   */
  readonly shouldDeferBuildsOnStaleBacklog?: boolean;
  /**
   * Partial chunk bakes resumed across frames. Keys match
   * {@link formattingWorldPlazaTileChunkCacheKey}.
   */
  readonly pendingChunkBuilds?: Map<
    string,
    SyncingWorldPlazaVisibleTileChunkPendingBuild
  >;
  /** Shared terrain ms budget; tile draws stop when expired. */
  readonly terrainFrameWorkBudget?: ManagingWorldPlazaTerrainFrameWorkBudget | null;
}

/** Result from {@link syncingWorldPlazaVisibleTileChunkGraphicsLayer}. */
export interface SyncingWorldPlazaVisibleTileChunkGraphicsLayerResult {
  /** True when every needed chunk exists and no pending bakes remain. */
  readonly isComplete: boolean;
  /** Number of new chunks fully built during this call. */
  readonly chunksBuilt: number;
  /** Number of stale chunks destroyed during this call. */
  readonly chunksPruned: number;
  /** True when z-order must be refreshed on the parent container. */
  readonly needsChildSort: boolean;
}

/**
 * True when a chunk origin's tile footprint still overlaps retention bounds.
 */
function checkingWorldPlazaFloorChunkKeyOverlapsBounds(
  cacheKey: string,
  chunkSizeTiles: number,
  bounds: DefiningWorldPlazaVisibleTileBounds
): boolean {
  const separatorIndex = cacheKey.indexOf(':');
  const chunkOriginTileX = Number(cacheKey.slice(0, separatorIndex));
  const chunkOriginTileY = Number(cacheKey.slice(separatorIndex + 1));
  const chunkMaxTileX = chunkOriginTileX + chunkSizeTiles - 1;
  const chunkMaxTileY = chunkOriginTileY + chunkSizeTiles - 1;

  return (
    chunkMaxTileX >= bounds.minTileX &&
    chunkOriginTileX <= bounds.maxTileX &&
    chunkMaxTileY >= bounds.minTileY &&
    chunkOriginTileY <= bounds.maxTileY
  );
}

/**
 * Draws tiles into a pending chunk until the chunk finishes or the budget expires.
 *
 * Always draws at least {@link SYNCING_WORLD_PLAZA_VISIBLE_TILE_CHUNK_MIN_TILES_PER_CALL}
 * tiles so a saturated budget still advances the bake.
 */
function advancingWorldPlazaVisibleTileChunkPendingBuild(input: {
  readonly pendingBuild: SyncingWorldPlazaVisibleTileChunkPendingBuild;
  readonly chunkSizeTiles: number;
  readonly drawOptions: DrawingWorldPlazaGrassFloorTileDrawOptions;
  readonly terrainFrameWorkBudget:
    | ManagingWorldPlazaTerrainFrameWorkBudget
    | null
    | undefined;
}): boolean {
  const tileCount = input.chunkSizeTiles * input.chunkSizeTiles;
  const startedOffset = input.pendingBuild.nextTileOffset;

  while (input.pendingBuild.nextTileOffset < tileCount) {
    const tilesDrawnSoFar = input.pendingBuild.nextTileOffset - startedOffset;

    if (
      tilesDrawnSoFar >=
        SYNCING_WORLD_PLAZA_VISIBLE_TILE_CHUNK_MIN_TILES_PER_CALL &&
      input.terrainFrameWorkBudget &&
      checkingWorldPlazaTerrainFrameWorkBudgetExpired(
        input.terrainFrameWorkBudget
      )
    ) {
      return false;
    }

    const drawResult = drawingWorldPlazaGrassFloorChunkTilesOnGraphics({
      graphics: input.pendingBuild.graphics,
      chunkOriginTileX: input.pendingBuild.chunkOriginTileX,
      chunkOriginTileY: input.pendingBuild.chunkOriginTileY,
      chunkSizeTiles: input.chunkSizeTiles,
      drawOptions: input.drawOptions,
      startTileOffset: input.pendingBuild.nextTileOffset,
      maxTiles: SYNCING_WORLD_PLAZA_VISIBLE_TILE_CHUNK_BUDGET_CHECK_TILE_STRIDE,
      drawPassContext: input.pendingBuild.drawPassContext ?? undefined,
    });

    input.pendingBuild.drawPassContext = drawResult.drawPassContext;
    input.pendingBuild.nextTileOffset = drawResult.nextTileOffset;

    if (drawResult.isComplete) {
      return true;
    }
  }

  return true;
}

/**
 * Adds or removes chunk graphics as the visible window shifts.
 *
 * New chunks are built nearest-first and capped per call so a single frame
 * never draws hundreds of tiles. Tile draws inside a chunk are time-sliced
 * under the shared terrain ms budget so one 8x8 bake cannot monopolize a frame.
 * Stale chunks are pruned first (with a burst budget when backlog grows) so
 * continuous movement cannot leave Graphics children climbing unboundedly.
 *
 * @param input - Parent container, bounds, chunk size, cache, and draw options.
 */
export function syncingWorldPlazaVisibleTileChunkGraphicsLayer(
  input: SyncingWorldPlazaVisibleTileChunkGraphicsLayerInput
): SyncingWorldPlazaVisibleTileChunkGraphicsLayerResult {
  const buildBudget = Math.max(
    1,
    input.maxChunkBuildsPerCall ??
      SYNCING_WORLD_PLAZA_VISIBLE_TILE_CHUNK_DEFAULT_BUILD_BUDGET
  );
  const basePruneBudget = Math.max(
    1,
    input.maxChunkPrunesPerCall ??
      SYNCING_WORLD_PLAZA_VISIBLE_TILE_CHUNK_DEFAULT_PRUNE_BUDGET
  );
  const shouldSortChildrenImmediately =
    input.shouldSortChildrenImmediately ?? false;
  const shouldDeferBuildsOnStaleBacklog =
    input.shouldDeferBuildsOnStaleBacklog ?? true;
  const pendingChunkBuilds = input.pendingChunkBuilds;
  const chunkOrigins = listingWorldPlazaTileChunkOriginsInBounds(
    input.bounds,
    input.chunkSizeTiles
  );
  const retentionBounds: DefiningWorldPlazaVisibleTileBounds = {
    minTileX:
      input.bounds.minTileX -
      DEFINING_WORLD_PLAZA_FLOOR_CHUNK_RETENTION_MARGIN_TILES,
    maxTileX:
      input.bounds.maxTileX +
      DEFINING_WORLD_PLAZA_FLOOR_CHUNK_RETENTION_MARGIN_TILES,
    minTileY:
      input.bounds.minTileY -
      DEFINING_WORLD_PLAZA_FLOOR_CHUNK_RETENTION_MARGIN_TILES,
    maxTileY:
      input.bounds.maxTileY +
      DEFINING_WORLD_PLAZA_FLOOR_CHUNK_RETENTION_MARGIN_TILES,
  };
  const neededKeys = new Set<string>();
  const missingChunkOrigins: typeof chunkOrigins = [];

  for (const chunkOrigin of chunkOrigins) {
    const cacheKey = formattingWorldPlazaTileChunkCacheKey(
      chunkOrigin.chunkOriginTileX,
      chunkOrigin.chunkOriginTileY
    );
    neededKeys.add(cacheKey);

    if (
      !input.chunkGraphicsByKey.has(cacheKey) &&
      !pendingChunkBuilds?.has(cacheKey)
    ) {
      missingChunkOrigins.push(chunkOrigin);
    }
  }

  const halfChunk = input.chunkSizeTiles / 2;

  missingChunkOrigins.sort((originA, originB) => {
    const distanceA =
      Math.abs(originA.chunkOriginTileX + halfChunk - input.centerTileX) +
      Math.abs(originA.chunkOriginTileY + halfChunk - input.centerTileY);
    const distanceB =
      Math.abs(originB.chunkOriginTileX + halfChunk - input.centerTileX) +
      Math.abs(originB.chunkOriginTileY + halfChunk - input.centerTileY);

    return distanceA - distanceB;
  });

  const staleChunkKeys: string[] = [];

  for (const cacheKey of input.chunkGraphicsByKey.keys()) {
    if (neededKeys.has(cacheKey)) {
      continue;
    }

    if (
      checkingWorldPlazaFloorChunkKeyOverlapsBounds(
        cacheKey,
        input.chunkSizeTiles,
        retentionBounds
      )
    ) {
      continue;
    }

    staleChunkKeys.push(cacheKey);
  }

  if (pendingChunkBuilds) {
    for (const cacheKey of pendingChunkBuilds.keys()) {
      if (neededKeys.has(cacheKey)) {
        continue;
      }

      if (
        checkingWorldPlazaFloorChunkKeyOverlapsBounds(
          cacheKey,
          input.chunkSizeTiles,
          retentionBounds
        )
      ) {
        continue;
      }

      staleChunkKeys.push(cacheKey);
    }
  }

  const { pruneBudget, shouldDeferBuilds: shouldDeferBuildsFromBacklog } =
    resolvingWorldPlazaTerrainCachePruneBudget({
      basePruneBudget,
      staleCount: staleChunkKeys.length,
      neededCount: neededKeys.size,
    });
  const shouldDeferBuilds =
    shouldDeferBuildsOnStaleBacklog && shouldDeferBuildsFromBacklog;
  const chunksToPrune = staleChunkKeys.slice(0, pruneBudget);
  let didMutateChildren = false;
  let chunksBuilt = 0;
  let chunksStartedOrResumed = 0;

  for (const cacheKey of chunksToPrune) {
    const chunkGraphics = input.chunkGraphicsByKey.get(cacheKey);

    if (chunkGraphics) {
      input.parentContainer.removeChild(chunkGraphics);
      chunkGraphics.destroy();
      input.chunkGraphicsByKey.delete(cacheKey);
      didMutateChildren = true;
    }

    const pendingBuild = pendingChunkBuilds?.get(cacheKey);

    if (pendingBuild) {
      input.parentContainer.removeChild(pendingBuild.graphics);
      pendingBuild.graphics.destroy();
      pendingChunkBuilds?.delete(cacheKey);
      didMutateChildren = true;
    }
  }

  const finishingPendingChunk = (
    cacheKey: string,
    pendingBuild: SyncingWorldPlazaVisibleTileChunkPendingBuild
  ): void => {
    pendingBuild.graphics.visible = true;
    input.chunkGraphicsByKey.set(cacheKey, pendingBuild.graphics);
    pendingChunkBuilds?.delete(cacheKey);
    chunksBuilt += 1;
    didMutateChildren = true;
  };

  const advancingPendingChunk = (
    cacheKey: string,
    pendingBuild: SyncingWorldPlazaVisibleTileChunkPendingBuild
  ): boolean => {
    chunksStartedOrResumed += 1;
    const isComplete = advancingWorldPlazaVisibleTileChunkPendingBuild({
      pendingBuild,
      chunkSizeTiles: input.chunkSizeTiles,
      drawOptions: input.drawOptions,
      terrainFrameWorkBudget: input.terrainFrameWorkBudget,
    });

    if (isComplete) {
      finishingPendingChunk(cacheKey, pendingBuild);
    }

    return isComplete;
  };

  if (!shouldDeferBuilds) {
    if (pendingChunkBuilds && pendingChunkBuilds.size > 0) {
      const pendingEntries = Array.from(pendingChunkBuilds.entries()).sort(
        ([, pendingA], [, pendingB]) => {
          const distanceA =
            Math.abs(
              pendingA.chunkOriginTileX + halfChunk - input.centerTileX
            ) +
            Math.abs(pendingA.chunkOriginTileY + halfChunk - input.centerTileY);
          const distanceB =
            Math.abs(
              pendingB.chunkOriginTileX + halfChunk - input.centerTileX
            ) +
            Math.abs(pendingB.chunkOriginTileY + halfChunk - input.centerTileY);

          return distanceA - distanceB;
        }
      );

      for (const [cacheKey, pendingBuild] of pendingEntries) {
        if (!neededKeys.has(cacheKey)) {
          continue;
        }

        if (chunksStartedOrResumed >= buildBudget) {
          break;
        }

        const completed = advancingPendingChunk(cacheKey, pendingBuild);

        if (
          !completed &&
          input.terrainFrameWorkBudget &&
          checkingWorldPlazaTerrainFrameWorkBudgetExpired(
            input.terrainFrameWorkBudget
          )
        ) {
          break;
        }
      }
    }

    for (const { chunkOriginTileX, chunkOriginTileY } of missingChunkOrigins) {
      if (chunksStartedOrResumed >= buildBudget) {
        break;
      }

      if (
        input.terrainFrameWorkBudget &&
        checkingWorldPlazaTerrainFrameWorkBudgetExpired(
          input.terrainFrameWorkBudget
        )
      ) {
        break;
      }

      const cacheKey = formattingWorldPlazaTileChunkCacheKey(
        chunkOriginTileX,
        chunkOriginTileY
      );
      const chunkGraphics = new Graphics();
      chunkGraphics.eventMode = 'none';
      markingWorldPlazaPixiDisplayObjectCullable(chunkGraphics);
      chunkGraphics.zIndex = resolvingWorldPlazaGrassFloorChunkGraphicsZIndex(
        chunkOriginTileX,
        chunkOriginTileY
      );
      // Progressive bake: show tiles as they fill instead of hiding the whole
      // chunk until complete (invisible pending = diamond see-through holes).
      chunkGraphics.visible = true;
      input.parentContainer.addChild(chunkGraphics);
      didMutateChildren = true;

      if (!pendingChunkBuilds) {
        drawingWorldPlazaGrassFloorChunkOnGraphics({
          graphics: chunkGraphics,
          chunkOriginTileX,
          chunkOriginTileY,
          chunkSizeTiles: input.chunkSizeTiles,
          drawOptions: input.drawOptions,
        });
        input.chunkGraphicsByKey.set(cacheKey, chunkGraphics);
        chunksBuilt += 1;
        chunksStartedOrResumed += 1;
        continue;
      }

      const pendingBuild: SyncingWorldPlazaVisibleTileChunkPendingBuild = {
        graphics: chunkGraphics,
        chunkOriginTileX,
        chunkOriginTileY,
        nextTileOffset: 0,
        drawPassContext: null,
      };
      pendingChunkBuilds.set(cacheKey, pendingBuild);

      const completed = advancingPendingChunk(cacheKey, pendingBuild);

      if (
        !completed &&
        input.terrainFrameWorkBudget &&
        checkingWorldPlazaTerrainFrameWorkBudgetExpired(
          input.terrainFrameWorkBudget
        )
      ) {
        break;
      }
    }
  }

  if (
    didMutateChildren &&
    shouldSortChildrenImmediately &&
    input.parentContainer.sortableChildren
  ) {
    input.parentContainer.sortChildren();
  }

  let remainingNeededChunkCount = 0;

  for (const cacheKey of neededKeys) {
    if (input.chunkGraphicsByKey.has(cacheKey)) {
      continue;
    }

    remainingNeededChunkCount += 1;
  }

  const remainingStaleCount = staleChunkKeys.length - chunksToPrune.length;

  return {
    isComplete: remainingNeededChunkCount === 0 && remainingStaleCount <= 0,
    chunksBuilt,
    chunksPruned: chunksToPrune.length,
    needsChildSort:
      didMutateChildren &&
      !shouldSortChildrenImmediately &&
      input.parentContainer.sortableChildren,
  };
}
