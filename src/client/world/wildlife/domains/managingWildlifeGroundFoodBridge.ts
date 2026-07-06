/**
 * Module bridge between ground-item React state and the wildlife sim tick.
 *
 * @module components/world/wildlife/domains/managingWildlifeGroundFoodBridge
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import type { DefiningWorldPlazaGroundItem } from '@/components/world/inventory/domains/definingWorldPlazaGroundItem';

export type ManagingWildlifeGroundFoodBridge = {
  listGroundItems: () => readonly DefiningWorldPlazaGroundItem[];
  consumeGroundFoodUnit: (
    groundItemId: string,
    consumerPosition: DefiningWorldPlazaWorldPoint
  ) => boolean;
};

let managingWildlifeGroundFoodBridge: ManagingWildlifeGroundFoodBridge | null =
  null;

/** Registers the active ground-item bridge for wildlife foraging. */
export function registeringWildlifeGroundFoodBridge(
  bridge: ManagingWildlifeGroundFoodBridge | null
): void {
  managingWildlifeGroundFoodBridge = bridge;
}

/** Lists ground items visible to the wildlife simulation this frame. */
export function listingWildlifeGroundFoodItems(): readonly DefiningWorldPlazaGroundItem[] {
  return managingWildlifeGroundFoodBridge?.listGroundItems() ?? [];
}

/** Consumes one unit from a ground stack when wildlife is in range. */
export function consumingWildlifeGroundFoodBridgeUnit(
  groundItemId: string,
  consumerPosition: DefiningWorldPlazaWorldPoint
): boolean {
  return (
    managingWildlifeGroundFoodBridge?.consumeGroundFoodUnit(
      groundItemId,
      consumerPosition
    ) ?? false
  );
}
