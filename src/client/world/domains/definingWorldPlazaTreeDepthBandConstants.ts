import { DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX } from "@/components/world/domains/definingWorldPlazaIsometricConstants";

/**
 * Depth-band batching for isometric tree sorting.
 *
 * Trees in the same screen-Y band share one Graphics object. Each band gets a
 * z-index derived from its center Y so avatars interleave correctly (walk
 * behind trees to the north, in front of trees to the south).
 *
 * @module components/world/domains/definingWorldPlazaTreeDepthBandConstants
 */

/** Screen-Y bucket height; half a tile keeps sorting close to avatar feet. */
export const DEFINING_WORLD_PLAZA_TREE_DEPTH_BAND_HEIGHT_PX =
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX;
