/**
 * Isometric tile layout dimensions (no depth-engine imports).
 *
 * @module components/world/domains/definingWorldPlazaIsometricTileLayoutConstants
 */

/** Full diamond tile width on screen (pixels). */
export const DEFINING_WORLD_PLAZA_ISOMETRIC_TILE_WIDTH_PX = 64;

/** Full diamond tile height on screen (pixels); half of width for 2:1 iso. */
export const DEFINING_WORLD_PLAZA_ISOMETRIC_TILE_HEIGHT_PX = 32;

/** Half tile width used in grid-to-screen projection. */
export const DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX =
  DEFINING_WORLD_PLAZA_ISOMETRIC_TILE_WIDTH_PX / 2;

/** Half tile height used in grid-to-screen projection. */
export const DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX =
  DEFINING_WORLD_PLAZA_ISOMETRIC_TILE_HEIGHT_PX / 2;

/** Half-width of one isometric tile measured in grid units (diamond center to edge). */
export const DEFINING_WORLD_PLAZA_ISOMETRIC_TILE_HALF_EXTENT_GRID = 0.5;
