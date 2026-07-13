/**
 * Reads attached recipe pages from localStorage.
 *
 * @module components/world/domains/readingWorldPlazaRecipeDiscoveryFromStorage
 */

import { checkingWorldPlazaCraftModeRecipeId } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeRegistry';
import type { DefiningWorldPlazaCraftModeRecipeId } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeTypes';
import { resolvingWorldPlazaRecipeDiscoveryStorageKey } from '@/components/world/domains/definingWorldPlazaRecipeDiscoveryConstants';

export type WorldPlazaRecipeDiscoverySnapshot = {
  readonly attachedRecipeIds: ReadonlySet<DefiningWorldPlazaCraftModeRecipeId>;
};

const WORLD_PLAZA_RECIPE_DISCOVERY_EMPTY_SNAPSHOT: WorldPlazaRecipeDiscoverySnapshot =
  {
    attachedRecipeIds: new Set(),
  };

/**
 * Reads attached recipe page ids from localStorage.
 *
 * @param storageOwnerId - Session owner id, or null for guest sessions.
 */
export function readingWorldPlazaRecipeDiscoveryFromStorage(
  storageOwnerId: string | null
): WorldPlazaRecipeDiscoverySnapshot {
  if (typeof window === 'undefined') {
    return WORLD_PLAZA_RECIPE_DISCOVERY_EMPTY_SNAPSHOT;
  }

  try {
    const rawValue = localStorage.getItem(
      resolvingWorldPlazaRecipeDiscoveryStorageKey(storageOwnerId)
    );

    if (!rawValue) {
      return WORLD_PLAZA_RECIPE_DISCOVERY_EMPTY_SNAPSHOT;
    }

    const parsedValue = JSON.parse(rawValue);

    if (!parsedValue || typeof parsedValue !== 'object') {
      return WORLD_PLAZA_RECIPE_DISCOVERY_EMPTY_SNAPSHOT;
    }

    const attachedRaw = Reflect.get(parsedValue, 'attached');

    if (!Array.isArray(attachedRaw)) {
      return WORLD_PLAZA_RECIPE_DISCOVERY_EMPTY_SNAPSHOT;
    }

    return {
      attachedRecipeIds: new Set(
        attachedRaw.filter(
          (value): value is DefiningWorldPlazaCraftModeRecipeId =>
            typeof value === 'string' && checkingWorldPlazaCraftModeRecipeId(value)
        )
      ),
    };
  } catch {
    return WORLD_PLAZA_RECIPE_DISCOVERY_EMPTY_SNAPSHOT;
  }
}
