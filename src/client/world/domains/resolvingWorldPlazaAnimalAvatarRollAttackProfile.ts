/**
 * Resolves the roll / leap attack profile for a playable avatar skin.
 *
 * @module components/world/domains/resolvingWorldPlazaAnimalAvatarRollAttackProfile
 */

import {
  DEFINING_WORLD_PLAZA_ANIMAL_AVATAR_ROLL_ATTACK_DEFAULT_PROFILE,
  type DefiningWorldPlazaAnimalAvatarRollAttackProfile,
} from '@/components/world/domains/definingWorldPlazaAnimalAvatarRollAttackConstants';
import {
  DEFINING_WORLD_PLAZA_ANIMAL_AVATAR_ROLL_ATTACK_ARCHETYPE_BY_SPECIES,
  DEFINING_WORLD_PLAZA_ANIMAL_AVATAR_ROLL_ATTACK_ARCHETYPE_PROFILES,
  DEFINING_WORLD_PLAZA_ANIMAL_AVATAR_ROLL_ATTACK_EXTRA_ON_HIT_BY_SPECIES,
  DEFINING_WORLD_PLAZA_ANIMAL_AVATAR_ROLL_ATTACK_SPECIES_OVERRIDES,
} from '@/components/world/domains/definingWorldPlazaAnimalAvatarRollAttackRegistry';
import { checkingWorldPlazaAnimalPlayableAvatarSkinId } from '@/components/world/domains/definingWorldPlazaAnimalPlayableAvatarSkinRegistry';
import { DEFINING_WORLD_PLAZA_ANIMAL_PLAYABLE_SPRITE_FOLDER_TO_WILDLIFE_SPECIES_ID } from '@/components/world/domains/definingWorldPlazaAnimalPlayableAvatarWildlifeSpeciesIdAliases';
import type { DefiningWorldPlazaAvatarSkinId } from '@/components/world/domains/definingWorldPlazaAvatarSkinConstants';
import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';

function resolvingWorldPlazaAnimalAvatarRollAttackSpeciesId(
  skinId: string
): DefiningWildlifeSpeciesId | null {
  if (!checkingWorldPlazaAnimalPlayableAvatarSkinId(skinId)) {
    return null;
  }

  return (
    DEFINING_WORLD_PLAZA_ANIMAL_PLAYABLE_SPRITE_FOLDER_TO_WILDLIFE_SPECIES_ID[
      skinId
    ] ?? (skinId as DefiningWildlifeSpeciesId)
  );
}

/**
 * Animal roll-attack profile for a skin, or null for GirlSample / non-animals.
 */
export function resolvingWorldPlazaAnimalAvatarRollAttackProfile(
  skinId: DefiningWorldPlazaAvatarSkinId | string
): DefiningWorldPlazaAnimalAvatarRollAttackProfile | null {
  const speciesId = resolvingWorldPlazaAnimalAvatarRollAttackSpeciesId(skinId);

  if (!speciesId) {
    return null;
  }

  const archetypeId =
    DEFINING_WORLD_PLAZA_ANIMAL_AVATAR_ROLL_ATTACK_ARCHETYPE_BY_SPECIES[
      speciesId
    ] ?? 'prey';
  const archetypeProfile =
    DEFINING_WORLD_PLAZA_ANIMAL_AVATAR_ROLL_ATTACK_ARCHETYPE_PROFILES[
      archetypeId
    ] ?? DEFINING_WORLD_PLAZA_ANIMAL_AVATAR_ROLL_ATTACK_DEFAULT_PROFILE;
  const speciesOverride =
    DEFINING_WORLD_PLAZA_ANIMAL_AVATAR_ROLL_ATTACK_SPECIES_OVERRIDES[speciesId];
  const extraOnHitEffects =
    DEFINING_WORLD_PLAZA_ANIMAL_AVATAR_ROLL_ATTACK_EXTRA_ON_HIT_BY_SPECIES[
      speciesId
    ] ?? [];

  return {
    ...archetypeProfile,
    ...speciesOverride,
    archetypeId,
    extraOnHitEffects,
  };
}

/**
 * Forward roll distance for a skin (animal profile or GirlSample default).
 */
export function resolvingWorldPlazaAvatarRollForwardGridDistance(
  skinId: DefiningWorldPlazaAvatarSkinId | string,
  girlSampleDistance: number
): number {
  const profile = resolvingWorldPlazaAnimalAvatarRollAttackProfile(skinId);

  return profile?.forwardGridDistance ?? girlSampleDistance;
}

/**
 * Stamina cost multiplier for animal rolls (1 for GirlSample).
 */
export function resolvingWorldPlazaAvatarRollStaminaCostMultiplier(
  skinId: DefiningWorldPlazaAvatarSkinId | string
): number {
  const profile = resolvingWorldPlazaAnimalAvatarRollAttackProfile(skinId);

  return profile?.staminaCostMultiplier ?? 1;
}
