/**
 * Filters legacy demo loot still present on old Colyseus room shards.
 *
 * @module components/world/inventory/domains/checkingWorldPlazaGroundItemIsLegacyDemoSeed
 */

import type { DefiningWorldPlazaGroundItem } from "@/components/world/inventory/domains/definingWorldPlazaGroundItem";
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_STONE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
} from "@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds";

/** One fixed demo spawn from the removed server seed layout. */
interface DefiningWorldPlazaGroundItemLegacyDemoSeedEntry {
  readonly itemTypeId: string;
  readonly quantity: number;
  readonly gridX: number;
  readonly gridY: number;
  readonly layer: number;
}

/**
 * Exact demo loot tiles from the old {@code GROUND_ITEM_SEED_LAYOUT}.
 * Hidden client-side until stale room shards are recycled.
 */
export const DEFINING_WORLD_PLAZA_GROUND_ITEM_LEGACY_DEMO_SEED_LAYOUT: readonly DefiningWorldPlazaGroundItemLegacyDemoSeedEntry[] =
  [
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
      quantity: 3,
      gridX: 2,
      gridY: 0,
      layer: 1,
    },
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_STONE,
      quantity: 2,
      gridX: -1,
      gridY: 1,
      layer: 1,
    },
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
      quantity: 4,
      gridX: 1,
      gridY: 2,
      layer: 1,
    },
  ] as const;

/**
 * Returns true when a ground item matches the removed demo seed layout.
 *
 * @param groundItem - Shared ground item mirrored from Colyseus room state.
 */
export function checkingWorldPlazaGroundItemIsLegacyDemoSeed(
  groundItem: Pick<
    DefiningWorldPlazaGroundItem,
    "itemTypeId" | "quantity" | "gridX" | "gridY" | "layer"
  >,
): boolean {
  return DEFINING_WORLD_PLAZA_GROUND_ITEM_LEGACY_DEMO_SEED_LAYOUT.some(
    (seedEntry) =>
      seedEntry.itemTypeId === groundItem.itemTypeId &&
      seedEntry.quantity === groundItem.quantity &&
      seedEntry.gridX === groundItem.gridX &&
      seedEntry.gridY === groundItem.gridY &&
      seedEntry.layer === groundItem.layer,
  );
}
