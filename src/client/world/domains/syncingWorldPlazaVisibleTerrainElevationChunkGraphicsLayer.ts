import { drawingWorldPlazaTerrainElevationChunkOnGraphics } from "@/components/world/domains/drawingWorldPlazaTerrainElevationChunkOnGraphics";
import type { DrawingWorldPlazaTerrainElevationColumnDrawOptions } from "@/components/world/domains/drawingWorldPlazaTerrainElevationColumnOnGraphics";
import { formattingWorldPlazaTileChunkCacheKey } from "@/components/world/domains/formattingWorldPlazaTileChunkCacheKey";
import {
  listingWorldPlazaTileChunkOriginsInBounds,
  resolvingWorldPlazaGrassFloorChunkGraphicsZIndex,
} from "@/components/world/domains/listingWorldPlazaTileChunkOriginsInBounds";
import { markingWorldPlazaPixiDisplayObjectCullable } from "@/components/world/domains/markingWorldPlazaPixiDisplayObjectCullable";
import type { DefiningWorldPlazaVisibleTileBounds } from "@/components/world/domains/definingWorldPlazaVisibleTileBounds";
import type { Container } from "pixi.js";
import { Graphics } from "pixi.js";

/**
 * Incrementally syncs batched terrain elevation chunks for a visible window.
 *
 * @module components/world/domains/syncingWorldPlazaVisibleTerrainElevationChunkGraphicsLayer
 */

/** Default cap on new elevation chunks built per call. */
const SYNCING_WORLD_PLAZA_VISIBLE_TERRAIN_ELEVATION_CHUNK_DEFAULT_BUILD_BUDGET = 2;

/** Input for {@link syncingWorldPlazaVisibleTerrainElevationChunkGraphicsLayer}. */
export interface SyncingWorldPlazaVisibleTerrainElevationChunkGraphicsLayerInput {
  readonly parentContainer: Container;
  readonly bounds: DefiningWorldPlazaVisibleTileBounds;
  readonly chunkSizeTiles: number;
  readonly chunkGraphicsByKey: Map<string, Graphics>;
  /** Flat chunks with no raised tiles; avoids rebuilding empty regions every frame. */
  readonly emptyChunkKeys: Set<string>;
  readonly drawOptions?: DrawingWorldPlazaTerrainElevationColumnDrawOptions;
  readonly centerTileX: number;
  readonly centerTileY: number;
  readonly maxChunkBuildsPerCall?: number;
  readonly shouldSortChildrenImmediately?: boolean;
}

/** Result from {@link syncingWorldPlazaVisibleTerrainElevationChunkGraphicsLayer}. */
export interface SyncingWorldPlazaVisibleTerrainElevationChunkGraphicsLayerResult {
  readonly isComplete: boolean;
  readonly chunksBuilt: number;
  readonly needsChildSort: boolean;
}

/**
 * Adds or removes elevation chunk graphics as the visible window shifts.
 *
 * @param input - Parent container, bounds, chunk size, caches, and build budget.
 */
export function syncingWorldPlazaVisibleTerrainElevationChunkGraphicsLayer(
  input: SyncingWorldPlazaVisibleTerrainElevationChunkGraphicsLayerInput,
): SyncingWorldPlazaVisibleTerrainElevationChunkGraphicsLayerResult {
  const buildBudget = Math.max(
    1,
    input.maxChunkBuildsPerCall ??
      SYNCING_WORLD_PLAZA_VISIBLE_TERRAIN_ELEVATION_CHUNK_DEFAULT_BUILD_BUDGET,
  );
  const shouldSortChildrenImmediately =
    input.shouldSortChildrenImmediately ?? true;
  const chunkOrigins = listingWorldPlazaTileChunkOriginsInBounds(
    input.bounds,
    input.chunkSizeTiles,
  );
  const neededKeys = new Set<string>();
  const missingChunkOrigins: typeof chunkOrigins = [];

  for (const chunkOrigin of chunkOrigins) {
    const cacheKey = formattingWorldPlazaTileChunkCacheKey(
      chunkOrigin.chunkOriginTileX,
      chunkOrigin.chunkOriginTileY,
    );
    neededKeys.add(cacheKey);

    if (
      input.chunkGraphicsByKey.has(cacheKey) ||
      input.emptyChunkKeys.has(cacheKey)
    ) {
      continue;
    }

    missingChunkOrigins.push(chunkOrigin);
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
  let didMutateChildren = false;

  for (const { chunkOriginTileX, chunkOriginTileY } of chunksToBuild) {
    const cacheKey = formattingWorldPlazaTileChunkCacheKey(
      chunkOriginTileX,
      chunkOriginTileY,
    );
    const chunkGraphics = new Graphics();
    chunkGraphics.eventMode = "none";
    const raisedColumnCount = drawingWorldPlazaTerrainElevationChunkOnGraphics({
      graphics: chunkGraphics,
      chunkOriginTileX,
      chunkOriginTileY,
      chunkSizeTiles: input.chunkSizeTiles,
      drawOptions: input.drawOptions,
    });

    if (raisedColumnCount === 0) {
      chunkGraphics.destroy();
      input.emptyChunkKeys.add(cacheKey);
      continue;
    }

    markingWorldPlazaPixiDisplayObjectCullable(chunkGraphics);
    chunkGraphics.zIndex = resolvingWorldPlazaGrassFloorChunkGraphicsZIndex(
      chunkOriginTileX,
      chunkOriginTileY,
    );
    input.parentContainer.addChild(chunkGraphics);
    input.chunkGraphicsByKey.set(cacheKey, chunkGraphics);
    didMutateChildren = true;
  }

  for (const [cacheKey, chunkGraphics] of input.chunkGraphicsByKey) {
    if (neededKeys.has(cacheKey)) {
      continue;
    }

    input.parentContainer.removeChild(chunkGraphics);
    chunkGraphics.destroy();
    input.chunkGraphicsByKey.delete(cacheKey);
    didMutateChildren = true;
  }

  for (const cacheKey of input.emptyChunkKeys) {
    if (neededKeys.has(cacheKey)) {
      continue;
    }

    input.emptyChunkKeys.delete(cacheKey);
  }

  if (
    didMutateChildren &&
    shouldSortChildrenImmediately &&
    input.parentContainer.sortableChildren
  ) {
    input.parentContainer.sortChildren();
  }

  return {
    isComplete: missingChunkOrigins.length <= chunksToBuild.length,
    chunksBuilt: chunksToBuild.length,
    needsChildSort:
      didMutateChildren &&
      !shouldSortChildrenImmediately &&
      input.parentContainer.sortableChildren,
  };
}
