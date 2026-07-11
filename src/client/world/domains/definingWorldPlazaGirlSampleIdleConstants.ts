/**
 * GirlSample ready-idle sprite constants for the plaza test character.
 *
 * Idle strips live under `public/creatures/sprites/playable/girl-sample/` and use the same
 * 256 px frame size as walk. Each strip is 1024x1024 (4 columns x 4 rows) with
 * 14 populated frames (the last two cells in row four are empty).
 */

import {
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_MOTION_FRAME_HEIGHT_PX,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_MOTION_FRAME_WIDTH_PX,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_ASSET_BASE_URL,
  type DefiningWorldPlazaGirlSampleMotionSheetLayout,
  type DefiningWorldPlazaGirlSampleWalkDirection,
} from '@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants';

/** Idle strip layout: 1024x1024, 4 columns x 4 rows, 14 frames. */
export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_IDLE_MOTION_SHEET_LAYOUT: DefiningWorldPlazaGirlSampleMotionSheetLayout =
  {
    columnCount: 4,
    frameCount: 14,
    frameWidthPx: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_MOTION_FRAME_WIDTH_PX,
    frameHeightPx: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_MOTION_FRAME_HEIGHT_PX,
  };

/** Ready-idle animation frames per second (looped). */
export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_IDLE_ANIMATION_FPS = 5;

/** Ready-idle loop plays for this long after a run ends, then the avatar settles to neutral. */
export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_READY_IDLE_DURATION_MS = 5000;

/** Maps each idle direction to its public sprite strip URL. */
export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_IDLE_DIRECTION_URLS: Record<
  DefiningWorldPlazaGirlSampleWalkDirection,
  string
> = {
  Right: `${DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_ASSET_BASE_URL}/GirlSample_ReadyIdle/GirlSample_ReadyIdle_Right.webp`,
  DownRight: `${DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_ASSET_BASE_URL}/GirlSample_ReadyIdle/GirlSample_ReadyIdle_DownRight.webp`,
  Down: `${DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_ASSET_BASE_URL}/GirlSample_ReadyIdle/GirlSample_ReadyIdle_Down.webp`,
  DownLeft: `${DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_ASSET_BASE_URL}/GirlSample_ReadyIdle/GirlSample_ReadyIdle_DownLeft.webp`,
  Left: `${DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_ASSET_BASE_URL}/GirlSample_ReadyIdle/GirlSample_ReadyIdle_Left.webp`,
  UpLeft: `${DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_ASSET_BASE_URL}/GirlSample_ReadyIdle/GirlSample_ReadyIdle_UpLeft.webp`,
  Up: `${DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_ASSET_BASE_URL}/GirlSample_ReadyIdle/GirlSample_ReadyIdle_Up.webp`,
  UpRight: `${DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_ASSET_BASE_URL}/GirlSample_ReadyIdle/GirlSample_ReadyIdle_UpRight.webp`,
};
