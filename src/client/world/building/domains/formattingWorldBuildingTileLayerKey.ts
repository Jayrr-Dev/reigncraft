import type { DefiningWorldBuildingTilePosition } from "@/components/world/building/domains/definingWorldBuildingTilePosition";
import type { DefiningWorldBuildingPlacedBlock } from "@/components/world/building/domains/definingWorldBuildingPlacedBlock";
import { checkingWorldBuildingPlacedBlockIsPassableTileSurfaceOverlay } from "@/components/world/building/domains/checkingWorldBuildingPlacedBlockIsPassableTileSurfaceOverlay";
import { resolvingWorldBuildingPlacedBlockWorldLayer } from "@/components/world/building/domains/definingWorldBuildingPlacedBlock";
import { DEFINING_WORLD_BUILDING_PASSABLE_TILE_SURFACE_OVERLAY_KEY_SUFFIX } from "@/components/world/building/domains/definingWorldBuildingPassableTileSurfaceOverlayConstants";

/**
 * Stable map keys for placed blocks indexed by tile and layer.
 *
 * @module components/world/building/domains/formattingWorldBuildingTileLayerKey
 */

/**
 * Builds a stable key for a tile position and world layer.
 *
 * @param position - Tile coordinates.
 * @param worldLayer - One-based vertical layer.
 */
export function formattingWorldBuildingTileLayerKey(
  position: DefiningWorldBuildingTilePosition,
  worldLayer: number,
): string {
  return `${position.tileX}:${position.tileY}:${worldLayer}`;
}

/**
 * Builds a stable key for a passable tile overlay on an extruded block top face.
 *
 * @param position - Tile coordinates.
 * @param worldLayer - Shared top face layer for the overlay and extruded block.
 */
export function formattingWorldBuildingTileSurfaceOverlayLayerKey(
  position: DefiningWorldBuildingTilePosition,
  worldLayer: number,
): string {
  return `${formattingWorldBuildingTileLayerKey(position, worldLayer)}:${DEFINING_WORLD_BUILDING_PASSABLE_TILE_SURFACE_OVERLAY_KEY_SUFFIX}`;
}

/**
 * Resolves the plot map key used to store one placed block row.
 *
 * @param block - Placed block entity.
 */
export function resolvingWorldBuildingPlacedBlockStorageTileLayerKey(
  block: DefiningWorldBuildingPlacedBlock,
): string {
  const worldLayer = resolvingWorldBuildingPlacedBlockWorldLayer(block);

  if (checkingWorldBuildingPlacedBlockIsPassableTileSurfaceOverlay(block)) {
    return formattingWorldBuildingTileSurfaceOverlayLayerKey(
      block.tilePosition,
      worldLayer,
    );
  }

  return formattingWorldBuildingTileLayerKey(block.tilePosition, worldLayer);
}
