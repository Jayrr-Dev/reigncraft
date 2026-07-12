/**
 * Validates plaza avatar skin ids against the combined selectable registry.
 *
 * @module components/world/domains/checkingWorldPlazaAvatarSkinIdKnown
 */

import { checkingWorldPlazaAnimalPlayableAvatarSkinId } from '@/components/world/domains/definingWorldPlazaAnimalPlayableAvatarSkinRegistry';
import {
  DEFINING_WORLD_PLAZA_AVATAR_SKIN,
  DEFINING_WORLD_PLAZA_AVATAR_SKIN_OPTIONS,
} from '@/components/world/domains/definingWorldPlazaAvatarSkinConstants';

const CHECKING_WORLD_PLAZA_AVATAR_SKIN_ID_KNOWN_OPTION_IDS = new Set<string>(
  DEFINING_WORLD_PLAZA_AVATAR_SKIN_OPTIONS.map((option) => option.skinId)
);

const CHECKING_WORLD_PLAZA_AVATAR_SKIN_ID_KNOWN_SPECIAL_IDS = new Set<string>([
  DEFINING_WORLD_PLAZA_AVATAR_SKIN.GIRL_SAMPLE,
  DEFINING_WORLD_PLAZA_AVATAR_SKIN.FOX_PEACH,
]);

/**
 * True when the skin id is a registered selectable or animal playable skin.
 */
export function checkingWorldPlazaAvatarSkinIdKnown(skinId: string): boolean {
  if (CHECKING_WORLD_PLAZA_AVATAR_SKIN_ID_KNOWN_OPTION_IDS.has(skinId)) {
    return true;
  }

  if (CHECKING_WORLD_PLAZA_AVATAR_SKIN_ID_KNOWN_SPECIAL_IDS.has(skinId)) {
    return true;
  }

  return checkingWorldPlazaAnimalPlayableAvatarSkinId(skinId);
}
