import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { buildingWorldPlazaVisibleTreeDrawEntries } from '@/components/world/domains/buildingWorldPlazaVisibleTreeDrawEntries';
import type { DefiningWorldPlazaVisibleTileBounds } from '@/components/world/domains/definingWorldPlazaVisibleTileBounds';
import { drawingWorldPlazaTreeGroundShadowOnGraphicsAtScreenPoint } from '@/components/world/domains/drawingWorldPlazaTreeOnGraphics';
import { formattingWorldPlazaTreeDrawCacheKey } from '@/components/world/domains/formattingWorldPlazaTreeDrawCacheKey';
import { markingWorldPlazaPixiDisplayObjectCullable } from '@/components/world/domains/markingWorldPlazaPixiDisplayObjectCullable';
import { resolvingWorldPlazaTreeGroundShadowEntityZIndex } from '@/components/world/domains/resolvingWorldPlazaTreeGroundShadowEntityZIndex';
import type { Container } from 'pixi.js';
import { Graphics } from 'pixi.js';

/**
 * Incrementally syncs depth-sorted tree ground shadows for a visible tile window.
 *
 * @module components/world/domains/syncingWorldPlazaVisibleTreeGroundShadowGraphicsLayer
 */

/** Input for {@link syncingWorldPlazaVisibleTreeGroundShadowGraphicsLayer}. */
export interface SyncingWorldPlazaVisibleTreeGroundShadowGraphicsLayerInput {
  readonly parentContainer: Container;
  readonly bounds: DefiningWorldPlazaVisibleTileBounds;
  readonly shadowGraphicsByKey: Map<string, Graphics>;
  readonly maxVisibleTrees?: number;
  readonly centerTileX?: number;
  readonly centerTileY?: number;
  readonly placedBlocks?: DefiningWorldBuildingPlacedBlock[];
  readonly choppedTreeStateByTileKey?: ReadonlyMap<
    string,
    import('@/components/world/harvest/domains/managingWorldPlazaLocalChoppedTrees').DefiningWorldPlazaChoppedTreeTileState
  >;
  readonly shouldSortChildrenImmediately?: boolean;
  /** When true, cached shadows are redrawn (e.g. the sun moved). */
  readonly shouldRedrawExistingShadows?: boolean;
}

/** Result from {@link syncingWorldPlazaVisibleTreeGroundShadowGraphicsLayer}. */
export interface SyncingWorldPlazaVisibleTreeGroundShadowGraphicsLayerResult {
  readonly needsChildSort: boolean;
}

/**
 * Adds or removes tree shadow graphics as trees enter or leave the window.
 *
 * Shadows live on the entity avatar sub-layer with their own z-index so circular
 * halos are not clipped by neighboring floor or terrain column tiles.
 *
 * @param input - Parent container, bounds, and shadow graphics cache.
 */
export function syncingWorldPlazaVisibleTreeGroundShadowGraphicsLayer(
  input: SyncingWorldPlazaVisibleTreeGroundShadowGraphicsLayerInput
): SyncingWorldPlazaVisibleTreeGroundShadowGraphicsLayerResult {
  const shouldSortChildrenImmediately =
    input.shouldSortChildrenImmediately ?? true;
  const drawEntries = buildingWorldPlazaVisibleTreeDrawEntries(
    input.bounds,
    input.maxVisibleTrees,
    input.centerTileX,
    input.centerTileY,
    input.placedBlocks ?? [],
    input.choppedTreeStateByTileKey
  );
  const neededKeys = new Set<string>();
  let didMutateChildren = false;

  for (const entry of drawEntries) {
    const cacheKey = formattingWorldPlazaTreeDrawCacheKey(entry.tree);
    neededKeys.add(cacheKey);

    const shadowEntityZIndex = resolvingWorldPlazaTreeGroundShadowEntityZIndex(
      entry.tree.tileX,
      entry.tree.tileY
    );
    const existingShadowGraphics = input.shadowGraphicsByKey.get(cacheKey);
    const shadowSurfaceScreenY = entry.baseScreenY + entry.elevationOffsetYPx;

    if (existingShadowGraphics) {
      if (existingShadowGraphics.zIndex !== shadowEntityZIndex) {
        existingShadowGraphics.zIndex = shadowEntityZIndex;
        didMutateChildren = true;
      }

      if (input.shouldRedrawExistingShadows) {
        drawingWorldPlazaTreeGroundShadowOnGraphicsAtScreenPoint(
          existingShadowGraphics,
          entry.tree,
          entry.baseScreenX,
          shadowSurfaceScreenY
        );
      }

      continue;
    }

    const shadowGraphics = new Graphics();
    shadowGraphics.eventMode = 'none';
    markingWorldPlazaPixiDisplayObjectCullable(shadowGraphics);
    shadowGraphics.zIndex = shadowEntityZIndex;
    drawingWorldPlazaTreeGroundShadowOnGraphicsAtScreenPoint(
      shadowGraphics,
      entry.tree,
      entry.baseScreenX,
      shadowSurfaceScreenY
    );
    input.parentContainer.addChild(shadowGraphics);
    input.shadowGraphicsByKey.set(cacheKey, shadowGraphics);
    didMutateChildren = true;
  }

  for (const [cacheKey, shadowGraphics] of input.shadowGraphicsByKey) {
    if (neededKeys.has(cacheKey)) {
      continue;
    }

    input.parentContainer.removeChild(shadowGraphics);
    shadowGraphics.destroy();
    input.shadowGraphicsByKey.delete(cacheKey);
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
