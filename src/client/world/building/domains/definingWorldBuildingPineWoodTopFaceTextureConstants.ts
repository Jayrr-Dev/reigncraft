/**
 * Visual constants for Minecraft-style pine plank overlays.
 *
 * @module components/world/building/domains/definingWorldBuildingPineWoodTopFaceTextureConstants
 */

/** Plank rows per face band, matching Minecraft plank blocks. */
export const DEFINING_WORLD_BUILDING_PINE_WOOD_PLANK_TEXTURE_ROW_COUNT = 4;

/** Groove line width between plank rows in pixels. */
export const DEFINING_WORLD_BUILDING_PINE_WOOD_PLANK_TEXTURE_GROOVE_LINE_WIDTH_PX = 1;

/** Groove line opacity. */
export const DEFINING_WORLD_BUILDING_PINE_WOOD_PLANK_TEXTURE_GROOVE_ALPHA = 0.58;

/** Brightness offset for groove lines. */
export const DEFINING_WORLD_BUILDING_PINE_WOOD_PLANK_TEXTURE_GROOVE_DARKEN_AMOUNT = -0.3;

/** Joint line width between staggered plank segments in pixels. */
export const DEFINING_WORLD_BUILDING_PINE_WOOD_PLANK_TEXTURE_JOINT_LINE_WIDTH_PX = 0.85;

/** Joint line opacity. */
export const DEFINING_WORLD_BUILDING_PINE_WOOD_PLANK_TEXTURE_JOINT_ALPHA = 0.48;

/** Brightness offset for joint lines. */
export const DEFINING_WORLD_BUILDING_PINE_WOOD_PLANK_TEXTURE_JOINT_DARKEN_AMOUNT = -0.22;

/** Noise specks drawn inside each plank row. */
export const DEFINING_WORLD_BUILDING_PINE_WOOD_PLANK_TEXTURE_NOISE_SPECK_COUNT_PER_ROW = 4;

/** Noise speck radius in pixels. */
export const DEFINING_WORLD_BUILDING_PINE_WOOD_PLANK_TEXTURE_NOISE_SPECK_RADIUS_PX = 0.7;

/** Noise speck opacity. */
export const DEFINING_WORLD_BUILDING_PINE_WOOD_PLANK_TEXTURE_NOISE_SPECK_ALPHA = 0.28;

/** Brightness offset for darker noise specks. */
export const DEFINING_WORLD_BUILDING_PINE_WOOD_PLANK_TEXTURE_NOISE_DARKEN_AMOUNT = -0.12;

/** Brightness offset for lighter noise specks. */
export const DEFINING_WORLD_BUILDING_PINE_WOOD_PLANK_TEXTURE_NOISE_LIGHTEN_AMOUNT = 0.1;

/** Salt for staggered joint placement per plank row. */
export const DEFINING_WORLD_BUILDING_PINE_WOOD_PLANK_TEXTURE_JOINT_SEED_SALT = 7123;

/** Salt for plank row noise speck placement. */
export const DEFINING_WORLD_BUILDING_PINE_WOOD_PLANK_TEXTURE_NOISE_SEED_SALT = 8237;

/** Salt discriminator for the left side face. */
export const DEFINING_WORLD_BUILDING_PINE_WOOD_SIDE_FACE_TEXTURE_LEFT_FACE_SALT = 11;

/** Salt discriminator for the right side face. */
export const DEFINING_WORLD_BUILDING_PINE_WOOD_SIDE_FACE_TEXTURE_RIGHT_FACE_SALT = 29;

/** Minimum side column height in pixels before plank bands are drawn. */
export const DEFINING_WORLD_BUILDING_PINE_WOOD_SIDE_FACE_TEXTURE_MIN_COLUMN_HEIGHT_PX = 2;

/** Legacy alias used by side-face imports. */
export const DEFINING_WORLD_BUILDING_PINE_WOOD_TOP_FACE_TEXTURE_GRAIN_LINE_WIDTH_PX =
  DEFINING_WORLD_BUILDING_PINE_WOOD_PLANK_TEXTURE_GROOVE_LINE_WIDTH_PX;
