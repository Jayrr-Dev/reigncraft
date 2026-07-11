/**
 * Fox Peach plaza avatar sprite constants.
 *
 * Assets live under `public/creatures/sprites/playable/fox-peach/` as per-direction sprite strips named
 * `Fox_Normal_{Motion}_dir{N}.webp`. Each direction file is one motion strip:
 * walk sheets are 1536x512 (6 columns x 2 rows, 12 frames) and idle sheets
 * are 1536x1024 (6 columns x 4 rows, 20 populated frames).
 *
 * The pack has no dedicated run or jump strips, so run, jump, and fall reuse
 * the walk strips with faster frame rates where appropriate.
 *
 * @module components/world/domains/definingWorldPlazaFoxPeachSpriteConstants
 */

import { DEFINING_PUBLIC_SPRITE_ASSET_EXTENSION } from '@/components/world/domains/definingPublicSpriteAssetExtension';
import type {
  DefiningWorldPlazaGirlSampleMotionSheetLayout,
  DefiningWorldPlazaGirlSampleWalkDirection,
} from '@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants';

/** Square frame size for every Fox Peach motion strip (pixels). */
export const DEFINING_WORLD_PLAZA_FOX_PEACH_FRAME_SIZE_PX = 256;

/** Base public URL for Fox Peach sprite strips. */
export const DEFINING_WORLD_PLAZA_FOX_PEACH_ASSET_BASE_URL =
  '/creatures/sprites/playable/fox-peach' as const;

/** Walk strip layout: 1536x512, 6 columns x 2 rows, 12 frames. */
export const DEFINING_WORLD_PLAZA_FOX_PEACH_WALK_MOTION_SHEET_LAYOUT: DefiningWorldPlazaGirlSampleMotionSheetLayout =
  {
    columnCount: 6,
    frameCount: 12,
    frameWidthPx: DEFINING_WORLD_PLAZA_FOX_PEACH_FRAME_SIZE_PX,
    frameHeightPx: DEFINING_WORLD_PLAZA_FOX_PEACH_FRAME_SIZE_PX,
  };

/** Idle strip layout: 1536x1024, 6 columns x 4 rows, 20 populated frames. */
export const DEFINING_WORLD_PLAZA_FOX_PEACH_IDLE_MOTION_SHEET_LAYOUT: DefiningWorldPlazaGirlSampleMotionSheetLayout =
  {
    columnCount: 6,
    frameCount: 20,
    frameWidthPx: DEFINING_WORLD_PLAZA_FOX_PEACH_FRAME_SIZE_PX,
    frameHeightPx: DEFINING_WORLD_PLAZA_FOX_PEACH_FRAME_SIZE_PX,
  };

/** Run motion layout (reuses the walk strip). */
export const DEFINING_WORLD_PLAZA_FOX_PEACH_RUN_MOTION_SHEET_LAYOUT =
  DEFINING_WORLD_PLAZA_FOX_PEACH_WALK_MOTION_SHEET_LAYOUT;

/** Jump motion layout (reuses the walk strip). */
export const DEFINING_WORLD_PLAZA_FOX_PEACH_JUMP_MOTION_SHEET_LAYOUT =
  DEFINING_WORLD_PLAZA_FOX_PEACH_WALK_MOTION_SHEET_LAYOUT;

/** Fall motion layout (reuses the walk strip). */
export const DEFINING_WORLD_PLAZA_FOX_PEACH_FALL_MOTION_SHEET_LAYOUT =
  DEFINING_WORLD_PLAZA_FOX_PEACH_WALK_MOTION_SHEET_LAYOUT;

/**
 * Screen-space direction to Fox Peach `dirN` file index.
 *
 * Up (dir4) and Down (dir8) match the pack's front/back strips. The remaining
 * six directions are mirrored left-right so screen movement matches facing.
 */
const DEFINING_WORLD_PLAZA_FOX_PEACH_DIRECTION_FILE_INDEX: Record<
  DefiningWorldPlazaGirlSampleWalkDirection,
  number
> = {
  Right: 6,
  DownRight: 7,
  Down: 8,
  DownLeft: 1,
  Left: 2,
  UpLeft: 3,
  Up: 4,
  UpRight: 5,
};

/**
 * Builds a Fox Peach per-direction strip URL for one motion.
 *
 * @param motionPrefix - Motion name segment in the asset filename.
 * @param direction - Screen-space walk direction.
 */
function buildingWorldPlazaFoxPeachDirectionStripUrl(
  motionPrefix: 'Walk' | 'Idle',
  direction: DefiningWorldPlazaGirlSampleWalkDirection
): string {
  const directionIndex =
    DEFINING_WORLD_PLAZA_FOX_PEACH_DIRECTION_FILE_INDEX[direction];

  return `${DEFINING_WORLD_PLAZA_FOX_PEACH_ASSET_BASE_URL}/Fox_Normal_${motionPrefix}_dir${directionIndex}${DEFINING_PUBLIC_SPRITE_ASSET_EXTENSION}`;
}

/** Maps each walk direction to its public Fox Peach walk strip URL. */
export const DEFINING_WORLD_PLAZA_FOX_PEACH_WALK_DIRECTION_URLS: Record<
  DefiningWorldPlazaGirlSampleWalkDirection,
  string
> = {
  Right: buildingWorldPlazaFoxPeachDirectionStripUrl('Walk', 'Right'),
  DownRight: buildingWorldPlazaFoxPeachDirectionStripUrl('Walk', 'DownRight'),
  Down: buildingWorldPlazaFoxPeachDirectionStripUrl('Walk', 'Down'),
  DownLeft: buildingWorldPlazaFoxPeachDirectionStripUrl('Walk', 'DownLeft'),
  Left: buildingWorldPlazaFoxPeachDirectionStripUrl('Walk', 'Left'),
  UpLeft: buildingWorldPlazaFoxPeachDirectionStripUrl('Walk', 'UpLeft'),
  Up: buildingWorldPlazaFoxPeachDirectionStripUrl('Walk', 'Up'),
  UpRight: buildingWorldPlazaFoxPeachDirectionStripUrl('Walk', 'UpRight'),
};

/** Maps each idle direction to its public Fox Peach idle strip URL. */
export const DEFINING_WORLD_PLAZA_FOX_PEACH_IDLE_DIRECTION_URLS: Record<
  DefiningWorldPlazaGirlSampleWalkDirection,
  string
> = {
  Right: buildingWorldPlazaFoxPeachDirectionStripUrl('Idle', 'Right'),
  DownRight: buildingWorldPlazaFoxPeachDirectionStripUrl('Idle', 'DownRight'),
  Down: buildingWorldPlazaFoxPeachDirectionStripUrl('Idle', 'Down'),
  DownLeft: buildingWorldPlazaFoxPeachDirectionStripUrl('Idle', 'DownLeft'),
  Left: buildingWorldPlazaFoxPeachDirectionStripUrl('Idle', 'Left'),
  UpLeft: buildingWorldPlazaFoxPeachDirectionStripUrl('Idle', 'UpLeft'),
  Up: buildingWorldPlazaFoxPeachDirectionStripUrl('Idle', 'Up'),
  UpRight: buildingWorldPlazaFoxPeachDirectionStripUrl('Idle', 'UpRight'),
};

/** Walk animation frames per second. */
export const DEFINING_WORLD_PLAZA_FOX_PEACH_WALK_ANIMATION_FPS = 10;

/** Run animation frames per second (walk strip, faster playback). */
export const DEFINING_WORLD_PLAZA_FOX_PEACH_RUN_ANIMATION_FPS = 22;

/** Idle animation frames per second (looped). */
export const DEFINING_WORLD_PLAZA_FOX_PEACH_IDLE_ANIMATION_FPS = 8;

/** Jump animation frames per second (one-shot walk strip). */
export const DEFINING_WORLD_PLAZA_FOX_PEACH_JUMP_ANIMATION_FPS = 14;

/** Fall animation frames per second (loops until landing). */
export const DEFINING_WORLD_PLAZA_FOX_PEACH_FALL_ANIMATION_FPS = 14;

/** Sprite direction strip used while falling. */
export const DEFINING_WORLD_PLAZA_FOX_PEACH_FALL_SPRITE_DIRECTION =
  'Down' as const;

/** Normalized horizontal anchor at the grid/collision origin. */
export const DEFINING_WORLD_PLAZA_FOX_PEACH_ANCHOR_X_NORMALIZED = 0.5;

/**
 * Normalized vertical anchor at the painted feet line.
 *
 * Frames leave empty padding below the fox, so the anchor sits higher in the
 * cell than dog packs that fill the full 256 px frame.
 */
export const DEFINING_WORLD_PLAZA_FOX_PEACH_ANCHOR_Y_NORMALIZED = 0.42;

/** Painted foot line in the sprite frame (ground shadow placement only). */
export const DEFINING_WORLD_PLAZA_FOX_PEACH_WALK_FOOT_Y_NORMALIZED = 0.68;

/** Sprite scale tuned for 256 px frames on 64 px isometric tiles. */
export const DEFINING_WORLD_PLAZA_FOX_PEACH_SPRITE_SCALE = 0.4;

/**
 * Distance from the grid anchor down to the painted feet (world-local px).
 */
export function computingWorldPlazaFoxPeachFootOffsetBelowGridAnchorPx(): number {
  return (
    (DEFINING_WORLD_PLAZA_FOX_PEACH_WALK_FOOT_Y_NORMALIZED -
      DEFINING_WORLD_PLAZA_FOX_PEACH_ANCHOR_Y_NORMALIZED) *
    DEFINING_WORLD_PLAZA_FOX_PEACH_FRAME_SIZE_PX *
    DEFINING_WORLD_PLAZA_FOX_PEACH_SPRITE_SCALE
  );
}

/** Default facing when the Fox Peach avatar is idle. */
export const DEFINING_WORLD_PLAZA_FOX_PEACH_DEFAULT_DIRECTION = 'Down' as const;

/** TanStack Query key for loaded Fox Peach walk, run, jump, and idle textures. */
export const DEFINING_WORLD_PLAZA_FOX_PEACH_CHARACTER_TEXTURES_QUERY_KEY = [
  'world-plaza',
  'fox-peach',
  'character-textures',
  '8-direction',
  'walk-6x2',
  'idle-6x4',
] as const;
