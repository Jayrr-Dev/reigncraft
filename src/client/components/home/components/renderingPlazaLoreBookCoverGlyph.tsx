'use client';

/**
 * Shared HQ cover glyph for one Corpus volume.
 *
 * @module components/home/components/renderingPlazaLoreBookCoverGlyph
 */

import { DEFINING_PLAZA_LORE_BOOK_LOCKED_SILHOUETTE_FILTER } from '@/components/home/domains/definingPlazaLoreBookUnlockConstants';
import { resolvingPlazaLoreBookSpriteIconStyle } from '@/components/home/domains/resolvingPlazaLoreBookSpriteIconStyle';
import { Icon } from '@/components/ui/icon';

/** Props for {@link RenderingPlazaLoreBookCoverGlyph}. */
export type RenderingPlazaLoreBookCoverGlyphProps = {
  readonly bookId: string;
  readonly className?: string;
  /** Codex-style black silhouette when the volume is still locked. */
  readonly variant?: 'revealed' | 'silhouette';
};

/**
 * Pixel cover tome from the lore book sprite sheet.
 */
export function RenderingPlazaLoreBookCoverGlyph({
  bookId,
  className = '',
  variant = 'revealed',
}: RenderingPlazaLoreBookCoverGlyphProps): React.JSX.Element {
  const style = resolvingPlazaLoreBookSpriteIconStyle(bookId);
  const isSilhouette = variant === 'silhouette';

  if (!style) {
    return (
      <span
        className={`inline-flex items-center justify-center text-poster-gold ${className}`.trim()}
        aria-hidden
        style={
          isSilhouette
            ? { filter: DEFINING_PLAZA_LORE_BOOK_LOCKED_SILHOUETTE_FILTER }
            : undefined
        }
      >
        <Icon icon="mdi:book" className="size-2/3" />
      </span>
    );
  }

  return (
    <span
      className={`inline-block shrink-0 [image-rendering:pixelated] ${className}`.trim()}
      style={{
        ...style,
        ...(isSilhouette
          ? { filter: DEFINING_PLAZA_LORE_BOOK_LOCKED_SILHOUETTE_FILTER }
          : {}),
      }}
      aria-hidden
    />
  );
}
