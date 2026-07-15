/**
 * Sprite sheet crop helpers for early unique find-only weapons.
 *
 * @module components/world/inventory/domains/definingWorldPlazaInventoryEarlyWeaponSpriteSheetConstants
 */

import type { DefiningWorldPlazaInventorySpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';

export const DEFINING_WORLD_PLAZA_INVENTORY_EARLY_WEAPON_SPRITE_SHEET_URL =
  '/inventory/sprites/inventory-early-weapon-sprites.webp' as const;

export const DEFINING_WORLD_PLAZA_INVENTORY_EARLY_WEAPON_SPRITE_SHEET_COLUMN_COUNT = 6;
export const DEFINING_WORLD_PLAZA_INVENTORY_EARLY_WEAPON_SPRITE_SHEET_ROW_COUNT = 1;

/** Sheet order: Splinter Stick, Knot Mace, Reed Needle, Campfire Brand, Thaw Pick, Lucky Twig. */
export const DEFINING_WORLD_PLAZA_INVENTORY_EARLY_WEAPON_SPRITE_SHEET_TYPE_IDS =
  [
    'world-plaza-weapon-splinter-stick',
    'world-plaza-weapon-knot-mace',
    'world-plaza-weapon-reed-needle',
    'world-plaza-weapon-campfire-brand',
    'world-plaza-weapon-thaw-pick',
    'world-plaza-weapon-lucky-twig',
  ] as const;

const DEFINING_WORLD_PLAZA_INVENTORY_EARLY_WEAPON_SPRITE_INDEX_BY_TYPE_ID =
  new Map<string, number>(
    DEFINING_WORLD_PLAZA_INVENTORY_EARLY_WEAPON_SPRITE_SHEET_TYPE_IDS.map(
      (typeId, index) => [typeId, index]
    )
  );

export function resolvingWorldPlazaInventoryEarlyWeaponSpriteSheetIcon(
  itemTypeId: string
): DefiningWorldPlazaInventorySpriteSheetIcon | null {
  const sheetIndex =
    DEFINING_WORLD_PLAZA_INVENTORY_EARLY_WEAPON_SPRITE_INDEX_BY_TYPE_ID.get(
      itemTypeId
    );

  if (sheetIndex === undefined) {
    return null;
  }

  return {
    spriteSheetUrl:
      DEFINING_WORLD_PLAZA_INVENTORY_EARLY_WEAPON_SPRITE_SHEET_URL,
    columnCount:
      DEFINING_WORLD_PLAZA_INVENTORY_EARLY_WEAPON_SPRITE_SHEET_COLUMN_COUNT,
    rowCount:
      DEFINING_WORLD_PLAZA_INVENTORY_EARLY_WEAPON_SPRITE_SHEET_ROW_COUNT,
    columnIndex:
      sheetIndex %
      DEFINING_WORLD_PLAZA_INVENTORY_EARLY_WEAPON_SPRITE_SHEET_COLUMN_COUNT,
    rowIndex: Math.floor(
      sheetIndex /
        DEFINING_WORLD_PLAZA_INVENTORY_EARLY_WEAPON_SPRITE_SHEET_COLUMN_COUNT
    ),
  };
}
