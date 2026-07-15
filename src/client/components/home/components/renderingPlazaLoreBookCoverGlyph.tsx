'use client';

/**
 * Shared HQ cover glyph for one Corpus volume.
 *
 * @module components/home/components/renderingPlazaLoreBookCoverGlyph
 */

import { resolvingPlazaLoreBookSpriteIconStyle } from '@/components/home/domains/resolvingPlazaLoreBookSpriteIconStyle';
import { Icon } from '@/components/ui/icon';

/** Props for {@link RenderingPlazaLoreBookCoverGlyph}. */
export type RenderingPlazaLoreBookCoverGlyphProps = {
  readonly bookId: string;
  readonly className?: string;
};

/**
 * Pixel cover tome from the lore book sprite sheet.
 */
export function RenderingPlazaLoreBookCoverGlyph({
  bookId,
  className = '',
}: RenderingPlazaLoreBookCoverGlyphProps): React.JSX.Element {
  const style = resolvingPlazaLoreBookSpriteIconStyle(bookId);

  if (!style) {
    return (
      <span
        className={`inline-flex items-center justify-center text-poster-gold ${className}`.trim()}
        aria-hidden
      >
        <Icon icon="mdi:book" className="size-2/3" />
      </span>
    );
  }

  return (
    <span
      className={`inline-block shrink-0 [image-rendering:pixelated] ${className}`.trim()}
      style={style}
      aria-hidden
    />
  );
}
