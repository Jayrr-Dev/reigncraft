/**
 * Persisted recipe-page attach progress for the plaza Recipes guide.
 *
 * @module components/world/domains/definingWorldPlazaRecipeDiscoveryConstants
 */

/** localStorage key prefix for attached cookbook recipe pages. */
export const DEFINING_WORLD_PLAZA_RECIPE_DISCOVERY_STORAGE_KEY_PREFIX =
  'world-plaza-recipe-discovery' as const;

/**
 * Resolves the localStorage key for recipe page attaches.
 *
 * @param storageOwnerId - Session owner id, or null for the legacy global key.
 */
export function resolvingWorldPlazaRecipeDiscoveryStorageKey(
  storageOwnerId: string | null
): string {
  if (storageOwnerId) {
    return `${DEFINING_WORLD_PLAZA_RECIPE_DISCOVERY_STORAGE_KEY_PREFIX}:${storageOwnerId}`;
  }

  return DEFINING_WORLD_PLAZA_RECIPE_DISCOVERY_STORAGE_KEY_PREFIX;
}
