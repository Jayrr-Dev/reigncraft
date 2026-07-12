/**
 * Resolves which wildlife vocal event to play for one playable-animal action.
 *
 * @module components/world/domains/resolvingWorldPlazaAnimalAvatarSpeciesSfxEventKind
 */

import {
  DEFINING_WORLD_PLAZA_ANIMAL_AVATAR_SPECIES_SFX_EVENT_FALLBACKS,
  type DefiningWorldPlazaAnimalAvatarSpeciesSfxAction,
} from '@/components/world/domains/definingWorldPlazaAnimalAvatarSpeciesSfxActionMapping';
import type { DefiningWildlifeSpeciesSfxEventKind } from '@/components/world/wildlife/domains/definingWildlifeSpeciesSfxEventKind';
import { checkingWildlifeSpeciesSfxEventEnabled } from '@/components/world/wildlife/domains/definingWildlifeSpeciesSfxProfileRegistry';
import { resolvingWildlifeSpeciesSfxClipPoolLength } from '@/components/world/wildlife/domains/resolvingWildlifeSpeciesSfxClipId';

/**
 * First enabled wildlife event kind that has clips for this species + action.
 */
export function resolvingWorldPlazaAnimalAvatarSpeciesSfxEventKind(
  speciesId: string,
  action: DefiningWorldPlazaAnimalAvatarSpeciesSfxAction
): DefiningWildlifeSpeciesSfxEventKind | null {
  const candidates =
    DEFINING_WORLD_PLAZA_ANIMAL_AVATAR_SPECIES_SFX_EVENT_FALLBACKS[action];

  for (const eventKind of candidates) {
    if (!checkingWildlifeSpeciesSfxEventEnabled(speciesId, eventKind)) {
      continue;
    }

    if (resolvingWildlifeSpeciesSfxClipPoolLength(speciesId, eventKind) <= 0) {
      continue;
    }

    return eventKind;
  }

  return null;
}
