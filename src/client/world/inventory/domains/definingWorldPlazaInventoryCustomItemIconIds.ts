/**
 * Custom inventory item icon ids for glyphs that are not Lucide or emoji.
 *
 * @module components/world/inventory/domains/definingWorldPlazaInventoryCustomItemIconIds
 */

/** Glowing soul orb used by Spritcore. */
export const DEFINING_WORLD_PLAZA_INVENTORY_CUSTOM_ITEM_ICON_SPRITCORE_SPHERE =
  'spritcore-sphere' as const;

/** Registered custom inventory item icon ids. */
export type DefiningWorldPlazaInventoryCustomItemIconId =
  typeof DEFINING_WORLD_PLAZA_INVENTORY_CUSTOM_ITEM_ICON_SPRITCORE_SPHERE;
