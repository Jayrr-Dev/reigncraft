import { DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND } from "@/components/world/building/domains/definingWorldBuildingWorldLayerConstants";
import {
  DEFINING_WORLD_BUILDING_CLAIM_MODE_PLOT_OVERLAY_DEPTH_SORT_SOUTH_GRID_FRACTION,
  DEFINING_WORLD_BUILDING_CLAIM_MODE_PLOT_OVERLAY_ENTITY_Z_INDEX_GAP_BELOW_AVATAR,
  DEFINING_WORLD_BUILDING_CLAIM_MODE_PLOT_OVERLAY_FLOOR_Z_INDEX,
} from "@/components/world/building/domains/definingWorldBuildingClaimModeConstants";
import type { DefiningWorldBuildingTilePosition } from "@/components/world/building/domains/definingWorldBuildingTilePosition";
import type { DefiningWorldPlazaWorldPoint } from "@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint";
import { DEFINING_WORLD_DEPTH_ENTITY_ON_BLOCK_DEPTH_BIAS } from '@/components/world/depth/domains/definingWorldDepthBiasLadder';
import { computingWorldDepthSortKey } from '@/components/world/depth/domains/computingWorldDepthSortKey';
import { resolvingWorldPlazaTerrainElevationSurfaceLayerAtTileIndex } from "@/components/world/domains/resolvingWorldPlazaTerrainElevationAtTileIndex";
import { resolvingWorldPlazaTerrainElevationColumnEntityZIndex } from "@/components/world/domains/resolvingWorldPlazaTerrainElevationColumnEntityZIndex";

/** Footprint radius (in tiles) scanned for cliff columns that clip the diamond. */
const DEFINING_WORLD_BUILDING_CLAIM_MODE_PLOT_OVERLAY_TERRAIN_CLEARANCE_FOOTPRINT_TILE_RADIUS = 1;

/**
 * Depth sort keys for claim-mode plot overlays on floor and entity layers.
 *
 * @module components/world/building/domains/resolvingWorldBuildingClaimModePlotOverlayZIndex
 */

/** Where claim overlays render relative to grass and terrain columns. */
export type ResolvingWorldBuildingClaimModePlotOverlayRenderLayer =
  | "floor"
  | "entity";

/**
 * Returns the grid foot used for entity-layer claim depth sorting.
 *
 * Biasing toward the south-east corner keeps the full diamond in front of
 * northern grass and cliff faces that share its top edges.
 *
 * @param tilePosition - Tile anchor for the overlay diamond.
 */
export function resolvingWorldBuildingClaimModePlotOverlayDepthSortGridPoint(
  tilePosition: DefiningWorldBuildingTilePosition,
): DefiningWorldPlazaWorldPoint {
  return {
    x:
      tilePosition.tileX +
      DEFINING_WORLD_BUILDING_CLAIM_MODE_PLOT_OVERLAY_DEPTH_SORT_SOUTH_GRID_FRACTION,
    y:
      tilePosition.tileY +
      DEFINING_WORLD_BUILDING_CLAIM_MODE_PLOT_OVERLAY_DEPTH_SORT_SOUTH_GRID_FRACTION,
  };
}

/**
 * Returns the highest terrain-column entity z-index in the overlay footprint.
 *
 * Scans the immediate neighborhood so a taller cliff column on an adjacent tile
 * can be cleared, mirroring the avatar body fix. Returns negative infinity when
 * no raised terrain borders the tile.
 *
 * @param tilePosition - Tile anchor for the overlay diamond.
 */
function resolvingWorldBuildingClaimModePlotOverlayMaxNeighborTerrainColumnEntityZIndex(
  tilePosition: DefiningWorldBuildingTilePosition,
): number {
  let maxTerrainEntityZ = Number.NEGATIVE_INFINITY;

  for (
    let tileOffsetY =
      -DEFINING_WORLD_BUILDING_CLAIM_MODE_PLOT_OVERLAY_TERRAIN_CLEARANCE_FOOTPRINT_TILE_RADIUS;
    tileOffsetY <=
    DEFINING_WORLD_BUILDING_CLAIM_MODE_PLOT_OVERLAY_TERRAIN_CLEARANCE_FOOTPRINT_TILE_RADIUS;
    tileOffsetY += 1
  ) {
    for (
      let tileOffsetX =
        -DEFINING_WORLD_BUILDING_CLAIM_MODE_PLOT_OVERLAY_TERRAIN_CLEARANCE_FOOTPRINT_TILE_RADIUS;
      tileOffsetX <=
      DEFINING_WORLD_BUILDING_CLAIM_MODE_PLOT_OVERLAY_TERRAIN_CLEARANCE_FOOTPRINT_TILE_RADIUS;
      tileOffsetX += 1
    ) {
      const tileX = tilePosition.tileX + tileOffsetX;
      const tileY = tilePosition.tileY + tileOffsetY;

      if (
        resolvingWorldPlazaTerrainElevationSurfaceLayerAtTileIndex(tileX, tileY) <=
        DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND
      ) {
        continue;
      }

      maxTerrainEntityZ = Math.max(
        maxTerrainEntityZ,
        resolvingWorldPlazaTerrainElevationColumnEntityZIndex(tileX, tileY),
      );
    }
  }

  return maxTerrainEntityZ;
}

/**
 * Returns a per-tile z-index on the entity layer above terrain columns and below avatars.
 *
 * Bumps above any neighboring cliff column so the diamond renders fully instead
 * of being cut by the uphill face, while staying one gap below where an avatar
 * standing on that same terrain would sort.
 *
 * @param tilePosition - Tile anchor for the overlay diamond.
 */
export function resolvingWorldBuildingClaimModePlotOverlayEntityZIndex(
  tilePosition: DefiningWorldBuildingTilePosition,
): number {
  const baseEntityZIndex =
    computingWorldDepthSortKey(
      resolvingWorldBuildingClaimModePlotOverlayDepthSortGridPoint(tilePosition),
    ) +
    DEFINING_WORLD_DEPTH_ENTITY_ON_BLOCK_DEPTH_BIAS -
    DEFINING_WORLD_BUILDING_CLAIM_MODE_PLOT_OVERLAY_ENTITY_Z_INDEX_GAP_BELOW_AVATAR;
  const maxNeighborTerrainEntityZIndex =
    resolvingWorldBuildingClaimModePlotOverlayMaxNeighborTerrainColumnEntityZIndex(
      tilePosition,
    );

  return Math.max(
    baseEntityZIndex,
    maxNeighborTerrainEntityZIndex +
      DEFINING_WORLD_DEPTH_ENTITY_ON_BLOCK_DEPTH_BIAS -
      DEFINING_WORLD_BUILDING_CLAIM_MODE_PLOT_OVERLAY_ENTITY_Z_INDEX_GAP_BELOW_AVATAR,
  );
}

/**
 * Returns a per-tile z-index on the floor layer above batched grass chunks.
 *
 * Uses one shared value so adjacent claim diamonds do not clip each other's
 * south edges when sorted by tileX + tileY.
 *
 * @param _tilePosition - Tile anchor (unused; kept for call-site symmetry).
 */
export function resolvingWorldBuildingClaimModePlotOverlayFloorZIndex(
  _tilePosition: DefiningWorldBuildingTilePosition,
): number {
  return DEFINING_WORLD_BUILDING_CLAIM_MODE_PLOT_OVERLAY_FLOOR_Z_INDEX;
}

/**
 * Resolves the z-index for one claim overlay tile on its render layer.
 *
 * @param tilePosition - Tile anchor for the overlay diamond.
 * @param renderLayer - Floor or entity layer target.
 */
export function resolvingWorldBuildingClaimModePlotOverlayZIndex(
  tilePosition: DefiningWorldBuildingTilePosition,
  renderLayer: ResolvingWorldBuildingClaimModePlotOverlayRenderLayer,
): number {
  if (renderLayer === "floor") {
    return resolvingWorldBuildingClaimModePlotOverlayFloorZIndex(tilePosition);
  }

  return resolvingWorldBuildingClaimModePlotOverlayEntityZIndex(tilePosition);
}
