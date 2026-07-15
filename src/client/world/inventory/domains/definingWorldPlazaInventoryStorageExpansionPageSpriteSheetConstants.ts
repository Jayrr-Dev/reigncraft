/**
 * Storage-expansion ledger page sprite sheet (rare / mythic / legendary).
 *
 * @module components/world/inventory/domains/definingWorldPlazaInventoryStorageExpansionPageSpriteSheetConstants
 */

import type { DefiningWorldPlazaInventoryStorageExpansionPageTier } from '@/components/world/inventory/domains/definingWorldPlazaInventoryStorageExpansionConstants';
import type { DefiningWorldPlazaInventorySpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';

/** HQ 64px packing-ledger page icons. */
export const DEFINING_WORLD_PLAZA_INVENTORY_STORAGE_EXPANSION_PAGE_SPRITE_SHEET_URL =
  '/inventory/sprites/inventory-storage-expansion-page-sprites.webp' as const;

export const DEFINING_WORLD_PLAZA_INVENTORY_STORAGE_EXPANSION_PAGE_SPRITE_SHEET_COLUMN_COUNT =
  3;
export const DEFINING_WORLD_PLAZA_INVENTORY_STORAGE_EXPANSION_PAGE_SPRITE_SHEET_ROW_COUNT =
  1;

const DEFINING_WORLD_PLAZA_INVENTORY_STORAGE_EXPANSION_PAGE_SPRITE_COLUMN_BY_TIER =
  {
    rare: 0,
    mythic: 1,
    legendary: 2,
  } as const satisfies Record<
    DefiningWorldPlazaInventoryStorageExpansionPageTier,
    number
  >;

/**
 * Resolves the page glyph for one expansion ledger tier.
 */
export function resolvingWorldPlazaInventoryStorageExpansionPageSpriteSheetIcon(
  tier: DefiningWorldPlazaInventoryStorageExpansionPageTier
): DefiningWorldPlazaInventorySpriteSheetIcon {
  return {
    spriteSheetUrl:
      DEFINING_WORLD_PLAZA_INVENTORY_STORAGE_EXPANSION_PAGE_SPRITE_SHEET_URL,
    columnCount:
      DEFINING_WORLD_PLAZA_INVENTORY_STORAGE_EXPANSION_PAGE_SPRITE_SHEET_COLUMN_COUNT,
    rowCount:
      DEFINING_WORLD_PLAZA_INVENTORY_STORAGE_EXPANSION_PAGE_SPRITE_SHEET_ROW_COUNT,
    columnIndex:
      DEFINING_WORLD_PLAZA_INVENTORY_STORAGE_EXPANSION_PAGE_SPRITE_COLUMN_BY_TIER[
        tier
      ],
    rowIndex: 0,
  };
}
