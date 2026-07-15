'use client';

/**
 * Shelf of thematic lore volumes. Selecting a spine opens the shared book UI.
 *
 * @module components/home/components/renderingPlazaLoreBookShelf
 */

import {
  DEFINING_PLAZA_BUTTON_SFX_KIND,
  definingPlazaButtonSfxDataAttributes,
} from '@/components/home/domains/definingPlazaDefaultButtonSfxConstants';
import {
  DEFINING_PLAZA_LORE_BOOK_SUBTITLE,
  DEFINING_PLAZA_LORE_BOOK_TITLE,
  LABELING_PLAZA_LORE_BOOK_SHELF,
} from '@/components/home/domains/definingPlazaLoreBookConstants';
import { listingPlazaLoreBooks } from '@/components/home/domains/resolvingPlazaLoreBookDefinition';
import { Icon } from '@/components/ui/icon';
import { useMemo } from 'react';

const LORE_BOOK_HEADER_BUTTON_CLASS_NAME =
  'plaza-btn-3d flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-md border-2 border-poster-gold/60 bg-[linear-gradient(180deg,#2c4a52_0%,#223a42_100%)] text-parchment shadow-[0_4px_0_0_#14252b] [--plaza-edge:#14252b]';

/** Props for {@link RenderingPlazaLoreBookShelf}. */
export type RenderingPlazaLoreBookShelfProps = {
  onSelectBookId: (bookId: string) => void;
  onClose?: () => void;
  className?: string;
};

/**
 * Series shelf: pick a volume, then read it in the shared lore book panel.
 */
export function RenderingPlazaLoreBookShelf({
  onSelectBookId,
  onClose,
  className = '',
}: RenderingPlazaLoreBookShelfProps): React.JSX.Element {
  const books = useMemo(() => listingPlazaLoreBooks(), []);

  return (
    <div
      className={`lore-book-cover lore-book-cover--shelf plaza-pop-in flex h-[min(88dvh,42rem)] w-full max-w-4xl flex-col gap-3 overflow-hidden rounded-lg p-3 font-body sm:p-4 ${className}`.trim()}
    >
      <span
        className="lore-book-mote left-[12%] top-[18%] size-1"
        aria-hidden
      />
      <span
        className="lore-book-mote left-[78%] top-[12%] size-1.5 [animation-delay:2.4s]"
        aria-hidden
      />

      <div className="relative flex shrink-0 items-center gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-md border-2 border-poster-gold/50 bg-black/25 text-poster-gold">
          <Icon
            icon="mdi:book-open-page-variant"
            className="size-6"
            aria-hidden
          />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-xl font-bold tracking-wide text-parchment">
            {DEFINING_PLAZA_LORE_BOOK_TITLE}
          </h2>
          <p className="truncate text-xs font-medium italic text-parchment/65 sm:text-sm">
            {DEFINING_PLAZA_LORE_BOOK_SUBTITLE}
          </p>
        </div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className={LORE_BOOK_HEADER_BUTTON_CLASS_NAME}
          >
            <Icon icon="mdi:close" className="size-5" aria-hidden />
          </button>
        ) : null}
      </div>

      <div className="lore-book-page relative flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto rounded-md p-3 sm:p-4">
        <p className="px-1 font-display text-[11px] font-bold uppercase tracking-[0.2em] text-ink-soft">
          Volumes
        </p>
        <ul
          aria-label={LABELING_PLAZA_LORE_BOOK_SHELF}
          className="grid grid-cols-1 gap-2 sm:grid-cols-2"
        >
          {books.map((book) => (
            <li key={book.id}>
              <button
                type="button"
                {...definingPlazaButtonSfxDataAttributes(
                  DEFINING_PLAZA_BUTTON_SFX_KIND.none
                )}
                onClick={() => onSelectBookId(book.id)}
                data-theme={book.themeId}
                className="lore-book-shelf-spine group flex w-full cursor-pointer items-start gap-3 rounded-md border px-3 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-poster-teal/40"
              >
                <span className="lore-book-shelf-spine__icon flex size-11 shrink-0 items-center justify-center rounded-sm border">
                  <Icon icon={book.icon} className="size-5" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink-soft/80">
                    {book.volumeLabel}
                  </span>
                  <span className="mt-0.5 block font-display text-base font-bold leading-tight tracking-wide text-ink">
                    {book.title}
                  </span>
                  <span className="mt-1 block text-xs font-medium italic leading-snug text-ink-soft">
                    {book.blurb}
                  </span>
                </span>
                <Icon
                  icon="mdi:chevron-right"
                  className="mt-1 size-4 shrink-0 text-ink-soft/50 transition group-hover:text-ink-soft"
                  aria-hidden
                />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
