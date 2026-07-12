/**
 * Declarative combat strips for animal playable avatar skins.
 *
 * GirlSample keeps its own per-direction combat pack. Species skins share the
 * Husky-style 8x15 sheet layout: Attack1 = melee, Attack3 = roll / dodge lunge
 * (Pinguin Attack3 is the belly slide).
 *
 * Fox Peach has no Attack sheets yet, so it is omitted.
 *
 * @module components/world/domains/definingWorldPlazaAnimalAvatarCombatRegistry
 */

import { buildingWorldPlazaAnimalAvatarCombatSheetUrls } from '@/components/world/domains/buildingWorldPlazaAnimalAvatarCombatSheetUrls';
import {
  DEFINING_WORLD_PLAZA_ANIMAL_PLAYABLE_AVATAR_SKIN_BY_ID,
  type DefiningWorldPlazaAnimalPlayableAvatarSkinRow,
} from '@/components/world/domains/definingWorldPlazaAnimalPlayableAvatarSkinRegistry';
import type { DefiningWorldPlazaAvatarSkinId } from '@/components/world/domains/definingWorldPlazaAvatarSkinConstants';
import type { DefiningWorldPlazaGirlSampleCombatMotionClipSuffix } from '@/components/world/domains/definingWorldPlazaGirlSampleCombatMotionConstants';
import type {
  DefiningWorldPlazaGirlSampleMotionSheetLayout,
  DefiningWorldPlazaGirlSampleWalkDirection,
} from '@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants';
import {
  DEFINING_WILDLIFE_DIRECTION_ROW_INDEX,
  DEFINING_WILDLIFE_SHEET_COLUMN_COUNT,
  definingWildlifeMotionSheetLayout,
} from '@/components/world/wildlife/domains/definingWildlifeSpriteSheetLayout';

/** Combat motions every animal avatar skin ships today. */
export const DEFINING_WORLD_PLAZA_ANIMAL_AVATAR_COMBAT_MOTION_CLIP_SUFFIXES = [
  'roll',
  'melee',
] as const;

export type DefiningWorldPlazaAnimalAvatarCombatMotionClipSuffix =
  (typeof DEFINING_WORLD_PLAZA_ANIMAL_AVATAR_COMBAT_MOTION_CLIP_SUFFIXES)[number];

/** One combat strip (candidate sheet URLs + playback fps). */
export type DefiningWorldPlazaAnimalAvatarCombatMotionStrip = {
  readonly sheetUrls: readonly string[];
  readonly animationFps: number;
};

/** Full combat presentation bundle for one animal playable skin. */
export type DefiningWorldPlazaAnimalAvatarCombatDefinition = {
  readonly skinId: DefiningWorldPlazaAvatarSkinId;
  readonly frameSizePx: number;
  readonly sheetColumnCount: number;
  readonly directionRowIndex: Record<
    DefiningWorldPlazaGirlSampleWalkDirection,
    number
  >;
  readonly sheetLayout: DefiningWorldPlazaGirlSampleMotionSheetLayout;
  readonly melee: DefiningWorldPlazaAnimalAvatarCombatMotionStrip;
  readonly roll: DefiningWorldPlazaAnimalAvatarCombatMotionStrip;
};

/** Default fps for animal Attack strips. */
const DEFINING_WORLD_PLAZA_ANIMAL_AVATAR_COMBAT_ANIMATION_FPS = 18;

function definingWorldPlazaAnimalAvatarCombatDefinitionFromSkinRow(
  skinRow: DefiningWorldPlazaAnimalPlayableAvatarSkinRow
): DefiningWorldPlazaAnimalAvatarCombatDefinition {
  const sheetLayout = definingWildlifeMotionSheetLayout(
    skinRow.frameHeightPx,
    skinRow.frameHeightPx
  );

  return {
    skinId: skinRow.skinId,
    frameSizePx: skinRow.frameHeightPx,
    sheetColumnCount: DEFINING_WILDLIFE_SHEET_COLUMN_COUNT,
    directionRowIndex: DEFINING_WILDLIFE_DIRECTION_ROW_INDEX,
    sheetLayout,
    melee: {
      sheetUrls: buildingWorldPlazaAnimalAvatarCombatSheetUrls(
        skinRow.spriteFolder,
        'melee'
      ),
      animationFps: DEFINING_WORLD_PLAZA_ANIMAL_AVATAR_COMBAT_ANIMATION_FPS,
    },
    roll: {
      sheetUrls: buildingWorldPlazaAnimalAvatarCombatSheetUrls(
        skinRow.spriteFolder,
        'roll'
      ),
      animationFps: DEFINING_WORLD_PLAZA_ANIMAL_AVATAR_COMBAT_ANIMATION_FPS,
    },
  };
}

/** Combat definitions keyed by animal playable skin id. */
export const DEFINING_WORLD_PLAZA_ANIMAL_AVATAR_COMBAT_BY_SKIN: Readonly<
  Record<string, DefiningWorldPlazaAnimalAvatarCombatDefinition>
> = Object.freeze(
  Object.fromEntries(
    Object.values(DEFINING_WORLD_PLAZA_ANIMAL_PLAYABLE_AVATAR_SKIN_BY_ID)
      .filter((skinRow) => skinRow.combatEnabled)
      .map((skinRow) => [
        skinRow.skinId,
        definingWorldPlazaAnimalAvatarCombatDefinitionFromSkinRow(skinRow),
      ])
  )
);

/**
 * Resolves the animal combat definition for a skin, if it has Attack sheets.
 */
export function resolvingWorldPlazaAnimalAvatarCombatDefinition(
  skinId: DefiningWorldPlazaAvatarSkinId
): DefiningWorldPlazaAnimalAvatarCombatDefinition | null {
  return DEFINING_WORLD_PLAZA_ANIMAL_AVATAR_COMBAT_BY_SKIN[skinId] ?? null;
}

/**
 * True when the skin uses the animal Attack1/Attack3 combat pack.
 */
export function checkingWorldPlazaAnimalAvatarCombatSupported(
  skinId: DefiningWorldPlazaAvatarSkinId
): boolean {
  return resolvingWorldPlazaAnimalAvatarCombatDefinition(skinId) !== null;
}

/**
 * Roll duration synced to the animal roll strip length and fps.
 */
export function computingWorldPlazaAnimalAvatarRollDurationMs(
  combatDefinition: DefiningWorldPlazaAnimalAvatarCombatDefinition
): number {
  return (
    (combatDefinition.sheetLayout.frameCount /
      combatDefinition.roll.animationFps) *
    1000
  );
}

/**
 * Narrows a combat suffix to the animal-supported set when applicable.
 */
export function resolvingWorldPlazaAnimalAvatarCombatMotionClipSuffix(
  motionKind: DefiningWorldPlazaGirlSampleCombatMotionClipSuffix
): DefiningWorldPlazaAnimalAvatarCombatMotionClipSuffix | null {
  if (motionKind === 'roll' || motionKind === 'melee') {
    return motionKind;
  }

  return null;
}
