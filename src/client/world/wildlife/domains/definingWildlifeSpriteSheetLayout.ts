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
import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';

/** Base public URL for animal sprite sheets. */
export const DEFINING_WILDLIFE_ASSET_BASE_URL = '/Animals' as const;

/** Animation columns per direction row. */
export const DEFINING_WILDLIFE_SHEET_COLUMN_COUNT = 15;

/** Direction rows per motion sheet. */
export const DEFINING_WILDLIFE_SHEET_ROW_COUNT = 8;

import type { DefiningWildlifeExtendedMotionClipKind } from '@/components/world/wildlife/domains/definingWildlifeSpeciesExtendedMotionClipRegistry';

/** Motion clip ids that have their own sprite sheets on disk. */
export type DefiningWildlifeLoadedMotionClipKind =
  | 'idle'
  | 'walk'
  | 'run'
  | 'attack'
  | 'takeDamage'
  | 'die';

/** Motion clip ids used at runtime, including derived clips. */
export type DefiningWildlifeMotionClipKind =
  | DefiningWildlifeLoadedMotionClipKind
  | DefiningWildlifeExtendedMotionClipKind
  | 'sleep';

/**
 * Maps motion kind to candidate sheet filenames inside each species folder,
 * ordered by preference. Some animals lack a Walk sheet (e.g. Grey Wolf),
 * so the loader falls back down this list.
 */
export const DEFINING_WILDLIFE_MOTION_SHEET_FILE_NAMES: Record<
  DefiningWildlifeLoadedMotionClipKind,
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
 * Per-species motion sheet overrides when pack assets are missing or broken.
 *
 * Boar `Walk_Shadowless.png` duplicates one direction row across all eight rows;
 * `Run_Shadowless.png` has the correct 8-direction layout.
 */
export const DEFINING_WILDLIFE_SPECIES_MOTION_SHEET_FILE_NAME_OVERRIDES: Partial<
  Record<
    DefiningWildlifeSpeciesId,
    Partial<Record<DefiningWildlifeLoadedMotionClipKind, readonly string[]>>
  >
> = {
  boar: {
    walk: ['Run_Shadowless.png', 'Idle_Shadowless.png'],
  },
  'grey-wolf': {
    walk: ['Run_Shadowless.png', 'Idle_Shadowless.png'],
    run: ['Run_Shadowless.png', 'Idle_Shadowless.png'],
  },
  'omega-wolf': {
    walk: ['Run_Shadowless.png', 'Idle_Shadowless.png'],
    run: ['Run_Shadowless.png', 'Idle_Shadowless.png'],
  },
  // The Hayena pack ships bespoke file names instead of the shared layout.
  hyena: {
    idle: ['Hyena idle_Shadowless.png'],
    walk: ['Hyena Fast walk_Shadowless.png', 'Hyena run_Shadowless.png'],
    run: ['Hyena run_Shadowless.png', 'Hyena Fast walk_Shadowless.png'],
    attack: [
      'Hyena Attacking_Shadowless.png',
      'Hyena Jump attack_Shadowless.png',
    ],
    takeDamage: [
      'Hyena TakeDamage_Shadowless.png',
      'Hyena idle_Shadowless.png',
    ],
    die: ['Hyena Die_Shadowless.png', 'Hyena TakeDamage_Shadowless.png'],
  },
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
  attack2: 16,
  attack3: 14,
  takeDamage: 12,
  die: 10,
  howl: 10,
  sleep: 1,
};

/** Builds candidate public URLs for one species motion sheet, in preference order. */
export function buildingWildlifeMotionSheetUrls(
  spriteFolder: string,
  motionKind: DefiningWildlifeLoadedMotionClipKind,
  speciesId?: DefiningWildlifeSpeciesId
): readonly string[] {
  const encodedFolder = spriteFolder
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');

  const overrideFileNames =
    speciesId &&
    DEFINING_WILDLIFE_SPECIES_MOTION_SHEET_FILE_NAME_OVERRIDES[speciesId]?.[
      motionKind
    ];
  const fileNames: readonly string[] = Array.isArray(overrideFileNames)
    ? overrideFileNames
    : (DEFINING_WILDLIFE_MOTION_SHEET_FILE_NAMES[motionKind] ?? []);

  return fileNames.map(
    (fileName: string) =>
      `${DEFINING_WILDLIFE_ASSET_BASE_URL}/${encodedFolder}/${fileName}`
  );
}
