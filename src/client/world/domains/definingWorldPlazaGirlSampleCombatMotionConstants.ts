/**
 * GirlSample combat and reaction sprite constants.
 *
 * Assets live under `public/creatures/sprites/playable/girl-sample/` in per-motion folders.
 * All strips use 256 px frames unless noted in each layout entry.
 */

import {
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_MOTION_FRAME_HEIGHT_PX,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_MOTION_FRAME_WIDTH_PX,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_ASSET_BASE_URL,
  type DefiningWorldPlazaGirlSampleMotionSheetLayout,
  type DefiningWorldPlazaGirlSampleWalkDirection,
} from '@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants';
import type { DefiningWorldPlazaEntityDamageKind } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';

/** Roll strip layout: 1024x768, 4x3, 9 frames. */
export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_MOTION_SHEET_LAYOUT: DefiningWorldPlazaGirlSampleMotionSheetLayout =
  {
    columnCount: 4,
    frameCount: 9,
    frameWidthPx: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_MOTION_FRAME_WIDTH_PX,
    frameHeightPx: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_MOTION_FRAME_HEIGHT_PX,
  };

/** Melee strip layout: 1024x768, 4x3, 9 frames. */
export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_MELEE_MOTION_SHEET_LAYOUT: DefiningWorldPlazaGirlSampleMotionSheetLayout =
  {
    columnCount: 4,
    frameCount: 9,
    frameWidthPx: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_MOTION_FRAME_WIDTH_PX,
    frameHeightPx: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_MOTION_FRAME_HEIGHT_PX,
  };

/** Damaged hit-react strip layout: 1024x768, 4x3, 9 frames. */
export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_DAMAGED_MOTION_SHEET_LAYOUT: DefiningWorldPlazaGirlSampleMotionSheetLayout =
  {
    columnCount: 4,
    frameCount: 9,
    frameWidthPx: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_MOTION_FRAME_WIDTH_PX,
    frameHeightPx: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_MOTION_FRAME_HEIGHT_PX,
  };

/** Death strip layout: 1024x1792, 4x7 grid, 27 populated frames (last cell empty). */
export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_DEATH_MOTION_SHEET_LAYOUT: DefiningWorldPlazaGirlSampleMotionSheetLayout =
  {
    columnCount: 4,
    frameCount: 27,
    frameWidthPx: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_MOTION_FRAME_WIDTH_PX,
    frameHeightPx: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_MOTION_FRAME_HEIGHT_PX,
  };

/** Push strip layout: 1024x1280, 4x5, 18 populated frames. */
export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_PUSH_MOTION_SHEET_LAYOUT: DefiningWorldPlazaGirlSampleMotionSheetLayout =
  {
    columnCount: 4,
    frameCount: 18,
    frameWidthPx: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_MOTION_FRAME_WIDTH_PX,
    frameHeightPx: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_MOTION_FRAME_HEIGHT_PX,
  };

/** Boost strip layout: 1024x1024, 4x4, 16 frames. */
export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_BOOST_MOTION_SHEET_LAYOUT: DefiningWorldPlazaGirlSampleMotionSheetLayout =
  {
    columnCount: 4,
    frameCount: 16,
    frameWidthPx: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_MOTION_FRAME_WIDTH_PX,
    frameHeightPx: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_MOTION_FRAME_HEIGHT_PX,
  };

/** Block strip layout: 1024x256, 4x1, 4 frames. */
export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_BLOCK_MOTION_SHEET_LAYOUT: DefiningWorldPlazaGirlSampleMotionSheetLayout =
  {
    columnCount: 4,
    frameCount: 4,
    frameWidthPx: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_MOTION_FRAME_WIDTH_PX,
    frameHeightPx: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_MOTION_FRAME_HEIGHT_PX,
  };

export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_ANIMATION_FPS = 18;
export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_MELEE_ANIMATION_FPS = 14;
export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_DAMAGED_ANIMATION_FPS = 14;
export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_DEATH_ANIMATION_FPS = 10;
export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_PUSH_ANIMATION_FPS = 10;
export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_BOOST_ANIMATION_FPS = 8;
export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_BLOCK_ANIMATION_FPS = 10;

/** Roll travel distance in grid units (Dark Souls style dodge distance). */
export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_FORWARD_GRID_DISTANCE = 2.25;

/** Roll duration synced to the full strip at roll fps (base for future roll buffs). */
export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_DURATION_MS =
  (DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_MOTION_SHEET_LAYOUT.frameCount /
    DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_ANIMATION_FPS) *
  1000;

/** Active dodge window during a roll (middle portion of roll duration). */
export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_DODGE_START_RATIO = 0.15;
export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_DODGE_END_RATIO = 0.75;

/** Roll progress at which another roll can start (1 = full roll must finish). */
export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_CHAIN_START_RATIO = 1;

/** Extra pause after the chain point before the next roll can begin. */
export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_CHAIN_EXTRA_DELAY_MS = 150;

/** Minimum physical damage reduction at the dodge window edges (0..1). */
export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_DODGE_MIN_DAMAGE_REDUCTION_RATIO = 0.75;

/** Maximum physical damage reduction at the dodge window peak frame (0..1). */
export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_DODGE_MAX_DAMAGE_REDUCTION_RATIO = 0.95;

/** Direct attack damage kinds mitigated by an active roll dodge. */
export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_DODGE_MITIGATED_DAMAGE_KINDS =
  ['physical'] as const satisfies readonly DefiningWorldPlazaEntityDamageKind[];

/** Melee attack presentation duration. */
export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_MELEE_DURATION_MS =
  (DEFINING_WORLD_PLAZA_GIRL_SAMPLE_MELEE_MOTION_SHEET_LAYOUT.frameCount /
    DEFINING_WORLD_PLAZA_GIRL_SAMPLE_MELEE_ANIMATION_FPS) *
  1000;

/** Damaged hit-react presentation duration (full strip at 14 fps). */
export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_DAMAGED_DURATION_MS =
  (DEFINING_WORLD_PLAZA_GIRL_SAMPLE_DAMAGED_MOTION_SHEET_LAYOUT.frameCount /
    DEFINING_WORLD_PLAZA_GIRL_SAMPLE_DAMAGED_ANIMATION_FPS) *
  1000;

/** Block / dodge / soften defensive reaction duration. */
export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_BLOCK_REACTION_DURATION_MS = 400;

/** Push-into-wall presentation duration. */
export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_PUSH_DURATION_MS =
  (DEFINING_WORLD_PLAZA_GIRL_SAMPLE_PUSH_MOTION_SHEET_LAYOUT.frameCount /
    DEFINING_WORLD_PLAZA_GIRL_SAMPLE_PUSH_ANIMATION_FPS) *
  1000;

function definingWorldPlazaGirlSampleCombatDirectionUrls(
  folderName: string,
  filePrefix: string
): Record<DefiningWorldPlazaGirlSampleWalkDirection, string> {
  return {
    Right: `${DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_ASSET_BASE_URL}/${folderName}/${filePrefix}_Right.webp`,
    DownRight: `${DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_ASSET_BASE_URL}/${folderName}/${filePrefix}_DownRight.webp`,
    Down: `${DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_ASSET_BASE_URL}/${folderName}/${filePrefix}_Down.webp`,
    DownLeft: `${DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_ASSET_BASE_URL}/${folderName}/${filePrefix}_DownLeft.webp`,
    Left: `${DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_ASSET_BASE_URL}/${folderName}/${filePrefix}_Left.webp`,
    UpLeft: `${DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_ASSET_BASE_URL}/${folderName}/${filePrefix}_UpLeft.webp`,
    Up: `${DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_ASSET_BASE_URL}/${folderName}/${filePrefix}_Up.webp`,
    UpRight: `${DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_ASSET_BASE_URL}/${folderName}/${filePrefix}_UpRight.webp`,
  };
}

export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_DIRECTION_URLS =
  definingWorldPlazaGirlSampleCombatDirectionUrls(
    'GirlSample_Roll',
    'GirlSample_Roll'
  );

export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_MELEE_DIRECTION_URLS =
  definingWorldPlazaGirlSampleCombatDirectionUrls(
    'GirlSample_Melee',
    'GirlSample_Melee'
  );

export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_DAMAGED_DIRECTION_URLS =
  definingWorldPlazaGirlSampleCombatDirectionUrls(
    'GirlSample_Damaged',
    'GirlSample_Damaged'
  );

export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_DEATH_DIRECTION_URLS =
  definingWorldPlazaGirlSampleCombatDirectionUrls(
    'GirlSample_Death',
    'GirlSample_Death'
  );

export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_PUSH_DIRECTION_URLS =
  definingWorldPlazaGirlSampleCombatDirectionUrls(
    'GirlSample_Push',
    'GirlSample_Push'
  );

export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_BOOST_DIRECTION_URLS =
  definingWorldPlazaGirlSampleCombatDirectionUrls(
    'GirlSample_Boost',
    'GirlSample_Boost'
  );

export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_BLOCK_DIRECTION_URLS =
  definingWorldPlazaGirlSampleCombatDirectionUrls(
    'GirlSample_Block',
    'GirlSample_Block'
  );

/** Combat presentation clip suffixes registered for GirlSample only. */
export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_COMBAT_MOTION_CLIP_SUFFIXES = [
  'roll',
  'melee',
  'damaged',
  'death',
  'push',
  'boost',
  'block',
] as const;

export type DefiningWorldPlazaGirlSampleCombatMotionClipSuffix =
  (typeof DEFINING_WORLD_PLAZA_GIRL_SAMPLE_COMBAT_MOTION_CLIP_SUFFIXES)[number];
