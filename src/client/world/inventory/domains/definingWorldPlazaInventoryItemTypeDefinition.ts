import type { DefiningInventoryItemTypeDefinition } from '@/components/inventory/domains/definingInventoryItemRegistry';
import type { DefiningWorldPlazaCraftModeRecipeId } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeTypes';
import type { DefiningWorldPlazaArmorSlotId } from '@/components/world/equipment/domains/definingWorldPlazaArmorSlotRegistry';
import type { DefiningWorldPlazaEquipmentItemCapabilities } from '@/components/world/equipment/domains/definingWorldPlazaEquipmentToolKind';
import type { DefiningWorldPlazaInventoryItemCost } from '@/components/world/inventory/domains/computingWorldPlazaInventoryItemResolvedCost';
import type { DefiningWorldPlazaInventoryCustomItemIconId } from '@/components/world/inventory/domains/definingWorldPlazaInventoryCustomItemIconIds';
import type { DefiningWorldPlazaInventoryItemSpecialTag } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemSpecialTagConstants';
import type { DefiningWorldPlazaInventoryStackQuantityDisplayBehavior } from '@/components/world/inventory/domains/definingWorldPlazaInventoryStackQuantityDisplay';

/** Hunger restoration applied when a food item is eaten. */
export type DefiningWorldPlazaInventoryItemFoodBehavior = {
  readonly hungerRestoreRatio: number;
  /** Flat HP + percent of eater max HP restored when eaten (before kill size). */
  readonly healthHeal: {
    readonly baseFlat: number;
    readonly percentOfMax: number;
  };
  readonly meatKind?: 'raw' | 'cooked';
  readonly wildlifeSpeciesId?: string;
  readonly flowerSpeciesId?: string;
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
  /**
   * When set, eating consumes this food then grants one `returnItemTypeId`
   * (reusable clay vessels: bottle, bowl, crock).
   */
  readonly returnItemTypeId?: string;
};

/** Tool capabilities granted when a hotbar item is equipped. */
export type DefiningWorldPlazaInventoryItemEquipmentBehavior =
  DefiningWorldPlazaEquipmentItemCapabilities;

/** Profile armor slot wear behavior for survival trail gear. */
export type DefiningWorldPlazaInventoryItemArmorBehavior = {
  readonly slotId: DefiningWorldPlazaArmorSlotId;
};

/** Extra inventory grid granted when the bag popover is open. */
export type DefiningWorldPlazaInventoryItemContainerBehavior = {
  readonly columns: number;
  readonly rows: number;
};

/** One cell within a sprite sheet used as an inventory icon. */
export type DefiningWorldPlazaInventorySpriteSheetIcon = {
  readonly spriteSheetUrl: string;
  readonly columnCount: number;
  readonly rowCount: number;
  readonly columnIndex: number;
  readonly rowIndex: number;
  /** Optional CSS `filter` for tier tinting (e.g. shared fishrod cell). */
  readonly cssFilter?: string;
};

/** Wear-and-break rules for reusable tools (axe, build tool, etc.). */
export type DefiningWorldPlazaInventoryItemDurabilityBehavior = {
  /** Starting durability for a fresh item instance. */
  readonly max: number;
  /** Fixed durability lost per successful use. When unset, rolls default 1–3. */
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
    readonly armor?: DefiningWorldPlazaInventoryItemArmorBehavior;
    readonly container?: DefiningWorldPlazaInventoryItemContainerBehavior;
    readonly durability?: DefiningWorldPlazaInventoryItemDurabilityBehavior;
    readonly defaultEnchantments?: readonly string[];
    readonly stackQuantityDisplay?: DefiningWorldPlazaInventoryStackQuantityDisplayBehavior;
    readonly customIconId?: DefiningWorldPlazaInventoryCustomItemIconId;
    /** Public URL for a pixel inventory icon (e.g. `/tools-icons/wood-axe.png`). */
    readonly iconImageUrl?: string;
    /** One cropped pixel-art cell from a public sprite sheet. */
    readonly iconSpriteSheet?: DefiningWorldPlazaInventorySpriteSheetIcon;
    /**
     * Optional CSS color drawn over {@link iconSpriteSheet} with a sheet-cell
     * alpha mask (used for Spritcore crimson/gold cycles).
     */
    readonly iconSpriteOverlayColor?: string;
    /** Bundled Iconify glyph id (e.g. `mdi:bag-personal`). */
    readonly iconifyIcon?: string;
    /** Special content tags (Godforge, Unique, Quest Reward). */
    readonly tags?: readonly DefiningWorldPlazaInventoryItemSpecialTag[];
    /** Equipment forge rank for future upgrade systems. */
    readonly forgeLevel?: number;
    /** Economy base cost plus optional named multipliers. */
    readonly cost?: DefiningWorldPlazaInventoryItemCost;
    /**
     * Loose cookbook recipe page: double-click attaches `recipeId` once.
     */
    readonly recipePage?: {
      readonly recipeId: DefiningWorldPlazaCraftModeRecipeId;
    };
    /**
     * When true, the hotbar ground action uses Place instead of Drop
     * (traps and other world-placed gear, not loose ground loot).
     */
    readonly placesOnWorldGround?: boolean;
  };
