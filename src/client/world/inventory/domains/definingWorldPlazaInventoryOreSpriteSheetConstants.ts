import type { DefiningWorldPlazaInventorySpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_CLAY,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_COAL,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_COPPER,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_GOLD,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_IRON,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_LEAD,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_NITER,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_SCARLET,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_SILVER,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_SULFUR,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import type { WorldOreSpeciesId } from '../../../../shared/worldOreRarity';

/**
 * Ore inventory sprite sheet (4×3 @ 32px, 10 occupied).
 *
 * @module components/world/inventory/domains/definingWorldPlazaInventoryOreSpriteSheetConstants
 */

export const DEFINING_WORLD_PLAZA_INVENTORY_ORE_SPRITE_SHEET_URL =
  '/inventory/sprites/inventory-ore-sprites.webp' as const;

export const DEFINING_WORLD_PLAZA_INVENTORY_ORE_SPRITE_SHEET_COLUMN_COUNT = 4;
export const DEFINING_WORLD_PLAZA_INVENTORY_ORE_SPRITE_SHEET_ROW_COUNT = 3;

/** Sprite sheet cell order (matches art export). */
export const DEFINING_WORLD_PLAZA_INVENTORY_ORE_SPRITE_SHEET_TYPE_IDS = [
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_CLAY,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_IRON,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_SILVER,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_GOLD,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_COPPER,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_COAL,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_NITER,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_SCARLET,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_LEAD,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_SULFUR,
] as const;

const DEFINING_WORLD_PLAZA_INVENTORY_ORE_SPRITE_INDEX_BY_TYPE_ID = new Map<
  string,
  number
>(
  DEFINING_WORLD_PLAZA_INVENTORY_ORE_SPRITE_SHEET_TYPE_IDS.map(
    (typeId, index) => [typeId, index]
  )
);

/** Maps species slug to inventory item type id. */
export const DEFINING_WORLD_PLAZA_ORE_SPECIES_TO_ITEM_TYPE_ID: Record<
  WorldOreSpeciesId,
  (typeof DEFINING_WORLD_PLAZA_INVENTORY_ORE_SPRITE_SHEET_TYPE_IDS)[number]
> = {
  clay: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_CLAY,
  iron: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_IRON,
  silver: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_SILVER,
  gold: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_GOLD,
  copper: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_COPPER,
  coal: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_COAL,
  niter: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_NITER,
  scarlet: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_SCARLET,
  lead: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_LEAD,
  sulfur: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_SULFUR,
};

/**
 * Resolves sprite crop for one ore item type.
 */
export function resolvingWorldPlazaInventoryOreSpriteSheetIcon(
  itemTypeId: string
): DefiningWorldPlazaInventorySpriteSheetIcon | null {
  const sheetIndex =
    DEFINING_WORLD_PLAZA_INVENTORY_ORE_SPRITE_INDEX_BY_TYPE_ID.get(itemTypeId);

  if (sheetIndex === undefined) {
    return null;
  }

  const columnIndex =
    sheetIndex % DEFINING_WORLD_PLAZA_INVENTORY_ORE_SPRITE_SHEET_COLUMN_COUNT;
  const rowIndex = Math.floor(
    sheetIndex / DEFINING_WORLD_PLAZA_INVENTORY_ORE_SPRITE_SHEET_COLUMN_COUNT
  );

  return {
    spriteSheetUrl: DEFINING_WORLD_PLAZA_INVENTORY_ORE_SPRITE_SHEET_URL,
    columnCount: DEFINING_WORLD_PLAZA_INVENTORY_ORE_SPRITE_SHEET_COLUMN_COUNT,
    rowCount: DEFINING_WORLD_PLAZA_INVENTORY_ORE_SPRITE_SHEET_ROW_COUNT,
    columnIndex,
    rowIndex,
  };
}

/**
 * Inventory type id for a seeded ore species at a vein.
 */
export function resolvingWorldPlazaOreItemTypeIdFromSpeciesId(
  speciesId: WorldOreSpeciesId
): string {
  return DEFINING_WORLD_PLAZA_ORE_SPECIES_TO_ITEM_TYPE_ID[speciesId];
}

const DEFINING_WORLD_PLAZA_ORE_ITEM_TYPE_ID_TO_SPECIES_ID = new Map<
  string,
  WorldOreSpeciesId
>(
  (
    Object.entries(DEFINING_WORLD_PLAZA_ORE_SPECIES_TO_ITEM_TYPE_ID) as [
      WorldOreSpeciesId,
      string,
    ][]
  ).map(([speciesId, typeId]) => [typeId, speciesId])
);

/**
 * Parses an ore species id from an inventory ore item type id.
 */
export function parsingWorldPlazaOreSpeciesIdFromItemTypeId(
  itemTypeId: string
): WorldOreSpeciesId | null {
  return (
    DEFINING_WORLD_PLAZA_ORE_ITEM_TYPE_ID_TO_SPECIES_ID.get(itemTypeId) ?? null
  );
}

/**
 * True when the item type is a mineable ore resource.
 */
export function checkingWorldPlazaInventoryItemIsOre(
  itemTypeId: string
): boolean {
  return DEFINING_WORLD_PLAZA_ORE_ITEM_TYPE_ID_TO_SPECIES_ID.has(itemTypeId);
}
