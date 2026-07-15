/**
 * Sprite sheet crop helpers for late unique craftable weapons.
 *
 * @module components/world/inventory/domains/definingWorldPlazaInventoryLateWeaponSpriteSheetConstants
 */

import type { DefiningWorldPlazaInventorySpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';

export const DEFINING_WORLD_PLAZA_INVENTORY_LATE_WEAPON_SPRITE_SHEET_URL =
  '/inventory/sprites/inventory-late-weapon-sprites.webp' as const;

export const DEFINING_WORLD_PLAZA_INVENTORY_LATE_WEAPON_SPRITE_SHEET_COLUMN_COUNT = 6;
export const DEFINING_WORLD_PLAZA_INVENTORY_LATE_WEAPON_SPRITE_SHEET_ROW_COUNT = 1;

/** Sheet order: Chaos Diceblade, Quiet Hand Blade, Glass Needle Stiletto, Siphon Fang Dagger, Fated Ledger Blade, Soft Clay Cleaver. */
export const DEFINING_WORLD_PLAZA_INVENTORY_LATE_WEAPON_SPRITE_SHEET_TYPE_IDS =
  [
    'world-plaza-weapon-chaos-die',
    'world-plaza-weapon-quiet-hand',
    'world-plaza-weapon-glass-needle',
    'world-plaza-weapon-siphon-fang',
    'world-plaza-weapon-fated-ledger',
    'world-plaza-weapon-soft-clay-cleaver',
  ] as const;

const DEFINING_WORLD_PLAZA_INVENTORY_LATE_WEAPON_SPRITE_INDEX_BY_TYPE_ID =
  new Map<string, number>(
    DEFINING_WORLD_PLAZA_INVENTORY_LATE_WEAPON_SPRITE_SHEET_TYPE_IDS.map(
      (typeId, index) => [typeId, index]
    )
  );

export function resolvingWorldPlazaInventoryLateWeaponSpriteSheetIcon(
  itemTypeId: string
): DefiningWorldPlazaInventorySpriteSheetIcon | null {
  const sheetIndex =
    DEFINING_WORLD_PLAZA_INVENTORY_LATE_WEAPON_SPRITE_INDEX_BY_TYPE_ID.get(
      itemTypeId
    );

  if (sheetIndex === undefined) {
    return null;
  }

  return {
    spriteSheetUrl: DEFINING_WORLD_PLAZA_INVENTORY_LATE_WEAPON_SPRITE_SHEET_URL,
    columnCount:
      DEFINING_WORLD_PLAZA_INVENTORY_LATE_WEAPON_SPRITE_SHEET_COLUMN_COUNT,
    rowCount: DEFINING_WORLD_PLAZA_INVENTORY_LATE_WEAPON_SPRITE_SHEET_ROW_COUNT,
    columnIndex:
      sheetIndex %
      DEFINING_WORLD_PLAZA_INVENTORY_LATE_WEAPON_SPRITE_SHEET_COLUMN_COUNT,
    rowIndex: Math.floor(
      sheetIndex /
        DEFINING_WORLD_PLAZA_INVENTORY_LATE_WEAPON_SPRITE_SHEET_COLUMN_COUNT
    ),
  };
}
