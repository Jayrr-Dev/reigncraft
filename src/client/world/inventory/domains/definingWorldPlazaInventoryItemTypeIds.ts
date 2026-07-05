/**
 * Server-safe world plaza inventory item type ids.
 *
 * Kept free of React/icon imports so the Colyseus game server can reference
 * item ids (e.g. for authoritative ground-item seeding) without pulling in
 * client-only modules like `lucide-react`.
 *
 * @module components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds
 */

/** Wood resource item type id. */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD =
  'world-plaza-wood' as const;

/** Stone resource item type id. */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_STONE =
  'world-plaza-stone' as const;

/** Flint igniter item type id. */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLINT =
  'world-plaza-flint' as const;

/** Build tool item type id. */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_TOOL =
  'world-plaza-tool' as const;

/** Wood axe item type id. */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_AXE =
  'world-plaza-axe' as const;

/** Berries food item type id. */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRIES =
  'world-plaza-berries' as const;

/** Apple food item type id. */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_APPLE =
  'world-plaza-apple' as const;

/** Cooked meat food item type id. */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_COOKED_MEAT =
  'world-plaza-cooked-meat' as const;
