/**
 * Sprite-sheet cells for fishing catch rarity float icons.
 * Order matches {@link DEFINING_WORLD_PLAZA_INVENTORY_ITEM_RARITY_ORDER}.
 *
 * @module components/world/fishing/domains/definingWorldPlazaFishingRaritySpriteSheetConstants
 */

import type { DefiningWorldPlazaInventoryItemRarity } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemRarityConstants';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_RARITY_ORDER } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemRarityConstants';
import type { DefiningWorldPlazaInventorySpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';

export const DEFINING_WORLD_PLAZA_FISHING_RARITY_SPRITE_SHEET_URL =
  '/creatures/sprites/loot/fishing-rarity-sprites.webp' as const;

export const DEFINING_WORLD_PLAZA_FISHING_RARITY_SPRITE_SHEET_COLUMN_COUNT = 4;
export const DEFINING_WORLD_PLAZA_FISHING_RARITY_SPRITE_SHEET_ROW_COUNT = 2;

/**
 * Resolves the 32px sheet crop for one inventory rarity tier.
 */
export function resolvingWorldPlazaFishingRaritySpriteSheetIcon(
  rarity: DefiningWorldPlazaInventoryItemRarity
): DefiningWorldPlazaInventorySpriteSheetIcon {
  const index = DEFINING_WORLD_PLAZA_INVENTORY_ITEM_RARITY_ORDER.indexOf(rarity);
  const safeIndex = index >= 0 ? index : 0;
  const columnIndex =
    safeIndex % DEFINING_WORLD_PLAZA_FISHING_RARITY_SPRITE_SHEET_COLUMN_COUNT;
  const rowIndex = Math.floor(
    safeIndex / DEFINING_WORLD_PLAZA_FISHING_RARITY_SPRITE_SHEET_COLUMN_COUNT
  );

  return {
    spriteSheetUrl: DEFINING_WORLD_PLAZA_FISHING_RARITY_SPRITE_SHEET_URL,
    columnCount: DEFINING_WORLD_PLAZA_FISHING_RARITY_SPRITE_SHEET_COLUMN_COUNT,
    rowCount: DEFINING_WORLD_PLAZA_FISHING_RARITY_SPRITE_SHEET_ROW_COUNT,
    columnIndex,
    rowIndex,
  };
}
