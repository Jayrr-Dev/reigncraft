/**
 * Constants for the world plaza player inventory hotbar.
 *
 * @module components/world/inventory/domains/definingWorldPlazaInventoryConstants
 */

import {
  DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID,
  resolvingWorldPlazaCraftRecipePageItemTypeId,
} from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeTypes';
import { DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_INVENTORY_HOTBAR_ANCHOR_CLASS_NAME } from '@/components/world/domains/definingWorldPlazaGameplayHudLayoutConstants';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_AXE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_PICKAXE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SATCHEL,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import type { DefiningWorldPlazaInventoryDemoSeedItem } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypes';

/** Columns per inventory row (main hotbar and each storage page). */
export const DEFINING_WORLD_PLAZA_INVENTORY_COLUMNS = 6 as const;

/** Always-visible main hotbar row count. */
export const DEFINING_WORLD_PLAZA_INVENTORY_MAIN_ROW_COUNT = 1 as const;

/** Extra storage rows behind the page arrows (paged {@link DEFINING_WORLD_PLAZA_INVENTORY_COLUMNS} at a time). */
export const DEFINING_WORLD_PLAZA_INVENTORY_STORAGE_ROW_COUNT = 3 as const;

/** Visible rows in the hotbar chrome (one paged row at a time). */
export const DEFINING_WORLD_PLAZA_INVENTORY_VISIBLE_ROW_COUNT = 1 as const;

/**
 * Total hotbar pages: main row first, then each storage row.
 * Arrows flip through these one row at a time.
 */
export const DEFINING_WORLD_PLAZA_INVENTORY_PAGE_COUNT =
  DEFINING_WORLD_PLAZA_INVENTORY_MAIN_ROW_COUNT +
  DEFINING_WORLD_PLAZA_INVENTORY_STORAGE_ROW_COUNT;

/** Slots shown per storage page (one row). */
export const DEFINING_WORLD_PLAZA_INVENTORY_PAGE_SIZE =
  DEFINING_WORLD_PLAZA_INVENTORY_COLUMNS;

/** Main hotbar slot count (row 1; equippable; page 0). */
export const DEFINING_WORLD_PLAZA_INVENTORY_MAIN_HOTBAR_SLOT_COUNT =
  DEFINING_WORLD_PLAZA_INVENTORY_COLUMNS *
  DEFINING_WORLD_PLAZA_INVENTORY_MAIN_ROW_COUNT;

/** Total inventory slots: main row + storage rows. */
export const DEFINING_WORLD_PLAZA_INVENTORY_CAPACITY =
  DEFINING_WORLD_PLAZA_INVENTORY_COLUMNS *
  (DEFINING_WORLD_PLAZA_INVENTORY_MAIN_ROW_COUNT +
    DEFINING_WORLD_PLAZA_INVENTORY_STORAGE_ROW_COUNT);

/** First slot index of storage (row 2+). */
export const DEFINING_WORLD_PLAZA_INVENTORY_STORAGE_SLOT_START =
  DEFINING_WORLD_PLAZA_INVENTORY_MAIN_HOTBAR_SLOT_COUNT;

/** Number of storage-only pages (excludes the main hotbar page). */
export const DEFINING_WORLD_PLAZA_INVENTORY_STORAGE_PAGE_COUNT =
  DEFINING_WORLD_PLAZA_INVENTORY_STORAGE_ROW_COUNT;

/**
 * Far-left hotbar slot reserved for weapons and tools only.
 * When empty, the UI shows a faded fist (unarmed melee).
 */
export const DEFINING_WORLD_PLAZA_INVENTORY_WEAPON_TOOL_SLOT_INDEX = 0 as const;

/** Iconify id for the empty weapon/tool slot fist placeholder. */
export const DEFINING_WORLD_PLAZA_INVENTORY_EMPTY_FIST_ICON =
  'ph:hand-fist' as const;

/** Opacity for the empty fist placeholder (empty but fighting unarmed). */
export const DEFINING_WORLD_PLAZA_INVENTORY_EMPTY_FIST_OPACITY = 0.45 as const;

/**
 * Empty fist glyph size vs inventory slot edge (larger than normal item icons).
 */
export const DEFINING_WORLD_PLAZA_INVENTORY_EMPTY_FIST_ICON_SIZE_RATIO =
  0.72 as const;

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

/** Accessible label for paging storage up (toward earlier rows). */
export const LABELING_WORLD_PLAZA_INVENTORY_PAGE_UP =
  'Previous inventory row' as const;

/** Accessible label for paging storage down (toward later rows). */
export const LABELING_WORLD_PLAZA_INVENTORY_PAGE_DOWN =
  'Next inventory row' as const;

/**
 * Delay before drag-hover on a page arrow changes the storage page (ms).
 * Avoids accidental flips while brushing past the arrows.
 */
export const DEFINING_WORLD_PLAZA_INVENTORY_PAGE_ARROW_DRAG_HOVER_DELAY_MS =
  280 as const;

/**
 * Repeat interval while still hovering a page arrow during drag (ms).
 * Useful if more than two storage pages are added later.
 */
export const DEFINING_WORLD_PLAZA_INVENTORY_PAGE_ARROW_DRAG_HOVER_REPEAT_MS =
  420 as const;

/**
 * Min ms between wheel-driven inventory page steps.
 * Stops trackpad inertia from skipping several rows at once.
 */
export const DEFINING_WORLD_PLAZA_INVENTORY_PAGE_WHEEL_COOLDOWN_MS =
  140 as const;

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
    {
      itemTypeId: resolvingWorldPlazaCraftRecipePageItemTypeId(
        DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.CAMPFIRE
      ),
      quantity: 1,
    },
  ] as const;
