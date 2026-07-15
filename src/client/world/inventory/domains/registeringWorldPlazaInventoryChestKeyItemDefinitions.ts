/**
 * Chest key inventory item definitions.
 *
 * @module components/world/inventory/domains/registeringWorldPlazaInventoryChestKeyItemDefinitions
 */

import type { DefiningWorldPlazaInventoryItemTypeDefinition } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CHEST_KEY } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';

export function registeringWorldPlazaInventoryChestKeyItemDefinitions(): readonly DefiningWorldPlazaInventoryItemTypeDefinition[] {
  return [
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CHEST_KEY,
      name: 'Chest Key',
      rarity: 'rare',
      maxStack: 16,
      isDroppable: true,
      isStackable: true,
      iconifyIcon: 'mdi:key-variant',
    },
  ];
}
