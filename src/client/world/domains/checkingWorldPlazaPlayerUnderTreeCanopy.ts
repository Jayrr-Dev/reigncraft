import type { DefiningWorldPlazaWorldPoint } from "@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint";
import { DEFINING_WORLD_PLAZA_TREE_CANOPY_PLAYER_OCCLUSION_FOOTPRINT_RADIUS_MULTIPLIER } from "@/components/world/domains/definingWorldPlazaTreeCanopyPlayerOcclusionConstants";
import { resolvingWorldPlazaTreeCanopyFootprintRadiusGrid } from "@/components/world/domains/drawingWorldPlazaTreeOnGraphics";
import type { DefiningWorldPlazaTreeInstance } from "@/components/world/domains/resolvingWorldPlazaTreeAtTileIndex";

/**
 * Whether the player stands under a tree crown for canopy fade.
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
  const deltaX = playerPosition.x - tree.tileX;
  const deltaY = playerPosition.y - tree.tileY;
  const distance = Math.hypot(deltaX, deltaY);
  const footprintRadiusGrid =
    resolvingWorldPlazaTreeCanopyFootprintRadiusGrid(tree) *
    DEFINING_WORLD_PLAZA_TREE_CANOPY_PLAYER_OCCLUSION_FOOTPRINT_RADIUS_MULTIPLIER;

  return distance < footprintRadiusGrid;
}
