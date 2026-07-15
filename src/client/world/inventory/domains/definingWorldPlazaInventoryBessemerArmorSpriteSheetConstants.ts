import type { DefiningWorldPlazaInventorySpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';

export const DEFINING_WORLD_PLAZA_INVENTORY_BESSEMER_ARMOR_SPRITE_SHEET_URL =
  '/inventory/sprites/inventory-bessemer-armor-sprites.webp' as const;

export const DEFINING_WORLD_PLAZA_INVENTORY_BESSEMER_ARMOR_SPRITE_SHEET_COLUMN_COUNT = 5;
export const DEFINING_WORLD_PLAZA_INVENTORY_BESSEMER_ARMOR_SPRITE_SHEET_ROW_COUNT = 1;

/** Sprite sheet order: helm, arm, body, leg, foot. */
export const DEFINING_WORLD_PLAZA_INVENTORY_BESSEMER_ARMOR_SPRITE_SHEET_TYPE_IDS =
  [
    'world-plaza-bessemer-casque',
    'world-plaza-bessemer-gauntlets',
    'world-plaza-bessemer-breastplate',
    'world-plaza-bessemer-greaves',
    'world-plaza-bessemer-sabatons',
  ] as const;

const DEFINING_WORLD_PLAZA_INVENTORY_BESSEMER_ARMOR_SPRITE_INDEX_BY_TYPE_ID =
  new Map<string, number>(
    DEFINING_WORLD_PLAZA_INVENTORY_BESSEMER_ARMOR_SPRITE_SHEET_TYPE_IDS.map(
      (typeId, index) => [typeId, index]
    )
  );

export function resolvingWorldPlazaInventoryBessemerArmorSpriteSheetIcon(
  itemTypeId: string
): DefiningWorldPlazaInventorySpriteSheetIcon | null {
  const sheetIndex =
    DEFINING_WORLD_PLAZA_INVENTORY_BESSEMER_ARMOR_SPRITE_INDEX_BY_TYPE_ID.get(
      itemTypeId
    );

  if (sheetIndex === undefined) {
    return null;
  }

  return {
    spriteSheetUrl:
      DEFINING_WORLD_PLAZA_INVENTORY_BESSEMER_ARMOR_SPRITE_SHEET_URL,
    columnCount:
      DEFINING_WORLD_PLAZA_INVENTORY_BESSEMER_ARMOR_SPRITE_SHEET_COLUMN_COUNT,
    rowCount:
      DEFINING_WORLD_PLAZA_INVENTORY_BESSEMER_ARMOR_SPRITE_SHEET_ROW_COUNT,
    columnIndex:
      sheetIndex %
      DEFINING_WORLD_PLAZA_INVENTORY_BESSEMER_ARMOR_SPRITE_SHEET_COLUMN_COUNT,
    rowIndex: Math.floor(
      sheetIndex /
        DEFINING_WORLD_PLAZA_INVENTORY_BESSEMER_ARMOR_SPRITE_SHEET_COLUMN_COUNT
    ),
  };
}
