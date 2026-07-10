import type { DefiningWorldPlazaVisibleTileBounds } from '@/components/world/domains/definingWorldPlazaVisibleTileBounds';
import { drawingWorldPlazaGrassFloorChunkOnGraphics } from '@/components/world/domains/drawingWorldPlazaGrassFloorChunkOnGraphics';
import type { DrawingWorldPlazaGrassFloorTileDrawOptions } from '@/components/world/domains/drawingWorldPlazaGrassFloorTileOnGraphics';
import { formattingWorldPlazaTileChunkCacheKey } from '@/components/world/domains/formattingWorldPlazaTileChunkCacheKey';
import {
  listingWorldPlazaTileChunkOriginsInBounds,
  resolvingWorldPlazaGrassFloorChunkGraphicsZIndex,
} from '@/components/world/domains/listingWorldPlazaTileChunkOriginsInBounds';
import { markingWorldPlazaPixiDisplayObjectCullable } from '@/components/world/domains/markingWorldPlazaPixiDisplayObjectCullable';
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
  /** Max chunks to build this call; remaining chunks build on later frames. */
  readonly maxChunkBuildsPerCall?: number;
  /** Max stale chunks to destroy this call; spreads prune cost across frames. */
  readonly maxChunkPrunesPerCall?: number;
  /** When false, caller runs sortChildren once after all mutations this tick. */
  readonly shouldSortChildrenImmediately?: boolean;
}

/** Result from {@link syncingWorldPlazaVisibleTileChunkGraphicsLayer}. */
export interface SyncingWorldPlazaVisibleTileChunkGraphicsLayerResult {
  /** True when every needed chunk exists (stale chunks are always pruned immediately). */
  readonly isComplete: boolean;
  /** Number of new chunks built during this call. */
  readonly chunksBuilt: number;
  /** Number of stale chunks destroyed during this call. */
  readonly chunksPruned: number;
  /** True when z-order must be refreshed on the parent container. */
  readonly needsChildSort: boolean;
}

/**
 * Adds or removes chunk graphics as the visible window shifts.
 *
 * New chunks are built nearest-first and capped per call so a single frame
 * never draws hundreds of tiles. Stale chunks are pruned with a matching budget
 * so bounds crossings do not destroy dozens of graphics objects in one tick.
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
  const pruneBudget = Math.max(
    1,
    input.maxChunkPrunesPerCall ??
      SYNCING_WORLD_PLAZA_VISIBLE_TILE_CHUNK_DEFAULT_PRUNE_BUDGET
  );
  const shouldSortChildrenImmediately =
    input.shouldSortChildrenImmediately ?? true;
  const chunkOrigins = listingWorldPlazaTileChunkOriginsInBounds(
    input.bounds,
    input.chunkSizeTiles
  );
  const neededKeys = new Set<string>();
  const missingChunkOrigins: typeof chunkOrigins = [];

  for (const chunkOrigin of chunkOrigins) {
    const cacheKey = formattingWorldPlazaTileChunkCacheKey(
      chunkOrigin.chunkOriginTileX,
      chunkOrigin.chunkOriginTileY
    );
    neededKeys.add(cacheKey);

    if (!input.chunkGraphicsByKey.has(cacheKey)) {
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

  const chunksToBuild = missingChunkOrigins.slice(0, buildBudget);
  const staleChunkKeys: string[] = [];

  for (const cacheKey of input.chunkGraphicsByKey.keys()) {
    if (!neededKeys.has(cacheKey)) {
      staleChunkKeys.push(cacheKey);
    }
  }

  const chunksToPrune = staleChunkKeys.slice(0, pruneBudget);
  let didMutateChildren = false;

  for (const { chunkOriginTileX, chunkOriginTileY } of chunksToBuild) {
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
    drawingWorldPlazaGrassFloorChunkOnGraphics({
      graphics: chunkGraphics,
      chunkOriginTileX,
      chunkOriginTileY,
      chunkSizeTiles: input.chunkSizeTiles,
      drawOptions: input.drawOptions,
    });
    input.parentContainer.addChild(chunkGraphics);
    input.chunkGraphicsByKey.set(cacheKey, chunkGraphics);
    didMutateChildren = true;
  }

  for (const cacheKey of chunksToPrune) {
    const chunkGraphics = input.chunkGraphicsByKey.get(cacheKey);

    if (!chunkGraphics) {
      continue;
    }

    input.parentContainer.removeChild(chunkGraphics);
    chunkGraphics.destroy();
    input.chunkGraphicsByKey.delete(cacheKey);
    didMutateChildren = true;
  }

  if (
    didMutateChildren &&
    shouldSortChildrenImmediately &&
    input.parentContainer.sortableChildren
  ) {
    input.parentContainer.sortChildren();
  }

  return {
    isComplete:
      missingChunkOrigins.length <= chunksToBuild.length &&
      staleChunkKeys.length <= chunksToPrune.length,
    chunksBuilt: chunksToBuild.length,
    chunksPruned: chunksToPrune.length,
    needsChildSort:
      didMutateChildren &&
      !shouldSortChildrenImmediately &&
      input.parentContainer.sortableChildren,
  };
}
