/**
 * Sprite-sheet cells for fishing catch raw/cooked inventory icons.
 * Greyish/silvery fish used blue chroma (#0088FF) at generate time.
 *
 * @module components/world/fishing/domains/definingWorldPlazaFishingCatchSpriteSheetConstants
 */

import type { DefiningWorldPlazaInventorySpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';

type DefiningWorldPlazaFishingCatchSpriteSheetGroup = {
  readonly catchIds: readonly string[];
  readonly rawSpriteSheetUrl: string;
  readonly cookedSpriteSheetUrl: string;
  readonly columnCount: number;
  readonly rowCount: number;
};

const DEFINING_WORLD_PLAZA_FISHING_CATCH_SPRITE_SHEET_GROUPS: readonly DefiningWorldPlazaFishingCatchSpriteSheetGroup[] =
  [
    {
      rawSpriteSheetUrl:
        '/creatures/sprites/loot/fish-raw-color-a-sprites.webp',
      cookedSpriteSheetUrl:
        '/creatures/sprites/loot/fish-cooked-color-a-sprites.webp',
      columnCount: 4,
      rowCount: 3,
      catchIds: [
        'largemouth-bass',
        'yellow-perch',
        'crayfish',
        'quiet-hand-sunfish',
        'painted-snail',
        'smallmouth-bass',
        'current-thread-eel',
        'peacock-bass',
        'giant-river-prawn',
        'vinecoil-moray',
        'dustwake-barb',
        'bowfin-river',
      ],
    },
    {
      rawSpriteSheetUrl:
        '/creatures/sprites/loot/fish-raw-color-b-sprites.webp',
      cookedSpriteSheetUrl:
        '/creatures/sprites/loot/fish-cooked-color-b-sprites.webp',
      columnCount: 4,
      rowCount: 3,
      catchIds: [
        'mud-turtle',
        'brook-trout',
        'dwarf-crayfish',
        'spritcore-tadling',
        'rainbow-darter',
        'apple-snail',
        'rosyface-shiner',
        'green-sunfish',
        'freshwater-crab',
        'bullfrog',
        'mirrorpuddle-carp',
        'common-starfish',
      ],
    },
    {
      rawSpriteSheetUrl:
        '/creatures/sprites/loot/fish-raw-color-c-sprites.webp',
      cookedSpriteSheetUrl:
        '/creatures/sprites/loot/fish-cooked-color-c-sprites.webp',
      columnCount: 4,
      rowCount: 2,
      catchIds: [
        'climbing-perch',
        'mangrove-crab',
        'warmouth',
        'swamp-crayfish',
        'swamp-bowfin',
        'swamp-mud-crab',
        'red-choir-bogmaw',
        'mereon-judgment-gar',
      ],
    },
    {
      rawSpriteSheetUrl: '/creatures/sprites/loot/fish-raw-grey-a-sprites.webp',
      cookedSpriteSheetUrl:
        '/creatures/sprites/loot/fish-cooked-grey-a-sprites.webp',
      columnCount: 4,
      rowCount: 3,
      catchIds: [
        'freshwater-mussel',
        'stillglass-pike',
        'striped-bass',
        'soft-shell-clam',
        'lake-whitefish',
        'cold-water-shrimp',
        'ladder-rime-char',
        'channel-catfish',
        'freshwater-drum',
        'carnegus-gravel-ray',
        'burbot',
        'creek-chub',
      ],
    },
    {
      rawSpriteSheetUrl: '/creatures/sprites/loot/fish-raw-grey-b-sprites.webp',
      cookedSpriteSheetUrl:
        '/creatures/sprites/loot/fish-cooked-grey-b-sprites.webp',
      columnCount: 4,
      rowCount: 2,
      catchIds: [
        'freshwater-snail',
        'skipstone-minnow',
        'arctic-grayling',
        'ice-rill-shrimp',
        'rime-sprig-goby',
        'fathead-minnow',
        'uncored-leechfish',
      ],
    },
  ];

function resolvingSpriteSheetIconForCatch(
  catchId: string,
  phase: 'raw' | 'cooked'
): DefiningWorldPlazaInventorySpriteSheetIcon | null {
  for (const group of DEFINING_WORLD_PLAZA_FISHING_CATCH_SPRITE_SHEET_GROUPS) {
    const spriteIndex = group.catchIds.indexOf(catchId);

    if (spriteIndex < 0) {
      continue;
    }

    return {
      spriteSheetUrl:
        phase === 'raw' ? group.rawSpriteSheetUrl : group.cookedSpriteSheetUrl,
      columnCount: group.columnCount,
      rowCount: group.rowCount,
      columnIndex: spriteIndex % group.columnCount,
      rowIndex: Math.floor(spriteIndex / group.columnCount),
    };
  }

  return null;
}

/** Raw inventory sprite cell for one fishing catch id. */
export function resolvingWorldPlazaFishingCatchRawSpriteSheetIcon(
  catchId: string
): DefiningWorldPlazaInventorySpriteSheetIcon | null {
  return resolvingSpriteSheetIconForCatch(catchId, 'raw');
}

/** Cooked inventory sprite cell for one fishing catch id. */
export function resolvingWorldPlazaFishingCatchCookedSpriteSheetIcon(
  catchId: string
): DefiningWorldPlazaInventorySpriteSheetIcon | null {
  return resolvingSpriteSheetIconForCatch(catchId, 'cooked');
}
