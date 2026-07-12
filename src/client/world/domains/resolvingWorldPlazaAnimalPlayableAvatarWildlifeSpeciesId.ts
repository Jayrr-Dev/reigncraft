/**
 * Maps playable avatar sprite folders to wildlife species ids.
 *
 * Used for sheet overrides and species vocal SFX lookup when folder names
 * differ from registry keys (typos / pack naming).
 *
 * @module components/world/domains/resolvingWorldPlazaAnimalPlayableAvatarWildlifeSpeciesId
 */

import { checkingWorldPlazaAnimalPlayableAvatarSkinId } from '@/components/world/domains/definingWorldPlazaAnimalPlayableAvatarSkinRegistry';
import { resolvingWildlifeSpeciesSfxProfile } from '@/components/world/wildlife/domains/definingWildlifeSpeciesSfxProfileRegistry';
import { DEFINING_WILDLIFE_SPECIES_MOTION_SHEET_FILE_NAME_OVERRIDES } from '@/components/world/wildlife/domains/definingWildlifeSpriteSheetLayout';
import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';

/** Folder name on disk when it differs from the wildlife species id. */
const DEFINING_WORLD_PLAZA_ANIMAL_PLAYABLE_SPRITE_FOLDER_TO_WILDLIFE_SPECIES_ID: Partial<
  Record<string, DefiningWildlifeSpeciesId>
> = {
  hayena: 'hyena',
  jak: 'yak',
  alpacha: 'alpaca',
  toirtois: 'tortoise',
  lama: 'llama',
  'elite-wolf': 'omega-wolf',
};

/**
 * Wildlife species id for sheet overrides / SFX, when the folder maps or has overrides.
 */
export function resolvingWorldPlazaAnimalPlayableAvatarWildlifeSpeciesId(
  spriteFolder: string
): DefiningWildlifeSpeciesId | undefined {
  const mappedSpeciesId =
    DEFINING_WORLD_PLAZA_ANIMAL_PLAYABLE_SPRITE_FOLDER_TO_WILDLIFE_SPECIES_ID[
      spriteFolder
    ];

  if (mappedSpeciesId) {
    return mappedSpeciesId;
  }

  if (
    spriteFolder in DEFINING_WILDLIFE_SPECIES_MOTION_SHEET_FILE_NAME_OVERRIDES
  ) {
    return spriteFolder as DefiningWildlifeSpeciesId;
  }

  return undefined;
}

/**
 * Wildlife species id for playable-animal vocal SFX, when a profile exists.
 */
export function resolvingWorldPlazaAnimalPlayableAvatarSpeciesSfxSpeciesId(
  skinId: string
): DefiningWildlifeSpeciesId | null {
  if (!checkingWorldPlazaAnimalPlayableAvatarSkinId(skinId)) {
    return null;
  }

  const mappedSpeciesId =
    DEFINING_WORLD_PLAZA_ANIMAL_PLAYABLE_SPRITE_FOLDER_TO_WILDLIFE_SPECIES_ID[
      skinId
    ] ?? skinId;

  if (resolvingWildlifeSpeciesSfxProfile(mappedSpeciesId)) {
    return mappedSpeciesId;
  }

  return null;
}
