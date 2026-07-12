import { checkingWorldPlazaLavaAtTileIndex } from '@/components/world/domains/checkingWorldPlazaLavaAtTileIndex';
import { checkingWorldPlazaTerrainElevationTileIsCliffEdgeAtTileIndex } from '@/components/world/domains/checkingWorldPlazaTerrainElevationTileIsCliffEdgeAtTileIndex';
import { checkingWorldPlazaTileIsWithinColumnRockFootprintAtTileIndex } from '@/components/world/domains/checkingWorldPlazaTileIsWithinColumnRockFootprintAtTileIndex';
import { DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE } from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsConstants';
import {
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_COLUMN_MAX_VISIBLE_DEFAULT,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_COLUMN_PRUNE_BUDGET_PER_CALL,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_COLUMN_RETENTION_MARGIN_TILES,
} from '@/components/world/domains/definingWorldPlazaTerrainElevationConstants';
import type { DefiningWorldPlazaVisibleTileBounds } from '@/components/world/domains/definingWorldPlazaVisibleTileBounds';
import { buildingWorldPlazaVisibleTileBoundsCacheKey } from '@/components/world/domains/definingWorldPlazaVisibleTileBounds';
import {
  drawingWorldPlazaTerrainElevationColumnOnGraphics,
  type DrawingWorldPlazaTerrainElevationColumnDrawOptions,
} from '@/components/world/domains/drawingWorldPlazaTerrainElevationColumnOnGraphics';
import { formattingWorldPlazaTileIndexCacheKey } from '@/components/world/domains/formattingWorldPlazaTileIndexCacheKey';
import { markingWorldPlazaPixiDisplayObjectCullable } from '@/components/world/domains/markingWorldPlazaPixiDisplayObjectCullable';
import { beginningWorldPlazaPerformanceSample } from '@/components/world/domains/measuringWorldPlazaPerformanceDiagnostics';
import { checkingWorldPlazaTerrainElevationHasRaisedSurfaceAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaSurfaceLayerAtTileIndex';
import { resolvingWorldPlazaTerrainCachePruneBudget } from '@/components/world/domains/resolvingWorldPlazaTerrainCachePruneBudget';
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
  /**
   * Max nearest-player columns kept attached. Dense hills exceed this inside
   * the isometric window; farther raised tiles stay undrawn until closer.
   */
  readonly maxVisibleElevationColumns?: number;
  readonly maxColumnBuildsPerCall?: number;
  readonly maxColumnPrunesPerCall?: number;
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

/** Player tile used when the pending nearest-N list was last rebuilt. */
let syncingWorldPlazaVisibleTerrainElevationLastCenterTileX = Number.NaN;
let syncingWorldPlazaVisibleTerrainElevationLastCenterTileY = Number.NaN;

/** Sorted raised tiles still waiting for graphics within the current nearest-N. */
let syncingWorldPlazaVisibleTerrainElevationPendingCandidates: SyncingWorldPlazaVisibleTerrainElevationTileColumnCandidate[] =
  [];

/** Raised tile keys currently attached (nearest-N). */
let syncingWorldPlazaVisibleTerrainElevationNeededKeys = new Set<string>();

/** Bounds expanded by the retention margin; nearest-N edge hysteresis. */
let syncingWorldPlazaVisibleTerrainElevationRetentionBounds: DefiningWorldPlazaVisibleTileBounds | null =
  null;

/**
 * Clears incremental elevation sync state after terrain rule or cache changes.
 */
export function invalidatingWorldPlazaVisibleTerrainElevationTileColumnSyncState(): void {
  syncingWorldPlazaVisibleTerrainElevationLastBoundsKey = '';
  syncingWorldPlazaVisibleTerrainElevationLastCenterTileX = Number.NaN;
  syncingWorldPlazaVisibleTerrainElevationLastCenterTileY = Number.NaN;
  syncingWorldPlazaVisibleTerrainElevationPendingCandidates = [];
  syncingWorldPlazaVisibleTerrainElevationNeededKeys = new Set<string>();
  syncingWorldPlazaVisibleTerrainElevationRetentionBounds = null;
}

/**
 * Checks whether a `x:y` column cache key sits inside the given bounds.
 */
function checkingWorldPlazaElevationColumnKeyWithinBounds(
  cacheKey: string,
  bounds: DefiningWorldPlazaVisibleTileBounds
): boolean {
  const separatorIndex = cacheKey.indexOf(':');
  const tileX = Number(cacheKey.slice(0, separatorIndex));
  const tileY = Number(cacheKey.slice(separatorIndex + 1));

  return (
    tileX >= bounds.minTileX &&
    tileX <= bounds.maxTileX &&
    tileY >= bounds.minTileY &&
    tileY <= bounds.maxTileY
  );
}

/**
 * Lists raised tiles inside the visible bounds that need block columns.
 *
 * Only cliff-edge tiles (and raised lava caps) become entity-layer columns.
 * Plateau interiors render as flat lifted diamonds in the batched floor
 * chunks, so they never spend a per-tile Graphics or depth sort slot here.
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

      if (
        !checkingWorldPlazaLavaAtTileIndex(tileX, tileY) &&
        !checkingWorldPlazaTerrainElevationTileIsCliffEdgeAtTileIndex(
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
 * Rebuilds the nearest-N pending queue when the visible window or player tile shifts.
 *
 * @param bounds - Visible tile bounds.
 * @param centerTileX - Player tile column index.
 * @param centerTileY - Player tile row index.
 * @param maxVisibleElevationColumns - Nearest-player attach cap.
 */
function refreshingWorldPlazaVisibleTerrainElevationPendingCandidatesForBounds(
  bounds: DefiningWorldPlazaVisibleTileBounds,
  centerTileX: number,
  centerTileY: number,
  maxVisibleElevationColumns: number
): void {
  const raisedTileCandidates =
    listingWorldPlazaVisibleTerrainElevationRaisedTileCandidatesInBounds(
      bounds
    );

  raisedTileCandidates.sort((candidateA, candidateB) => {
    const distanceA =
      Math.abs(candidateA.tileX - centerTileX) +
      Math.abs(candidateA.tileY - centerTileY);
    const distanceB =
      Math.abs(candidateB.tileX - centerTileX) +
      Math.abs(candidateB.tileY - centerTileY);

    return distanceA - distanceB;
  });

  const attachedCandidates = raisedTileCandidates.slice(
    0,
    maxVisibleElevationColumns
  );
  const neededKeys = new Set<string>();

  for (const candidate of attachedCandidates) {
    neededKeys.add(
      formattingWorldPlazaTileIndexCacheKey(candidate.tileX, candidate.tileY)
    );
  }

  syncingWorldPlazaVisibleTerrainElevationPendingCandidates =
    attachedCandidates;
  syncingWorldPlazaVisibleTerrainElevationNeededKeys = neededKeys;
  syncingWorldPlazaVisibleTerrainElevationRetentionBounds = {
    minTileX:
      bounds.minTileX -
      DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_COLUMN_RETENTION_MARGIN_TILES,
    maxTileX:
      bounds.maxTileX +
      DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_COLUMN_RETENTION_MARGIN_TILES,
    minTileY:
      bounds.minTileY -
      DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_COLUMN_RETENTION_MARGIN_TILES,
    maxTileY:
      bounds.maxTileY +
      DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_COLUMN_RETENTION_MARGIN_TILES,
  };
}

/**
 * Adds or removes per-tile terrain columns as the visible window shifts.
 *
 * Columns live on the avatar entity layer so they depth-sort against players.
 * Only the nearest {@link SyncingWorldPlazaVisibleTerrainElevationTileColumnGraphicsLayerInput.maxVisibleElevationColumns}
 * raised tiles stay attached; denser hills beyond that cap stay undrawn until
 * the player walks closer (same pattern as `maxVisibleTrees`).
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
  const basePruneBudget =
    input.maxColumnPrunesPerCall ??
    DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_COLUMN_PRUNE_BUDGET_PER_CALL;
  const maxVisibleElevationColumns = Math.max(
    0,
    Math.floor(
      input.maxVisibleElevationColumns ??
        DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_COLUMN_MAX_VISIBLE_DEFAULT
    )
  );
  const shouldSortChildrenImmediately =
    input.shouldSortChildrenImmediately ?? false;
  const boundsKey = buildingWorldPlazaVisibleTileBoundsCacheKey(input.bounds);
  const centerTileChanged =
    input.centerTileX !==
      syncingWorldPlazaVisibleTerrainElevationLastCenterTileX ||
    input.centerTileY !==
      syncingWorldPlazaVisibleTerrainElevationLastCenterTileY;

  if (
    boundsKey !== syncingWorldPlazaVisibleTerrainElevationLastBoundsKey ||
    centerTileChanged
  ) {
    syncingWorldPlazaVisibleTerrainElevationLastBoundsKey = boundsKey;
    syncingWorldPlazaVisibleTerrainElevationLastCenterTileX = input.centerTileX;
    syncingWorldPlazaVisibleTerrainElevationLastCenterTileY = input.centerTileY;
    refreshingWorldPlazaVisibleTerrainElevationPendingCandidatesForBounds(
      input.bounds,
      input.centerTileX,
      input.centerTileY,
      maxVisibleElevationColumns
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

  const retentionBounds =
    syncingWorldPlazaVisibleTerrainElevationRetentionBounds;
  const softRetainLimit =
    maxVisibleElevationColumns +
    DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_COLUMN_PRUNE_BUDGET_PER_CALL;

  let staleKeyCount = 0;

  for (const cacheKey of input.columnGraphicsByKey.keys()) {
    if (syncingWorldPlazaVisibleTerrainElevationNeededKeys.has(cacheKey)) {
      continue;
    }

    // Soft-retain only columns that were previously nearest-N and still sit
    // inside the hysteresis ring. Never retain unbounded raised tiles from
    // outside the attach cap — that is what blew Map.size past 1000.
    if (
      retentionBounds &&
      checkingWorldPlazaElevationColumnKeyWithinBounds(
        cacheKey,
        retentionBounds
      ) &&
      input.columnGraphicsByKey.size <= softRetainLimit
    ) {
      continue;
    }

    staleKeyCount += 1;
  }

  const { pruneBudget, shouldDeferBuilds } =
    resolvingWorldPlazaTerrainCachePruneBudget({
      basePruneBudget,
      staleCount: staleKeyCount,
      neededCount: syncingWorldPlazaVisibleTerrainElevationNeededKeys.size,
    });

  let prunedCount = 0;
  let didMutateChildren = false;
  const finishTerrainPruneSample =
    staleKeyCount > 0
      ? beginningWorldPlazaPerformanceSample(
          DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE.TERRAIN_PRUNE
        )
      : null;

  for (const [cacheKey, columnGraphics] of input.columnGraphicsByKey) {
    if (syncingWorldPlazaVisibleTerrainElevationNeededKeys.has(cacheKey)) {
      if (columnGraphics.parent !== input.parentContainer) {
        input.parentContainer.addChild(columnGraphics);
        didMutateChildren = true;
      }

      continue;
    }

    if (
      retentionBounds &&
      checkingWorldPlazaElevationColumnKeyWithinBounds(
        cacheKey,
        retentionBounds
      ) &&
      input.columnGraphicsByKey.size - prunedCount <= softRetainLimit
    ) {
      // Keep Graphics for reuse, but detach so trunk-layer sort skips them.
      if (columnGraphics.parent === input.parentContainer) {
        input.parentContainer.removeChild(columnGraphics);
        didMutateChildren = true;
      }

      continue;
    }

    if (prunedCount >= pruneBudget) {
      break;
    }

    if (columnGraphics.parent === input.parentContainer) {
      input.parentContainer.removeChild(columnGraphics);
    }

    columnGraphics.destroy();
    input.columnGraphicsByKey.delete(cacheKey);
    prunedCount += 1;
    didMutateChildren = true;
  }

  finishTerrainPruneSample?.();

  const columnsToBuild =
    shouldDeferBuilds || maxVisibleElevationColumns === 0
      ? []
      : missingTileCandidates.slice(0, buildBudget);

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

  if (
    didMutateChildren &&
    shouldSortChildrenImmediately &&
    input.parentContainer.sortableChildren
  ) {
    input.parentContainer.sortChildren();
  }

  return {
    isComplete:
      missingTileCandidates.length <= columnsToBuild.length &&
      prunedCount >= staleKeyCount,
    columnsBuilt: columnsToBuild.length,
    needsChildSort:
      didMutateChildren &&
      !shouldSortChildrenImmediately &&
      input.parentContainer.sortableChildren,
  };
}
