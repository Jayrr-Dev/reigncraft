/**
 * Typed instance metadata keys for plaza inventory items.
 *
 * @module components/world/inventory/domains/definingWorldPlazaInventoryItemInstanceMetadataConstants
 */

/** Creator display name shown when inspecting an item (future crafting). */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_CREATED_BY_METADATA_KEY =
  'createdBy' as const;

/** Optional per-instance forge level override (future equipment upgrades). */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_FORGE_LEVEL_METADATA_KEY =
  'forgeLevel' as const;
