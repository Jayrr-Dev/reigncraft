/**
 * Lore Corpus volume cover sprite sheet (6×1 @ 64px HQ).
 *
 * @module components/home/domains/definingPlazaLoreBookSpriteConstants
 */

import type { DefiningWorldPlazaInventorySpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';

/** Closed-tome covers for the Wanderer's Corpus library shelf. */
export const DEFINING_PLAZA_LORE_BOOK_SPRITE_SHEET_URL =
  '/inventory/sprites/inventory-lore-book-sprites.webp' as const;

export const DEFINING_PLAZA_LORE_BOOK_SPRITE_SHEET_COLUMN_COUNT = 6;
export const DEFINING_PLAZA_LORE_BOOK_SPRITE_SHEET_ROW_COUNT = 1;
export const DEFINING_PLAZA_LORE_BOOK_SPRITE_CELL_SIZE_PX = 64;

/**
 * Column index in the lore book sheet, keyed by volume id.
 * Order matches {@link DEFINING_PLAZA_LORE_BOOKS}.
 */
export const DEFINING_PLAZA_LORE_BOOK_SPRITE_COLUMN_BY_BOOK_ID = {
  'book-i-lands': 0,
  'book-ii-founder': 1,
  'book-iii-climb': 2,
  'book-iv-road': 3,
  'book-v-crown': 4,
  'book-vi-edges': 5,
} as const;

export type DefiningPlazaLoreBookSpriteBookId =
  keyof typeof DEFINING_PLAZA_LORE_BOOK_SPRITE_COLUMN_BY_BOOK_ID;

/**
 * Resolves the HQ cover glyph for one Corpus volume.
 *
 * @param bookId - Lore volume id
 */
export function resolvingPlazaLoreBookSpriteSheetIcon(
  bookId: string
): DefiningWorldPlazaInventorySpriteSheetIcon | null {
  if (!(bookId in DEFINING_PLAZA_LORE_BOOK_SPRITE_COLUMN_BY_BOOK_ID)) {
    return null;
  }

  const columnIndex =
    DEFINING_PLAZA_LORE_BOOK_SPRITE_COLUMN_BY_BOOK_ID[
      bookId as DefiningPlazaLoreBookSpriteBookId
    ];

  return {
    spriteSheetUrl: DEFINING_PLAZA_LORE_BOOK_SPRITE_SHEET_URL,
    columnCount: DEFINING_PLAZA_LORE_BOOK_SPRITE_SHEET_COLUMN_COUNT,
    rowCount: DEFINING_PLAZA_LORE_BOOK_SPRITE_SHEET_ROW_COUNT,
    columnIndex,
    rowIndex: 0,
  };
}
