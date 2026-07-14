/**
 * Procedural top-face texture kinds for placed building blocks.
 *
 * Pixi draw paths use these to overlay grain, ripples, and similar detail on
 * the block top diamond after the base fill color is drawn.
 *
 * @module components/world/building/domains/definingWorldBuildingPlacedBlockTopFaceTextureKind
 */

/** Pine wood plank grain on passable floor blocks. */
export const DEFINING_WORLD_BUILDING_PLACED_BLOCK_TOP_FACE_TEXTURE_KIND_PINE_WOOD =
  'pineWood' as const;

/** Static flow streaks on placed stream water blocks. */
export const DEFINING_WORLD_BUILDING_PLACED_BLOCK_TOP_FACE_TEXTURE_KIND_WATER_STREAM =
  'waterStream' as const;

/** Ore wall mineral overlays (clay bands, niter crust, flecks, coal facets). */
export const DEFINING_WORLD_BUILDING_PLACED_BLOCK_TOP_FACE_TEXTURE_KIND_ORE_WALL =
  'oreWall' as const;

/** Procedural overlay drawn on a placed block top face. */
export type DefiningWorldBuildingPlacedBlockTopFaceTextureKind =
  | typeof DEFINING_WORLD_BUILDING_PLACED_BLOCK_TOP_FACE_TEXTURE_KIND_PINE_WOOD
  | typeof DEFINING_WORLD_BUILDING_PLACED_BLOCK_TOP_FACE_TEXTURE_KIND_WATER_STREAM
  | typeof DEFINING_WORLD_BUILDING_PLACED_BLOCK_TOP_FACE_TEXTURE_KIND_ORE_WALL;
