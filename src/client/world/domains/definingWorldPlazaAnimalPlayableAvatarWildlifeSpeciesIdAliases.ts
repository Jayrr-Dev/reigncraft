/**
 * Folder-name aliases when playable sprite folders differ from wildlife species ids.
 *
 * Leaf module: no skin-registry imports (avoids init cycles with character engine).
 *
 * @module components/world/domains/definingWorldPlazaAnimalPlayableAvatarWildlifeSpeciesIdAliases
 */

import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';

/** Folder name on disk when it differs from the wildlife species id. */
export const DEFINING_WORLD_PLAZA_ANIMAL_PLAYABLE_SPRITE_FOLDER_TO_WILDLIFE_SPECIES_ID: Partial<
  Record<string, DefiningWildlifeSpeciesId>
> = {
  hayena: 'hyena',
  jak: 'yak',
  alpacha: 'alpaca',
  toirtois: 'tortoise',
  lama: 'llama',
  'elite-wolf': 'omega-wolf',
  // Recolor pack; no bestiary species row. Gate + SFX share tiger.
  'white-tiger': 'tiger',
};
