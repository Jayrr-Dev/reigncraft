/**
 * Shared sprite sheet layout for the SmallScaleInt 8-direction animal pack.
 *
 * Assets live under `public/Animals/<folder>/` as shadowless sheets:
 * 8 direction rows × 15 animation columns per motion clip.
 *
 * @module components/world/wildlife/domains/definingWildlifeSpriteSheetLayout
 */

import type {
  DefiningWorldPlazaGirlSampleMotionSheetLayout,
  DefiningWorldPlazaGirlSampleWalkDirection,
} from '@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants';

/** Base public URL for animal sprite sheets. */
export const DEFINING_WILDLIFE_ASSET_BASE_URL = '/Animals' as const;

/** Standard frame size for smaller animals (pixels). */
export const DEFINING_WILDLIFE_FRAME_SIZE_SMALL_PX = 64;

/** Frame size for larger animals (pixels). */
export const DEFINING_WILDLIFE_FRAME_SIZE_LARGE_PX = 128;

/** Animation columns per direction row. */
export const DEFINING_WILDLIFE_SHEET_COLUMN_COUNT = 15;

/** Direction rows per motion sheet. */
export const DEFINING_WILDLIFE_SHEET_ROW_COUNT = 8;

/** Motion clip ids supported by every wildlife species. */
export type DefiningWildlifeMotionClipKind =
  | 'idle'
  | 'walk'
  | 'run'
  | 'attack'
  | 'takeDamage'
  | 'die';

/** Maps motion kind to the shadowless sheet filename inside each species folder. */
export const DEFINING_WILDLIFE_MOTION_SHEET_FILE_NAMES: Record<
  DefiningWildlifeMotionClipKind,
  string
> = {
  idle: 'Idle_Shadowless.png',
  walk: 'Walk_Shadowless.png',
  run: 'Run_Shadowless.png',
  attack: 'Attack1_Shadowless.png',
  takeDamage: 'TakeDamage_Shadowless.png',
  die: 'Die_Shadowless.png',
};

/**
 * Screen-space direction to sheet row index (same inversion as Husky pack).
 */
export const DEFINING_WILDLIFE_DIRECTION_ROW_INDEX: Record<
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

/** Builds a motion sheet layout for one frame size. */
export function definingWildlifeMotionSheetLayout(
  frameSizePx: number
): DefiningWorldPlazaGirlSampleMotionSheetLayout {
  return {
    columnCount: DEFINING_WILDLIFE_SHEET_COLUMN_COUNT,
    frameCount: DEFINING_WILDLIFE_SHEET_COLUMN_COUNT,
    frameWidthPx: frameSizePx,
    frameHeightPx: frameSizePx,
  };
}

/** Animation fps per motion kind. */
export const DEFINING_WILDLIFE_MOTION_FPS: Record<
  DefiningWildlifeMotionClipKind,
  number
> = {
  idle: 8,
  walk: 14,
  run: 18,
  attack: 16,
  takeDamage: 12,
  die: 10,
};

/** Builds the public URL for one species motion sheet. */
export function buildingWildlifeMotionSheetUrl(
  spriteFolder: string,
  motionKind: DefiningWildlifeMotionClipKind
): string {
  const encodedFolder = spriteFolder
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');

  return `${DEFINING_WILDLIFE_ASSET_BASE_URL}/${encodedFolder}/${DEFINING_WILDLIFE_MOTION_SHEET_FILE_NAMES[motionKind]}`;
}
