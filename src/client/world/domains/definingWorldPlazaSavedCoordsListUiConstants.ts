/**
 * Saved-coordinates list section styling (parchment claim-tool chrome).
 *
 * @module components/world/domains/definingWorldPlazaSavedCoordsListUiConstants
 */

import { DEFINING_REIGNCRAFT_BADGE_SEMANTIC_PRESETS } from '@/components/ui/domains/definingReigncraftBadgeConstants';
import { resolvingReigncraftTextBadgeShellClassName } from '@/components/ui/domains/resolvingReigncraftBadgeClassNames';

/** Saved coords coordinate badge classes. */
export const DEFINING_WORLD_PLAZA_SAVED_COORDS_LIST_BADGE_CLASS_NAME =
  `h-5 min-w-0 flex-[1_1_calc((100%-0.5rem)/2)] max-w-full shrink-0 justify-center truncate rounded-sm px-0.5 text-[9px] font-medium tabular-nums ${resolvingReigncraftTextBadgeShellClassName(DEFINING_REIGNCRAFT_BADGE_SEMANTIC_PRESETS.savedCoordinate)}` as const;

/** Saved coords list track button classes when inactive. */
export const DEFINING_WORLD_PLAZA_SAVED_COORDS_LIST_TRACK_BUTTON_CLASS_NAME =
  'h-5 shrink-0 rounded-sm border border-poster-wood/45 bg-parchment-dark/35 px-1 text-[8px] font-semibold uppercase tracking-[0.04em] text-ink transition hover:bg-parchment-dark/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-poster-gold/70 disabled:cursor-not-allowed disabled:border-poster-wood/25 disabled:bg-parchment-dark/25 disabled:text-ink-soft/45' as const;

/** Saved coords list track button classes when active. */
export const DEFINING_WORLD_PLAZA_SAVED_COORDS_LIST_TRACK_BUTTON_ACTIVE_CLASS_NAME =
  'h-5 shrink-0 rounded-sm border border-poster-gold/55 bg-[linear-gradient(180deg,#c1592f_0%,#a2481f_100%)] px-1 text-[8px] font-semibold uppercase tracking-[0.04em] text-parchment shadow-[0_1px_0_0_#6d2c12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-poster-gold/70 disabled:cursor-not-allowed disabled:border-poster-wood/25 disabled:bg-parchment-dark/25 disabled:text-ink-soft/45 disabled:shadow-none' as const;

/** Saved coords row layout classes. */
export const DEFINING_WORLD_PLAZA_SAVED_COORDS_LIST_ROW_CLASS_NAME =
  'flex min-w-0 items-center gap-1' as const;

/** Saved coords delete button classes. */
export const DEFINING_WORLD_PLAZA_SAVED_COORDS_LIST_DELETE_BUTTON_CLASS_NAME =
  'flex size-5 shrink-0 items-center justify-center rounded-sm border border-poster-wood/50 bg-parchment-dark/30 text-ink-soft transition hover:border-red-700/55 hover:bg-red-700/15 hover:text-red-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50 disabled:cursor-not-allowed disabled:opacity-40' as const;

/** Lucide icon size inside the saved coords delete button. */
export const DEFINING_WORLD_PLAZA_SAVED_COORDS_LIST_DELETE_ICON_CLASS_NAME =
  'size-3 shrink-0' as const;

/** Accessible label for deleting one saved coordinate row. */
export const LABELING_WORLD_PLAZA_SAVED_COORDS_LIST_DELETE_BUTTON =
  'Delete saved coordinates' as const;

/** Saved coords section label on parchment chrome. */
export const DEFINING_WORLD_PLAZA_SAVED_COORDS_LIST_SECTION_LABEL_CLASS_NAME =
  'text-[8px] font-semibold uppercase tracking-[0.14em] text-ink-soft' as const;

/** Saved coords empty state text classes. */
export const DEFINING_WORLD_PLAZA_SAVED_COORDS_LIST_EMPTY_TEXT_CLASS_NAME =
  'text-[9px] text-ink-soft' as const;

/** Visible track action label in the saved coords list. */
export const DEFINING_WORLD_PLAZA_SAVED_COORDS_LIST_TRACK_BUTTON_LABEL =
  'Track' as const;

/** Saved coords section header label. */
export const DEFINING_WORLD_PLAZA_SAVED_COORDS_LIST_SECTION_LABEL =
  'Saved Coords' as const;

/** Empty saved coords message. */
export const DEFINING_WORLD_PLAZA_SAVED_COORDS_LIST_EMPTY_MESSAGE =
  'No coords saved yet.' as const;

/** Save coords primary button on parchment chrome. */
export const DEFINING_WORLD_PLAZA_SAVED_COORDS_LIST_SAVE_BUTTON_CLASS_NAME =
  'w-full rounded-sm border border-poster-teal/45 bg-[linear-gradient(180deg,#2c4a52_0%,#223a42_100%)] px-1.5 py-1 text-[9px] font-bold uppercase tracking-[0.04em] text-parchment shadow-[0_1px_0_0_rgba(20,28,26,0.5)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:border-poster-wood/25 disabled:bg-parchment-dark/40 disabled:text-ink-soft/50 disabled:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-poster-gold/70' as const;

/** Save action label when all coordinate slots are full. */
export const LABELING_WORLD_PLAZA_SAVED_COORDS_SAVE_AT_CAPACITY_BUTTON =
  'Max saved (3)' as const;

/** Save coords button label before placement is armed. */
export const LABELING_WORLD_PLAZA_SAVED_COORDS_SAVE_BUTTON =
  'Save Coords' as const;

/** Save coords button label while placement is armed. */
export const LABELING_WORLD_PLAZA_SAVED_COORDS_CANCEL_PLACEMENT =
  'Cancel' as const;

/** Save coords button label while persisting. */
export const LABELING_WORLD_PLAZA_SAVED_COORDS_SAVING_BUTTON =
  'Saving...' as const;
