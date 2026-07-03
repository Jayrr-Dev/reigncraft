import type { DefiningWorldPlazaVisibleTileBounds } from "@/components/world/domains/definingWorldPlazaVisibleTileBounds";
import { drawingWorldPlazaTerrainCollisionDebugChunkOnGraphics } from "@/components/world/domains/drawingWorldPlazaTerrainCollisionDebugChunkOnGraphics";
import { formattingWorldPlazaTileChunkCacheKey } from "@/components/world/domains/formattingWorldPlazaTileChunkCacheKey";
import { listingWorldPlazaTileChunkOriginsInBounds } from "@/components/world/domains/listingWorldPlazaTileChunkOriginsInBounds";
import { markingWorldPlazaPixiDisplayObjectCullable } from "@/components/world/domains/markingWorldPlazaPixiDisplayObjectCullable";
import type { Container } from "pixi.js";
import { Graphics } from "pixi.js";

/**
 * Incrementally syncs cached, cullable static collision debug chunks.
 *
 * Mirrors the floor chunk layer: each visible chunk's collider geometry is
 * drawn once into its own Graphics, cached by key, flagged cullable, and pruned
 * only when it leaves the padded window. Walking no longer rebuilds the overlay
 * every bounds shift, and the CullerPlugin skips off-screen chunks at render.
 *
 * @module components/world/domains/syncingWorldPlazaVisibleTerrainCollisionDebugChunkGraphicsLayer
 */

/** Default cap on new chunk builds per call when no budget is supplied. */
const SYNCING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_CHUNK_DEFAULT_BUILD_BUDGET = 2;

/** Input for {@link syncingWorldPlazaVisibleTerrainCollisionDebugChunkGraphicsLayer}. */
export interface SyncingWorldPlazaVisibleTerrainCollisionDebugChunkGraphicsLayerInput {
  readonly parentContainer: Container;
  readonly bounds: DefiningWorldPlazaVisibleTileBounds;
  readonly chunkSizeTiles: number;
  readonly chunkGraphicsByKey: Map<string, Graphics>;
  /** Center grid point used to build the nearest chunks first. */
  readonly centerTileX: number;
  readonly centerTileY: number;
  /** Max chunks to build this call; remaining chunks build on later frames. */
  readonly maxChunkBuildsPerCall?: number;
}

/** Result from {@link syncingWorldPlazaVisibleTerrainCollisionDebugChunkGraphicsLayer}. */
export interface SyncingWorldPlazaVisibleTerrainCollisionDebugChunkGraphicsLayerResult {
  /** True when every needed chunk exists. */
  readonly isComplete: boolean;
  /** Number of new chunks built during this call. */
  readonly chunksBuilt: number;
}

/**
 * Adds or removes debug chunk graphics as the visible window shifts.
 *
 * @param input - Parent container, bounds, chunk size, and cache.
 */
export function syncingWorldPlazaVisibleTerrainCollisionDebugChunkGraphicsLayer(
  input: SyncingWorldPlazaVisibleTerrainCollisionDebugChunkGraphicsLayerInput,
): SyncingWorldPlazaVisibleTerrainCollisionDebugChunkGraphicsLayerResult {
  const buildBudget = Math.max(
    1,
    input.maxChunkBuildsPerCall ??
      SYNCING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_CHUNK_DEFAULT_BUILD_BUDGET,
  );
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

  for (const { chunkOriginTileX, chunkOriginTileY } of chunksToBuild) {
    const cacheKey = formattingWorldPlazaTileChunkCacheKey(
      chunkOriginTileX,
      chunkOriginTileY,
    );
    const chunkGraphics = new Graphics();
    chunkGraphics.eventMode = "none";
    markingWorldPlazaPixiDisplayObjectCullable(chunkGraphics);
    drawingWorldPlazaTerrainCollisionDebugChunkOnGraphics(
      chunkGraphics,
      chunkOriginTileX,
      chunkOriginTileY,
      input.chunkSizeTiles,
    );
    input.parentContainer.addChild(chunkGraphics);
    input.chunkGraphicsByKey.set(cacheKey, chunkGraphics);
  }

  for (const [cacheKey, chunkGraphics] of input.chunkGraphicsByKey) {
    if (neededKeys.has(cacheKey)) {
      continue;
    }

    input.parentContainer.removeChild(chunkGraphics);
    chunkGraphics.destroy();
    input.chunkGraphicsByKey.delete(cacheKey);
  }

  return {
    isComplete: missingChunkOrigins.length <= chunksToBuild.length,
    chunksBuilt: chunksToBuild.length,
  };
}
