/**
 * Persists the selected avatar skin to localStorage.
 *
 * @module components/world/domains/writingWorldPlazaSelectedAvatarSkinToStorage
 */

import type { DefiningWorldPlazaAvatarSkinId } from '@/components/world/domains/definingWorldPlazaAvatarSkinConstants';
import { resolvingWorldPlazaSelectedAvatarSkinStorageKey } from '@/components/world/domains/definingWorldPlazaAvatarTransformConstants';

/**
 * Writes the active avatar skin for one session owner.
 */
export function writingWorldPlazaSelectedAvatarSkinToStorage(
  storageOwnerId: string | null,
  skinId: DefiningWorldPlazaAvatarSkinId
): void {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(
    resolvingWorldPlazaSelectedAvatarSkinStorageKey(storageOwnerId),
    JSON.stringify({ skinId })
  );
}
