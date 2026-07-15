import { resolvingWorldPlazaCraftablePlateArmorPieceDefinition } from '@/components/world/equipment/domains/definingWorldPlazaCraftablePlateArmorSetRegistry';
import type { DefiningWorldPlazaInventorySpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';

export const DEFINING_WORLD_PLAZA_INVENTORY_CRAFTABLE_PLATE_ARMOR_SPRITE_SHEET_COLUMN_COUNT = 5;
export const DEFINING_WORLD_PLAZA_INVENTORY_CRAFTABLE_PLATE_ARMOR_SPRITE_SHEET_ROW_COUNT = 1;

export function resolvingWorldPlazaInventoryCraftablePlateArmorSpriteSheetIcon(
  itemTypeId: string
): DefiningWorldPlazaInventorySpriteSheetIcon | null {
  const piece =
    resolvingWorldPlazaCraftablePlateArmorPieceDefinition(itemTypeId);

  if (!piece) {
    return null;
  }

  return {
    spriteSheetUrl: piece.spriteSheetUrl,
    columnCount:
      DEFINING_WORLD_PLAZA_INVENTORY_CRAFTABLE_PLATE_ARMOR_SPRITE_SHEET_COLUMN_COUNT,
    rowCount:
      DEFINING_WORLD_PLAZA_INVENTORY_CRAFTABLE_PLATE_ARMOR_SPRITE_SHEET_ROW_COUNT,
    columnIndex: piece.sheetColumnIndex,
    rowIndex: 0,
  };
}
