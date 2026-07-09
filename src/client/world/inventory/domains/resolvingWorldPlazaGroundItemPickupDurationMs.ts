/**
 * Resolves ground-pickup channel duration from item weight.
 *
 * @module components/world/inventory/domains/resolvingWorldPlazaGroundItemPickupDurationMs
 */

import { computingWorldPlazaGroundItemPickupDurationMs } from '@/components/world/inventory/domains/computingWorldPlazaGroundItemPickupDurationMs';
import { resolvingWorldPlazaInventoryItemWeight } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemWeight';

/**
 * Pickup channel length in ms for one ground item type (0.5s … 10s by weight).
 */
export function resolvingWorldPlazaGroundItemPickupDurationMs(
  itemTypeId: string
): number {
  return computingWorldPlazaGroundItemPickupDurationMs(
    resolvingWorldPlazaInventoryItemWeight(itemTypeId)
  );
}
