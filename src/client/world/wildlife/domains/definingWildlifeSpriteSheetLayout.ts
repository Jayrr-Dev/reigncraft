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

/**
 * Maps motion kind to candidate sheet filenames inside each species folder,
 * ordered by preference. Some animals lack a Walk sheet (e.g. Grey Wolf),
 * so the loader falls back down this list.
 */
export const DEFINING_WILDLIFE_MOTION_SHEET_FILE_NAMES: Record<
  DefiningWildlifeMotionClipKind,
  readonly string[]
> = {
  idle: ['Idle_Shadowless.png', 'Idle2_Shadowless.png'],
  walk: ['Walk_Shadowless.png', 'Run_Shadowless.png', 'Idle_Shadowless.png'],
  run: ['Run_Shadowless.png', 'Walk_Shadowless.png', 'Idle_Shadowless.png'],
  attack: ['Attack1_Shadowless.png', 'Attack2_Shadowless.png'],
  takeDamage: ['TakeDamage_Shadowless.png', 'Idle_Shadowless.png'],
  die: ['Die_Shadowless.png', 'TakeDamage_Shadowless.png'],
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

/** Builds a motion sheet layout for one derived frame size. */
export function definingWildlifeMotionSheetLayout(
  frameWidthPx: number,
  frameHeightPx: number
): DefiningWorldPlazaGirlSampleMotionSheetLayout {
  return {
    columnCount: DEFINING_WILDLIFE_SHEET_COLUMN_COUNT,
    frameCount: DEFINING_WILDLIFE_SHEET_COLUMN_COUNT,
    frameWidthPx,
    frameHeightPx,
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

/** Builds candidate public URLs for one species motion sheet, in preference order. */
export function buildingWildlifeMotionSheetUrls(
  spriteFolder: string,
  motionKind: DefiningWildlifeMotionClipKind
): readonly string[] {
  const encodedFolder = spriteFolder
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');

  return DEFINING_WILDLIFE_MOTION_SHEET_FILE_NAMES[motionKind].map(
    (fileName) =>
      `${DEFINING_WILDLIFE_ASSET_BASE_URL}/${encodedFolder}/${fileName}`
  );
}
