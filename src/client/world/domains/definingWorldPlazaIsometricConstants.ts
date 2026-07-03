/**
 * 2:1 isometric layout constants for the plaza world.
 *
 * @module components/world/domains/definingWorldPlazaIsometricConstants
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

/** Tuning baseline for walk speed (grid units per second on horizontal screen axis). */
export const DEFINING_WORLD_PLAZA_ISOMETRIC_GRID_WALK_SPEED_PER_SECOND = 2;

/** Walk speed in screen pixels per second (uniform on all screen axes). */
export const DEFINING_WORLD_PLAZA_ISOMETRIC_SCREEN_WALK_SPEED_PER_SECOND =
  DEFINING_WORLD_PLAZA_ISOMETRIC_GRID_WALK_SPEED_PER_SECOND *
  Math.SQRT2 *
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX;

/** Tuning baseline for run speed (grid units per second on horizontal screen axis). */
export const DEFINING_WORLD_PLAZA_ISOMETRIC_GRID_RUN_SPEED_PER_SECOND = 3;

/** Run speed in screen pixels per second (uniform on all screen axes). */
export const DEFINING_WORLD_PLAZA_ISOMETRIC_SCREEN_RUN_SPEED_PER_SECOND =
  DEFINING_WORLD_PLAZA_ISOMETRIC_GRID_RUN_SPEED_PER_SECOND *
  Math.SQRT2 *
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX;

/** Base z-index for the floor layer container. */
export const DEFINING_WORLD_PLAZA_ISOMETRIC_FLOOR_Z_INDEX = 0;

/** z-index for the entity layer container (always above floor). */
export const DEFINING_WORLD_PLAZA_ISOMETRIC_ENTITY_LAYER_Z_INDEX = 1;

/** Sub-layer z-index for avatars and interactables inside the entity layer. */
export const DEFINING_WORLD_PLAZA_ISOMETRIC_ENTITY_AVATAR_SUB_LAYER_Z_INDEX = 0;

/** Sub-layer z-index so tree canopies always render above avatars. */
export const DEFINING_WORLD_PLAZA_ISOMETRIC_ENTITY_CANOPY_SUB_LAYER_Z_INDEX = 1;

/** Sub-layer z-index for transient world feedback (click markers) above canopies. */
export const DEFINING_WORLD_PLAZA_ISOMETRIC_ENTITY_EFFECTS_SUB_LAYER_Z_INDEX = 2;

/** Multiplier for screen-Y entity depth sorting within the entity layer. */
export const DEFINING_WORLD_PLAZA_ISOMETRIC_ENTITY_Z_INDEX_SCALE = 10;

/** Half-width of one isometric tile measured in grid units (diamond center to edge). */
export const DEFINING_WORLD_PLAZA_ISOMETRIC_TILE_HALF_EXTENT_GRID = 0.5;

/**
 * Extra brightness adjustment for left-facing (west) column side faces.
 * Negative values darken the west face relative to the right (east) face.
 */
export const DEFINING_WORLD_PLAZA_ISOMETRIC_LEFT_COLUMN_SIDE_FACE_BRIGHTNESS_ADJUSTMENT =
  -0.08 as const;

/**
 * Depth-sort bias added to an avatar so it renders above the block column of the
 * tile it is standing on. Covers the worst-case half-tile sub-tile deviation so
 * a grounded avatar always wins its own tile while staying behind columns one
 * full tile to the south.
 */
export const DEFINING_WORLD_PLAZA_ISOMETRIC_ENTITY_ON_BLOCK_DEPTH_BIAS =
  Math.round(
    DEFINING_WORLD_PLAZA_ISOMETRIC_TILE_HALF_EXTENT_GRID *
      DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX *
      DEFINING_WORLD_PLAZA_ISOMETRIC_ENTITY_Z_INDEX_SCALE,
  );
