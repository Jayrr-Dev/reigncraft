import type { DefiningWorldPlazaInventorySpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';

export const DEFINING_WORLD_PLAZA_INVENTORY_HEALER_SPRITE_SHEET_URL =
  '/inventory/sprites/inventory-healer-sprites.webp' as const;

export const DEFINING_WORLD_PLAZA_INVENTORY_HEALER_SPRITE_SHEET_COLUMN_COUNT = 5;
export const DEFINING_WORLD_PLAZA_INVENTORY_HEALER_SPRITE_SHEET_ROW_COUNT = 5;

export const DEFINING_WORLD_PLAZA_INVENTORY_HEALER_SPRITE_SHEET_TYPE_IDS = [
  'world-plaza-healer-yarrow-pressure-dressing',
  'world-plaza-healer-calendula-wound-salve',
  'world-plaza-healer-chamomile-compress',
  'world-plaza-healer-lavender-antiseptic-wash',
  'world-plaza-healer-peppermint-digestive-drops',
  'world-plaza-healer-meadowsweet-fever-cloth',
  'world-plaza-healer-rose-liniment',
  'world-plaza-healer-field-agaric-restorative-tablet',
  'world-plaza-healer-kennel-paw-salve',
  'world-plaza-healer-litterbox-gut-drops',
  'world-plaza-healer-arnica-bruise-liniment',
  'world-plaza-healer-echinacea-tincture',
  'world-plaza-healer-valerian-night-draught',
  'world-plaza-healer-rest-cure-pillow',
  'world-plaza-healer-sheepskin-wound-pack',
  'world-plaza-healer-wolf-bite-antiserum',
  'world-plaza-healer-boar-lard-drawing-poultice',
  'world-plaza-healer-packhound-plague-collar',
  'world-plaza-healer-cat-scratch-styptic',
  'world-plaza-healer-bone-set-splint-wrap',
  'world-plaza-healer-deep-rest-serum',
  'world-plaza-healer-foxglove-heart-ampoule',
  'world-plaza-healer-cyroborn-frostbite-pack',
  'world-plaza-healer-graded-plague-purge',
  'world-plaza-healer-belladonna-last-rites',
] as const;

const DEFINING_WORLD_PLAZA_INVENTORY_HEALER_SPRITE_INDEX_BY_TYPE_ID = new Map<
  string,
  number
>(
  DEFINING_WORLD_PLAZA_INVENTORY_HEALER_SPRITE_SHEET_TYPE_IDS.map(
    (typeId, index) => [typeId, index]
  )
);

export function resolvingWorldPlazaInventoryHealerSpriteSheetIcon(
  itemTypeId: string
): DefiningWorldPlazaInventorySpriteSheetIcon | null {
  const sheetIndex =
    DEFINING_WORLD_PLAZA_INVENTORY_HEALER_SPRITE_INDEX_BY_TYPE_ID.get(itemTypeId);

  if (sheetIndex === undefined) {
    return null;
  }

  return {
    spriteSheetUrl: DEFINING_WORLD_PLAZA_INVENTORY_HEALER_SPRITE_SHEET_URL,
    columnCount: DEFINING_WORLD_PLAZA_INVENTORY_HEALER_SPRITE_SHEET_COLUMN_COUNT,
    rowCount: DEFINING_WORLD_PLAZA_INVENTORY_HEALER_SPRITE_SHEET_ROW_COUNT,
    columnIndex:
      sheetIndex %
      DEFINING_WORLD_PLAZA_INVENTORY_HEALER_SPRITE_SHEET_COLUMN_COUNT,
    rowIndex: Math.floor(
      sheetIndex /
        DEFINING_WORLD_PLAZA_INVENTORY_HEALER_SPRITE_SHEET_COLUMN_COUNT
    ),
  };
}
