/**
 * Persists attached recipe pages to localStorage.
 *
 * @module components/world/domains/writingWorldPlazaRecipeDiscoveryToStorage
 */

import type { DefiningWorldPlazaCraftModeRecipeId } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeTypes';
import { resolvingWorldPlazaRecipeDiscoveryStorageKey } from '@/components/world/domains/definingWorldPlazaRecipeDiscoveryConstants';

/**
 * Writes attached recipe page ids to localStorage.
 *
 * @param storageOwnerId - Session owner id, or null for guest sessions.
 * @param attachedRecipeIds - Recipe pages attached to the player's cookbooks.
 */
export function writingWorldPlazaRecipeDiscoveryToStorage(
  storageOwnerId: string | null,
  attachedRecipeIds: ReadonlySet<DefiningWorldPlazaCraftModeRecipeId>
): void {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(
    resolvingWorldPlazaRecipeDiscoveryStorageKey(storageOwnerId),
    JSON.stringify({
      attached: [...attachedRecipeIds].sort(),
    })
  );
}
