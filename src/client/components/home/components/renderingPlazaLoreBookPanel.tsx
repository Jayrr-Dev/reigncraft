'use client';

/**
 * Open-book lore reader: contents on the left page, active entry on the right.
 *
 * @module components/home/components/renderingPlazaLoreBookPanel
 */

import { RenderingPlazaLoreBookIllustration } from '@/components/home/components/renderingPlazaLoreBookIllustration';
import { RenderingPlazaOpenBookFrame } from '@/components/home/components/renderingPlazaOpenBookFrame';
import {
  DEFINING_PLAZA_BUTTON_SFX_KIND,
  definingPlazaButtonSfxDataAttributes,
} from '@/components/home/domains/definingPlazaDefaultButtonSfxConstants';
import {
  DEFINING_PLAZA_LORE_BOOK_SEALED_TITLE,
  DEFINING_PLAZA_LORE_BOOK_SHELF_BACK_LABEL,
  LABELING_PLAZA_LORE_BOOK_CHAPTER_LIST,
  type PlazaLoreBookEntry,
} from '@/components/home/domains/definingPlazaLoreBookConstants';
import {
  DEFINING_PLAZA_OPEN_BOOK_CLOSE_BUTTON_CLASS_NAME,
  DEFINING_PLAZA_OPEN_BOOK_PAGE_INK_CLASS_NAME,
  DEFINING_PLAZA_OPEN_BOOK_PAGER_BUTTON_CLASS_NAME,
} from '@/components/home/domains/definingPlazaOpenBookUiConstants';
import { playingPlazaBookSfx } from '@/components/home/domains/playingPlazaBookSfx';
import type { PlazaLoreBookResolved } from '@/components/home/domains/resolvingPlazaLoreBookDefinition';
import { resolvingPlazaLoreBookIllustration } from '@/components/home/domains/resolvingPlazaLoreBookIllustration';
import {
  listingPlazaLoreBookPages,
  resolvingPlazaLoreBookAdjacentPage,
  resolvingPlazaLoreBookChapterFirstEntryId,
  resolvingPlazaLoreBookPageByEntryId,
  type PlazaLoreBookPage,
} from '@/components/home/domains/resolvingPlazaLoreBookNavigation';
import { Icon } from '@/components/ui/icon';
import { useEffect, useMemo, useState } from 'react';

const LORE_BOOK_CHAPTER_BUTTON_CLASS_NAME =
  'flex w-full cursor-pointer items-center gap-1.5 rounded-sm px-1.5 py-1 text-left transition hover:bg-[#6b4e2e]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6b4e2e]/35';

const LORE_BOOK_ENTRY_BUTTON_CLASS_NAME =
  'flex w-full cursor-pointer items-baseline gap-1.5 rounded-sm py-0.5 pl-6 pr-1.5 text-left text-[11px] transition hover:bg-[#6b4e2e]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6b4e2e]/35 sm:text-xs';

function checkingLoreBookEntrySealed(entry: PlazaLoreBookEntry): boolean {
  return entry.kind === 'sealed';
}

function resolvingLoreBookEntryListTitle(entry: PlazaLoreBookEntry): string {
  return checkingLoreBookEntrySealed(entry)
    ? DEFINING_PLAZA_LORE_BOOK_SEALED_TITLE
    : entry.title;
}

function RenderingPlazaLoreBookKindBadge({
  kind,
}: {
  kind: PlazaLoreBookEntry['kind'];
}): React.JSX.Element | null {
  if (kind === 'account') {
    return null;
  }

  const isSealed = kind === 'sealed';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide ${
        isSealed
          ? 'bg-red-950/70 text-red-200'
          : 'bg-[#3d2a16]/85 text-parchment/90'
      }`}
    >
      <Icon
        icon={isSealed ? 'mdi:lock' : 'game-icons:broken-tablet'}
        className="size-2.5"
        aria-hidden
      />
      {isSealed ? 'Sealed' : 'Fragment'}
    </span>
  );
}

function RenderingPlazaLoreBookSealedBody({
  entry,
}: {
  entry: PlazaLoreBookEntry;
}): React.JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-1 py-2 text-center">
      <span className="lore-book-seal flex size-14 items-center justify-center rounded-full text-parchment sm:size-16">
        <Icon
          icon={entry.icon}
          className="size-7 opacity-80 sm:size-8"
          aria-hidden
        />
      </span>
      <p className="font-display text-lg font-bold tracking-[0.28em] text-[#3d2a16] sm:text-xl">
        {DEFINING_PLAZA_LORE_BOOK_SEALED_TITLE}
      </p>
      {entry.sealNote ? (
        <p
          className={`max-w-sm text-[11px] font-medium italic leading-relaxed sm:text-xs ${DEFINING_PLAZA_OPEN_BOOK_PAGE_INK_CLASS_NAME}`}
        >
          {entry.sealNote}
        </p>
      ) : null}
    </div>
  );
}

function RenderingPlazaLoreBookEntryBody({
  entry,
}: {
  entry: PlazaLoreBookEntry;
}): React.JSX.Element {
  if (checkingLoreBookEntrySealed(entry)) {
    const sealedIllustration = resolvingPlazaLoreBookIllustration(entry.id);

    return (
      <div className="flex flex-1 flex-col gap-3">
        {sealedIllustration ? (
          <RenderingPlazaLoreBookIllustration
            illustrationId={sealedIllustration.id}
            caption={sealedIllustration.caption}
          />
        ) : null}
        <RenderingPlazaLoreBookSealedBody entry={entry} />
      </div>
    );
  }

  const isFragment = entry.kind === 'fragment';
  const illustration = resolvingPlazaLoreBookIllustration(entry.id);

  return (
    <div className="flex flex-col gap-2.5">
      {illustration ? (
        <RenderingPlazaLoreBookIllustration
          illustrationId={illustration.id}
          caption={illustration.caption}
        />
      ) : null}
      {entry.paragraphs.map((paragraph, paragraphIndex) => (
        <div key={`${entry.id}-paragraph-${paragraphIndex}`}>
          {isFragment && paragraphIndex > 0 ? (
            <div className="lore-book-torn-gap mb-2" aria-hidden />
          ) : null}
          <p
            className={`text-[11px] leading-relaxed sm:text-xs ${
              isFragment
                ? `font-medium italic ${DEFINING_PLAZA_OPEN_BOOK_PAGE_INK_CLASS_NAME}`
                : 'font-medium text-[#3d2a16]/90'
            }`}
          >
            {paragraph}
          </p>
        </div>
      ))}
      {entry.quote ? (
        <figure className="mt-0.5 border-l-2 border-[#c4a35a]/80 pl-2.5">
          <blockquote className="font-display text-xs font-bold leading-snug text-[#4a3518] sm:text-sm">
            &ldquo;{entry.quote.text}&rdquo;
          </blockquote>
          <figcaption
            className={`mt-1 text-[10px] font-medium italic sm:text-[11px] ${DEFINING_PLAZA_OPEN_BOOK_PAGE_INK_CLASS_NAME}`}
          >
            {entry.quote.attribution}
          </figcaption>
        </figure>
      ) : null}
      {entry.marginNote ? (
        <p
          className={`mt-0.5 flex items-start gap-1.5 text-[10px] font-medium italic sm:text-[11px] ${DEFINING_PLAZA_OPEN_BOOK_PAGE_INK_CLASS_NAME}`}
        >
          <Icon
            icon="mdi:feather"
            className="mt-0.5 size-3 shrink-0 text-[#a67c2a]"
            aria-hidden
          />
          {entry.marginNote}
        </p>
      ) : null}
    </div>
  );
}

/** Props for {@link RenderingPlazaLoreBookPanel}. */
export type RenderingPlazaLoreBookPanelProps = {
  book: PlazaLoreBookResolved;
  onClose?: () => void;
  onBackToShelf?: () => void;
  className?: string;
};

/**
 * One volume of the Corpus series on the shared pixel open-book frame.
 */
export function RenderingPlazaLoreBookPanel({
  book,
  onClose,
  onBackToShelf,
  className = '',
}: RenderingPlazaLoreBookPanelProps): React.JSX.Element {
  const chapters = book.chapters;
  const pages = useMemo(() => listingPlazaLoreBookPages(chapters), [chapters]);
  const [activeEntryId, setActiveEntryId] = useState<string>(
    pages[0]?.entry.id ?? ''
  );

  useEffect(() => {
    setActiveEntryId(pages[0]?.entry.id ?? '');
  }, [book.id, pages]);

  const activePage: PlazaLoreBookPage | null =
    resolvingPlazaLoreBookPageByEntryId(activeEntryId, chapters) ??
    pages[0] ??
    null;
  const previousPage = activePage
    ? resolvingPlazaLoreBookAdjacentPage(
        activePage.entry.id,
        'previous',
        chapters
      )
    : null;
  const nextPage = activePage
    ? resolvingPlazaLoreBookAdjacentPage(activePage.entry.id, 'next', chapters)
    : null;

  const turningLoreBookPage = (entryId: string): void => {
    if (entryId !== activeEntryId) {
      playingPlazaBookSfx({ actionId: 'page_turn' });
    }

    setActiveEntryId(entryId);
  };

  const openingLoreBookChapter = (chapterId: string): void => {
    const firstEntryId = resolvingPlazaLoreBookChapterFirstEntryId(
      chapterId,
      chapters
    );

    if (firstEntryId) {
      turningLoreBookPage(firstEntryId);
    }
  };

  return (
    <RenderingPlazaOpenBookFrame
      className={className}
      title={book.title}
      subtitle={book.subtitle}
      onClose={onClose}
      headerLeading={
        <div className="flex shrink-0 items-center gap-2">
          {onBackToShelf ? (
            <button
              type="button"
              onClick={onBackToShelf}
              aria-label={DEFINING_PLAZA_LORE_BOOK_SHELF_BACK_LABEL}
              title={DEFINING_PLAZA_LORE_BOOK_SHELF_BACK_LABEL}
              {...definingPlazaButtonSfxDataAttributes(
                DEFINING_PLAZA_BUTTON_SFX_KIND.none
              )}
              className={DEFINING_PLAZA_OPEN_BOOK_CLOSE_BUTTON_CLASS_NAME}
            >
              <Icon
                icon="mdi:arrow-left"
                className="size-4 sm:size-5"
                aria-hidden
              />
            </button>
          ) : null}
          <span className="flex size-12 shrink-0 items-center justify-center rounded-sm border border-parchment/35 bg-black/25 text-poster-gold sm:size-14">
            <Icon icon={book.icon} className="size-7 sm:size-8" aria-hidden />
          </span>
        </div>
      }
      leftPage={
        <nav
          aria-label={LABELING_PLAZA_LORE_BOOK_CHAPTER_LIST}
          className="flex min-h-0 flex-1 flex-col gap-1"
        >
          <p className="px-1 pb-0.5 font-display text-[10px] font-bold uppercase tracking-[0.18em] text-[#6b4e2e]/80">
            Contents
          </p>
          <p className="px-1 pb-1 font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-[#6b4e2e]/60">
            {book.volumeLabel}
          </p>
          {chapters.map((chapter) => {
            const isActiveChapter = activePage?.chapter.id === chapter.id;

            return (
              <div key={chapter.id} className="flex flex-col">
                <button
                  type="button"
                  {...definingPlazaButtonSfxDataAttributes(
                    DEFINING_PLAZA_BUTTON_SFX_KIND.none
                  )}
                  onClick={() => openingLoreBookChapter(chapter.id)}
                  aria-expanded={isActiveChapter}
                  className={`${LORE_BOOK_CHAPTER_BUTTON_CLASS_NAME} ${
                    isActiveChapter ? 'bg-[#6b4e2e]/12' : ''
                  }`}
                >
                  <span
                    className={`flex size-6 shrink-0 items-center justify-center rounded-sm border ${
                      isActiveChapter
                        ? 'border-[#c4a35a]/70 bg-[#c4a35a]/20 text-[#a67c2a]'
                        : 'border-[#6b4e2e]/25 bg-[#fff8e7]/50 text-[#4a3518]'
                    }`}
                  >
                    <Icon
                      icon={chapter.icon}
                      className="size-3.5"
                      aria-hidden
                    />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-display text-xs font-bold leading-tight text-[#3d2a16]">
                      {chapter.title}
                    </span>
                    <span
                      className={`block truncate text-[10px] font-medium italic leading-tight ${DEFINING_PLAZA_OPEN_BOOK_PAGE_INK_CLASS_NAME}`}
                    >
                      {chapter.blurb}
                    </span>
                  </span>
                </button>
                {isActiveChapter
                  ? chapter.entries.map((entry) => {
                      const isActiveEntry = activePage?.entry.id === entry.id;
                      const folioNumber =
                        pages.find((page) => page.entry.id === entry.id)
                          ?.folioNumber ?? 0;

                      return (
                        <button
                          key={entry.id}
                          type="button"
                          {...definingPlazaButtonSfxDataAttributes(
                            DEFINING_PLAZA_BUTTON_SFX_KIND.none
                          )}
                          onClick={() => turningLoreBookPage(entry.id)}
                          aria-current={isActiveEntry ? 'page' : undefined}
                          className={`${LORE_BOOK_ENTRY_BUTTON_CLASS_NAME} ${
                            isActiveEntry
                              ? 'bg-[#c4a35a]/20 font-bold text-[#3d2a16]'
                              : `font-medium ${DEFINING_PLAZA_OPEN_BOOK_PAGE_INK_CLASS_NAME}`
                          }`}
                        >
                          <span className="w-4 shrink-0 text-right font-mono text-[9px] text-[#6b4e2e]/65">
                            {folioNumber}
                          </span>
                          <span className="min-w-0 flex-1 truncate">
                            {resolvingLoreBookEntryListTitle(entry)}
                          </span>
                          {checkingLoreBookEntrySealed(entry) ? (
                            <Icon
                              icon="mdi:lock"
                              className="size-3 shrink-0 text-red-900/70"
                              aria-hidden
                            />
                          ) : null}
                        </button>
                      );
                    })
                  : null}
              </div>
            );
          })}
        </nav>
      }
      rightPage={
        activePage ? (
          <article
            aria-label={resolvingLoreBookEntryListTitle(activePage.entry)}
            className="lore-book-page-turn flex min-h-0 flex-1 flex-col gap-2"
          >
            <header className="flex items-start gap-2">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-sm border border-[#6b4e2e]/25 bg-[#fff8e7]/55 text-[#4a3518]">
                <Icon
                  icon={activePage.entry.icon}
                  className="size-4"
                  aria-hidden
                />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <h3 className="font-display text-sm font-bold leading-tight tracking-wide text-[#3d2a16] sm:text-base">
                    {resolvingLoreBookEntryListTitle(activePage.entry)}
                  </h3>
                  <RenderingPlazaLoreBookKindBadge
                    kind={activePage.entry.kind}
                  />
                </div>
                <p
                  className={`text-[10px] font-medium italic sm:text-[11px] ${DEFINING_PLAZA_OPEN_BOOK_PAGE_INK_CLASS_NAME}`}
                >
                  {activePage.entry.subtitle}
                </p>
              </div>
            </header>

            <div
              aria-hidden
              className="h-px shrink-0 bg-[linear-gradient(90deg,transparent,rgba(107,78,46,0.4),transparent)]"
            />

            <RenderingPlazaLoreBookEntryBody entry={activePage.entry} />
          </article>
        ) : null
      }
      leftPageKey={`${book.id}-toc`}
      rightPageKey={activePage?.entry.id ?? `${book.id}-empty`}
      footer={
        <footer className="flex items-center justify-center gap-3 sm:gap-4">
          <button
            type="button"
            {...definingPlazaButtonSfxDataAttributes(
              DEFINING_PLAZA_BUTTON_SFX_KIND.none
            )}
            onClick={() =>
              previousPage && turningLoreBookPage(previousPage.entry.id)
            }
            disabled={!previousPage}
            className={DEFINING_PLAZA_OPEN_BOOK_PAGER_BUTTON_CLASS_NAME}
          >
            <Icon icon="mdi:chevron-left" className="size-4" aria-hidden />
            <span className="hidden sm:inline">Prev</span>
          </button>
          <span className="font-mono text-xs font-medium text-parchment/75 sm:text-sm">
            {activePage ? `${activePage.folioNumber}/${pages.length}` : '-/-'}
          </span>
          <button
            type="button"
            {...definingPlazaButtonSfxDataAttributes(
              DEFINING_PLAZA_BUTTON_SFX_KIND.none
            )}
            onClick={() => nextPage && turningLoreBookPage(nextPage.entry.id)}
            disabled={!nextPage}
            className={DEFINING_PLAZA_OPEN_BOOK_PAGER_BUTTON_CLASS_NAME}
          >
            <span className="hidden sm:inline">Next</span>
            <Icon icon="mdi:chevron-right" className="size-4" aria-hidden />
          </button>
        </footer>
      }
    />
  );
}
