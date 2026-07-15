/**
 * Persists avatar transform cooldown to localStorage.
 *
 * @module components/world/domains/writingWorldPlazaAvatarTransformCooldownToStorage
 */

import { resolvingWorldPlazaAvatarTransformCooldownStorageKey } from '@/components/world/domains/definingWorldPlazaAvatarTransformConstants';

/**
 * Writes the next transform-ready wall-clock stamp for one session owner.
 */
export function writingWorldPlazaAvatarTransformCooldownToStorage(
  storageOwnerId: string | null,
  readyAtMs: number
): void {
  if (typeof window === 'undefined') {
    return;
  }

  const storageKey =
    resolvingWorldPlazaAvatarTransformCooldownStorageKey(storageOwnerId);

  if (!(readyAtMs > 0)) {
    localStorage.removeItem(storageKey);
    return;
  }

  localStorage.setItem(storageKey, JSON.stringify({ readyAtMs }));
}
