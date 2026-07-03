/**
 * GirlSample jump sprite constants for the plaza test character.
 *
 * Jump strips live under `public/GirlSample_Walk_256Update/` and use the same
 * 256 px frame size as walk. Each strip is 1024x768 (4 columns x 3 rows) with
 * 11 populated frames (the last cell in row three is empty).
 */

import {
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_MOTION_FRAME_HEIGHT_PX,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_MOTION_FRAME_WIDTH_PX,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_ASSET_BASE_URL,
  type DefiningWorldPlazaGirlSampleMotionSheetLayout,
  type DefiningWorldPlazaGirlSampleWalkDirection,
} from "@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants";

/** Jump strip layout: 1024x768, 4 columns x 3 rows, 11 frames. */
export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_JUMP_MOTION_SHEET_LAYOUT: DefiningWorldPlazaGirlSampleMotionSheetLayout =
  {
    columnCount: 4,
    frameCount: 11,
    frameWidthPx: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_MOTION_FRAME_WIDTH_PX,
    frameHeightPx: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_MOTION_FRAME_HEIGHT_PX,
  };

/** Jump animation frames per second (one-shot, not looped). */
export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_JUMP_ANIMATION_FPS = 14;

/** Total jump duration (ms); synced to the one-shot strip length. */
export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_JUMP_DURATION_MS =
  (DEFINING_WORLD_PLAZA_GIRL_SAMPLE_JUMP_MOTION_SHEET_LAYOUT.frameCount /
    DEFINING_WORLD_PLAZA_GIRL_SAMPLE_JUMP_ANIMATION_FPS) *
  1000;

/** Grid tiles traveled forward during a standing or walk jump. */
export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_JUMP_FORWARD_GRID_DISTANCE = 0.625;

/** Grid tiles traveled forward when jumping while running. */
export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_RUN_JUMP_FORWARD_GRID_DISTANCE = 3.5;

/** Peak vertical sprite lift during a normal jump arc (screen pixels). */
export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_JUMP_ARC_PEAK_SCREEN_PX = 28;

/** Peak vertical sprite lift during a running jump arc (screen pixels). */
export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_RUN_JUMP_ARC_PEAK_SCREEN_PX = 46;

/** Maps each jump direction to its public sprite strip URL. */
export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_JUMP_DIRECTION_URLS: Record<
  DefiningWorldPlazaGirlSampleWalkDirection,
  string
> = {
  Right: `${DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_ASSET_BASE_URL}/GirlSample_Jump_Right.png`,
  DownRight: `${DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_ASSET_BASE_URL}/GirlSample_Jump_DownRight.png`,
  Down: `${DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_ASSET_BASE_URL}/GirlSample_Jump_Down.png`,
  DownLeft: `${DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_ASSET_BASE_URL}/GirlSample_Jump_DownLeft.png`,
  Left: `${DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_ASSET_BASE_URL}/GirlSample_Jump_Left.png`,
  UpLeft: `${DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_ASSET_BASE_URL}/GirlSample_Jump_UpLeft.png`,
  Up: `${DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_ASSET_BASE_URL}/GirlSample_Jump_Up.png`,
  UpRight: `${DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_ASSET_BASE_URL}/GirlSample_Jump_UpRight.png`,
};
