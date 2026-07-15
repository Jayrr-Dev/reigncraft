'use client';

/**
 * Library shelf of Corpus volumes: click a cover tome to open that book.
 * Locked volumes render as black silhouettes until their unlock event fires.
 *
 * @module components/home/components/renderingPlazaLoreBookShelf
 */

import { RenderingPlazaLoreBookCoverGlyph } from '@/components/home/components/renderingPlazaLoreBookCoverGlyph';
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
  DEFINING_PLAZA_LORE_BOOK_LOCKED_TITLE,
  resolvingPlazaLoreBookUnlockDefinition,
} from '@/components/home/domains/definingPlazaLoreBookUnlockConstants';
import { DEFINING_PLAZA_OPEN_BOOK_CLOSE_BUTTON_CLASS_NAME } from '@/components/home/domains/definingPlazaOpenBookUiConstants';
import {
  listingPlazaLoreBooks,
  type PlazaLoreBookResolved,
} from '@/components/home/domains/resolvingPlazaLoreBookDefinition';
import { Icon } from '@/components/ui/icon';
import {
  gettingWorldPlazaLoreBookDiscoverySnapshot,
  subscribingWorldPlazaLoreBookDiscovery,
} from '@/components/world/domains/managingWorldPlazaLoreBookDiscoveryStore';
import { useMemo, useSyncExternalStore } from 'react';

function RenderingPlazaLoreBookLibraryVolume({
  book,
  isUnlocked,
  onSelectBookId,
}: {
  readonly book: PlazaLoreBookResolved;
  readonly isUnlocked: boolean;
  readonly onSelectBookId: (bookId: string) => void;
}): React.JSX.Element {
  const unlockDefinition = resolvingPlazaLoreBookUnlockDefinition(book.id);
  const lockedHint =
    unlockDefinition?.lockedHint ?? 'This volume is still sealed.';

  if (!isUnlocked) {
    return (
      <li className="min-w-0">
        <div
          data-theme={book.themeId}
          aria-label={`${book.volumeLabel}: locked`}
          className="lore-book-library-volume lore-book-library-volume--locked flex w-full flex-col items-center gap-2 rounded-md px-1.5 py-2 text-center"
        >
          <span className="lore-book-library-volume__cover relative flex items-end justify-center">
            <RenderingPlazaLoreBookCoverGlyph
              bookId={book.id}
              variant="silhouette"
              className="size-16 opacity-80 drop-shadow-[0_6px_0_rgba(0,0,0,0.45)] sm:size-20 md:size-24"
            />
          </span>
          <span className="min-w-0 px-0.5">
            <span className="block font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-parchment/40 sm:text-[10px]">
              {book.volumeLabel}
            </span>
            <span className="mt-0.5 block font-display text-xs font-bold leading-tight tracking-[0.22em] text-parchment/45 sm:text-sm">
              {DEFINING_PLAZA_LORE_BOOK_LOCKED_TITLE}
            </span>
            <span className="mt-1 block text-[10px] font-medium italic leading-snug text-parchment/40 sm:text-[11px]">
              {lockedHint}
            </span>
          </span>
        </div>
      </li>
    );
  }

  return (
    <li className="min-w-0">
      <button
        type="button"
        {...definingPlazaButtonSfxDataAttributes(
          DEFINING_PLAZA_BUTTON_SFX_KIND.none
        )}
        onClick={() => onSelectBookId(book.id)}
        data-theme={book.themeId}
        aria-label={`${book.volumeLabel}: ${book.title}`}
        className="lore-book-library-volume group flex w-full cursor-pointer flex-col items-center gap-2 rounded-md px-1.5 py-2 text-center transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-poster-gold/50"
      >
        <span className="lore-book-library-volume__cover relative flex items-end justify-center">
          <RenderingPlazaLoreBookCoverGlyph
            bookId={book.id}
            className="size-16 drop-shadow-[0_6px_0_rgba(0,0,0,0.45)] transition duration-150 group-hover:-translate-y-1 group-hover:drop-shadow-[0_10px_0_rgba(0,0,0,0.4)] sm:size-20 md:size-24"
          />
        </span>
        <span className="min-w-0 px-0.5">
          <span className="block font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-parchment/55 sm:text-[10px]">
            {book.volumeLabel}
          </span>
          <span className="mt-0.5 block font-display text-xs font-bold leading-tight tracking-wide text-parchment sm:text-sm">
            {book.title}
          </span>
          <span className="mt-1 block text-[10px] font-medium italic leading-snug text-parchment/60 sm:text-[11px]">
            {book.blurb}
          </span>
        </span>
      </button>
    </li>
  );
}

/** Props for {@link RenderingPlazaLoreBookShelf}. */
export type RenderingPlazaLoreBookShelfProps = {
  onSelectBookId: (bookId: string) => void;
  onClose?: () => void;
  className?: string;
};

/**
 * Library board: six cover tomes on a wooden shelf.
 */
export function RenderingPlazaLoreBookShelf({
  onSelectBookId,
  onClose,
  className = '',
}: RenderingPlazaLoreBookShelfProps): React.JSX.Element {
  const books = useMemo(() => listingPlazaLoreBooks(), []);
  const unlockedBookIds = useSyncExternalStore(
    subscribingWorldPlazaLoreBookDiscovery,
    gettingWorldPlazaLoreBookDiscoverySnapshot,
    () => []
  );
  const unlockedBookIdSet = useMemo(
    () => new Set(unlockedBookIds),
    [unlockedBookIds]
  );

  return (
    <div
      className={`lore-book-library plaza-pop-in flex max-h-[calc(100dvh-3rem)] w-full max-w-[min(94vw,52rem)] flex-col gap-3 overflow-hidden font-body sm:gap-4 ${className}`.trim()}
    >
      <header className="flex w-full items-center gap-3 px-1 sm:px-2">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <RenderingPlazaLoreBookCoverGlyph
            bookId="book-i-lands"
            className="size-12 sm:size-14"
          />
          <div className="min-w-0">
            <h2 className="font-display text-base font-bold uppercase leading-tight tracking-wide text-parchment sm:text-lg md:text-xl">
              {DEFINING_PLAZA_LORE_BOOK_TITLE}
            </h2>
            <p className="mt-1 text-xs font-medium italic leading-snug text-parchment/70 sm:text-sm">
              {DEFINING_PLAZA_LORE_BOOK_SUBTITLE}
            </p>
          </div>
        </div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            {...definingPlazaButtonSfxDataAttributes(
              DEFINING_PLAZA_BUTTON_SFX_KIND.none
            )}
            className={DEFINING_PLAZA_OPEN_BOOK_CLOSE_BUTTON_CLASS_NAME}
          >
            <Icon icon="mdi:close" className="size-4 sm:size-5" aria-hidden />
          </button>
        ) : null}
      </header>

      <div className="lore-book-library__board relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-md">
        <p className="px-4 pt-3 font-display text-[11px] font-bold uppercase tracking-[0.22em] text-parchment/50 sm:px-5">
          Library
        </p>
        <ul
          aria-label={LABELING_PLAZA_LORE_BOOK_SHELF}
          className="relative z-10 grid min-h-0 flex-1 grid-cols-2 gap-x-2 gap-y-3 overflow-y-auto px-3 pb-10 pt-4 sm:grid-cols-3 sm:gap-x-4 sm:px-5 sm:pb-12 md:grid-cols-6 md:gap-x-2"
        >
          {books.map((book) => (
            <RenderingPlazaLoreBookLibraryVolume
              key={book.id}
              book={book}
              isUnlocked={unlockedBookIdSet.has(book.id)}
              onSelectBookId={onSelectBookId}
            />
          ))}
        </ul>
        <div
          className="lore-book-library__ledge pointer-events-none absolute inset-x-0 bottom-0 h-8 sm:h-10"
          aria-hidden
        />
      </div>
    </div>
  );
}
