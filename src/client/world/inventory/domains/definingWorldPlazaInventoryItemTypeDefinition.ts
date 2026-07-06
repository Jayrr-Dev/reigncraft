import type { DefiningInventoryItemTypeDefinition } from '@/components/inventory/domains/definingInventoryItemRegistry';
import type { DefiningWorldPlazaEquipmentToolKind } from '@/components/world/equipment/domains/definingWorldPlazaEquipmentToolKind';

/** Hunger restoration applied when a food item is eaten. */
export type DefiningWorldPlazaInventoryItemFoodBehavior = {
  readonly hungerRestoreRatio: number;
};

/** Tool capabilities granted when a hotbar item is equipped. */
export type DefiningWorldPlazaInventoryItemEquipmentBehavior = {
  readonly toolKinds: readonly DefiningWorldPlazaEquipmentToolKind[];
  /** Multiplier applied to harvest channel durations (higher = faster). */
  readonly harvestSpeedMultiplier: number;
};

/**
 * Full world plaza item definition: inventory metadata plus optional gameplay
 * behaviors. Add new items in {@link DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_DEFINITIONS}.
 */
export type DefiningWorldPlazaInventoryItemTypeDefinition =
  DefiningInventoryItemTypeDefinition & {
    readonly food?: DefiningWorldPlazaInventoryItemFoodBehavior;
    readonly equipment?: DefiningWorldPlazaInventoryItemEquipmentBehavior;
  };
