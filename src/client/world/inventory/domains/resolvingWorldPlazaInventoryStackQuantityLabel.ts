/**
 * Resolves formatted stack labels for world plaza inventory items.
 *
 * @module components/world/inventory/domains/resolvingWorldPlazaInventoryStackQuantityLabel
 */

import { formattingWorldPlazaInventoryStackQuantityLabel } from '@/components/world/inventory/domains/formattingWorldPlazaInventoryStackQuantityLabel';
import { resolvingWorldPlazaInventoryItemTypeDefinition } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemTypeDefinition';

/**
 * Formats a stack quantity using the item type's declarative display rules.
 *
 * @param itemTypeId - Registered inventory item type id
 * @param quantity - Stack count
 */
export function resolvingWorldPlazaInventoryStackQuantityLabel(
  itemTypeId: string,
  quantity: number
): string {
  const typeDefinition =
    resolvingWorldPlazaInventoryItemTypeDefinition(itemTypeId);

  return formattingWorldPlazaInventoryStackQuantityLabel(
    quantity,
    typeDefinition?.stackQuantityDisplay
  );
}
