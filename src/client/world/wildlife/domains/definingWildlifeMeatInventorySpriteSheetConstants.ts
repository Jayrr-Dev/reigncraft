/**
 * Sprite-sheet cells for wildlife meat inventory icons.
 *
 * @module components/world/wildlife/domains/definingWildlifeMeatInventorySpriteSheetConstants
 */

import type { DefiningWorldPlazaInventorySpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';

type DefiningWildlifeMeatInventorySpriteSheetGroup = {
  readonly rawItemTypeIds: readonly string[];
  readonly rawSpriteSheetUrl: string;
  readonly cookedSpriteSheetUrl: string;
  readonly columnCount: number;
  readonly rowCount: number;
};

export const DEFINING_WILDLIFE_MEAT_INVENTORY_SPRITE_SHEET_COLUMN_COUNT = 4;
export const DEFINING_WILDLIFE_MEAT_INVENTORY_SPRITE_SHEET_ROW_COUNT = 3;

const DEFINING_WILDLIFE_MEAT_INVENTORY_SPRITE_SHEET_GROUPS: readonly DefiningWildlifeMeatInventorySpriteSheetGroup[] =
  [
    {
      rawSpriteSheetUrl:
        '/creatures/sprites/loot/small-animal-raw-meat-sprites.webp',
      cookedSpriteSheetUrl:
        '/creatures/sprites/loot/small-animal-cooked-meat-sprites.webp',
      columnCount: DEFINING_WILDLIFE_MEAT_INVENTORY_SPRITE_SHEET_COLUMN_COUNT,
      rowCount: DEFINING_WILDLIFE_MEAT_INVENTORY_SPRITE_SHEET_ROW_COUNT,
      rawItemTypeIds: [
        'world-plaza-raw-chicken-meat',
        'world-plaza-raw-cat-black-meat',
        'world-plaza-raw-cat-white-meat',
        'world-plaza-raw-cat-large-meat',
        'world-plaza-raw-shepherd-dog-meat',
        'world-plaza-raw-monkey-meat',
        'world-plaza-raw-turtle-meat',
        'world-plaza-raw-tortoise-meat',
        'world-plaza-raw-alpaca-meat',
        'world-plaza-raw-mutton',
        'world-plaza-raw-pork',
        'world-plaza-raw-ram-mutton',
      ],
    },
    {
      rawSpriteSheetUrl:
        '/creatures/sprites/loot/medium-animal-raw-meat-sprites.webp',
      cookedSpriteSheetUrl:
        '/creatures/sprites/loot/medium-animal-cooked-meat-sprites.webp',
      columnCount: DEFINING_WILDLIFE_MEAT_INVENTORY_SPRITE_SHEET_COLUMN_COUNT,
      rowCount: DEFINING_WILDLIFE_MEAT_INVENTORY_SPRITE_SHEET_ROW_COUNT,
      rawItemTypeIds: [
        'world-plaza-raw-deer-meat',
        'world-plaza-raw-stag-venison',
        'world-plaza-raw-antilope-meat',
        'world-plaza-raw-oryx-meat',
        'world-plaza-raw-ostrich-meat',
        'world-plaza-raw-donkey-meat',
        'world-plaza-raw-llama-meat',
        'world-plaza-raw-boar-meat',
        'world-plaza-raw-hyena-meat',
        'world-plaza-raw-wolf-meat',
        'world-plaza-raw-omega-wolf-meat',
        'world-plaza-raw-jaguar-meat',
      ],
    },
    {
      rawSpriteSheetUrl:
        '/creatures/sprites/loot/large-animal-raw-meat-sprites.webp',
      cookedSpriteSheetUrl:
        '/creatures/sprites/loot/large-animal-cooked-meat-sprites.webp',
      columnCount: DEFINING_WILDLIFE_MEAT_INVENTORY_SPRITE_SHEET_COLUMN_COUNT,
      rowCount: DEFINING_WILDLIFE_MEAT_INVENTORY_SPRITE_SHEET_ROW_COUNT,
      rawItemTypeIds: [
        'world-plaza-raw-horse-meat',
        'world-plaza-raw-work-horse-meat',
        'world-plaza-raw-arabian-horse-meat',
        'world-plaza-raw-beef',
        'world-plaza-raw-zebra-meat',
        'world-plaza-raw-camel-meat',
        'world-plaza-raw-bison-meat',
        'world-plaza-raw-bull-beef',
        'world-plaza-raw-buffalo-meat',
        'world-plaza-raw-yak-meat',
        'world-plaza-raw-chimp-meat',
        'world-plaza-raw-lion-meat',
      ],
    },
    {
      rawSpriteSheetUrl:
        '/creatures/sprites/loot/massive-animal-raw-meat-sprites.webp',
      cookedSpriteSheetUrl:
        '/creatures/sprites/loot/massive-animal-cooked-meat-sprites.webp',
      columnCount: DEFINING_WILDLIFE_MEAT_INVENTORY_SPRITE_SHEET_COLUMN_COUNT,
      rowCount: DEFINING_WILDLIFE_MEAT_INVENTORY_SPRITE_SHEET_ROW_COUNT,
      rawItemTypeIds: [
        'world-plaza-raw-lioness-meat',
        'world-plaza-raw-giraffe-meat',
        'world-plaza-raw-elephant-meat',
        'world-plaza-raw-elephant-matriarch-meat',
        'world-plaza-raw-rhino-meat',
        'world-plaza-raw-rhino-cow-meat',
        'world-plaza-raw-hippo-meat',
        'world-plaza-raw-mammoth-meat',
        'world-plaza-raw-bear-meat',
        'world-plaza-raw-polar-bear-meat',
        'world-plaza-raw-tiger-meat',
        'world-plaza-raw-crocodile-meat',
      ],
    },
    {
      rawSpriteSheetUrl:
        '/creatures/sprites/loot/special-animal-raw-meat-sprites.webp',
      cookedSpriteSheetUrl:
        '/creatures/sprites/loot/special-animal-cooked-meat-sprites.webp',
      columnCount: 4,
      rowCount: 2,
      rawItemTypeIds: [
        'world-plaza-raw-pinguin-meat',
        'world-plaza-raw-fairy-dust',
        'world-plaza-raw-husky-meat',
        'world-plaza-raw-golden-retriever-meat',
        'world-plaza-raw-brown-beef',
        'world-plaza-raw-cat-orange-meat',
        'world-plaza-raw-grizzly-meat',
      ],
    },
  ];

/**
 * Resolves a 32px sprite-sheet cell for a standard wildlife meat item.
 * Variant meats retain their existing Iconify fallback.
 */
export function resolvingWildlifeMeatInventorySpriteSheetIcon(
  rawItemTypeId: string,
  meatKind: 'raw' | 'cooked'
): DefiningWorldPlazaInventorySpriteSheetIcon | null {
  for (const group of DEFINING_WILDLIFE_MEAT_INVENTORY_SPRITE_SHEET_GROUPS) {
    const spriteIndex = group.rawItemTypeIds.indexOf(rawItemTypeId);

    if (spriteIndex < 0) {
      continue;
    }

    return {
      spriteSheetUrl:
        meatKind === 'raw'
          ? group.rawSpriteSheetUrl
          : group.cookedSpriteSheetUrl,
      columnCount: group.columnCount,
      rowCount: group.rowCount,
      columnIndex: spriteIndex % group.columnCount,
      rowIndex: Math.floor(spriteIndex / group.columnCount),
    };
  }

  return null;
}
