import type { DefiningWorldBuildingPlacedBlock } from "@/components/world/building/domains/definingWorldBuildingPlacedBlock";
import { DEFINING_WORLD_BUILDING_PASSABLE_TILE_SURFACE_OVERLAY_METADATA_KEY } from "@/components/world/building/domains/definingWorldBuildingPassableTileSurfaceOverlayConstants";

/**
 * Detects passable tile rows stored as surface overlays on extruded blocks.
 *
 * @module components/world/building/domains/checkingWorldBuildingPlacedBlockIsPassableTileSurfaceOverlay
 */

/**
 * Returns true when the placed block is a passable tile overlaying another block.
 *
 * @param block - Placed block entity.
 */
export function checkingWorldBuildingPlacedBlockIsPassableTileSurfaceOverlay(
  block: DefiningWorldBuildingPlacedBlock,
): boolean {
  return (
    block.metadata[DEFINING_WORLD_BUILDING_PASSABLE_TILE_SURFACE_OVERLAY_METADATA_KEY] ===
    true
  );
}
