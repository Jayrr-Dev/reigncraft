import type { DefiningWorldPlazaInventorySpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';

export const DEFINING_WORLD_PLAZA_INVENTORY_GLASS_VEIL_ARMOR_SPRITE_SHEET_URL =
  '/inventory/sprites/inventory-glass-veil-armor-sprites.webp' as const;

export const DEFINING_WORLD_PLAZA_INVENTORY_GLASS_VEIL_ARMOR_SPRITE_SHEET_COLUMN_COUNT = 5;
export const DEFINING_WORLD_PLAZA_INVENTORY_GLASS_VEIL_ARMOR_SPRITE_SHEET_ROW_COUNT = 1;

export const DEFINING_WORLD_PLAZA_INVENTORY_GLASS_VEIL_ARMOR_SPRITE_SHEET_TYPE_IDS =
  [
    'world-plaza-glass-veil-diadem',
    'world-plaza-glass-veil-bracers',
    'world-plaza-glass-veil-mantle',
    'world-plaza-glass-veil-greaves',
    'world-plaza-glass-veil-slippers',
  ] as const;

const DEFINING_WORLD_PLAZA_INVENTORY_GLASS_VEIL_ARMOR_SPRITE_INDEX_BY_TYPE_ID =
  new Map<string, number>(
    DEFINING_WORLD_PLAZA_INVENTORY_GLASS_VEIL_ARMOR_SPRITE_SHEET_TYPE_IDS.map(
      (typeId, index) => [typeId, index]
    )
  );

export function resolvingWorldPlazaInventoryGlassVeilArmorSpriteSheetIcon(
  itemTypeId: string
): DefiningWorldPlazaInventorySpriteSheetIcon | null {
  const sheetIndex =
    DEFINING_WORLD_PLAZA_INVENTORY_GLASS_VEIL_ARMOR_SPRITE_INDEX_BY_TYPE_ID.get(
      itemTypeId
    );

  if (sheetIndex === undefined) {
    return null;
  }

  return {
    spriteSheetUrl:
      DEFINING_WORLD_PLAZA_INVENTORY_GLASS_VEIL_ARMOR_SPRITE_SHEET_URL,
    columnCount:
      DEFINING_WORLD_PLAZA_INVENTORY_GLASS_VEIL_ARMOR_SPRITE_SHEET_COLUMN_COUNT,
    rowCount:
      DEFINING_WORLD_PLAZA_INVENTORY_GLASS_VEIL_ARMOR_SPRITE_SHEET_ROW_COUNT,
    columnIndex:
      sheetIndex %
      DEFINING_WORLD_PLAZA_INVENTORY_GLASS_VEIL_ARMOR_SPRITE_SHEET_COLUMN_COUNT,
    rowIndex: Math.floor(
      sheetIndex /
        DEFINING_WORLD_PLAZA_INVENTORY_GLASS_VEIL_ARMOR_SPRITE_SHEET_COLUMN_COUNT
    ),
  };
}
