/**
 * Bonus storage-row unlocks for the plaza inventory hotbar.
 * Base layout stays fixed; each unlock adds one page (+6 slots). Cap is 3.
 *
 * @module components/world/inventory/domains/definingWorldPlazaInventoryStorageExpansionConstants
 */

import {
  DEFINING_WORLD_PLAZA_INVENTORY_COLUMNS,
  DEFINING_WORLD_PLAZA_INVENTORY_MAIN_ROW_COUNT,
  DEFINING_WORLD_PLAZA_INVENTORY_STORAGE_ROW_COUNT,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryConstants';

/** Rarity tiers for loose storage-expansion ledger pages. */
export type DefiningWorldPlazaInventoryStorageExpansionPageTier =
  | 'rare'
  | 'mythic'
  | 'legendary';

/** Max bonus storage rows a player can unlock (Codex + consumable pages). */
export const DEFINING_WORLD_PLAZA_INVENTORY_STORAGE_EXPANSION_MAX_BONUS_ROWS =
  3 as const;

/** Slots granted per unlocked storage row. */
export const DEFINING_WORLD_PLAZA_INVENTORY_STORAGE_EXPANSION_SLOTS_PER_ROW =
  DEFINING_WORLD_PLAZA_INVENTORY_COLUMNS;

/** Base storage rows before any expansion unlock. */
export const DEFINING_WORLD_PLAZA_INVENTORY_STORAGE_EXPANSION_BASE_ROW_COUNT =
  DEFINING_WORLD_PLAZA_INVENTORY_STORAGE_ROW_COUNT;

/** Absolute max storage rows (base + bonus). */
export const DEFINING_WORLD_PLAZA_INVENTORY_STORAGE_EXPANSION_MAX_ROW_COUNT =
  DEFINING_WORLD_PLAZA_INVENTORY_STORAGE_EXPANSION_BASE_ROW_COUNT +
  DEFINING_WORLD_PLAZA_INVENTORY_STORAGE_EXPANSION_MAX_BONUS_ROWS;

/** Absolute max inventory capacity (main + max storage). */
export const DEFINING_WORLD_PLAZA_INVENTORY_STORAGE_EXPANSION_MAX_CAPACITY =
  DEFINING_WORLD_PLAZA_INVENTORY_COLUMNS *
  (DEFINING_WORLD_PLAZA_INVENTORY_MAIN_ROW_COUNT +
    DEFINING_WORLD_PLAZA_INVENTORY_STORAGE_EXPANSION_MAX_ROW_COUNT);

/** localStorage key prefix for bonus storage-row unlocks. */
export const DEFINING_WORLD_PLAZA_INVENTORY_STORAGE_EXPANSION_STORAGE_KEY_PREFIX =
  'world-plaza-inventory-storage-expansion' as const;

/** Ordered page tiers (art / Codex dialog order). */
export const DEFINING_WORLD_PLAZA_INVENTORY_STORAGE_EXPANSION_PAGE_TIERS = [
  'rare',
  'mythic',
  'legendary',
] as const satisfies readonly DefiningWorldPlazaInventoryStorageExpansionPageTier[];

/** Inventory item type ids for the three expansion ledger pages. */
export const DEFINING_WORLD_PLAZA_INVENTORY_STORAGE_EXPANSION_PAGE_TYPE_ID = {
  rare: 'world-plaza-storage-expansion-page-rare',
  mythic: 'world-plaza-storage-expansion-page-mythic',
  legendary: 'world-plaza-storage-expansion-page-legendary',
} as const satisfies Record<
  DefiningWorldPlazaInventoryStorageExpansionPageTier,
  string
>;

/** Player-facing labels for each page tier. */
export const DEFINING_WORLD_PLAZA_INVENTORY_STORAGE_EXPANSION_PAGE_LABEL = {
  rare: 'Rare Packing Ledger',
  mythic: 'Mythic Packing Ledger',
  legendary: 'Legendary Packing Ledger',
} as const satisfies Record<
  DefiningWorldPlazaInventoryStorageExpansionPageTier,
  string
>;

export const LABELING_WORLD_PLAZA_INVENTORY_STORAGE_EXPANSION_UNLOCKED_TOAST =
  'Extra pack page unlocked. Arrow through your bag for the new row.' as const;

export const LABELING_WORLD_PLAZA_INVENTORY_STORAGE_EXPANSION_AT_CAP_TOAST =
  'Pack already holds the maximum extra pages.' as const;

export const LABELING_WORLD_PLAZA_INVENTORY_STORAGE_EXPANSION_INVENTORY_FULL_TOAST =
  'Inventory Full' as const;

/**
 * Resolves the localStorage key for storage-expansion unlocks.
 *
 * @param storageOwnerId - Session owner id, or null for the legacy global key.
 */
export function resolvingWorldPlazaInventoryStorageExpansionStorageKey(
  storageOwnerId: string | null
): string {
  if (storageOwnerId) {
    return `${DEFINING_WORLD_PLAZA_INVENTORY_STORAGE_EXPANSION_STORAGE_KEY_PREFIX}:${storageOwnerId}`;
  }

  return DEFINING_WORLD_PLAZA_INVENTORY_STORAGE_EXPANSION_STORAGE_KEY_PREFIX;
}

/**
 * Stable Codex claim key for one milestone chest.
 */
export function resolvingWorldPlazaInventoryStorageExpansionCodexClaimKey(input: {
  readonly sectionId: string;
  readonly meterKind: string;
  readonly percent: number;
}): string {
  return `${input.sectionId}:${input.meterKind}:${input.percent}`;
}
