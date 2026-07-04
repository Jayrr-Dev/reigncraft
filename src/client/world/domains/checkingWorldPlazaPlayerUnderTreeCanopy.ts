import type { DefiningWorldPlazaWorldPoint } from "@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint";
import {
  DEFINING_WORLD_PLAZA_TREE_CANOPY_PLAYER_OCCLUSION_FOOTPRINT_RADIUS_MULTIPLIER,
  DEFINING_WORLD_PLAZA_TREE_CANOPY_PLAYER_OCCLUSION_FULL_FADE_RADIUS_FRACTION,
} from "@/components/world/domains/definingWorldPlazaTreeCanopyPlayerOcclusionConstants";
import { resolvingWorldPlazaTreeCanopyFootprintRadiusGrid } from "@/components/world/domains/drawingWorldPlazaTreeOnGraphics";
import type { DefiningWorldPlazaTreeInstance } from "@/components/world/domains/resolvingWorldPlazaTreeAtTileIndex";

/**
 * Distance-based canopy fade strength around the player.
 *
 * @module components/world/domains/checkingWorldPlazaPlayerUnderTreeCanopy
 */

/**
 * Returns true when a grid position lies inside the tree's overhead canopy.
 *
 * @param playerPosition - Player position in grid space.
 * @param tree - Tree instance to test against.
 */
export function checkingWorldPlazaPlayerUnderTreeCanopy(
  playerPosition: DefiningWorldPlazaWorldPoint,
  tree: DefiningWorldPlazaTreeInstance,
): boolean {
  return (
    computingWorldPlazaTreeCanopyPlayerOcclusionStrength(playerPosition, tree) >
    0
  );
}

/**
 * Computes how strongly a canopy should fade based on player proximity.
 *
 * Returns 1 (fully faded) when the player is at or near the trunk, falling
 * off smoothly to 0 at the edge of the scaled canopy footprint.
 *
 * @param playerPosition - Player position in grid space.
 * @param tree - Tree instance to test against.
 */
export function computingWorldPlazaTreeCanopyPlayerOcclusionStrength(
  playerPosition: DefiningWorldPlazaWorldPoint,
  tree: DefiningWorldPlazaTreeInstance,
): number {
  const deltaX = playerPosition.x - tree.tileX;
  const deltaY = playerPosition.y - tree.tileY;
  const distance = Math.hypot(deltaX, deltaY);
  const footprintRadiusGrid =
    resolvingWorldPlazaTreeCanopyFootprintRadiusGrid(tree) *
    DEFINING_WORLD_PLAZA_TREE_CANOPY_PLAYER_OCCLUSION_FOOTPRINT_RADIUS_MULTIPLIER;

  if (distance >= footprintRadiusGrid) {
    return 0;
  }

  const fullFadeRadiusGrid =
    footprintRadiusGrid *
    DEFINING_WORLD_PLAZA_TREE_CANOPY_PLAYER_OCCLUSION_FULL_FADE_RADIUS_FRACTION;

  if (distance <= fullFadeRadiusGrid) {
    return 1;
  }

  const falloffSpanGrid = footprintRadiusGrid - fullFadeRadiusGrid;
  const normalizedFalloff = (distance - fullFadeRadiusGrid) / falloffSpanGrid;
  const strength = 1 - normalizedFalloff;

  // Smoothstep keeps the fade edge soft instead of a hard linear cutoff.
  return strength * strength * (3 - 2 * strength);
}
