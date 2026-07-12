/**
 * Resolves roll presentation duration for the active avatar skin.
 *
 * @module components/world/domains/resolvingWorldPlazaAvatarRollDurationMs
 */

import {
  computingWorldPlazaAnimalAvatarRollDurationMs,
  resolvingWorldPlazaAnimalAvatarCombatDefinition,
} from '@/components/world/domains/definingWorldPlazaAnimalAvatarCombatRegistry';
import type { DefiningWorldPlazaAvatarSkinId } from '@/components/world/domains/definingWorldPlazaAvatarSkinConstants';
import { DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_DURATION_MS } from '@/components/world/domains/definingWorldPlazaGirlSampleCombatMotionConstants';

/**
 * Roll travel / strip duration in ms for one avatar skin.
 *
 * Animal skins use Attack3 strip length. Others default to GirlSample timing.
 */
export function resolvingWorldPlazaAvatarRollDurationMs(
  skinId: DefiningWorldPlazaAvatarSkinId
): number {
  const animalCombatDefinition =
    resolvingWorldPlazaAnimalAvatarCombatDefinition(skinId);

  if (animalCombatDefinition) {
    return computingWorldPlazaAnimalAvatarRollDurationMs(animalCombatDefinition);
  }

  return DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_DURATION_MS;
}
