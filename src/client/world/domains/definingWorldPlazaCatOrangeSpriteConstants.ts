/**
 * Cat Orange plaza avatar sprite constants.
 *
 * Assets live under `public/Cat Orange/` as shadowless sprite sheets. Every
 * motion sheet is one 960x512 image packed as 8 direction rows by 15 animation
 * columns of 64x64 frames, matching the Husky pack layout.
 *
 * @module components/world/domains/definingWorldPlazaCatOrangeSpriteConstants
 */

import type {
  DefiningWorldPlazaGirlSampleMotionSheetLayout,
  DefiningWorldPlazaGirlSampleWalkDirection,
} from "@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants";

/** Square frame size for every Cat Orange motion sheet (pixels). */
export const DEFINING_WORLD_PLAZA_CAT_ORANGE_FRAME_SIZE_PX = 64;

/** Animation columns per direction row in every Cat Orange motion sheet. */
export const DEFINING_WORLD_PLAZA_CAT_ORANGE_SHEET_COLUMN_COUNT = 15;

/** Direction rows packed into every Cat Orange motion sheet. */
export const DEFINING_WORLD_PLAZA_CAT_ORANGE_SHEET_ROW_COUNT = 8;

/** Base public URL for Cat Orange sprite sheets. */
export const DEFINING_WORLD_PLAZA_CAT_ORANGE_ASSET_BASE_URL =
  "/Cat%20Orange" as const;

/** Single-row motion layout shared by all Cat Orange sheets. */
export const DEFINING_WORLD_PLAZA_CAT_ORANGE_MOTION_SHEET_LAYOUT: DefiningWorldPlazaGirlSampleMotionSheetLayout =
  {
    columnCount: DEFINING_WORLD_PLAZA_CAT_ORANGE_SHEET_COLUMN_COUNT,
    frameCount: DEFINING_WORLD_PLAZA_CAT_ORANGE_SHEET_COLUMN_COUNT,
    frameWidthPx: DEFINING_WORLD_PLAZA_CAT_ORANGE_FRAME_SIZE_PX,
    frameHeightPx: DEFINING_WORLD_PLAZA_CAT_ORANGE_FRAME_SIZE_PX,
  };

/** Walk motion layout. */
export const DEFINING_WORLD_PLAZA_CAT_ORANGE_WALK_MOTION_SHEET_LAYOUT =
  DEFINING_WORLD_PLAZA_CAT_ORANGE_MOTION_SHEET_LAYOUT;

/** Run motion layout. */
export const DEFINING_WORLD_PLAZA_CAT_ORANGE_RUN_MOTION_SHEET_LAYOUT =
  DEFINING_WORLD_PLAZA_CAT_ORANGE_MOTION_SHEET_LAYOUT;

/** Idle motion layout. */
export const DEFINING_WORLD_PLAZA_CAT_ORANGE_IDLE_MOTION_SHEET_LAYOUT =
  DEFINING_WORLD_PLAZA_CAT_ORANGE_MOTION_SHEET_LAYOUT;

/** Jump motion layout. */
export const DEFINING_WORLD_PLAZA_CAT_ORANGE_JUMP_MOTION_SHEET_LAYOUT =
  DEFINING_WORLD_PLAZA_CAT_ORANGE_MOTION_SHEET_LAYOUT;

/** Fall motion layout (reuses the Run sheet). */
export const DEFINING_WORLD_PLAZA_CAT_ORANGE_FALL_MOTION_SHEET_LAYOUT =
  DEFINING_WORLD_PLAZA_CAT_ORANGE_MOTION_SHEET_LAYOUT;

/**
 * Screen-space direction to sheet row index.
 *
 * Same vertical/diagonal inversion as the Husky pack so screen movement matches
 * the painted facing on each strip.
 */
export const DEFINING_WORLD_PLAZA_CAT_ORANGE_DIRECTION_ROW_INDEX: Record<
  DefiningWorldPlazaGirlSampleWalkDirection,
  number
> = {
  Right: 0,
  UpRight: 7,
  Up: 6,
  UpLeft: 5,
  Left: 4,
  DownLeft: 3,
  Down: 2,
  DownRight: 1,
};

/** Walk animation frames per second. */
export const DEFINING_WORLD_PLAZA_CAT_ORANGE_WALK_ANIMATION_FPS = 14;

/** Run animation frames per second. */
export const DEFINING_WORLD_PLAZA_CAT_ORANGE_RUN_ANIMATION_FPS = 18;

/** Idle animation frames per second (looped). */
export const DEFINING_WORLD_PLAZA_CAT_ORANGE_IDLE_ANIMATION_FPS = 8;

/** Jump animation frames per second (one-shot). */
export const DEFINING_WORLD_PLAZA_CAT_ORANGE_JUMP_ANIMATION_FPS = 18;

/** Fall animation frames per second (loops until landing). */
export const DEFINING_WORLD_PLAZA_CAT_ORANGE_FALL_ANIMATION_FPS = 18;

/** Sprite direction strip used while falling. */
export const DEFINING_WORLD_PLAZA_CAT_ORANGE_FALL_SPRITE_DIRECTION =
  "Down" as const;

/** Normalized horizontal anchor at the grid/collision origin. */
export const DEFINING_WORLD_PLAZA_CAT_ORANGE_ANCHOR_X_NORMALIZED = 0.5;

/** Normalized vertical anchor; higher values sit nearer the feet. */
export const DEFINING_WORLD_PLAZA_CAT_ORANGE_ANCHOR_Y_NORMALIZED = 0.66;

/** Sprite scale tuned for 64 px frames on 64 px isometric tiles. */
export const DEFINING_WORLD_PLAZA_CAT_ORANGE_SPRITE_SCALE = 1.75;

/** Default facing when the Cat Orange avatar is idle. */
export const DEFINING_WORLD_PLAZA_CAT_ORANGE_DEFAULT_DIRECTION =
  "Down" as const;

/** Maps each motion to its public Cat Orange shadowless sheet URL. */
export const DEFINING_WORLD_PLAZA_CAT_ORANGE_MOTION_SHEET_URLS = {
  walk: `${DEFINING_WORLD_PLAZA_CAT_ORANGE_ASSET_BASE_URL}/Walk_Shadowless.png`,
  run: `${DEFINING_WORLD_PLAZA_CAT_ORANGE_ASSET_BASE_URL}/Run_Shadowless.png`,
  idle: `${DEFINING_WORLD_PLAZA_CAT_ORANGE_ASSET_BASE_URL}/Idle_Shadowless.png`,
  jump: `${DEFINING_WORLD_PLAZA_CAT_ORANGE_ASSET_BASE_URL}/Jump_Shadowless.png`,
} as const;

/** TanStack Query key for loaded Cat Orange walk, run, jump, and idle textures. */
export const DEFINING_WORLD_PLAZA_CAT_ORANGE_CHARACTER_TEXTURES_QUERY_KEY = [
  "world-plaza",
  "cat-orange",
  "character-textures",
  "shadowless",
  "8-direction",
  "15-frame",
] as const;
