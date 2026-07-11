import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import {
  buildingWorldPlazaVisibleTreeDrawEntries,
  type BuildingWorldPlazaVisibleTreeDrawEntry,
} from '@/components/world/domains/buildingWorldPlazaVisibleTreeDrawEntries';
import { computingWorldPlazaTreeCanopyPlayerScreenOcclusionStrength } from '@/components/world/domains/computingWorldPlazaTreeCanopyPlayerScreenOcclusionStrength';
import { convertingWorldPlazaGridPointToIsometricScreenPoint } from '@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint';
import { computingWorldPlazaGirlSampleSpriteExtentAboveGridAnchorPx } from '@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants';
import { DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE } from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import {
  DEFINING_WORLD_PLAZA_TREE_CANOPY_DEFAULT_ALPHA,
  DEFINING_WORLD_PLAZA_TREE_CANOPY_PLAYER_OCCLUSION_ALPHA_EPSILON,
  DEFINING_WORLD_PLAZA_TREE_CANOPY_PLAYER_OCCLUSION_ALPHA_LERP,
  DEFINING_WORLD_PLAZA_TREE_CANOPY_UNDER_PLAYER_ALPHA,
} from '@/components/world/domains/definingWorldPlazaTreeCanopyPlayerOcclusionConstants';
import type { DefiningWorldPlazaVisibleTileBounds } from '@/components/world/domains/definingWorldPlazaVisibleTileBounds';
import { drawingWorldPlazaTreeCanopyOnGraphicsAtScreenPoint } from '@/components/world/domains/drawingWorldPlazaTreeOnGraphics';
import { formattingWorldPlazaTreeDrawCacheKey } from '@/components/world/domains/formattingWorldPlazaTreeDrawCacheKey';
import { markingWorldPlazaPixiDisplayObjectCullable } from '@/components/world/domains/markingWorldPlazaPixiDisplayObjectCullable';
import { beginningWorldPlazaPerformanceSample } from '@/components/world/domains/measuringWorldPlazaPerformanceDiagnostics';
import { resolvingWorldPlazaTerrainCachePruneBudget } from '@/components/world/domains/resolvingWorldPlazaTerrainCachePruneBudget';
import type { DefiningWorldPlazaTreeInstance } from '@/components/world/domains/resolvingWorldPlazaTreeAtTileIndex';
import { resolvingWorldPlazaTreeCanopyEntityZIndex } from '@/components/world/domains/resolvingWorldPlazaTreeCanopyEntityZIndex';
import { Container, Graphics } from 'pixi.js';

/**
 * Imperative tree canopy layer with incremental bounds sync and batched alpha.
 *
 * @module components/world/domains/syncingWorldPlazaVisibleTreeCanopyLayer
 */

/** One cached canopy container and its draw metadata. */
export interface SyncingWorldPlazaVisibleTreeCanopyLayerEntry {
  readonly container: Container;
  readonly tree: DefiningWorldPlazaTreeInstance;
  readonly baseScreenX: number;
  readonly baseScreenY: number;
  /** Trunk base Y including terrain elevation lift, matching the drawn crown. */
  readonly elevatedBaseScreenY: number;
}

/** Input for {@link syncingWorldPlazaVisibleTreeCanopyLayer}. */
export interface SyncingWorldPlazaVisibleTreeCanopyLayerInput {
  readonly parentContainer: Container;
  readonly bounds: DefiningWorldPlazaVisibleTileBounds;
  /** Shared entries reused by tree layers during the same terrain tick. */
  readonly drawEntries?: readonly BuildingWorldPlazaVisibleTreeDrawEntry[];
  readonly canopyEntriesByKey: Map<
    string,
    SyncingWorldPlazaVisibleTreeCanopyLayerEntry
  >;
  readonly maxVisibleTrees?: number;
  /** Tile column the visible-tree cap keeps trees nearest to (player). */
  readonly centerTileX?: number;
  /** Tile row the visible-tree cap keeps trees nearest to. */
  readonly centerTileY?: number;
  /** Placed blocks considered for tree overrides and surface layer. */
  readonly placedBlocks?: DefiningWorldBuildingPlacedBlock[];
  /** Chopped-tree remaining visual layers keyed by tile. */
  readonly choppedTreeStateByTileKey?: ReadonlyMap<
    string,
    import('@/components/world/harvest/domains/managingWorldPlazaLocalChoppedTrees').DefiningWorldPlazaChoppedTreeTileState
  >;
  /** When false, caller runs sortChildren once after all mutations this tick. */
  readonly shouldSortChildrenImmediately?: boolean;
  /** Max new canopies to draw this call; omit to build every missing canopy. */
  readonly maxTreeBuildsPerCall?: number;
  /** Max stale canopies removed per call; omit to prune all stale canopies. */
  readonly maxTreePrunesPerCall?: number;
}

/** Result from {@link syncingWorldPlazaVisibleTreeCanopyLayer}. */
export interface SyncingWorldPlazaVisibleTreeCanopyLayerResult {
  /** True when every needed canopy exists and stale canopies were pruned. */
  readonly isComplete: boolean;
  /** Number of new canopies built during this call. */
  readonly treesBuilt: number;
  /** True when z-order must be refreshed on the parent container. */
  readonly needsChildSort: boolean;
}

/**
 * Adds or removes canopy containers for trees entering or leaving the window.
 *
 * Stale canopies prune first (with a burst budget when backlog grows). New
 * canopies are nearest-first and capped per call so a forest bounds cross
 * does not hitch a single frame.
 *
 * @param input - Parent container, bounds, and canopy cache.
 */
export function syncingWorldPlazaVisibleTreeCanopyLayer(
  input: SyncingWorldPlazaVisibleTreeCanopyLayerInput
): SyncingWorldPlazaVisibleTreeCanopyLayerResult {
  const shouldSortChildrenImmediately =
    input.shouldSortChildrenImmediately ?? false;
  const buildBudget =
    input.maxTreeBuildsPerCall === undefined
      ? Number.POSITIVE_INFINITY
      : Math.max(1, input.maxTreeBuildsPerCall);
  const basePruneBudget =
    input.maxTreePrunesPerCall === undefined
      ? Number.POSITIVE_INFINITY
      : Math.max(0, input.maxTreePrunesPerCall);
  const centerTileX = input.centerTileX ?? 0;
  const centerTileY = input.centerTileY ?? 0;
  const drawEntries =
    input.drawEntries ??
    buildingWorldPlazaVisibleTreeDrawEntries(
      input.bounds,
      input.maxVisibleTrees,
      input.centerTileX,
      input.centerTileY,
      input.placedBlocks ?? [],
      input.choppedTreeStateByTileKey
    );
  const neededKeys = new Set<string>();
  const missingEntries: BuildingWorldPlazaVisibleTreeDrawEntry[] = [];
  let didMutateChildren = false;

  for (const entry of drawEntries) {
    const cacheKey = formattingWorldPlazaTreeDrawCacheKey(entry.tree);
    neededKeys.add(cacheKey);

    if (input.canopyEntriesByKey.has(cacheKey)) {
      continue;
    }

    missingEntries.push(entry);
  }

  missingEntries.sort((entryA, entryB) => {
    const distanceA =
      Math.abs(entryA.tree.tileX - centerTileX) +
      Math.abs(entryA.tree.tileY - centerTileY);
    const distanceB =
      Math.abs(entryB.tree.tileX - centerTileX) +
      Math.abs(entryB.tree.tileY - centerTileY);

    return distanceA - distanceB;
  });

  let staleKeyCount = 0;

  for (const cacheKey of input.canopyEntriesByKey.keys()) {
    if (!neededKeys.has(cacheKey)) {
      staleKeyCount += 1;
    }
  }

  const { pruneBudget, shouldDeferBuilds } =
    resolvingWorldPlazaTerrainCachePruneBudget({
      basePruneBudget: Number.isFinite(basePruneBudget)
        ? basePruneBudget
        : staleKeyCount,
      staleCount: staleKeyCount,
      neededCount: neededKeys.size,
    });
  const effectivePruneBudget = Number.isFinite(basePruneBudget)
    ? pruneBudget
    : Number.POSITIVE_INFINITY;

  let prunedCount = 0;
  const finishTerrainPruneSample =
    staleKeyCount > 0
      ? beginningWorldPlazaPerformanceSample(
          DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE.TERRAIN_PRUNE
        )
      : null;

  for (const [cacheKey, entry] of input.canopyEntriesByKey) {
    if (neededKeys.has(cacheKey)) {
      continue;
    }

    if (prunedCount >= effectivePruneBudget) {
      break;
    }

    input.parentContainer.removeChild(entry.container);
    entry.container.destroy({ children: true });
    input.canopyEntriesByKey.delete(cacheKey);
    didMutateChildren = true;
    prunedCount += 1;
  }

  finishTerrainPruneSample?.();

  const entriesToBuild =
    shouldDeferBuilds && Number.isFinite(basePruneBudget)
      ? []
      : missingEntries.slice(0, buildBudget);

  for (const entry of entriesToBuild) {
    const cacheKey = formattingWorldPlazaTreeDrawCacheKey(entry.tree);
    const elevatedBaseScreenY = entry.baseScreenY + entry.elevationOffsetYPx;
    const canopyContainer = new Container();
    canopyContainer.eventMode = 'none';
    markingWorldPlazaPixiDisplayObjectCullable(canopyContainer);
    canopyContainer.zIndex = resolvingWorldPlazaTreeCanopyEntityZIndex(
      entry.baseScreenY,
      entry.tree
    );

    const canopyGraphics = new Graphics();
    canopyGraphics.eventMode = 'none';
    drawingWorldPlazaTreeCanopyOnGraphicsAtScreenPoint(
      canopyGraphics,
      entry.tree,
      entry.baseScreenX,
      elevatedBaseScreenY
    );
    canopyContainer.addChild(canopyGraphics);
    input.parentContainer.addChild(canopyContainer);
    input.canopyEntriesByKey.set(cacheKey, {
      container: canopyContainer,
      tree: entry.tree,
      baseScreenX: entry.baseScreenX,
      baseScreenY: entry.baseScreenY,
      elevatedBaseScreenY,
    });
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
      missingEntries.length <= entriesToBuild.length &&
      prunedCount >= staleKeyCount,
    treesBuilt: entriesToBuild.length,
    needsChildSort:
      didMutateChildren &&
      !shouldSortChildrenImmediately &&
      input.parentContainer.sortableChildren,
  };
}

/**
 * Updates under-canopy fade alpha for every visible canopy in one pass.
 *
 * @param canopyEntriesByKey - Live canopy cache.
 * @param playerPosition - Local player position in grid space.
 */
export function updatingWorldPlazaVisibleTreeCanopyLayerAlpha(
  canopyEntriesByKey: ReadonlyMap<
    string,
    SyncingWorldPlazaVisibleTreeCanopyLayerEntry
  >,
  playerPosition: DefiningWorldPlazaWorldPoint
): void {
  const playerScreenPoint =
    convertingWorldPlazaGridPointToIsometricScreenPoint(playerPosition);
  const avatarBodyCenterScreenY =
    playerScreenPoint.y -
    computingWorldPlazaGirlSampleSpriteExtentAboveGridAnchorPx() * 0.5;

  for (const entry of canopyEntriesByKey.values()) {
    const occlusionStrength =
      computingWorldPlazaTreeCanopyPlayerScreenOcclusionStrength({
        avatarScreenX: playerScreenPoint.x,
        avatarScreenY: avatarBodyCenterScreenY,
        canopyBaseScreenX: entry.baseScreenX,
        canopyBaseScreenY: entry.elevatedBaseScreenY,
        tree: entry.tree,
      });
    const targetAlpha =
      DEFINING_WORLD_PLAZA_TREE_CANOPY_DEFAULT_ALPHA +
      (DEFINING_WORLD_PLAZA_TREE_CANOPY_UNDER_PLAYER_ALPHA -
        DEFINING_WORLD_PLAZA_TREE_CANOPY_DEFAULT_ALPHA) *
        occlusionStrength;
    const alphaDifference = targetAlpha - entry.container.alpha;

    if (
      Math.abs(alphaDifference) <=
      DEFINING_WORLD_PLAZA_TREE_CANOPY_PLAYER_OCCLUSION_ALPHA_EPSILON
    ) {
      if (entry.container.alpha !== targetAlpha) {
        entry.container.alpha = targetAlpha;
      }
      continue;
    }

    entry.container.alpha +=
      alphaDifference *
      DEFINING_WORLD_PLAZA_TREE_CANOPY_PLAYER_OCCLUSION_ALPHA_LERP;
  }
}
