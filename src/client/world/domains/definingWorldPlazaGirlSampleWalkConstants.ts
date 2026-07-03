/**
 * GirlSample walk and run sprite constants for the plaza test character.
 *
 * Assets live under `public/GirlSample_Walk_256Update/`.
 * Walk strips are 4x3 (9 frames). Run strips are 4x2 (8 frames).
 * Eight direction strips are loaded for screen-space octant movement.
 */

/** Shared frame width for GirlSample walk and run strips. */
export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_MOTION_FRAME_WIDTH_PX = 256;

/** Shared frame height for GirlSample walk and run strips. */
export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_MOTION_FRAME_HEIGHT_PX = 256;

/** Sprite sheet layout for one GirlSample motion strip. */
export interface DefiningWorldPlazaGirlSampleMotionSheetLayout {
  columnCount: number;
  frameCount: number;
  frameWidthPx: number;
  frameHeightPx: number;
}

/** Walk strip layout: 1024x768, 4 columns x 3 rows, 9 frames. */
export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_MOTION_SHEET_LAYOUT: DefiningWorldPlazaGirlSampleMotionSheetLayout =
  {
    columnCount: 4,
    frameCount: 9,
    frameWidthPx: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_MOTION_FRAME_WIDTH_PX,
    frameHeightPx: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_MOTION_FRAME_HEIGHT_PX,
  };

/**
 * Run strip layout: 1024x512 sheet, 4 columns x 2 rows, but only the first
 * 5 cells hold frames (top row + bottom-left). The trailing 3 cells are empty,
 * so the frame count must stop at 5 to avoid blank-frame flicker.
 */
export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_RUN_MOTION_SHEET_LAYOUT: DefiningWorldPlazaGirlSampleMotionSheetLayout =
  {
    columnCount: 4,
    frameCount: 5,
    frameWidthPx: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_MOTION_FRAME_WIDTH_PX,
    frameHeightPx: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_MOTION_FRAME_HEIGHT_PX,
  };

/** Base public URL for GirlSample character sprite strips. */
export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_ASSET_BASE_URL =
  "/GirlSample_Walk_256Update" as const;

/** TanStack Query key for loaded GirlSample walk, run, jump, and idle textures. */
export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_CHARACTER_TEXTURES_QUERY_KEY = [
  "world-plaza",
  "girl-sample",
  "character-textures",
  "8-direction",
  "run-4x2",
  "jump-4x3",
  "idle-4x4",
] as const;

/** Columns in each walk direction strip. */
export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_SHEET_COLUMN_COUNT =
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_MOTION_SHEET_LAYOUT.columnCount;

/** Rows in each walk direction strip. */
export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_SHEET_ROW_COUNT = 3;

/** Width of one walk animation frame (pixels). */
export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_FRAME_WIDTH_PX =
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_MOTION_FRAME_WIDTH_PX;

/** Height of one walk animation frame (pixels). */
export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_FRAME_HEIGHT_PX =
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_MOTION_FRAME_HEIGHT_PX;

/** Walk frames used per direction strip (last row is partially empty). */
export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_FRAME_COUNT =
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_MOTION_SHEET_LAYOUT.frameCount;

/** Walk animation frames per second. */
export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_ANIMATION_FPS = 6;

/** Run animation frames per second. */
export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_RUN_ANIMATION_FPS = 9;

/** Normalized horizontal anchor at the grid/collision origin. */
export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_ANCHOR_X_NORMALIZED = 0.5;

/**
 * Upper torso: player grid position, collision, camera follow, and container
 * origin. Higher values sit nearer the feet.
 */
export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_ANCHOR_Y_NORMALIZED = 0.61;

/** Painted foot line in the sprite frame (ground shadow placement only). */
export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_FOOT_Y_NORMALIZED = 0.8;

/** Sprite scale tuned for 64 px isometric tiles. */
export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_SPRITE_SCALE = 0.38;

/**
 * Distance from the grid anchor down to the painted feet (world-local px).
 */
export function computingWorldPlazaGirlSampleFootOffsetBelowGridAnchorPx(): number {
  return (
    (DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_FOOT_Y_NORMALIZED -
      DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_ANCHOR_Y_NORMALIZED) *
    DEFINING_WORLD_PLAZA_GIRL_SAMPLE_MOTION_FRAME_HEIGHT_PX *
    DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_SPRITE_SCALE
  );
}

/**
 * Distance from the grid anchor up to the top of the sprite (world-local px).
 */
export function computingWorldPlazaGirlSampleSpriteExtentAboveGridAnchorPx(): number {
  return (
    DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_ANCHOR_Y_NORMALIZED *
    DEFINING_WORLD_PLAZA_GIRL_SAMPLE_MOTION_FRAME_HEIGHT_PX *
    DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_SPRITE_SCALE
  );
}

/** Minimum grid movement before facing updates. */
export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_FACING_CHANGE_EPSILON = 0.0001;

/** Default facing when the avatar is idle. */
export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_DEFAULT_DIRECTION =
  "Down" as const;

/** Number of walk directions supported by the GirlSample strips. */
export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_DIRECTION_COUNT = 8;

/** GirlSample walk directions in clockwise screen order starting at Right. */
export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_DIRECTIONS = [
  "Right",
  "DownRight",
  "Down",
  "DownLeft",
  "Left",
  "UpLeft",
  "Up",
  "UpRight",
] as const;

/** GirlSample walk directions used by the plaza avatar. */
export type DefiningWorldPlazaGirlSampleWalkDirection =
  (typeof DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_DIRECTIONS)[number];

/** Maps each walk direction to its public sprite strip URL. */
export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_DIRECTION_URLS: Record<
  DefiningWorldPlazaGirlSampleWalkDirection,
  string
> = {
  Right: `${DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_ASSET_BASE_URL}/GirlSample_Walk_Right.png`,
  DownRight: `${DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_ASSET_BASE_URL}/GirlSample_Walk_DownRight.png`,
  Down: `${DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_ASSET_BASE_URL}/GirlSample_Walk_Down.png`,
  DownLeft: `${DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_ASSET_BASE_URL}/GirlSample_Walk_DownLeft.png`,
  Left: `${DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_ASSET_BASE_URL}/GirlSample_Walk_Left.png`,
  UpLeft: `${DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_ASSET_BASE_URL}/GirlSample_Walk_UpLeft.png`,
  Up: `${DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_ASSET_BASE_URL}/GirlSample_Walk_Up.png`,
  UpRight: `${DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_ASSET_BASE_URL}/GirlSample_Walk_UpRight.png`,
};

/** Maps each run direction to its public sprite strip URL. */
export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_RUN_DIRECTION_URLS: Record<
  DefiningWorldPlazaGirlSampleWalkDirection,
  string
> = {
  Right: `${DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_ASSET_BASE_URL}/GirlSample_Run_Right.png`,
  DownRight: `${DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_ASSET_BASE_URL}/GirlSample_Run_DownRight.png`,
  Down: `${DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_ASSET_BASE_URL}/GirlSample_Run_Down.png`,
  DownLeft: `${DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_ASSET_BASE_URL}/GirlSample_Run_DowlLeft.png`,
  Left: `${DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_ASSET_BASE_URL}/GirlSample_Run_Left.png`,
  UpLeft: `${DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_ASSET_BASE_URL}/GirlSample_Run_UpLeft.png`,
  Up: `${DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_ASSET_BASE_URL}/GirlSample_Run_Up.png`,
  UpRight: `${DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_ASSET_BASE_URL}/GirlSample_Run_UpRight.png`,
};
