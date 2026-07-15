/**
 * Reads persisted avatar transform cooldown from localStorage.
 *
 * @module components/world/domains/readingWorldPlazaAvatarTransformCooldownFromStorage
 */

import { resolvingWorldPlazaAvatarTransformCooldownStorageKey } from '@/components/world/domains/definingWorldPlazaAvatarTransformConstants';

/**
 * Returns wall-clock ms when transform is next allowed, or 0 when unlocked.
 */
export function readingWorldPlazaAvatarTransformCooldownFromStorage(
  storageOwnerId: string | null
): number {
  if (typeof window === 'undefined') {
    return 0;
  }

  const raw = localStorage.getItem(
    resolvingWorldPlazaAvatarTransformCooldownStorageKey(storageOwnerId)
  );

  if (!raw) {
    return 0;
  }

  try {
    const parsed: unknown = JSON.parse(raw);

    if (!parsed || typeof parsed !== 'object') {
      return 0;
    }

    const readyAtMs = (parsed as { readyAtMs?: unknown }).readyAtMs;

    return typeof readyAtMs === 'number' &&
      Number.isFinite(readyAtMs) &&
      readyAtMs > 0
      ? readyAtMs
      : 0;
  } catch {
    return 0;
  }
}
