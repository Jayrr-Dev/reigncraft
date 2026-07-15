/**
 * Reads the persisted selected avatar skin from localStorage.
 *
 * @module components/world/domains/readingWorldPlazaSelectedAvatarSkinFromStorage
 */

import { checkingWorldPlazaAvatarSkinIdKnown } from '@/components/world/domains/checkingWorldPlazaAvatarSkinIdKnown';
import {
  DEFINING_WORLD_PLAZA_AVATAR_SKIN_DEFAULT,
  type DefiningWorldPlazaAvatarSkinId,
} from '@/components/world/domains/definingWorldPlazaAvatarSkinConstants';
import { resolvingWorldPlazaSelectedAvatarSkinStorageKey } from '@/components/world/domains/definingWorldPlazaAvatarTransformConstants';

/**
 * Hydrates the last selected avatar skin for one session owner.
 */
export function readingWorldPlazaSelectedAvatarSkinFromStorage(
  storageOwnerId: string | null
): DefiningWorldPlazaAvatarSkinId {
  if (typeof window === 'undefined') {
    return DEFINING_WORLD_PLAZA_AVATAR_SKIN_DEFAULT;
  }

  const raw = localStorage.getItem(
    resolvingWorldPlazaSelectedAvatarSkinStorageKey(storageOwnerId)
  );

  if (!raw) {
    return DEFINING_WORLD_PLAZA_AVATAR_SKIN_DEFAULT;
  }

  try {
    const parsed: unknown = JSON.parse(raw);

    if (!parsed || typeof parsed !== 'object') {
      return DEFINING_WORLD_PLAZA_AVATAR_SKIN_DEFAULT;
    }

    const skinId = (parsed as { skinId?: unknown }).skinId;

    if (
      typeof skinId !== 'string' ||
      !checkingWorldPlazaAvatarSkinIdKnown(skinId)
    ) {
      return DEFINING_WORLD_PLAZA_AVATAR_SKIN_DEFAULT;
    }

    return skinId;
  } catch {
    return DEFINING_WORLD_PLAZA_AVATAR_SKIN_DEFAULT;
  }
}
