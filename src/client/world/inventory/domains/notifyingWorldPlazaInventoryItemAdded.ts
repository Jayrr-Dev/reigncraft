import { playingWorldPlazaInventoryBagSfx } from '@/components/world/inventory/domains/playingWorldPlazaInventoryBagSfx';

/**
 * Plays the inventory pickup clip when items were accepted into the bag.
 */
export function notifyingWorldPlazaInventoryItemAdded(
  quantityAccepted: number
): void {
  if (quantityAccepted <= 0) {
    return;
  }

  playingWorldPlazaInventoryBagSfx({ actionId: 'pickup' });
}
