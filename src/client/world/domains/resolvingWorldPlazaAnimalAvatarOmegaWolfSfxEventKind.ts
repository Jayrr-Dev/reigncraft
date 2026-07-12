/**
 * Resolves which Werewolf-pack event to play for one playable-wolf avatar action.
 *
 * @module components/world/domains/resolvingWorldPlazaAnimalAvatarOmegaWolfSfxEventKind
 */

import { DEFINING_WORLD_PLAZA_ANIMAL_AVATAR_OMEGA_WOLF_SFX_EVENT_FALLBACKS } from '@/components/world/domains/definingWorldPlazaAnimalAvatarOmegaWolfSfxActionMapping';
import type { DefiningWorldPlazaAnimalAvatarSpeciesSfxAction } from '@/components/world/domains/definingWorldPlazaAnimalAvatarSpeciesSfxActionMapping';
import type { DefiningWildlifeOmegaWolfSfxEventKind } from '@/components/world/wildlife/domains/definingWildlifeOmegaWolfSfxConstants';

/**
 * Werewolf event kind for this action. All actions rotate the fallback pool.
 */
export function resolvingWorldPlazaAnimalAvatarOmegaWolfSfxEventKind(
  action: DefiningWorldPlazaAnimalAvatarSpeciesSfxAction,
  rotationIndex: number
): DefiningWildlifeOmegaWolfSfxEventKind {
  const candidates =
    DEFINING_WORLD_PLAZA_ANIMAL_AVATAR_OMEGA_WOLF_SFX_EVENT_FALLBACKS[action];

  return candidates[rotationIndex % candidates.length] ?? 'attack_bite';
}
