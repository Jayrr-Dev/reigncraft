import { DEFINING_WORLD_PLAZA_ISOMETRIC_ENTITY_Z_INDEX_SCALE } from "@/components/world/domains/definingWorldPlazaIsometricConstants";
import { resolvingWorldPlazaTreeCanopyDepthSortScreenY } from "@/components/world/domains/drawingWorldPlazaTreeOnGraphics";
import type { DefiningWorldPlazaTreeInstance } from "@/components/world/domains/resolvingWorldPlazaTreeAtTileIndex";

/**
 * Entity-layer z-index for a tree canopy so foliage covers avatars underneath.
 *
 * @module components/world/domains/resolvingWorldPlazaTreeCanopyEntityZIndex
 */

/**
 * Depth sort key for a canopy; shifted south on screen so crowns occlude nearby avatars.
 *
 * Uses the ground-projected trunk foot Y for sorting. Paint Y may include terrain lift.
 *
 * @param trunkFootScreenY - Trunk foot Y at the ground grid projection (before terrain lift).
 * @param tree - Tree variant and placement scale.
 */
export function resolvingWorldPlazaTreeCanopyEntityZIndex(
  trunkFootScreenY: number,
  tree: DefiningWorldPlazaTreeInstance,
): number {
  const sortScreenY = resolvingWorldPlazaTreeCanopyDepthSortScreenY(
    trunkFootScreenY,
    tree,
  );

  return Math.round(
    sortScreenY * DEFINING_WORLD_PLAZA_ISOMETRIC_ENTITY_Z_INDEX_SCALE,
  );
}
