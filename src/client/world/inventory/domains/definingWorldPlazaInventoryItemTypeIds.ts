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
