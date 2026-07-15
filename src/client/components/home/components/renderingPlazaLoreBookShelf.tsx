'use client';

/**
 * Open-book shelf of thematic lore volumes. Selecting a spine opens a volume.
 *
 * @module components/home/components/renderingPlazaLoreBookShelf
 */

import { RenderingPlazaOpenBookFrame } from '@/components/home/components/renderingPlazaOpenBookFrame';
import {
  DEFINING_PLAZA_BUTTON_SFX_KIND,
  definingPlazaButtonSfxDataAttributes,
} from '@/components/home/domains/definingPlazaDefaultButtonSfxConstants';
import {
  DEFINING_PLAZA_LORE_BOOK_SUBTITLE,
  DEFINING_PLAZA_LORE_BOOK_TITLE,
  LABELING_PLAZA_LORE_BOOK_SHELF,
} from '@/components/home/domains/definingPlazaLoreBookConstants';
import {
  listingPlazaLoreBooks,
  type PlazaLoreBookResolved,
} from '@/components/home/domains/resolvingPlazaLoreBookDefinition';
import { Icon } from '@/components/ui/icon';
import { useMemo } from 'react';

function RenderingPlazaLoreBookShelfVolumeButton({
  book,
  onSelectBookId,
}: {
  readonly book: PlazaLoreBookResolved;
  readonly onSelectBookId: (bookId: string) => void;
}): React.JSX.Element {
  return (
    <button
      type="button"
      {...definingPlazaButtonSfxDataAttributes(
        DEFINING_PLAZA_BUTTON_SFX_KIND.none
      )}
      onClick={() => onSelectBookId(book.id)}
      data-theme={book.themeId}
      className="lore-book-shelf-spine group flex w-full cursor-pointer items-start gap-2 rounded-sm border px-2 py-2 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6b4e2e]/35"
    >
      <span className="lore-book-shelf-spine__icon flex size-8 shrink-0 items-center justify-center rounded-sm border sm:size-9">
        <Icon icon={book.icon} className="size-4 sm:size-5" aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-[#6b4e2e]/70">
          {book.volumeLabel}
        </span>
        <span className="mt-0.5 block font-display text-xs font-bold leading-tight tracking-wide text-[#3d2a16] sm:text-sm">
          {book.title}
        </span>
        <span className="mt-0.5 block text-[10px] font-medium italic leading-snug text-[#6b4e2e]/80 sm:text-[11px]">
          {book.blurb}
        </span>
      </span>
      <Icon
        icon="mdi:chevron-right"
        className="mt-0.5 size-3.5 shrink-0 text-[#6b4e2e]/40 transition group-hover:text-[#6b4e2e]/80"
        aria-hidden
      />
    </button>
  );
}

function RenderingPlazaLoreBookShelfPageColumn({
  books,
  heading,
  listLabel,
  onSelectBookId,
}: {
  readonly books: readonly PlazaLoreBookResolved[];
  readonly heading: string;
  readonly listLabel?: string;
  readonly onSelectBookId: (bookId: string) => void;
}): React.JSX.Element {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2">
      <p className="px-0.5 font-display text-[10px] font-bold uppercase tracking-[0.18em] text-[#6b4e2e]/80">
        {heading}
      </p>
      <ul className="flex flex-col gap-1.5" aria-label={listLabel ?? heading}>
        {books.map((book) => (
          <li key={book.id}>
            <RenderingPlazaLoreBookShelfVolumeButton
              book={book}
              onSelectBookId={onSelectBookId}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Props for {@link RenderingPlazaLoreBookShelf}. */
export type RenderingPlazaLoreBookShelfProps = {
  onSelectBookId: (bookId: string) => void;
  onClose?: () => void;
  className?: string;
};

/**
 * Series shelf on the shared pixel open-book frame.
 */
export function RenderingPlazaLoreBookShelf({
  onSelectBookId,
  onClose,
  className = '',
}: RenderingPlazaLoreBookShelfProps): React.JSX.Element {
  const books = useMemo(() => listingPlazaLoreBooks(), []);
  const midpoint = Math.ceil(books.length / 2);
  const leftBooks = books.slice(0, midpoint);
  const rightBooks = books.slice(midpoint);

  return (
    <RenderingPlazaOpenBookFrame
      className={className}
      title={DEFINING_PLAZA_LORE_BOOK_TITLE}
      subtitle={DEFINING_PLAZA_LORE_BOOK_SUBTITLE}
      onClose={onClose}
      headerLeading={
        <span className="flex size-12 shrink-0 items-center justify-center rounded-sm border border-parchment/35 bg-black/25 text-poster-gold sm:size-14">
          <Icon
            icon="mdi:book-open-page-variant"
            className="size-7 sm:size-8"
            aria-hidden
          />
        </span>
      }
      leftPage={
        <RenderingPlazaLoreBookShelfPageColumn
          books={leftBooks}
          heading="Volumes"
          listLabel={LABELING_PLAZA_LORE_BOOK_SHELF}
          onSelectBookId={onSelectBookId}
        />
      }
      rightPage={
        <RenderingPlazaLoreBookShelfPageColumn
          books={rightBooks}
          heading="Continued"
          onSelectBookId={onSelectBookId}
        />
      }
      leftPageKey="lore-shelf-left"
      rightPageKey="lore-shelf-right"
    />
  );
}
