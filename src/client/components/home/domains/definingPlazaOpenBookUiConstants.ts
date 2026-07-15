/**
 * Shared pixel open-book frame used by craft cookbooks and the lore Corpus.
 *
 * @module components/home/domains/definingPlazaOpenBookUiConstants
 */

/** Open-book pixel frame art. */
export const DEFINING_PLAZA_OPEN_BOOK_URL =
  '/inventory/ui/inventory-cookbook-open-book.webp' as const;

/** Native open-book art size (width / height). */
export const DEFINING_PLAZA_OPEN_BOOK_ASPECT_RATIO = 1024 / 617;

/**
 * Content boxes overlaid on the open-book art (percent of frame).
 * Tuned to clear the brown cover, spine, and corner ornaments.
 */
export const DEFINING_PLAZA_OPEN_BOOK_PAGE_LAYOUT = {
  left: {
    topPercent: 13,
    leftPercent: 7,
    widthPercent: 39,
    heightPercent: 70,
  },
  right: {
    topPercent: 13,
    leftPercent: 54,
    widthPercent: 39,
    heightPercent: 70,
  },
} as const;

/** One page side on the open-book frame. */
export type DefiningPlazaOpenBookPageSide =
  keyof typeof DEFINING_PLAZA_OPEN_BOOK_PAGE_LAYOUT;

/** Header / pager chrome shared by open-book dialogs. */
export const DEFINING_PLAZA_OPEN_BOOK_CLOSE_BUTTON_CLASS_NAME =
  'flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-sm border border-parchment/40 bg-parchment text-ink shadow-[0_2px_0_0_rgba(46,36,22,0.55)] transition hover:bg-parchment-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-parchment/60 sm:size-9';

export const DEFINING_PLAZA_OPEN_BOOK_PAGER_BUTTON_CLASS_NAME =
  'flex cursor-pointer items-center gap-1 rounded-sm border border-parchment/40 bg-parchment px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-ink shadow-[0_2px_0_0_rgba(46,36,22,0.55)] transition hover:bg-parchment-100 disabled:cursor-default disabled:opacity-35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-parchment/60';

/** Body ink on parchment pages (matches cookbook blank-page copy). */
export const DEFINING_PLAZA_OPEN_BOOK_PAGE_INK_CLASS_NAME = 'text-[#6b4e2e]';
