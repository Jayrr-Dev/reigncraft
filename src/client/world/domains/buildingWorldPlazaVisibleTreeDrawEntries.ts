import type { DefiningWorldBuildingPlacedBlock } from "@/components/world/building/domains/definingWorldBuildingPlacedBlock";
import { computingWorldBuildingWorldLayerScreenOffsetPx } from "@/components/world/building/domains/computingWorldBuildingWorldLayerScreenOffsetPx";
import { DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND } from "@/components/world/building/domains/definingWorldBuildingWorldLayerConstants";
import { convertingWorldPlazaGridPointToIsometricScreenPoint } from "@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint";
import type { DefiningWorldPlazaVisibleTileBounds } from "@/components/world/domains/definingWorldPlazaVisibleTileBounds";
import { listingWorldPlazaTreesInTileBounds } from "@/components/world/domains/listingWorldPlazaTreesInTileBounds";
import type { DefiningWorldPlazaTreeInstance } from "@/components/world/domains/resolvingWorldPlazaTreeAtTileIndex";

/**
 * Builds screen-space draw entries for visible trees.
 *
 * @module components/world/domains/buildingWorldPlazaVisibleTreeDrawEntries
 */

/** One tree ready for batched or banded drawing. */
export interface BuildingWorldPlazaVisibleTreeDrawEntry {
  tree: DefiningWorldPlazaTreeInstance;
  baseScreenX: number;
  /** Ground-projected screen Y, used for depth sorting by foot tile. */
  baseScreenY: number;
  /** Upward screen offset (px) lifting the tree onto raised terrain. */
  elevationOffsetYPx: number;
}

/**
 * Lists visible trees with absolute screen positions for depth sorting.
 *
 * @param bounds - Inclusive visible tile index range.
 * @param maxVisibleTrees - Upper bound on returned trees for adaptive quality.
 * @param centerTileX - Tile column the cap keeps trees nearest to (player).
 * @param centerTileY - Tile row the cap keeps trees nearest to.
 * @param placedBlocks - Placed blocks considered for tree overrides and surface layer.
 */
export function buildingWorldPlazaVisibleTreeDrawEntries(
  bounds: DefiningWorldPlazaVisibleTileBounds,
  maxVisibleTrees?: number,
  centerTileX?: number,
  centerTileY?: number,
  placedBlocks: DefiningWorldBuildingPlacedBlock[] = [],
): BuildingWorldPlazaVisibleTreeDrawEntry[] {
  const trees = listingWorldPlazaTreesInTileBounds(
    bounds,
    maxVisibleTrees,
    centerTileX,
    centerTileY,
    placedBlocks,
  );
  const drawEntries: BuildingWorldPlazaVisibleTreeDrawEntry[] = [];

  for (const tree of trees) {
    const basePoint = convertingWorldPlazaGridPointToIsometricScreenPoint({
      x: tree.tileX,
      y: tree.tileY,
    });
    const standingSurfaceLayer =
      tree.standingSurfaceLayer ?? DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND;
    const visualSurfaceLayer =
      tree.visualSurfaceLayer ?? standingSurfaceLayer;

    drawEntries.push({
      tree: {
        ...tree,
        standingSurfaceLayer,
        visualSurfaceLayer,
      },
      baseScreenX: basePoint.x + tree.offsetXPx,
      baseScreenY: basePoint.y + tree.offsetYPx,
      elevationOffsetYPx: computingWorldBuildingWorldLayerScreenOffsetPx(
        standingSurfaceLayer,
      ),
    });
  }

  return drawEntries;
}
