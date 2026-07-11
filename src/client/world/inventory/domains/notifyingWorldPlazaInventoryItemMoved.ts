import { playingWorldPlazaInventoryBagSfx } from '@/components/world/inventory/domains/playingWorldPlazaInventoryBagSfx';

/**
 * Plays the quieter inventory move clip after a successful slot rearrange.
 */
export function notifyingWorldPlazaInventoryItemMoved(): void {
  playingWorldPlazaInventoryBagSfx({ actionId: 'move' });
}
