/**
 * CSS background crop for one lore volume cover glyph.
 *
 * @module components/home/domains/resolvingPlazaLoreBookSpriteIconStyle
 */

import { resolvingPlazaLoreBookSpriteSheetIcon } from '@/components/home/domains/definingPlazaLoreBookSpriteConstants';
import type { CSSProperties } from 'react';

/**
 * Pixelated background-image style for a Corpus volume cover.
 *
 * @param bookId - Lore volume id
 */
export function resolvingPlazaLoreBookSpriteIconStyle(
  bookId: string
): CSSProperties | null {
  const spriteSheet = resolvingPlazaLoreBookSpriteSheetIcon(bookId);

  if (!spriteSheet) {
    return null;
  }

  const backgroundPositionX =
    spriteSheet.columnCount <= 1
      ? 0
      : (spriteSheet.columnIndex / (spriteSheet.columnCount - 1)) * 100;

  return {
    backgroundImage: `url("${spriteSheet.spriteSheetUrl}")`,
    backgroundPosition: `${backgroundPositionX}% 0%`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: `${spriteSheet.columnCount * 100}% ${spriteSheet.rowCount * 100}%`,
  };
}
