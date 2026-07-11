import { checkingWorldPlazaTileIsWithinColumnRockFootprintAtTileIndex } from '@/components/world/domains/checkingWorldPlazaTileIsWithinColumnRockFootprintAtTileIndex';
import type { DefiningWorldPlazaVisibleTileBounds } from '@/components/world/domains/definingWorldPlazaVisibleTileBounds';
import { buildingWorldPlazaVisibleTileBoundsCacheKey } from '@/components/world/domains/definingWorldPlazaVisibleTileBounds';
import {
  drawingWorldPlazaTerrainElevationColumnOnGraphics,
  type DrawingWorldPlazaTerrainElevationColumnDrawOptions,
} from '@/components/world/domains/drawingWorldPlazaTerrainElevationColumnOnGraphics';
import { formattingWorldPlazaTileIndexCacheKey } from '@/components/world/domains/formattingWorldPlazaTileIndexCacheKey';
import { markingWorldPlazaPixiDisplayObjectCullable } from '@/components/world/domains/markingWorldPlazaPixiDisplayObjectCullable';
import { checkingWorldPlazaTerrainElevationHasRaisedSurfaceAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaSurfaceLayerAtTileIndex';
import { resolvingWorldPlazaTerrainElevationColumnRenderEntityZIndex } from '@/components/world/domains/resolvingWorldPlazaTerrainElevationColumnEntityZIndex';
import type { Container } from 'pixi.js';
import { Graphics } from 'pixi.js';

/**
 * Incrementally syncs depth-sorted terrain elevation columns for a visible window.
 *
 * @module components/world/domains/syncingWorldPlazaVisibleTerrainElevationTileColumnGraphicsLayer
 */

/** Default cap on new terrain columns built per call. */
const SYNCING_WORLD_PLAZA_VISIBLE_TERRAIN_ELEVATION_TILE_COLUMN_DEFAULT_BUILD_BUDGET = 16;

/** One raised tile in the visible window. */
interface SyncingWorldPlazaVisibleTerrainElevationTileColumnCandidate {
  readonly tileX: number;
  readonly tileY: number;
}

/** Input for {@link syncingWorldPlazaVisibleTerrainElevationTileColumnGraphicsLayer}. */
export interface SyncingWorldPlazaVisibleTerrainElevationTileColumnGraphicsLayerInput {
  readonly parentContainer: Container;
  readonly bounds: DefiningWorldPlazaVisibleTileBounds;
  readonly columnGraphicsByKey: Map<string, Graphics>;
  readonly drawOptions?: DrawingWorldPlazaTerrainElevationColumnDrawOptions;
  readonly centerTileX: number;
  readonly centerTileY: number;
  readonly maxColumnBuildsPerCall?: number;
  readonly shouldSortChildrenImmediately?: boolean;
}

/** Result from {@link syncingWorldPlazaVisibleTerrainElevationTileColumnGraphicsLayer}. */
export interface SyncingWorldPlazaVisibleTerrainElevationTileColumnGraphicsLayerResult {
  readonly isComplete: boolean;
  readonly columnsBuilt: number;
  readonly needsChildSort: boolean;
}

/** Bounds key for the last full raised-tile listing pass. */
let syncingWorldPlazaVisibleTerrainElevationLastBoundsKey = '';

/** Sorted raised tiles still waiting for graphics within the current bounds. */
let syncingWorldPlazaVisibleTerrainElevationPendingCandidates: SyncingWorldPlazaVisibleTerrainElevationTileColumnCandidate[] =
  [];

/** Raised tile keys still required within the current bounds. */
let syncingWorldPlazaVisibleTerrainElevationNeededKeys = new Set<string>();

/**
 * Clears incremental elevation sync state after terrain rule or cache changes.
 */
export function invalidatingWorldPlazaVisibleTerrainElevationTileColumnSyncState(): void {
  syncingWorldPlazaVisibleTerrainElevationLastBoundsKey = '';
  syncingWorldPlazaVisibleTerrainElevationPendingCandidates = [];
  syncingWorldPlazaVisibleTerrainElevationNeededKeys = new Set<string>();
}

/**
 * Lists every raised tile inside the visible bounds.
 *
 * @param bounds - Visible tile bounds.
 */
function listingWorldPlazaVisibleTerrainElevationRaisedTileCandidatesInBounds(
  bounds: DefiningWorldPlazaVisibleTileBounds
): SyncingWorldPlazaVisibleTerrainElevationTileColumnCandidate[] {
  const candidates: SyncingWorldPlazaVisibleTerrainElevationTileColumnCandidate[] =
    [];

  for (let tileY = bounds.minTileY; tileY <= bounds.maxTileY; tileY += 1) {
    for (let tileX = bounds.minTileX; tileX <= bounds.maxTileX; tileX += 1) {
      if (
        !checkingWorldPlazaTerrainElevationHasRaisedSurfaceAtTileIndex(
          tileX,
          tileY
        )
      ) {
        continue;
      }

      if (
        checkingWorldPlazaTileIsWithinColumnRockFootprintAtTileIndex(
          tileX,
          tileY
        )
      ) {
        continue;
      }

      candidates.push({ tileX, tileY });
    }
  }

  return candidates;
}

/**
 * Rebuilds the pending raised-tile queue when the visible bounds window shifts.
 *
 * @param bounds - Visible tile bounds.
 * @param centerTileX - Player tile column index.
 * @param centerTileY - Player tile row index.
 */
function refreshingWorldPlazaVisibleTerrainElevationPendingCandidatesForBounds(
  bounds: DefiningWorldPlazaVisibleTileBounds,
  centerTileX: number,
  centerTileY: number
): void {
  const raisedTileCandidates =
    listingWorldPlazaVisibleTerrainElevationRaisedTileCandidatesInBounds(
      bounds
    );
  const neededKeys = new Set<string>();

  for (const candidate of raisedTileCandidates) {
    neededKeys.add(
      formattingWorldPlazaTileIndexCacheKey(candidate.tileX, candidate.tileY)
    );
  }

  raisedTileCandidates.sort((candidateA, candidateB) => {
    const distanceA =
      Math.abs(candidateA.tileX - centerTileX) +
      Math.abs(candidateA.tileY - centerTileY);
    const distanceB =
      Math.abs(candidateB.tileX - centerTileX) +
      Math.abs(candidateB.tileY - centerTileY);

    return distanceA - distanceB;
  });

  syncingWorldPlazaVisibleTerrainElevationPendingCandidates =
    raisedTileCandidates;
  syncingWorldPlazaVisibleTerrainElevationNeededKeys = neededKeys;
}

/**
 * Adds or removes per-tile terrain columns as the visible window shifts.
 *
 * Columns live on the avatar entity layer so they depth-sort against players.
 * A bounds-scoped pending queue avoids rescanning every visible tile each frame
 * while columns are still building incrementally.
 *
 * @param input - Parent container, bounds, cache, and build budget.
 */
export function syncingWorldPlazaVisibleTerrainElevationTileColumnGraphicsLayer(
  input: SyncingWorldPlazaVisibleTerrainElevationTileColumnGraphicsLayerInput
): SyncingWorldPlazaVisibleTerrainElevationTileColumnGraphicsLayerResult {
  const buildBudget = Math.max(
    1,
    input.maxColumnBuildsPerCall ??
      SYNCING_WORLD_PLAZA_VISIBLE_TERRAIN_ELEVATION_TILE_COLUMN_DEFAULT_BUILD_BUDGET
  );
  const shouldSortChildrenImmediately =
    input.shouldSortChildrenImmediately ?? false;
  const boundsKey = buildingWorldPlazaVisibleTileBoundsCacheKey(input.bounds);

  if (boundsKey !== syncingWorldPlazaVisibleTerrainElevationLastBoundsKey) {
    syncingWorldPlazaVisibleTerrainElevationLastBoundsKey = boundsKey;
    refreshingWorldPlazaVisibleTerrainElevationPendingCandidatesForBounds(
      input.bounds,
      input.centerTileX,
      input.centerTileY
    );
  }

  const missingTileCandidates: SyncingWorldPlazaVisibleTerrainElevationTileColumnCandidate[] =
    [];

  for (const candidate of syncingWorldPlazaVisibleTerrainElevationPendingCandidates) {
    const cacheKey = formattingWorldPlazaTileIndexCacheKey(
      candidate.tileX,
      candidate.tileY
    );

    if (input.columnGraphicsByKey.has(cacheKey)) {
      continue;
    }

    missingTileCandidates.push(candidate);
  }

  const columnsToBuild = missingTileCandidates.slice(0, buildBudget);
  let didMutateChildren = false;

  for (const candidate of columnsToBuild) {
    const cacheKey = formattingWorldPlazaTileIndexCacheKey(
      candidate.tileX,
      candidate.tileY
    );
    const columnGraphics = new Graphics();
    columnGraphics.eventMode = 'none';
    markingWorldPlazaPixiDisplayObjectCullable(columnGraphics);
    columnGraphics.zIndex =
      resolvingWorldPlazaTerrainElevationColumnRenderEntityZIndex(
        candidate.tileX,
        candidate.tileY
      );
    drawingWorldPlazaTerrainElevationColumnOnGraphics(
      columnGraphics,
      candidate.tileX,
      candidate.tileY,
      input.drawOptions
    );
    input.parentContainer.addChild(columnGraphics);
    input.columnGraphicsByKey.set(cacheKey, columnGraphics);
    didMutateChildren = true;
  }

  for (const [cacheKey, columnGraphics] of input.columnGraphicsByKey) {
    if (syncingWorldPlazaVisibleTerrainElevationNeededKeys.has(cacheKey)) {
      continue;
    }

    input.parentContainer.removeChild(columnGraphics);
    columnGraphics.destroy();
    input.columnGraphicsByKey.delete(cacheKey);
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
  };
}
