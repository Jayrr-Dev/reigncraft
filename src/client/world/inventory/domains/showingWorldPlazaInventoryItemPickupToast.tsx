/**
 * Shows the plaza pickup toast with the item glyph on the far right.
 *
 * @module components/world/inventory/domains/showingWorldPlazaInventoryItemPickupToast
 */

import { showingReigncraftToast } from '@/components/ui/domains/showingReigncraftToast';
import { RenderingWorldPlazaInventoryItemPickupToastContent } from '@/components/world/inventory/components/renderingWorldPlazaInventoryItemPickupToastContent';

export type ShowingWorldPlazaInventoryItemPickupToastParams = {
  readonly itemTypeId: string;
  readonly quantity: number;
};

/**
 * Formats and shows a "Picked up …" gameplay toast with the item icon.
 */
export function showingWorldPlazaInventoryItemPickupToast({
  itemTypeId,
  quantity,
}: ShowingWorldPlazaInventoryItemPickupToastParams): string | number {
  return showingReigncraftToast(
    <RenderingWorldPlazaInventoryItemPickupToastContent
      itemTypeId={itemTypeId}
      quantity={quantity}
    />
  );
}
