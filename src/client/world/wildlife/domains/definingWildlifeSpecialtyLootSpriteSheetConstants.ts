/**
 * Sprite-sheet cells for wildlife specialty loot inventory icons.
 *
 * @module components/world/wildlife/domains/definingWildlifeSpecialtyLootSpriteSheetConstants
 */

import type { DefiningWorldPlazaInventorySpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';
import type { DefiningWildlifeSpecialtyLootSpriteGroupId } from '@/components/world/wildlife/domains/definingWildlifeSpecialtyLootItemCatalog';
import {
  DEFINING_WILDLIFE_SPECIALTY_LOOT_ITEM_CATALOG,
  resolvingWildlifeSpecialtyLootItemDefinition,
} from '@/components/world/wildlife/domains/definingWildlifeSpecialtyLootItemCatalog';

type DefiningWildlifeSpecialtyLootSpriteSheetGroup = {
  readonly groupId: DefiningWildlifeSpecialtyLootSpriteGroupId;
  readonly spriteSheetUrl: string;
  readonly columnCount: number;
  readonly rowCount: number;
};

export const DEFINING_WILDLIFE_SPECIALTY_LOOT_SPRITE_SHEET_GROUPS: readonly DefiningWildlifeSpecialtyLootSpriteSheetGroup[] =
  [
    {
      groupId: 'farm',
      spriteSheetUrl:
        '/creatures/sprites/loot/wildlife-specialty-farm-sprites.webp',
      columnCount: 4,
      rowCount: 3,
    },
    {
      groupId: 'companions',
      spriteSheetUrl:
        '/creatures/sprites/loot/wildlife-specialty-companions-sprites.webp',
      columnCount: 4,
      rowCount: 2,
    },
    {
      groupId: 'runners',
      spriteSheetUrl:
        '/creatures/sprites/loot/wildlife-specialty-runners-sprites.webp',
      columnCount: 4,
      rowCount: 3,
    },
    {
      groupId: 'horses',
      spriteSheetUrl:
        '/creatures/sprites/loot/wildlife-specialty-horses-sprites.webp',
      columnCount: 4,
      rowCount: 3,
    },
    {
      groupId: 'shell',
      spriteSheetUrl:
        '/creatures/sprites/loot/wildlife-specialty-shell-sprites.webp',
      columnCount: 4,
      rowCount: 2,
    },
    {
      groupId: 'predators',
      spriteSheetUrl:
        '/creatures/sprites/loot/wildlife-specialty-predators-sprites.webp',
      columnCount: 4,
      rowCount: 3,
    },
    {
      groupId: 'giants',
      spriteSheetUrl:
        '/creatures/sprites/loot/wildlife-specialty-giants-sprites.webp',
      columnCount: 4,
      rowCount: 3,
    },
  ];

const DEFINING_WILDLIFE_SPECIALTY_LOOT_SPRITE_GROUP_BY_ID = Object.fromEntries(
  DEFINING_WILDLIFE_SPECIALTY_LOOT_SPRITE_SHEET_GROUPS.map((group) => [
    group.groupId,
    group,
  ])
) as Record<
  DefiningWildlifeSpecialtyLootSpriteGroupId,
  DefiningWildlifeSpecialtyLootSpriteSheetGroup
>;

export function resolvingWildlifeSpecialtyLootSpriteSheetIcon(
  itemTypeId: string
): DefiningWorldPlazaInventorySpriteSheetIcon | null {
  const item = resolvingWildlifeSpecialtyLootItemDefinition(itemTypeId);

  if (!item) {
    return null;
  }

  const group = DEFINING_WILDLIFE_SPECIALTY_LOOT_SPRITE_GROUP_BY_ID[
    item.spriteGroupId
  ];

  if (!group) {
    return null;
  }

  const columnIndex = item.spriteCellIndex % group.columnCount;
  const rowIndex = Math.floor(item.spriteCellIndex / group.columnCount);

  if (rowIndex >= group.rowCount) {
    return null;
  }

  return {
    spriteSheetUrl: group.spriteSheetUrl,
    columnCount: group.columnCount,
    rowCount: group.rowCount,
    columnIndex,
    rowIndex,
  };
}

/** Occupied cell counts per group (for sprite pack validation). */
export function listingWildlifeSpecialtyLootOccupiedCellCountByGroup(): Record<
  DefiningWildlifeSpecialtyLootSpriteGroupId,
  number
> {
  const counts = {
    farm: 0,
    companions: 0,
    runners: 0,
    horses: 0,
    shell: 0,
    predators: 0,
    giants: 0,
  } satisfies Record<DefiningWildlifeSpecialtyLootSpriteGroupId, number>;

  for (const item of DEFINING_WILDLIFE_SPECIALTY_LOOT_ITEM_CATALOG) {
    counts[item.spriteGroupId] += 1;
  }

  return counts;
}
