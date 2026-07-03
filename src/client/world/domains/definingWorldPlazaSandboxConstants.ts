/**
 * Layout and motion constants for the Pixi plaza sandbox.
 *
 * @module components/world/domains/definingWorldPlazaSandboxConstants
 */

/** Default canvas width when the host has not measured yet. */
export const DEFINING_WORLD_PLAZA_SANDBOX_DEFAULT_WIDTH_PX = 960;

/** Default canvas height when the host has not measured yet. */
export const DEFINING_WORLD_PLAZA_SANDBOX_DEFAULT_HEIGHT_PX = 540;

/** Tile size for the placeholder grid (pixels). */
export const DEFINING_WORLD_PLAZA_SANDBOX_TILE_SIZE_PX = 48;

/** Local player avatar radius (pixels). */
export const DEFINING_WORLD_PLAZA_SANDBOX_AVATAR_RADIUS_PX = 14;

/** Walk speed in pixels per second (hold-to-walk). */
export const DEFINING_WORLD_PLAZA_SANDBOX_ARROW_WALK_SPEED_PX_PER_SECOND = 180;

/** Arrow keys used for plaza movement. */
export const DEFINING_WORLD_PLAZA_SANDBOX_ARROW_KEYS = [
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
] as const;

/** WASD keys used for plaza movement (lowercase; normalized on input). */
export const DEFINING_WORLD_PLAZA_SANDBOX_WASD_KEYS = [
  "w",
  "a",
  "s",
  "d",
] as const;

/** All keys accepted for plaza movement. */
export const DEFINING_WORLD_PLAZA_SANDBOX_MOVEMENT_KEYS = [
  ...DEFINING_WORLD_PLAZA_SANDBOX_ARROW_KEYS,
  ...DEFINING_WORLD_PLAZA_SANDBOX_WASD_KEYS,
] as const;

/** {@link DEFINING_WORLD_PLAZA_SANDBOX_MOVEMENT_KEYS} union type. */
export type DefiningWorldPlazaSandboxMovementKey =
  (typeof DEFINING_WORLD_PLAZA_SANDBOX_MOVEMENT_KEYS)[number];

/** Alternate tile fill colors for the checkerboard floor (legacy; grass uses {@link definingWorldPlazaGrassFloorConstants}). */
export const DEFINING_WORLD_PLAZA_SANDBOX_TILE_COLOR_A = 0x5a9e4b;

/** Alternate tile fill colors for the checkerboard floor (legacy; grass uses {@link definingWorldPlazaGrassFloorConstants}). */
export const DEFINING_WORLD_PLAZA_SANDBOX_TILE_COLOR_B = 0x6bb85a;

/** Local player avatar fill color. */
export const DEFINING_WORLD_PLAZA_SANDBOX_AVATAR_FILL_COLOR = 0xf4d35e;

/** Local player avatar outline color. */
export const DEFINING_WORLD_PLAZA_SANDBOX_AVATAR_STROKE_COLOR = 0x1b263b;

/** Avatar outline width (pixels). */
export const DEFINING_WORLD_PLAZA_SANDBOX_AVATAR_STROKE_WIDTH_PX = 2;
