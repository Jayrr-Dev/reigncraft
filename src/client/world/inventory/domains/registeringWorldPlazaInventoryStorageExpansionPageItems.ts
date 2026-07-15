/**
 * Inventory item definitions for packing-ledger pages that unlock storage rows.
 *
 * @module components/world/inventory/domains/registeringWorldPlazaInventoryStorageExpansionPageItems
 */

import {
  DEFINING_WORLD_PLAZA_INVENTORY_STORAGE_EXPANSION_PAGE_LABEL,
  DEFINING_WORLD_PLAZA_INVENTORY_STORAGE_EXPANSION_PAGE_TIERS,
  DEFINING_WORLD_PLAZA_INVENTORY_STORAGE_EXPANSION_PAGE_TYPE_ID,
  type DefiningWorldPlazaInventoryStorageExpansionPageTier,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryStorageExpansionConstants';
import { resolvingWorldPlazaInventoryStorageExpansionPageSpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventoryStorageExpansionPageSpriteSheetConstants';
import type { DefiningWorldPlazaInventoryItemTypeDefinition } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';

/**
 * Three consumable ledger pages (rare / mythic / legendary). Each unlocks one
 * bonus storage row when used, shared across a global cap of 3.
 */
export function registeringWorldPlazaInventoryStorageExpansionPageItems(): readonly DefiningWorldPlazaInventoryItemTypeDefinition[] {
  return DEFINING_WORLD_PLAZA_INVENTORY_STORAGE_EXPANSION_PAGE_TIERS.map(
    (tier) => ({
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_STORAGE_EXPANSION_PAGE_TYPE_ID[tier],
      name: DEFINING_WORLD_PLAZA_INVENTORY_STORAGE_EXPANSION_PAGE_LABEL[tier],
      tooltip:
        'Double-click to bind this ledger into your pack. Adds one storage page (+6 slots). You can bind at most three.',
      rarity: tier,
      iconSpriteSheet:
        resolvingWorldPlazaInventoryStorageExpansionPageSpriteSheetIcon(tier),
      iconifyIcon: 'mdi:book-open-page-variant-outline',
      maxStack: 1,
      isDroppable: true,
      isStackable: false,
      storageExpansionPage: {
        tier,
      },
    })
  );
}

/**
 * Resolves the expansion page tier for an item type id, or null.
 */
export function resolvingWorldPlazaInventoryStorageExpansionPageTierFromItemTypeId(
  itemTypeId: string
): DefiningWorldPlazaInventoryStorageExpansionPageTier | null {
  for (const tier of DEFINING_WORLD_PLAZA_INVENTORY_STORAGE_EXPANSION_PAGE_TIERS) {
    if (
      DEFINING_WORLD_PLAZA_INVENTORY_STORAGE_EXPANSION_PAGE_TYPE_ID[tier] ===
      itemTypeId
    ) {
      return tier;
    }
  }

  return null;
}
