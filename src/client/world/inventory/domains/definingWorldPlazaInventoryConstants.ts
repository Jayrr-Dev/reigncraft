/**
 * Constants for the world plaza player inventory hotbar.
 *
 * @module components/world/inventory/domains/definingWorldPlazaInventoryConstants
 */

import { DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_INVENTORY_HOTBAR_ANCHOR_CLASS_NAME } from '@/components/world/domains/definingWorldPlazaGameplayHudLayoutConstants';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_AXE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_PICKAXE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SATCHEL,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import type { DefiningWorldPlazaInventoryDemoSeedItem } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypes';

/** Number of hotbar slots. */
export const DEFINING_WORLD_PLAZA_INVENTORY_CAPACITY = 5 as const;

/**
 * Far-left hotbar slot reserved for weapons and tools only.
 * When empty, the UI shows a faded fist (unarmed melee).
 */
export const DEFINING_WORLD_PLAZA_INVENTORY_WEAPON_TOOL_SLOT_INDEX = 0 as const;

/** Iconify id for the empty weapon/tool slot fist placeholder. */
export const DEFINING_WORLD_PLAZA_INVENTORY_EMPTY_FIST_ICON =
  'ph:hand-fist' as const;

/** Opacity for the empty fist placeholder (empty but fighting unarmed). */
export const DEFINING_WORLD_PLAZA_INVENTORY_EMPTY_FIST_OPACITY = 0.4 as const;

/** Accessible label for the empty reserved weapon/tool slot. */
export const LABELING_WORLD_PLAZA_INVENTORY_EMPTY_FIST_SLOT =
  'Unarmed (fist)' as const;

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

/** Bottom-center anchor for the plaza inventory hotbar. */
export const STYLING_WORLD_PLAZA_INVENTORY_HOTBAR_ANCHOR_CLASS_NAME =
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_INVENTORY_HOTBAR_ANCHOR_CLASS_NAME;

/** Accessible label for the inventory hotbar. */
export const LABELING_WORLD_PLAZA_INVENTORY_HOTBAR =
  'Inventory hotbar' as const;

/** Data attribute on hotbar slot surfaces that open item or bag popovers. */
export const DEFINING_WORLD_PLAZA_INVENTORY_SLOT_DATA_ATTRIBUTE =
  'data-plaza-inventory-slot' as const;

/** Data attribute on the portaled item info dialog. */
export const DEFINING_WORLD_PLAZA_INVENTORY_INFO_DIALOG_DATA_ATTRIBUTE =
  'data-plaza-inventory-info-dialog' as const;

/** Max ms between taps to count as a hotbar slot double activation (touch). */
export const DEFINING_WORLD_PLAZA_INVENTORY_SLOT_DOUBLE_ACTIVATION_MAX_INTERVAL_MS = 500;

/** Max pointer travel px between taps for hotbar slot double activation (touch). */
export const DEFINING_WORLD_PLAZA_INVENTORY_SLOT_DOUBLE_ACTIVATION_MAX_DISTANCE_PX = 28;

/** Delay before a single tap equips/opens a slot so double activation can cancel it. */
export const DEFINING_WORLD_PLAZA_INVENTORY_SLOT_SINGLE_CLICK_DEFER_MS = 200;

/**
 * When true, seeds demo items on first load for manual DnD testing.
 * Set to false before production if demo items are not desired.
 */
export const DEFINING_WORLD_PLAZA_INVENTORY_SEED_DEMO_ITEMS = true as const;

/** Item type granted on every new empty inventory (small adventurer bag). */
export const DEFINING_WORLD_PLAZA_INVENTORY_STARTER_BAG_ITEM_TYPE_ID =
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SATCHEL;

/** Wood axe granted into the reserved weapon/tool slot on new inventories. */
export const DEFINING_WORLD_PLAZA_INVENTORY_STARTER_TOOL_ITEM_TYPE_ID =
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_AXE;

/** Always applied when inventory loads empty (first session / fresh save). */
export const DEFINING_WORLD_PLAZA_INVENTORY_STARTER_ITEMS: readonly DefiningWorldPlazaInventoryDemoSeedItem[] =
  [
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_STARTER_TOOL_ITEM_TYPE_ID,
      quantity: 1,
    },
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_PICKAXE,
      quantity: 1,
    },
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_STARTER_BAG_ITEM_TYPE_ID,
      quantity: 1,
    },
  ] as const;
