/**
 * Constants for the world plaza player inventory hotbar.
 *
 * @module components/world/inventory/domains/definingWorldPlazaInventoryConstants
 */

/** Number of hotbar slots. */
export const DEFINING_WORLD_PLAZA_INVENTORY_CAPACITY = 5 as const;

/** localStorage key for persisted plaza inventory (scoped per user). */
export const DEFINING_WORLD_PLAZA_INVENTORY_STORAGE_KEY_PREFIX =
  'world-plaza-inventory' as const;

/** TanStack Query key root for plaza inventory. */
export const DEFINING_WORLD_PLAZA_INVENTORY_QUERY_KEY_ROOT =
  'world-plaza-inventory' as const;

/**
 * Resolves the localStorage key for a user's plaza inventory.
 *
 * @param userId - Authenticated user id
 */
export function resolvingWorldPlazaInventoryStorageKey(userId: string): string {
  return `${DEFINING_WORLD_PLAZA_INVENTORY_STORAGE_KEY_PREFIX}:${userId}`;
}

/**
 * Resolves the TanStack Query key suffix for a user's plaza inventory.
 *
 * @param userId - Authenticated user id
 */
export function resolvingWorldPlazaInventoryQueryKeySuffix(
  userId: string
): string {
  return `${DEFINING_WORLD_PLAZA_INVENTORY_QUERY_KEY_ROOT}:${userId}`;
}

import { DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_INVENTORY_HOTBAR_ANCHOR_CLASS_NAME } from '@/components/world/domains/definingWorldPlazaGameplayHudLayoutConstants';

/** Bottom-center anchor for the plaza inventory hotbar. */
export const STYLING_WORLD_PLAZA_INVENTORY_HOTBAR_ANCHOR_CLASS_NAME =
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_INVENTORY_HOTBAR_ANCHOR_CLASS_NAME;

/** Accessible label for the inventory hotbar. */
export const LABELING_WORLD_PLAZA_INVENTORY_HOTBAR =
  'Inventory hotbar' as const;

/**
 * When true, seeds demo items on first load for manual DnD testing.
 * Set to false before production if demo items are not desired.
 */
export const DEFINING_WORLD_PLAZA_INVENTORY_SEED_DEMO_ITEMS = true as const;
