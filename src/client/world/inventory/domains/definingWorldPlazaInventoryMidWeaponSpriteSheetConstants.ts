/**
 * Sprite sheet crop helpers for mid unique find-only weapons.
 *
 * @module components/world/inventory/domains/definingWorldPlazaInventoryMidWeaponSpriteSheetConstants
 */

import type { DefiningWorldPlazaInventorySpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';

export const DEFINING_WORLD_PLAZA_INVENTORY_MID_WEAPON_SPRITE_SHEET_URL =
  '/inventory/sprites/inventory-mid-weapon-sprites.webp' as const;

export const DEFINING_WORLD_PLAZA_INVENTORY_MID_WEAPON_SPRITE_SHEET_COLUMN_COUNT = 6;
export const DEFINING_WORLD_PLAZA_INVENTORY_MID_WEAPON_SPRITE_SHEET_ROW_COUNT = 1;

/** Sheet order: Bessemer Edge, Glass Shard, Leech Knife, Ledger Stub, Choir Blade, Venom Barb. */
export const DEFINING_WORLD_PLAZA_INVENTORY_MID_WEAPON_SPRITE_SHEET_TYPE_IDS = [
  'world-plaza-weapon-bessemer-edge',
  'world-plaza-weapon-glass-shard',
  'world-plaza-weapon-leech-knife',
  'world-plaza-weapon-ledger-stub',
  'world-plaza-weapon-choir-blade',
  'world-plaza-weapon-venom-barb',
] as const;

const DEFINING_WORLD_PLAZA_INVENTORY_MID_WEAPON_SPRITE_INDEX_BY_TYPE_ID =
  new Map<string, number>(
    DEFINING_WORLD_PLAZA_INVENTORY_MID_WEAPON_SPRITE_SHEET_TYPE_IDS.map(
      (typeId, index) => [typeId, index]
    )
  );

export function resolvingWorldPlazaInventoryMidWeaponSpriteSheetIcon(
  itemTypeId: string
): DefiningWorldPlazaInventorySpriteSheetIcon | null {
  const sheetIndex =
    DEFINING_WORLD_PLAZA_INVENTORY_MID_WEAPON_SPRITE_INDEX_BY_TYPE_ID.get(
      itemTypeId
    );

  if (sheetIndex === undefined) {
    return null;
  }

  return {
    spriteSheetUrl: DEFINING_WORLD_PLAZA_INVENTORY_MID_WEAPON_SPRITE_SHEET_URL,
    columnCount:
      DEFINING_WORLD_PLAZA_INVENTORY_MID_WEAPON_SPRITE_SHEET_COLUMN_COUNT,
    rowCount: DEFINING_WORLD_PLAZA_INVENTORY_MID_WEAPON_SPRITE_SHEET_ROW_COUNT,
    columnIndex:
      sheetIndex %
      DEFINING_WORLD_PLAZA_INVENTORY_MID_WEAPON_SPRITE_SHEET_COLUMN_COUNT,
    rowIndex: Math.floor(
      sheetIndex /
        DEFINING_WORLD_PLAZA_INVENTORY_MID_WEAPON_SPRITE_SHEET_COLUMN_COUNT
    ),
  };
}
