/**
 * Resolves the CSS crop for a species' bestiary portrait from its
 * idle sprite sheet (15 columns x 8 direction rows), or a glow-orb
 * stand-in for procedural companions without sheets.
 *
 * @module components/home/domains/resolvingPlazaBestiarySpritePortrait
 */

import {
  DEFINING_PLAZA_BESTIARY_PORTRAIT_FRAME_COLUMN_INDEX,
  DEFINING_PLAZA_BESTIARY_PORTRAIT_FRAME_ROW_INDEX,
} from '@/components/home/domains/definingPlazaBestiarySpritePortraitConstants';
import { formattingWorldPlazaPixiColorToCssHex } from '@/components/world/domains/formattingWorldPlazaPixiColorToCssHex';
import { checkingWildlifeSpeciesUsesGlowOrbPresentation } from '@/components/world/wildlife/domains/checkingWildlifeSpeciesUsesGlowOrbPresentation';
import {
  DEFINING_WILDLIFE_FAIRY_AURA_COLOR,
  DEFINING_WILDLIFE_FAIRY_BODY_COLOR,
} from '@/components/world/wildlife/domains/definingWildlifeFairyConstants';
import { resolvingWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import {
  buildingWildlifeMotionSheetUrls,
  DEFINING_WILDLIFE_SHEET_COLUMN_COUNT,
  DEFINING_WILDLIFE_SHEET_ROW_COUNT,
} from '@/components/world/wildlife/domains/definingWildlifeSpriteSheetLayout';
import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';

export type PlazaBestiarySpriteSheetPortrait = {
  kind: 'spriteSheet';
  /** Public URL of the idle sprite sheet. */
  sheetUrl: string;
  /** CSS background-size for one frame filling the box (e.g. "1500% 800%"). */
  backgroundSizeCss: string;
  /** CSS background-position selecting the sampled frame. */
  backgroundPositionCss: string;
};

export type PlazaBestiaryGlowOrbPortrait = {
  kind: 'glowOrb';
  /** Hex fill for the hard core (e.g. "#fff1a8"). */
  coreColorCss: string;
  /** Hex fill for the soft aura (e.g. "#ffd24a"). */
  auraColorCss: string;
};

export type PlazaBestiarySpritePortrait =
  | PlazaBestiarySpriteSheetPortrait
  | PlazaBestiaryGlowOrbPortrait;

/**
 * Builds the CSS sprite crop or glow-orb stand-in for one species portrait,
 * or null when the species has no registered presentation.
 */
export function resolvingPlazaBestiarySpritePortrait(
  speciesId: DefiningWildlifeSpeciesId
): PlazaBestiarySpritePortrait | null {
  const speciesDefinition = resolvingWildlifeSpeciesDefinition(speciesId);

  if (!speciesDefinition) {
    return null;
  }

  if (checkingWildlifeSpeciesUsesGlowOrbPresentation(speciesDefinition)) {
    return {
      kind: 'glowOrb',
      coreColorCss: formattingWorldPlazaPixiColorToCssHex(
        DEFINING_WILDLIFE_FAIRY_BODY_COLOR
      ),
      auraColorCss: formattingWorldPlazaPixiColorToCssHex(
        DEFINING_WILDLIFE_FAIRY_AURA_COLOR
      ),
    };
  }

  const sheetUrls = buildingWildlifeMotionSheetUrls(
    speciesDefinition.spriteFolder,
    'idle',
    speciesId
  );
  const sheetUrl = sheetUrls[0];

  if (!sheetUrl) {
    return null;
  }

  const columnPercent =
    (DEFINING_PLAZA_BESTIARY_PORTRAIT_FRAME_COLUMN_INDEX /
      (DEFINING_WILDLIFE_SHEET_COLUMN_COUNT - 1)) *
    100;
  const rowPercent =
    (DEFINING_PLAZA_BESTIARY_PORTRAIT_FRAME_ROW_INDEX /
      (DEFINING_WILDLIFE_SHEET_ROW_COUNT - 1)) *
    100;

  return {
    kind: 'spriteSheet',
    sheetUrl,
    backgroundSizeCss: `${DEFINING_WILDLIFE_SHEET_COLUMN_COUNT * 100}% ${DEFINING_WILDLIFE_SHEET_ROW_COUNT * 100}%`,
    backgroundPositionCss: `${columnPercent}% ${rowPercent}%`,
  };
}
