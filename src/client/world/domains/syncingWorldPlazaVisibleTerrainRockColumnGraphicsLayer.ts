import {
  DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_DEFAULT_BUILD_BUDGET,
  checkingWorldPlazaStoneDecorationUsesColumnRockRendering,
} from "@/components/world/domains/definingWorldPlazaTerrainRockConstants";
import type { DefiningWorldPlazaVisibleTileBounds } from "@/components/world/domains/definingWorldPlazaVisibleTileBounds";
import { checkingWorldPlazaTerrainRockColumnSpacingAnchorAtTileIndex } from "@/components/world/domains/checkingWorldPlazaTerrainRockColumnSpacingAnchorAtTileIndex";
import { drawingWorldPlazaTerrainRockColumnOnGraphics } from "@/components/world/domains/drawingWorldPlazaTerrainRockColumnOnGraphics";
import { formattingWorldPlazaTileIndexCacheKey } from "@/components/world/domains/formattingWorldPlazaTileIndexCacheKey";
import { markingWorldPlazaPixiDisplayObjectCullable } from "@/components/world/domains/markingWorldPlazaPixiDisplayObjectCullable";
import { resolvingWorldPlazaStoneDecorationAtTileIndex } from "@/components/world/domains/resolvingWorldPlazaStoneDecorationAtTileIndex";
import { resolvingWorldPlazaTerrainRockColumnEntityZIndex } from "@/components/world/domains/resolvingWorldPlazaTerrainRockColumnEntityZIndex";
import type { Container } from "pixi.js";
import { Graphics } from "pixi.js";

/**
 * Incrementally syncs depth-sorted procedural rock columns for a visible window.
 *
 * @module components/world/domains/syncingWorldPlazaVisibleTerrainRockColumnGraphicsLayer
 */

/** One medium or large rock tile in the visible window. */
interface SyncingWorldPlazaVisibleTerrainRockColumnCandidate {
  readonly tileX: number;
  readonly tileY: number;
}

/** Input for {@link syncingWorldPlazaVisibleTerrainRockColumnGraphicsLayer}. */
export interface SyncingWorldPlazaVisibleTerrainRockColumnGraphicsLayerInput {
  readonly parentContainer: Container;
  readonly bounds: DefiningWorldPlazaVisibleTileBounds;
  readonly rockGraphicsByKey: Map<string, Graphics>;
  readonly centerTileX: number;
  readonly centerTileY: number;
  readonly maxColumnBuildsPerCall?: number;
  readonly shouldSortChildrenImmediately?: boolean;
}

/** Result from {@link syncingWorldPlazaVisibleTerrainRockColumnGraphicsLayer}. */
export interface SyncingWorldPlazaVisibleTerrainRockColumnGraphicsLayerResult {
  readonly isComplete: boolean;
  readonly columnsBuilt: number;
  readonly needsChildSort: boolean;
  /** Anchor tiles for rocks built this call; used for targeted floor invalidation. */
  readonly builtAnchorTileIndices: readonly SyncingWorldPlazaVisibleTerrainRockColumnCandidate[];
}

/**
 * Lists spacing anchors for visible mega-boulders (one graphics object per boulder).
 *
 * @param bounds - Visible tile bounds.
 */
function listingWorldPlazaVisibleTerrainRockColumnCandidatesInBounds(
  bounds: DefiningWorldPlazaVisibleTileBounds,
): SyncingWorldPlazaVisibleTerrainRockColumnCandidate[] {
  const candidates: SyncingWorldPlazaVisibleTerrainRockColumnCandidate[] = [];

  for (let tileY = bounds.minTileY; tileY <= bounds.maxTileY; tileY += 1) {
    for (let tileX = bounds.minTileX; tileX <= bounds.maxTileX; tileX += 1) {
      if (!checkingWorldPlazaTerrainRockColumnSpacingAnchorAtTileIndex(tileX, tileY)) {
        continue;
      }

      const stoneDecoration = resolvingWorldPlazaStoneDecorationAtTileIndex(
        tileX,
        tileY,
      );

      if (
        !stoneDecoration ||
        !checkingWorldPlazaStoneDecorationUsesColumnRockRendering(
          stoneDecoration.sizeTierIndex,
        ) ||
        stoneDecoration.surfaceWorldLayer === null
      ) {
        continue;
      }

      candidates.push({ tileX, tileY });
    }
  }

  return candidates;
}

/**
 * Adds or removes per-tile rock columns as the visible window shifts.
 *
 * Columns live on the avatar entity layer so they depth-sort against players.
 *
 * @param input - Parent container, bounds, cache, and build budget.
 */
export function syncingWorldPlazaVisibleTerrainRockColumnGraphicsLayer(
  input: SyncingWorldPlazaVisibleTerrainRockColumnGraphicsLayerInput,
): SyncingWorldPlazaVisibleTerrainRockColumnGraphicsLayerResult {
  const buildBudget = Math.max(
    1,
    input.maxColumnBuildsPerCall ??
      DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_DEFAULT_BUILD_BUDGET,
  );
  const shouldSortChildrenImmediately =
    input.shouldSortChildrenImmediately ?? true;
  const rockTileCandidates =
    listingWorldPlazaVisibleTerrainRockColumnCandidatesInBounds(input.bounds);
  const neededKeys = new Set<string>();
  const missingTileCandidates: SyncingWorldPlazaVisibleTerrainRockColumnCandidate[] =
    [];
  let didMutateChildren = false;

  for (const candidate of rockTileCandidates) {
    const cacheKey = formattingWorldPlazaTileIndexCacheKey(
      candidate.tileX,
      candidate.tileY,
    );
    neededKeys.add(cacheKey);

    const existingRockGraphics = input.rockGraphicsByKey.get(cacheKey);
    const stoneDecoration = resolvingWorldPlazaStoneDecorationAtTileIndex(
      candidate.tileX,
      candidate.tileY,
    );

    if (
      existingRockGraphics &&
      (!stoneDecoration ||
        stoneDecoration.surfaceWorldLayer === null ||
        existingRockGraphics.label !==
          String(stoneDecoration.surfaceWorldLayer))
    ) {
      input.parentContainer.removeChild(existingRockGraphics);
      existingRockGraphics.destroy();
      input.rockGraphicsByKey.delete(cacheKey);
      didMutateChildren = true;
    }

    if (input.rockGraphicsByKey.has(cacheKey)) {
      continue;
    }

    missingTileCandidates.push(candidate);
  }

  missingTileCandidates.sort((candidateA, candidateB) => {
    const distanceA =
      Math.abs(candidateA.tileX - input.centerTileX) +
      Math.abs(candidateA.tileY - input.centerTileY);
    const distanceB =
      Math.abs(candidateB.tileX - input.centerTileX) +
      Math.abs(candidateB.tileY - input.centerTileY);

    return distanceA - distanceB;
  });

  const columnsToBuild = missingTileCandidates.slice(0, buildBudget);

  for (const candidate of rockTileCandidates) {
    const cacheKey = formattingWorldPlazaTileIndexCacheKey(
      candidate.tileX,
      candidate.tileY,
    );
    const existingRockGraphics = input.rockGraphicsByKey.get(cacheKey);

    if (!existingRockGraphics) {
      continue;
    }

    const stoneDecoration = resolvingWorldPlazaStoneDecorationAtTileIndex(
      candidate.tileX,
      candidate.tileY,
    );

    if (!stoneDecoration || stoneDecoration.surfaceWorldLayer === null) {
      continue;
    }

    const nextRockZIndex = resolvingWorldPlazaTerrainRockColumnEntityZIndex(
      candidate.tileX,
      candidate.tileY,
      stoneDecoration,
    );

    if (existingRockGraphics.zIndex !== nextRockZIndex) {
      existingRockGraphics.zIndex = nextRockZIndex;
      didMutateChildren = true;
    }
  }

  for (const candidate of columnsToBuild) {
    const stoneDecoration = resolvingWorldPlazaStoneDecorationAtTileIndex(
      candidate.tileX,
      candidate.tileY,
    );

    if (!stoneDecoration || stoneDecoration.surfaceWorldLayer === null) {
      continue;
    }

    const cacheKey = formattingWorldPlazaTileIndexCacheKey(
      candidate.tileX,
      candidate.tileY,
    );
    const rockGraphics = new Graphics();
    rockGraphics.eventMode = "none";
    rockGraphics.label = String(stoneDecoration.surfaceWorldLayer);
    markingWorldPlazaPixiDisplayObjectCullable(rockGraphics);
    rockGraphics.zIndex = resolvingWorldPlazaTerrainRockColumnEntityZIndex(
      candidate.tileX,
      candidate.tileY,
      stoneDecoration,
    );
    drawingWorldPlazaTerrainRockColumnOnGraphics(
      rockGraphics,
      candidate.tileX,
      candidate.tileY,
      stoneDecoration,
    );
    input.parentContainer.addChild(rockGraphics);
    input.rockGraphicsByKey.set(cacheKey, rockGraphics);
    didMutateChildren = true;
  }

  for (const [cacheKey, rockGraphics] of input.rockGraphicsByKey) {
    if (neededKeys.has(cacheKey)) {
      continue;
    }

    input.parentContainer.removeChild(rockGraphics);
    rockGraphics.destroy();
    input.rockGraphicsByKey.delete(cacheKey);
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
    isComplete: missingTileCandidates.length <= columnsToBuild.length,
    columnsBuilt: columnsToBuild.length,
    needsChildSort:
      didMutateChildren &&
      !shouldSortChildrenImmediately &&
      input.parentContainer.sortableChildren,
    builtAnchorTileIndices: columnsToBuild,
  };
}
