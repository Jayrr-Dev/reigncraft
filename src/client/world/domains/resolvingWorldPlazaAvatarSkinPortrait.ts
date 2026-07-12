/**
 * Resolves the CSS sprite crop for a playable avatar skin portrait, reusing
 * the same background-crop technique as the bestiary portraits.
 *
 * @module components/world/domains/resolvingWorldPlazaAvatarSkinPortrait
 */

import { resolvingWorldPlazaAnimalPlayableAvatarSkinRow } from '@/components/world/domains/definingWorldPlazaAnimalPlayableAvatarSkinRegistry';
import {
  DEFINING_WORLD_PLAZA_AVATAR_SKIN,
  type DefiningWorldPlazaAvatarSkinId,
} from '@/components/world/domains/definingWorldPlazaAvatarSkinConstants';
import {
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_IDLE_DIRECTION_URLS,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_IDLE_MOTION_SHEET_LAYOUT,
} from '@/components/world/domains/definingWorldPlazaGirlSampleIdleConstants';
import { resolvingWorldPlazaAnimalPlayableAvatarWildlifeSpeciesId } from '@/components/world/domains/resolvingWorldPlazaAnimalPlayableAvatarWildlifeSpeciesId';
import {
  buildingWildlifeMotionSheetUrls,
  DEFINING_WILDLIFE_SHEET_COLUMN_COUNT,
  DEFINING_WILDLIFE_SHEET_ROW_COUNT,
} from '@/components/world/wildlife/domains/definingWildlifeSpriteSheetLayout';

/** Camera-facing idle frame sampled from animal species sheets (row 2 = Down). */
const DEFINING_WORLD_PLAZA_AVATAR_PORTRAIT_ANIMAL_FRAME_COLUMN_INDEX = 0;
const DEFINING_WORLD_PLAZA_AVATAR_PORTRAIT_ANIMAL_FRAME_ROW_INDEX = 2;

/** CSS crop selecting one sprite-sheet frame as a portrait. */
export type ResolvingWorldPlazaAvatarSkinPortrait = {
  /** Public URL of the idle sprite sheet. */
  sheetUrl: string;
  /** CSS background-size scaling one frame to fill the box. */
  backgroundSizeCss: string;
  /** CSS background-position selecting the sampled frame. */
  backgroundPositionCss: string;
};

function computingPortraitCrop(
  columnCount: number,
  rowCount: number,
  columnIndex: number,
  rowIndex: number
): Pick<
  ResolvingWorldPlazaAvatarSkinPortrait,
  'backgroundSizeCss' | 'backgroundPositionCss'
> {
  const columnPercent =
    columnCount > 1 ? (columnIndex / (columnCount - 1)) * 100 : 0;
  const rowPercent = rowCount > 1 ? (rowIndex / (rowCount - 1)) * 100 : 0;

  return {
    backgroundSizeCss: `${columnCount * 100}% ${rowCount * 100}%`,
    backgroundPositionCss: `${columnPercent}% ${rowPercent}%`,
  };
}

/**
 * Builds the front-facing idle-frame CSS crop for one avatar skin, or null
 * when the skin has no known sheet layout.
 */
export function resolvingWorldPlazaAvatarSkinPortrait(
  skinId: DefiningWorldPlazaAvatarSkinId
): ResolvingWorldPlazaAvatarSkinPortrait | null {
  if (skinId === DEFINING_WORLD_PLAZA_AVATAR_SKIN.GIRL_SAMPLE) {
    const layout = DEFINING_WORLD_PLAZA_GIRL_SAMPLE_IDLE_MOTION_SHEET_LAYOUT;
    const rowCount = Math.ceil(layout.frameCount / layout.columnCount);

    return {
      sheetUrl: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_IDLE_DIRECTION_URLS.Down,
      ...computingPortraitCrop(layout.columnCount, rowCount, 0, 0),
    };
  }

  const animalRow = resolvingWorldPlazaAnimalPlayableAvatarSkinRow(skinId);

  if (!animalRow) {
    return null;
  }

  const wildlifeSpeciesId =
    resolvingWorldPlazaAnimalPlayableAvatarWildlifeSpeciesId(
      animalRow.spriteFolder
    );
  const sheetUrl = buildingWildlifeMotionSheetUrls(
    animalRow.spriteFolder,
    'idle',
    wildlifeSpeciesId ?? undefined
  )[0];

  if (!sheetUrl) {
    return null;
  }

  return {
    sheetUrl,
    ...computingPortraitCrop(
      DEFINING_WILDLIFE_SHEET_COLUMN_COUNT,
      DEFINING_WILDLIFE_SHEET_ROW_COUNT,
      DEFINING_WORLD_PLAZA_AVATAR_PORTRAIT_ANIMAL_FRAME_COLUMN_INDEX,
      DEFINING_WORLD_PLAZA_AVATAR_PORTRAIT_ANIMAL_FRAME_ROW_INDEX
    ),
  };
}
