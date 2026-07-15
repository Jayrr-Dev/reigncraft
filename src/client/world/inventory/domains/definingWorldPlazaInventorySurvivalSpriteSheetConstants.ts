import type { DefiningWorldPlazaInventorySpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';

export const DEFINING_WORLD_PLAZA_INVENTORY_SURVIVAL_SPRITE_SHEET_URL =
  '/inventory/sprites/inventory-survival-sprites.webp' as const;

export const DEFINING_WORLD_PLAZA_INVENTORY_SURVIVAL_SPRITE_SHEET_COLUMN_COUNT = 5;
export const DEFINING_WORLD_PLAZA_INVENTORY_SURVIVAL_SPRITE_SHEET_ROW_COUNT = 4;

/** Sprite sheet order: wear (11) then build mats (8). */
export const DEFINING_WORLD_PLAZA_INVENTORY_SURVIVAL_SPRITE_SHEET_TYPE_IDS = [
  'world-plaza-survival-straw-sun-hat',
  'world-plaza-survival-wool-neck-wrap',
  'world-plaza-survival-frost-glare-lenses',
  'world-plaza-survival-swamp-mesh-veil',
  'world-plaza-survival-hide-trail-vest',
  'world-plaza-survival-fur-shoulder-cape',
  'world-plaza-survival-palm-leaf-poncho',
  'world-plaza-survival-bark-bracers',
  'world-plaza-survival-fingerless-work-mitts',
  'world-plaza-survival-cloth-leg-wraps',
  'world-plaza-survival-hide-trail-boots',
  'world-plaza-survival-split-planks',
  'world-plaza-survival-wattle-panel',
  'world-plaza-survival-adobe-brick',
  'world-plaza-survival-rope-coil',
  'world-plaza-survival-peg-stake-pack',
  'world-plaza-survival-reed-mat',
  'world-plaza-survival-clay-daub-mix',
  'world-plaza-survival-lashing-twine-spool',
] as const;

const DEFINING_WORLD_PLAZA_INVENTORY_SURVIVAL_SPRITE_INDEX_BY_TYPE_ID = new Map<
  string,
  number
>(
  DEFINING_WORLD_PLAZA_INVENTORY_SURVIVAL_SPRITE_SHEET_TYPE_IDS.map(
    (typeId, index) => [typeId, index]
  )
);

export function resolvingWorldPlazaInventorySurvivalSpriteSheetIcon(
  itemTypeId: string
): DefiningWorldPlazaInventorySpriteSheetIcon | null {
  const sheetIndex =
    DEFINING_WORLD_PLAZA_INVENTORY_SURVIVAL_SPRITE_INDEX_BY_TYPE_ID.get(
      itemTypeId
    );

  if (sheetIndex === undefined) {
    return null;
  }

  return {
    spriteSheetUrl: DEFINING_WORLD_PLAZA_INVENTORY_SURVIVAL_SPRITE_SHEET_URL,
    columnCount:
      DEFINING_WORLD_PLAZA_INVENTORY_SURVIVAL_SPRITE_SHEET_COLUMN_COUNT,
    rowCount: DEFINING_WORLD_PLAZA_INVENTORY_SURVIVAL_SPRITE_SHEET_ROW_COUNT,
    columnIndex:
      sheetIndex %
      DEFINING_WORLD_PLAZA_INVENTORY_SURVIVAL_SPRITE_SHEET_COLUMN_COUNT,
    rowIndex: Math.floor(
      sheetIndex /
        DEFINING_WORLD_PLAZA_INVENTORY_SURVIVAL_SPRITE_SHEET_COLUMN_COUNT
    ),
  };
}
