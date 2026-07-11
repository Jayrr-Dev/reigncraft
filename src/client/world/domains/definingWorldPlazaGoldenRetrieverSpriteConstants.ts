/**
 * Golden Retriever plaza avatar sprite constants.
 *
 * Assets live under `public/creatures/sprites/species/golden-retriever/` as shadowless sprite sheets. Every
 * motion sheet is one 960x512 image packed as 8 direction rows by 15 animation
 * columns of 64x64 frames, matching the Husky pack layout.
 *
 * @module components/world/domains/definingWorldPlazaGoldenRetrieverSpriteConstants
 */

import type {
  DefiningWorldPlazaGirlSampleMotionSheetLayout,
  DefiningWorldPlazaGirlSampleWalkDirection,
} from '@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants';

/** Square frame size for every Golden Retriever motion sheet (pixels). */
export const DEFINING_WORLD_PLAZA_GOLDEN_RETRIEVER_FRAME_SIZE_PX = 64;

/** Animation columns per direction row in every Golden Retriever motion sheet. */
export const DEFINING_WORLD_PLAZA_GOLDEN_RETRIEVER_SHEET_COLUMN_COUNT = 15;

/** Direction rows packed into every Golden Retriever motion sheet. */
export const DEFINING_WORLD_PLAZA_GOLDEN_RETRIEVER_SHEET_ROW_COUNT = 8;

/** Base public URL for Golden Retriever sprite sheets. */
export const DEFINING_WORLD_PLAZA_GOLDEN_RETRIEVER_ASSET_BASE_URL =
  '/creatures/sprites/species/golden-retriever' as const;

/** Single-row motion layout shared by all Golden Retriever sheets. */
export const DEFINING_WORLD_PLAZA_GOLDEN_RETRIEVER_MOTION_SHEET_LAYOUT: DefiningWorldPlazaGirlSampleMotionSheetLayout =
  {
    columnCount: DEFINING_WORLD_PLAZA_GOLDEN_RETRIEVER_SHEET_COLUMN_COUNT,
    frameCount: DEFINING_WORLD_PLAZA_GOLDEN_RETRIEVER_SHEET_COLUMN_COUNT,
    frameWidthPx: DEFINING_WORLD_PLAZA_GOLDEN_RETRIEVER_FRAME_SIZE_PX,
    frameHeightPx: DEFINING_WORLD_PLAZA_GOLDEN_RETRIEVER_FRAME_SIZE_PX,
  };

/** Walk motion layout. */
export const DEFINING_WORLD_PLAZA_GOLDEN_RETRIEVER_WALK_MOTION_SHEET_LAYOUT =
  DEFINING_WORLD_PLAZA_GOLDEN_RETRIEVER_MOTION_SHEET_LAYOUT;

/** Run motion layout. */
export const DEFINING_WORLD_PLAZA_GOLDEN_RETRIEVER_RUN_MOTION_SHEET_LAYOUT =
  DEFINING_WORLD_PLAZA_GOLDEN_RETRIEVER_MOTION_SHEET_LAYOUT;

/** Idle motion layout. */
export const DEFINING_WORLD_PLAZA_GOLDEN_RETRIEVER_IDLE_MOTION_SHEET_LAYOUT =
  DEFINING_WORLD_PLAZA_GOLDEN_RETRIEVER_MOTION_SHEET_LAYOUT;

/** Jump motion layout (reuses the Run sheet). */
export const DEFINING_WORLD_PLAZA_GOLDEN_RETRIEVER_JUMP_MOTION_SHEET_LAYOUT =
  DEFINING_WORLD_PLAZA_GOLDEN_RETRIEVER_MOTION_SHEET_LAYOUT;

/** Fall motion layout (reuses the Run sheet). */
export const DEFINING_WORLD_PLAZA_GOLDEN_RETRIEVER_FALL_MOTION_SHEET_LAYOUT =
  DEFINING_WORLD_PLAZA_GOLDEN_RETRIEVER_MOTION_SHEET_LAYOUT;

/**
 * Screen-space direction to sheet row index.
 *
 * Same vertical/diagonal inversion as the Husky pack so screen movement matches
 * the painted facing on each strip.
 */
export const DEFINING_WORLD_PLAZA_GOLDEN_RETRIEVER_DIRECTION_ROW_INDEX: Record<
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
export const DEFINING_WORLD_PLAZA_GOLDEN_RETRIEVER_WALK_ANIMATION_FPS = 14;

/** Run animation frames per second. */
export const DEFINING_WORLD_PLAZA_GOLDEN_RETRIEVER_RUN_ANIMATION_FPS = 18;

/** Idle animation frames per second (looped). */
export const DEFINING_WORLD_PLAZA_GOLDEN_RETRIEVER_IDLE_ANIMATION_FPS = 8;

/** Jump animation frames per second (one-shot). */
export const DEFINING_WORLD_PLAZA_GOLDEN_RETRIEVER_JUMP_ANIMATION_FPS = 18;

/** Fall animation frames per second (loops until landing). */
export const DEFINING_WORLD_PLAZA_GOLDEN_RETRIEVER_FALL_ANIMATION_FPS = 18;

/** Sprite direction strip used while falling. */
export const DEFINING_WORLD_PLAZA_GOLDEN_RETRIEVER_FALL_SPRITE_DIRECTION =
  'Down' as const;

/** Normalized horizontal anchor at the grid/collision origin. */
export const DEFINING_WORLD_PLAZA_GOLDEN_RETRIEVER_ANCHOR_X_NORMALIZED = 0.5;

/** Normalized vertical anchor; higher values sit nearer the feet. */
export const DEFINING_WORLD_PLAZA_GOLDEN_RETRIEVER_ANCHOR_Y_NORMALIZED = 0.66;

/** Sprite scale tuned for 64 px frames on 64 px isometric tiles. */
export const DEFINING_WORLD_PLAZA_GOLDEN_RETRIEVER_SPRITE_SCALE = 1.75;

/** Default facing when the Golden Retriever avatar is idle. */
export const DEFINING_WORLD_PLAZA_GOLDEN_RETRIEVER_DEFAULT_DIRECTION =
  'Down' as const;

/** Maps each motion to its public Golden Retriever shadowless sheet URL. */
export const DEFINING_WORLD_PLAZA_GOLDEN_RETRIEVER_MOTION_SHEET_URLS = {
  walk: `${DEFINING_WORLD_PLAZA_GOLDEN_RETRIEVER_ASSET_BASE_URL}/Walk_Shadowless.webp`,
  run: `${DEFINING_WORLD_PLAZA_GOLDEN_RETRIEVER_ASSET_BASE_URL}/Run_Shadowless.webp`,
  idle: `${DEFINING_WORLD_PLAZA_GOLDEN_RETRIEVER_ASSET_BASE_URL}/Idle_Shadowless.webp`,
  jump: `${DEFINING_WORLD_PLAZA_GOLDEN_RETRIEVER_ASSET_BASE_URL}/Run_Shadowless.webp`,
} as const;
