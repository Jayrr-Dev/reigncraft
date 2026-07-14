/**
 * HUD toast after inventory accepts a world pickup.
 *
 * @module components/world/inventory/domains/formattingWorldPlazaInventoryItemPickupToastMessage
 */

import { resolvingWorldPlazaInventoryItemTypeDefinition } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemTypeDefinition';

export type FormattingWorldPlazaInventoryItemPickupToastMessageParams = {
  readonly itemTypeId: string;
  readonly quantity: number;
};

/** Resolves registry display name, falling back to the raw item type id. */
export function resolvingWorldPlazaInventoryItemPickupDisplayName(
  itemTypeId: string
): string {
  return (
    resolvingWorldPlazaInventoryItemTypeDefinition(itemTypeId)?.name ??
    itemTypeId
  );
}

/** `Picked up Wood.` or `Picked up Wood ×3.` */
export function formattingWorldPlazaInventoryItemPickupToastMessage({
  itemTypeId,
  quantity,
}: FormattingWorldPlazaInventoryItemPickupToastMessageParams): string {
  const displayName =
    resolvingWorldPlazaInventoryItemPickupDisplayName(itemTypeId);
  const acceptedQuantity = Math.max(0, Math.floor(quantity));

  if (acceptedQuantity <= 1) {
    return `Picked up ${displayName}.`;
  }

  return `Picked up ${displayName} ×${acceptedQuantity}.`;
}
