/**
 * Builds inventory item definitions for wildlife specialty loot parts/products.
 *
 * @module components/world/inventory/domains/registeringWorldPlazaWildlifeSpecialtyLootInventoryItems
 */

import type { DefiningWorldPlazaInventoryItemTypeDefinition } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';
import { DEFINING_WILDLIFE_SPECIALTY_LOOT_ITEM_CATALOG } from '@/components/world/wildlife/domains/definingWildlifeSpecialtyLootItemCatalog';
import { resolvingWildlifeSpecialtyLootSpriteSheetIcon } from '@/components/world/wildlife/domains/definingWildlifeSpecialtyLootSpriteSheetConstants';

/** Inventory definitions for every wildlife specialty loot item. */
export function registeringWorldPlazaWildlifeSpecialtyLootInventoryItems(): readonly DefiningWorldPlazaInventoryItemTypeDefinition[] {
  return DEFINING_WILDLIFE_SPECIALTY_LOOT_ITEM_CATALOG.map((entry) => ({
    typeId: entry.itemTypeId,
    name: entry.displayName,
    rarity: entry.rarity,
    description: entry.description,
    maxStack: 99,
    isDroppable: true,
    isStackable: true,
    iconSpriteSheet:
      resolvingWildlifeSpecialtyLootSpriteSheetIcon(entry.itemTypeId) ??
      undefined,
  }));
}
