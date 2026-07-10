'use client';

/**
 * Book-styled lore reader: chapter contents on the left page, the active
 * entry on the right, with page-turn transitions and ambient candlelight.
 *
 * @module components/home/components/renderingPlazaLoreBookPanel
 */

import { RenderingPlazaLoreBookIllustration } from '@/components/home/components/renderingPlazaLoreBookIllustration';
import {
  DEFINING_PLAZA_LORE_BOOK_SEALED_TITLE,
  DEFINING_PLAZA_LORE_BOOK_SUBTITLE,
  DEFINING_PLAZA_LORE_BOOK_TITLE,
  LABELING_PLAZA_LORE_BOOK_CHAPTER_LIST,
  type PlazaLoreBookEntry,
} from '@/components/home/domains/definingPlazaLoreBookConstants';
import { playingPlazaBookSfx } from '@/components/home/domains/playingPlazaBookSfx';
import { resolvingPlazaLoreBookIllustration } from '@/components/home/domains/resolvingPlazaLoreBookIllustration';
import {
  listingPlazaLoreBookPages,
  resolvingPlazaLoreBookAdjacentPage,
  resolvingPlazaLoreBookChapterFirstEntryId,
  resolvingPlazaLoreBookPageByEntryId,
  type PlazaLoreBookPage,
} from '@/components/home/domains/resolvingPlazaLoreBookNavigation';
import { Icon } from '@/components/ui/icon';
import { useMemo, useState } from 'react';

const LORE_BOOK_HEADER_BUTTON_CLASS_NAME =
  'plaza-btn-3d flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-md border-2 border-poster-gold/60 bg-[linear-gradient(180deg,#2c4a52_0%,#223a42_100%)] text-parchment shadow-[0_4px_0_0_#14252b] [--plaza-edge:#14252b]';

const LORE_BOOK_CHAPTER_BUTTON_CLASS_NAME =
  'flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-left transition hover:bg-parchment/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-poster-teal/40';

const LORE_BOOK_ENTRY_BUTTON_CLASS_NAME =
  'flex w-full cursor-pointer items-baseline gap-2 rounded-sm py-1 pl-8 pr-2 text-left text-sm transition hover:bg-parchment/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-poster-teal/40';

const LORE_BOOK_PAGER_BUTTON_CLASS_NAME =
  'flex cursor-pointer items-center gap-1 rounded-sm border border-poster-teal/25 bg-parchment/50 px-2 py-1 text-xs font-bold uppercase tracking-wide text-poster-teal-deep transition hover:bg-parchment/80 disabled:cursor-default disabled:opacity-35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-poster-teal/40';

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
      className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide ${
        isSealed ? 'bg-red-950/70 text-red-200' : 'bg-ink/80 text-parchment/90'
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
    <div className="flex flex-col items-center justify-center gap-4 px-2 py-4 text-center">
      <span className="lore-book-seal flex size-20 items-center justify-center rounded-full text-parchment">
        <Icon icon={entry.icon} className="size-9 opacity-80" aria-hidden />
      </span>
      <p className="font-display text-2xl font-bold tracking-[0.3em] text-ink">
        {DEFINING_PLAZA_LORE_BOOK_SEALED_TITLE}
      </p>
      {entry.sealNote ? (
        <p className="max-w-sm text-sm font-medium italic leading-relaxed text-ink-soft">
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
      <div className="flex flex-1 flex-col gap-4">
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
    <div className="flex flex-col gap-3">
      {illustration ? (
        <RenderingPlazaLoreBookIllustration
          illustrationId={illustration.id}
          caption={illustration.caption}
        />
      ) : null}
      {entry.paragraphs.map((paragraph, paragraphIndex) => (
        <div key={`${entry.id}-paragraph-${paragraphIndex}`}>
          {isFragment && paragraphIndex > 0 ? (
            <div className="lore-book-torn-gap mb-3" aria-hidden />
          ) : null}
          <p
            className={`text-sm leading-relaxed sm:text-[15px] ${
              isFragment
                ? 'font-medium italic text-ink-soft'
                : 'font-medium text-ink/90'
            }`}
          >
            {paragraph}
          </p>
        </div>
      ))}
      {entry.quote ? (
        <figure className="mt-1 border-l-2 border-poster-gold/70 pl-3">
          <blockquote className="font-display text-sm font-bold leading-snug text-poster-teal-deep">
            &ldquo;{entry.quote.text}&rdquo;
          </blockquote>
          <figcaption className="mt-1 text-xs font-medium italic text-ink-soft">
            {entry.quote.attribution}
          </figcaption>
        </figure>
      ) : null}
      {entry.marginNote ? (
        <p className="mt-1 flex items-start gap-1.5 text-xs font-medium italic text-ink-soft/90">
          <Icon
            icon="mdi:feather"
            className="mt-0.5 size-3 shrink-0 text-poster-amber"
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
  onClose?: () => void;
  className?: string;
};

/**
 * The Codex Lore book: chapters as a table of contents, entries as pages.
 */
export function RenderingPlazaLoreBookPanel({
  onClose,
  className = '',
}: RenderingPlazaLoreBookPanelProps): React.JSX.Element {
  const pages = useMemo(() => listingPlazaLoreBookPages(), []);
  const [activeEntryId, setActiveEntryId] = useState<string>(
    pages[0]?.entry.id ?? ''
  );
  const [isContentsOpenOnMobile, setIsContentsOpenOnMobile] = useState(true);

  const activePage: PlazaLoreBookPage | null =
    resolvingPlazaLoreBookPageByEntryId(activeEntryId) ?? pages[0] ?? null;
  const previousPage = activePage
    ? resolvingPlazaLoreBookAdjacentPage(activePage.entry.id, 'previous')
    : null;
  const nextPage = activePage
    ? resolvingPlazaLoreBookAdjacentPage(activePage.entry.id, 'next')
    : null;

  const turningLoreBookPage = (entryId: string): void => {
    if (entryId !== activeEntryId) {
      playingPlazaBookSfx({ actionId: 'page_turn' });
    }

    setActiveEntryId(entryId);
    setIsContentsOpenOnMobile(false);
  };

  const openingLoreBookChapter = (chapterId: string): void => {
    const firstEntryId = resolvingPlazaLoreBookChapterFirstEntryId(chapterId);

    if (firstEntryId) {
      turningLoreBookPage(firstEntryId);
    }
  };

  const chapters = useMemo(
    () => [...new Set(pages.map((page) => page.chapter))],
    [pages]
  );

  return (
    <div
      className={`lore-book-cover plaza-pop-in flex h-[min(88dvh,42rem)] w-full max-w-4xl flex-col gap-3 overflow-hidden rounded-lg p-3 font-body sm:p-4 ${className}`.trim()}
    >
      <span
        className="lore-book-mote left-[12%] top-[18%] size-1"
        aria-hidden
      />
      <span
        className="lore-book-mote left-[78%] top-[12%] size-1.5 [animation-delay:2.4s]"
        aria-hidden
      />
      <span
        className="lore-book-mote left-[46%] top-[8%] size-1 [animation-delay:5.1s]"
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

      <div className="relative flex min-h-0 flex-1 gap-1.5 overflow-hidden">
        <nav
          aria-label={LABELING_PLAZA_LORE_BOOK_CHAPTER_LIST}
          className={`lore-book-page lore-book-page--left h-full min-h-0 flex-col gap-1 overflow-y-auto rounded-l-md rounded-r-sm p-3 sm:flex sm:w-64 sm:shrink-0 ${
            isContentsOpenOnMobile ? 'flex flex-1' : 'hidden'
          }`}
        >
          <p className="px-2 pb-1 font-display text-[11px] font-bold uppercase tracking-[0.2em] text-ink-soft">
            Contents
          </p>
          {chapters.map((chapter) => {
            const isActiveChapter = activePage?.chapter.id === chapter.id;

            return (
              <div key={chapter.id} className="flex flex-col">
                <button
                  type="button"
                  onClick={() => openingLoreBookChapter(chapter.id)}
                  aria-expanded={isActiveChapter}
                  className={`${LORE_BOOK_CHAPTER_BUTTON_CLASS_NAME} ${
                    isActiveChapter ? 'bg-parchment/70' : ''
                  }`}
                >
                  <span
                    className={`flex size-7 shrink-0 items-center justify-center rounded-sm border ${
                      isActiveChapter
                        ? 'border-poster-gold/70 bg-poster-gold/20 text-poster-amber'
                        : 'border-poster-teal/25 bg-parchment/40 text-poster-teal-deep'
                    }`}
                  >
                    <Icon icon={chapter.icon} className="size-4" aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-display text-sm font-bold leading-tight text-ink">
                      {chapter.title}
                    </span>
                    <span className="block truncate text-[11px] font-medium italic leading-tight text-ink-soft">
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
                          onClick={() => turningLoreBookPage(entry.id)}
                          aria-current={isActiveEntry ? 'page' : undefined}
                          className={`${LORE_BOOK_ENTRY_BUTTON_CLASS_NAME} ${
                            isActiveEntry
                              ? 'bg-poster-gold/15 font-bold text-ink'
                              : 'font-medium text-ink-soft'
                          }`}
                        >
                          <span className="w-5 shrink-0 text-right font-mono text-[10px] text-ink-soft/70">
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

        {activePage ? (
          <article
            aria-label={resolvingLoreBookEntryListTitle(activePage.entry)}
            className={`lore-book-page lore-book-page--right h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-r-md rounded-l-sm sm:flex ${
              isContentsOpenOnMobile ? 'hidden' : 'flex'
            }`}
          >
            <div
              key={activePage.entry.id}
              className="lore-book-page-turn flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4 sm:p-5"
            >
              <header className="flex items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-sm border border-poster-teal/30 bg-parchment/50 text-poster-teal-deep">
                  <Icon
                    icon={activePage.entry.icon}
                    className="size-5"
                    aria-hidden
                  />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-lg font-bold leading-tight tracking-wide text-ink">
                      {resolvingLoreBookEntryListTitle(activePage.entry)}
                    </h3>
                    <RenderingPlazaLoreBookKindBadge
                      kind={activePage.entry.kind}
                    />
                  </div>
                  <p className="text-xs font-medium italic text-ink-soft">
                    {activePage.entry.subtitle}
                  </p>
                </div>
              </header>

              <div
                aria-hidden
                className="h-px shrink-0 bg-[linear-gradient(90deg,transparent,rgba(44,74,82,0.45),transparent)]"
              />

              <RenderingPlazaLoreBookEntryBody entry={activePage.entry} />
            </div>

            <footer className="flex shrink-0 items-center justify-between gap-2 border-t border-poster-teal/15 px-3 py-2">
              <button
                type="button"
                onClick={() =>
                  previousPage && turningLoreBookPage(previousPage.entry.id)
                }
                disabled={!previousPage}
                className={LORE_BOOK_PAGER_BUTTON_CLASS_NAME}
              >
                <Icon icon="mdi:chevron-left" className="size-4" aria-hidden />
                <span className="hidden sm:inline">Previous</span>
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsContentsOpenOnMobile(true)}
                  className={`${LORE_BOOK_PAGER_BUTTON_CLASS_NAME} sm:hidden`}
                >
                  <Icon
                    icon="mdi:book-open-page-variant"
                    className="size-4"
                    aria-hidden
                  />
                  Contents
                </button>
                <span className="font-mono text-[11px] font-medium text-ink-soft">
                  Page {activePage.folioNumber} of {pages.length}
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  nextPage && turningLoreBookPage(nextPage.entry.id)
                }
                disabled={!nextPage}
                className={LORE_BOOK_PAGER_BUTTON_CLASS_NAME}
              >
                <span className="hidden sm:inline">Next</span>
                <Icon icon="mdi:chevron-right" className="size-4" aria-hidden />
              </button>
            </footer>
          </article>
        ) : null}
      </div>
    </div>
  );
}
