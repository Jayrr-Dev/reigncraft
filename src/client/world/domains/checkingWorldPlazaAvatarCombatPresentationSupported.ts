/**
 * Resolves whether an avatar skin supports combat presentation strips.
 *
 * @module components/world/domains/checkingWorldPlazaAvatarCombatPresentationSupported
 */

import {
  DEFINING_WORLD_PLAZA_ANIMAL_AVATAR_COMBAT_MOTION_CLIP_SUFFIXES,
  checkingWorldPlazaAnimalAvatarCombatSupported,
  resolvingWorldPlazaAnimalAvatarCombatMotionClipSuffix,
  type DefiningWorldPlazaAnimalAvatarCombatMotionClipSuffix,
} from '@/components/world/domains/definingWorldPlazaAnimalAvatarCombatRegistry';
import {
  DEFINING_WORLD_PLAZA_AVATAR_SKIN,
  type DefiningWorldPlazaAvatarSkinId,
} from '@/components/world/domains/definingWorldPlazaAvatarSkinConstants';
import type { DefiningWorldPlazaGirlSampleCombatMotionClipSuffix } from '@/components/world/domains/definingWorldPlazaGirlSampleCombatMotionConstants';
import { DEFINING_WORLD_PLAZA_GIRL_SAMPLE_COMBAT_MOTION_CLIP_SUFFIXES } from '@/components/world/domains/definingWorldPlazaGirlSampleCombatMotionConstants';

/**
 * True when the skin can lazily load combat motion strips for presentation.
 */
export function checkingWorldPlazaAvatarCombatPresentationSupported(
  skinId: DefiningWorldPlazaAvatarSkinId
): boolean {
  return (
    skinId === DEFINING_WORLD_PLAZA_AVATAR_SKIN.GIRL_SAMPLE ||
    checkingWorldPlazaAnimalAvatarCombatSupported(skinId)
  );
}

/**
 * Combat motion suffixes the skin can request for lazy strip loading.
 */
export function resolvingWorldPlazaAvatarCombatMotionClipSuffixes(
  skinId: DefiningWorldPlazaAvatarSkinId
): readonly DefiningWorldPlazaGirlSampleCombatMotionClipSuffix[] {
  if (checkingWorldPlazaAnimalAvatarCombatSupported(skinId)) {
    return DEFINING_WORLD_PLAZA_ANIMAL_AVATAR_COMBAT_MOTION_CLIP_SUFFIXES;
  }

  if (skinId === DEFINING_WORLD_PLAZA_AVATAR_SKIN.GIRL_SAMPLE) {
    return DEFINING_WORLD_PLAZA_GIRL_SAMPLE_COMBAT_MOTION_CLIP_SUFFIXES;
  }

  return [];
}

/**
 * True when the skin supports the requested combat motion suffix.
 */
export function checkingWorldPlazaAvatarCombatMotionSupported(
  skinId: DefiningWorldPlazaAvatarSkinId,
  motionKind: DefiningWorldPlazaGirlSampleCombatMotionClipSuffix
): boolean {
  return resolvingWorldPlazaAvatarCombatMotionClipSuffixes(skinId).includes(
    motionKind
  );
}

/**
 * Narrows a combat suffix to the animal-supported set when applicable.
 */
export function resolvingWorldPlazaAnimalCombatMotionClipSuffix(
  motionKind: DefiningWorldPlazaGirlSampleCombatMotionClipSuffix
): DefiningWorldPlazaAnimalAvatarCombatMotionClipSuffix | null {
  return resolvingWorldPlazaAnimalAvatarCombatMotionClipSuffix(motionKind);
}
