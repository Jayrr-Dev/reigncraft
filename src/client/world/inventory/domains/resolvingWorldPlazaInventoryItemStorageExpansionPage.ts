/**
 * Resolves whether an inventory item is a storage-expansion ledger page.
 *
 * @module components/world/inventory/domains/resolvingWorldPlazaInventoryItemStorageExpansionPage
 */

import type { DefiningWorldPlazaInventoryStorageExpansionPageTier } from '@/components/world/inventory/domains/definingWorldPlazaInventoryStorageExpansionConstants';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_DEFINITIONS } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypes';

/**
 * Returns the page tier when this item unlocks a storage row, else null.
 */
export function resolvingWorldPlazaInventoryItemStorageExpansionPageTier(
  itemTypeId: string
): DefiningWorldPlazaInventoryStorageExpansionPageTier | null {
  const definition = DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_DEFINITIONS.find(
    (entry) => entry.typeId === itemTypeId
  );

  return definition?.storageExpansionPage?.tier ?? null;
}

/**
 * True when the item is a packing-ledger expansion page.
 */
export function checkingWorldPlazaInventoryItemIsStorageExpansionPage(
  itemTypeId: string
): boolean {
  return (
    resolvingWorldPlazaInventoryItemStorageExpansionPageTier(itemTypeId) !==
    null
  );
}
