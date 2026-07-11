import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { buildingWorldPlazaVisibleTreeDrawEntries } from '@/components/world/domains/buildingWorldPlazaVisibleTreeDrawEntries';
import { computingWorldPlazaTreeCanopyPlayerScreenOcclusionStrength } from '@/components/world/domains/computingWorldPlazaTreeCanopyPlayerScreenOcclusionStrength';
import { convertingWorldPlazaGridPointToIsometricScreenPoint } from '@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint';
import { computingWorldPlazaGirlSampleSpriteExtentAboveGridAnchorPx } from '@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import {
  DEFINING_WORLD_PLAZA_TREE_CANOPY_DEFAULT_ALPHA,
  DEFINING_WORLD_PLAZA_TREE_CANOPY_PLAYER_OCCLUSION_ALPHA_LERP,
  DEFINING_WORLD_PLAZA_TREE_CANOPY_UNDER_PLAYER_ALPHA,
} from '@/components/world/domains/definingWorldPlazaTreeCanopyPlayerOcclusionConstants';
import type { DefiningWorldPlazaVisibleTileBounds } from '@/components/world/domains/definingWorldPlazaVisibleTileBounds';
import { drawingWorldPlazaTreeCanopyOnGraphicsAtScreenPoint } from '@/components/world/domains/drawingWorldPlazaTreeOnGraphics';
import { formattingWorldPlazaTreeDrawCacheKey } from '@/components/world/domains/formattingWorldPlazaTreeDrawCacheKey';
import { markingWorldPlazaPixiDisplayObjectCullable } from '@/components/world/domains/markingWorldPlazaPixiDisplayObjectCullable';
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
 * New canopies are nearest-first and capped per call so a forest bounds cross
 * does not hitch a single frame.
 *
 * @param input - Parent container, bounds, and canopy cache.
 */
export function syncingWorldPlazaVisibleTreeCanopyLayer(
  input: SyncingWorldPlazaVisibleTreeCanopyLayerInput
): SyncingWorldPlazaVisibleTreeCanopyLayerResult {
  const shouldSortChildrenImmediately =
    input.shouldSortChildrenImmediately ?? true;
  const buildBudget =
    input.maxTreeBuildsPerCall === undefined
      ? Number.POSITIVE_INFINITY
      : Math.max(1, input.maxTreeBuildsPerCall);
  const centerTileX = input.centerTileX ?? 0;
  const centerTileY = input.centerTileY ?? 0;
  const drawEntries = buildingWorldPlazaVisibleTreeDrawEntries(
    input.bounds,
    input.maxVisibleTrees,
    input.centerTileX,
    input.centerTileY,
    input.placedBlocks ?? [],
    input.choppedTreeStateByTileKey
  );
  const neededKeys = new Set<string>();
  const missingEntries: typeof drawEntries = [];
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

  const entriesToBuild = missingEntries.slice(0, buildBudget);

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

  for (const [cacheKey, entry] of input.canopyEntriesByKey) {
    if (neededKeys.has(cacheKey)) {
      continue;
    }

    input.parentContainer.removeChild(entry.container);
    entry.container.destroy({ children: true });
    input.canopyEntriesByKey.delete(cacheKey);
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
    isComplete: missingEntries.length <= entriesToBuild.length,
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

    entry.container.alpha +=
      (targetAlpha - entry.container.alpha) *
      DEFINING_WORLD_PLAZA_TREE_CANOPY_PLAYER_OCCLUSION_ALPHA_LERP;
  }
}
