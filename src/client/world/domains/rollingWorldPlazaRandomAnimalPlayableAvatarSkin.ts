/**
 * Picks a random playable animal avatar skin for the Random Animal load.
 *
 * @module components/world/domains/rollingWorldPlazaRandomAnimalPlayableAvatarSkin
 */

import { resolvingWorldPlazaAnimalPlayableAvatarUnlockWildlifeSpeciesId } from '@/components/world/domains/checkingWorldPlazaAnimalPlayableAvatarSkinStudyUnlocked';
import {
  checkingWorldPlazaAnimalPlayableAvatarSkinId,
  DEFINING_WORLD_PLAZA_ANIMAL_PLAYABLE_AVATAR_SKIN_BY_ID,
} from '@/components/world/domains/definingWorldPlazaAnimalPlayableAvatarSkinRegistry';
import type { DefiningWorldPlazaAvatarSkinId } from '@/components/world/domains/definingWorldPlazaAvatarSkinConstants';
import { DEFINING_WORLD_PLAZA_RANDOM_ANIMAL_EXCLUDED_SKIN_IDS } from '@/components/world/domains/definingWorldPlazaRandomAnimalLoadConstants';

const DEFINING_WORLD_PLAZA_RANDOM_ANIMAL_EXCLUDED_SKIN_ID_SET = new Set<string>(
  DEFINING_WORLD_PLAZA_RANDOM_ANIMAL_EXCLUDED_SKIN_IDS
);

/**
 * Lists playable animal skins eligible for the Random Animal start pool.
 */
export function listingWorldPlazaRandomAnimalPlayableAvatarSkinIds(): readonly DefiningWorldPlazaAvatarSkinId[] {
  return Object.keys(DEFINING_WORLD_PLAZA_ANIMAL_PLAYABLE_AVATAR_SKIN_BY_ID)
    .filter((skinId) => {
      if (DEFINING_WORLD_PLAZA_RANDOM_ANIMAL_EXCLUDED_SKIN_ID_SET.has(skinId)) {
        return false;
      }

      return (
        resolvingWorldPlazaAnimalPlayableAvatarUnlockWildlifeSpeciesId(
          skinId
        ) !== null
      );
    })
    .sort();
}

/**
 * Rolls one random eligible animal playable skin id.
 *
 * @param random - Optional RNG in [0, 1). Defaults to Math.random.
 */
export function rollingWorldPlazaRandomAnimalPlayableAvatarSkin(
  random: () => number = Math.random
): DefiningWorldPlazaAvatarSkinId {
  const skinIds = listingWorldPlazaRandomAnimalPlayableAvatarSkinIds();

  if (skinIds.length === 0) {
    throw new Error(
      'No playable animal skins available for Random Animal load.'
    );
  }

  const index = Math.min(
    skinIds.length - 1,
    Math.max(0, Math.floor(random() * skinIds.length))
  );

  return skinIds[index]!;
}

/**
 * True when the skin is a valid Random Animal form (playable + not excluded).
 */
export function checkingWorldPlazaRandomAnimalPlayableAvatarSkinId(
  skinId: string
): boolean {
  return (
    checkingWorldPlazaAnimalPlayableAvatarSkinId(skinId) &&
    !DEFINING_WORLD_PLAZA_RANDOM_ANIMAL_EXCLUDED_SKIN_ID_SET.has(skinId) &&
    resolvingWorldPlazaAnimalPlayableAvatarUnlockWildlifeSpeciesId(skinId) !==
      null
  );
}
