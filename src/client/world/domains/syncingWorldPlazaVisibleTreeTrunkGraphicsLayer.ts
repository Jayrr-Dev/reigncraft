import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { buildingWorldPlazaVisibleTreeDrawEntries } from '@/components/world/domains/buildingWorldPlazaVisibleTreeDrawEntries';
import type { DefiningWorldPlazaVisibleTileBounds } from '@/components/world/domains/definingWorldPlazaVisibleTileBounds';
import { drawingWorldPlazaTreeTrunkOnGraphicsAtScreenPoint } from '@/components/world/domains/drawingWorldPlazaTreeOnGraphics';
import { formattingWorldPlazaTreeDrawCacheKey } from '@/components/world/domains/formattingWorldPlazaTreeDrawCacheKey';
import { markingWorldPlazaPixiDisplayObjectCullable } from '@/components/world/domains/markingWorldPlazaPixiDisplayObjectCullable';
import { resolvingWorldPlazaTreeTrunkEntityZIndex } from '@/components/world/domains/resolvingWorldPlazaTreeTrunkEntityZIndex';
import type { Container } from 'pixi.js';
import { Graphics } from 'pixi.js';

/**
 * Incrementally syncs depth-sorted tree trunk graphics for a visible tile window.
 *
 * @module components/world/domains/syncingWorldPlazaVisibleTreeTrunkGraphicsLayer
 */

/** Input for {@link syncingWorldPlazaVisibleTreeTrunkGraphicsLayer}. */
export interface SyncingWorldPlazaVisibleTreeTrunkGraphicsLayerInput {
  readonly parentContainer: Container;
  readonly bounds: DefiningWorldPlazaVisibleTileBounds;
  readonly trunkGraphicsByKey: Map<string, Graphics>;
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
  /** Max new trunks to draw this call; omit to build every missing trunk. */
  readonly maxTreeBuildsPerCall?: number;
  /** Max stale trunks removed per call; omit to prune all stale trunks. */
  readonly maxTreePrunesPerCall?: number;
}

/** Result from {@link syncingWorldPlazaVisibleTreeTrunkGraphicsLayer}. */
export interface SyncingWorldPlazaVisibleTreeTrunkGraphicsLayerResult {
  /** True when every needed trunk exists and stale trunks were pruned. */
  readonly isComplete: boolean;
  /** Number of new trunks built during this call. */
  readonly treesBuilt: number;
  /** True when z-order must be refreshed on the parent container. */
  readonly needsChildSort: boolean;
}

/**
 * Adds or removes trunk graphics only for trees entering or leaving the window.
 *
 * Trunks are parented on the avatar entity sub-layer so they interleave with
 * player sprites by {@link zIndex}. New trunks are nearest-first and capped per
 * call so a forest bounds cross does not hitch a single frame.
 *
 * @param input - Parent container, bounds, and trunk graphics cache.
 */
export function syncingWorldPlazaVisibleTreeTrunkGraphicsLayer(
  input: SyncingWorldPlazaVisibleTreeTrunkGraphicsLayerInput
): SyncingWorldPlazaVisibleTreeTrunkGraphicsLayerResult {
  const shouldSortChildrenImmediately =
    input.shouldSortChildrenImmediately ?? false;
  const buildBudget =
    input.maxTreeBuildsPerCall === undefined
      ? Number.POSITIVE_INFINITY
      : Math.max(1, input.maxTreeBuildsPerCall);
  const pruneBudget =
    input.maxTreePrunesPerCall === undefined
      ? Number.POSITIVE_INFINITY
      : Math.max(0, input.maxTreePrunesPerCall);
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

    if (input.trunkGraphicsByKey.has(cacheKey)) {
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
    const trunkGraphics = new Graphics();
    trunkGraphics.eventMode = 'none';
    markingWorldPlazaPixiDisplayObjectCullable(trunkGraphics);
    trunkGraphics.zIndex = resolvingWorldPlazaTreeTrunkEntityZIndex(
      entry.tree.tileX,
      entry.tree.tileY
    );
    drawingWorldPlazaTreeTrunkOnGraphicsAtScreenPoint(
      trunkGraphics,
      entry.tree,
      entry.baseScreenX,
      elevatedBaseScreenY
    );
    input.parentContainer.addChild(trunkGraphics);
    input.trunkGraphicsByKey.set(cacheKey, trunkGraphics);
    didMutateChildren = true;
  }

  let prunedCount = 0;
  let staleKeyCount = 0;

  for (const cacheKey of input.trunkGraphicsByKey.keys()) {
    if (!neededKeys.has(cacheKey)) {
      staleKeyCount += 1;
    }
  }

  for (const [cacheKey, trunkGraphics] of input.trunkGraphicsByKey) {
    if (neededKeys.has(cacheKey)) {
      continue;
    }

    if (prunedCount >= pruneBudget) {
      break;
    }

    input.parentContainer.removeChild(trunkGraphics);
    trunkGraphics.destroy();
    input.trunkGraphicsByKey.delete(cacheKey);
    didMutateChildren = true;
    prunedCount += 1;
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
