import type { DefiningInventoryItemTypeDefinition } from '@/components/inventory/domains/definingInventoryItemRegistry';
import type { DefiningWorldPlazaEquipmentItemCapabilities } from '@/components/world/equipment/domains/definingWorldPlazaEquipmentToolKind';
import type { DefiningWorldPlazaInventoryCustomItemIconId } from '@/components/world/inventory/domains/definingWorldPlazaInventoryCustomItemIconIds';
import type { DefiningWorldPlazaInventoryStackQuantityDisplayBehavior } from '@/components/world/inventory/domains/definingWorldPlazaInventoryStackQuantityDisplay';

/** Hunger restoration applied when a food item is eaten. */
export type DefiningWorldPlazaInventoryItemFoodBehavior = {
  readonly hungerRestoreRatio: number;
  readonly meatKind?: 'raw' | 'cooked';
  readonly wildlifeSpeciesId?: string;
  readonly rawPoisonFlatEv?: number;
  readonly rawPoisonDurationMs?: number;
  readonly rawSicknessChance?: number;
  readonly rawDiseaseId?: string;
  readonly rawDiseaseChance?: number;
  readonly rawSymptomIntensity?: number;
  readonly rawDurationIntensity?: number;
  readonly cookedWellFedBuffId?: string;
  readonly cookedWellFedBuffIds?: readonly string[];
  readonly cookedWellFedChance?: number;
  readonly cookedResidualDiseaseId?: string;
  readonly cookedResidualDiseaseChance?: number;
};

/** Tool capabilities granted when a hotbar item is equipped. */
export type DefiningWorldPlazaInventoryItemEquipmentBehavior =
  DefiningWorldPlazaEquipmentItemCapabilities;

/** Extra inventory grid granted when the bag popover is open. */
export type DefiningWorldPlazaInventoryItemContainerBehavior = {
  readonly columns: number;
  readonly rows: number;
};

/** Wear-and-break rules for reusable tools (axe, build tool, etc.). */
export type DefiningWorldPlazaInventoryItemDurabilityBehavior = {
  /** Starting durability for a fresh item instance. */
  readonly max: number;
  /** Durability lost per successful use (default 1). */
  readonly wearPerUse?: number;
  /** Chance [0, 1] the item is destroyed on each use while already at zero. */
  readonly breakChanceAtZero?: number;
};

/**
 * Full world plaza item definition: inventory metadata plus optional gameplay
 * behaviors. Add new items in {@link DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_DEFINITIONS}.
 */
export type DefiningWorldPlazaInventoryItemTypeDefinition =
  DefiningInventoryItemTypeDefinition & {
    readonly food?: DefiningWorldPlazaInventoryItemFoodBehavior;
    readonly equipment?: DefiningWorldPlazaInventoryItemEquipmentBehavior;
    readonly container?: DefiningWorldPlazaInventoryItemContainerBehavior;
    readonly durability?: DefiningWorldPlazaInventoryItemDurabilityBehavior;
    readonly defaultEnchantments?: readonly string[];
    readonly stackQuantityDisplay?: DefiningWorldPlazaInventoryStackQuantityDisplayBehavior;
    readonly customIconId?: DefiningWorldPlazaInventoryCustomItemIconId;
    /** Bundled Iconify glyph id (e.g. `mdi:bag-personal`). */
    readonly iconifyIcon?: string;
  };
