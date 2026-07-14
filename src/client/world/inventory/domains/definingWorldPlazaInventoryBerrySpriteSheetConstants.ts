import type { DefiningWorldPlazaInventorySpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_BLUE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_GOLDEN,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_RED,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_TEA_LEAVES,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import type { WorldShrubBerryLootKind } from '../../../../shared/worldShrubBerryLoot';

/**
 * Berry inventory sprite sheet (3×1 @ 32px).
 *
 * @module components/world/inventory/domains/definingWorldPlazaInventoryBerrySpriteSheetConstants
 */

export const DEFINING_WORLD_PLAZA_INVENTORY_BERRY_SPRITE_SHEET_URL =
  '/inventory/sprites/inventory-berry-sprites.webp' as const;

export const DEFINING_WORLD_PLAZA_INVENTORY_BERRY_SPRITE_SHEET_COLUMN_COUNT = 3;
export const DEFINING_WORLD_PLAZA_INVENTORY_BERRY_SPRITE_SHEET_ROW_COUNT = 1;

export const DEFINING_WORLD_PLAZA_INVENTORY_BERRY_SPRITE_SHEET_TYPE_IDS = [
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_RED,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_BLUE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_GOLDEN,
] as const;

const DEFINING_WORLD_PLAZA_INVENTORY_BERRY_SPRITE_INDEX_BY_TYPE_ID = new Map<
  string,
  number
>(
  DEFINING_WORLD_PLAZA_INVENTORY_BERRY_SPRITE_SHEET_TYPE_IDS.map(
    (typeId, index) => [typeId, index]
  )
);

/**
 * Maps every shrub loot kind to its inventory item type id.
 *
 * Tea leaves live on a separate 1×1 sprite sheet (see
 * `definingWorldPlazaInventoryTeaLeavesSpriteSheetConstants`); this map only
 * resolves the item type id, not the icon crop.
 */
export const DEFINING_WORLD_PLAZA_BERRY_LOOT_KIND_TO_ITEM_TYPE_ID: Record<
  WorldShrubBerryLootKind,
  | (typeof DEFINING_WORLD_PLAZA_INVENTORY_BERRY_SPRITE_SHEET_TYPE_IDS)[number]
  | typeof DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_TEA_LEAVES
> = {
  red_berry: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_RED,
  blue_berry: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_BLUE,
  golden_berry: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_GOLDEN,
  tea_leaves: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_TEA_LEAVES,
};

export function resolvingWorldPlazaInventoryBerrySpriteSheetIcon(
  itemTypeId: string
): DefiningWorldPlazaInventorySpriteSheetIcon | null {
  const sheetIndex =
    DEFINING_WORLD_PLAZA_INVENTORY_BERRY_SPRITE_INDEX_BY_TYPE_ID.get(itemTypeId);

  if (sheetIndex === undefined) {
    return null;
  }

  const columnIndex =
    sheetIndex % DEFINING_WORLD_PLAZA_INVENTORY_BERRY_SPRITE_SHEET_COLUMN_COUNT;
  const rowIndex = Math.floor(
    sheetIndex / DEFINING_WORLD_PLAZA_INVENTORY_BERRY_SPRITE_SHEET_COLUMN_COUNT
  );

  return {
    spriteSheetUrl: DEFINING_WORLD_PLAZA_INVENTORY_BERRY_SPRITE_SHEET_URL,
    columnCount: DEFINING_WORLD_PLAZA_INVENTORY_BERRY_SPRITE_SHEET_COLUMN_COUNT,
    rowCount: DEFINING_WORLD_PLAZA_INVENTORY_BERRY_SPRITE_SHEET_ROW_COUNT,
    columnIndex,
    rowIndex,
  };
}

export function resolvingWorldPlazaBerryItemTypeIdFromLootKind(
  lootKind: WorldShrubBerryLootKind
): string {
  return DEFINING_WORLD_PLAZA_BERRY_LOOT_KIND_TO_ITEM_TYPE_ID[lootKind];
}
