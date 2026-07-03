import type { DefiningWorldBuildingPlacedBlock } from "@/components/world/building/domains/definingWorldBuildingPlacedBlock";
import { buildingWorldPlazaVisibleTreeDrawEntries } from "@/components/world/domains/buildingWorldPlazaVisibleTreeDrawEntries";
import { formattingWorldPlazaTreeDrawCacheKey } from "@/components/world/domains/formattingWorldPlazaTreeDrawCacheKey";
import { markingWorldPlazaPixiDisplayObjectCullable } from "@/components/world/domains/markingWorldPlazaPixiDisplayObjectCullable";
import { drawingWorldPlazaTreeTrunkOnGraphicsAtScreenPoint } from "@/components/world/domains/drawingWorldPlazaTreeOnGraphics";
import type { DefiningWorldPlazaVisibleTileBounds } from "@/components/world/domains/definingWorldPlazaVisibleTileBounds";
import { resolvingWorldPlazaTreeTrunkEntityZIndex } from "@/components/world/domains/resolvingWorldPlazaTreeTrunkEntityZIndex";
import type { Container } from "pixi.js";
import { Graphics } from "pixi.js";

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
  /** When false, caller runs sortChildren once after all mutations this tick. */
  readonly shouldSortChildrenImmediately?: boolean;
}

/** Result from {@link syncingWorldPlazaVisibleTreeTrunkGraphicsLayer}. */
export interface SyncingWorldPlazaVisibleTreeTrunkGraphicsLayerResult {
  /** True when z-order must be refreshed on the parent container. */
  readonly needsChildSort: boolean;
}

/**
 * Adds or removes trunk graphics only for trees entering or leaving the window.
 *
 * Trunks are parented on the avatar entity sub-layer so they interleave with
 * player sprites by {@link zIndex}.
 *
 * @param input - Parent container, bounds, and trunk graphics cache.
 */
export function syncingWorldPlazaVisibleTreeTrunkGraphicsLayer(
  input: SyncingWorldPlazaVisibleTreeTrunkGraphicsLayerInput,
): SyncingWorldPlazaVisibleTreeTrunkGraphicsLayerResult {
  const shouldSortChildrenImmediately =
    input.shouldSortChildrenImmediately ?? true;
  const drawEntries = buildingWorldPlazaVisibleTreeDrawEntries(
    input.bounds,
    input.maxVisibleTrees,
    input.centerTileX,
    input.centerTileY,
    input.placedBlocks ?? [],
  );
  const neededKeys = new Set<string>();
  let didMutateChildren = false;

  for (const entry of drawEntries) {
    const cacheKey = formattingWorldPlazaTreeDrawCacheKey(entry.tree);
    neededKeys.add(cacheKey);

    if (input.trunkGraphicsByKey.has(cacheKey)) {
      continue;
    }

    const elevatedBaseScreenY = entry.baseScreenY + entry.elevationOffsetYPx;
    const trunkGraphics = new Graphics();
    trunkGraphics.eventMode = "none";
    markingWorldPlazaPixiDisplayObjectCullable(trunkGraphics);
    trunkGraphics.zIndex = resolvingWorldPlazaTreeTrunkEntityZIndex(
      entry.tree.tileX,
      entry.tree.tileY,
    );
    drawingWorldPlazaTreeTrunkOnGraphicsAtScreenPoint(
      trunkGraphics,
      entry.tree,
      entry.baseScreenX,
      elevatedBaseScreenY,
    );
    input.parentContainer.addChild(trunkGraphics);
    input.trunkGraphicsByKey.set(cacheKey, trunkGraphics);
    didMutateChildren = true;
  }

  for (const [cacheKey, trunkGraphics] of input.trunkGraphicsByKey) {
    if (neededKeys.has(cacheKey)) {
      continue;
    }

    input.parentContainer.removeChild(trunkGraphics);
    trunkGraphics.destroy();
    input.trunkGraphicsByKey.delete(cacheKey);
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
    needsChildSort:
      didMutateChildren &&
      !shouldSortChildrenImmediately &&
      input.parentContainer.sortableChildren,
  };
}
