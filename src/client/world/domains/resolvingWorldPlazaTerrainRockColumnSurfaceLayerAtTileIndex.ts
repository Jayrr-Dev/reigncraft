import {
  DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND,
  clampingWorldBuildingWorldLayer,
} from "@/components/world/building/domains/definingWorldBuildingWorldLayerConstants";
import { checkingWorldPlazaStoneDecorationUsesColumnRockRendering } from "@/components/world/domains/definingWorldPlazaTerrainRockConstants";
import { resolvingWorldPlazaColumnRockMetadataAtTileIndex } from "@/components/world/domains/resolvingWorldPlazaColumnRockMetadataAtTileIndex";
import { resolvingWorldPlazaTerrainElevationSurfaceLayerAtTileIndex } from "@/components/world/domains/resolvingWorldPlazaTerrainElevationAtTileIndex";

/**
 * Resolves the standable top world layer of a procedural column rock on a tile.
 *
 * Mega-boulders extrude up from the terrain surface across their full footprint,
 * so the player can stand on top exactly like a player-placed block stack.
 *
 * @module components/world/domains/resolvingWorldPlazaTerrainRockColumnSurfaceLayerAtTileIndex
 */

/**
 * Returns the top world layer the player can stand on for a column rock tile.
 *
 * Returns ground when the tile has no column rock (small pebbles never raise the
 * surface).
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function resolvingWorldPlazaTerrainRockColumnSurfaceLayerAtTileIndex(
  tileX: number,
  tileY: number,
): number {
  const columnRockMetadata = resolvingWorldPlazaColumnRockMetadataAtTileIndex(
    tileX,
    tileY,
  );

  if (
    !columnRockMetadata ||
    !checkingWorldPlazaStoneDecorationUsesColumnRockRendering(
      columnRockMetadata.sizeTierIndex,
    )
  ) {
    return DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND;
  }

  const terrainSurfaceLayer =
    resolvingWorldPlazaTerrainElevationSurfaceLayerAtTileIndex(tileX, tileY);
  const rockHeightLayers =
    columnRockMetadata.surfaceWorldLayer - DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND;

  return clampingWorldBuildingWorldLayer(
    Math.max(terrainSurfaceLayer, DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND) +
      rockHeightLayers,
  );
}

/**
 * Returns true when a column rock raises the tile above ground.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function checkingWorldPlazaTerrainRockColumnHasRaisedSurfaceAtTileIndex(
  tileX: number,
  tileY: number,
): boolean {
  return (
    resolvingWorldPlazaTerrainRockColumnSurfaceLayerAtTileIndex(tileX, tileY) >
    DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND
  );
}
