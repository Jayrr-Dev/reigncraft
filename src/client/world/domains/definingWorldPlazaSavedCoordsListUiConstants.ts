/**
 * Saved-coordinates list section styling (matches claim mode plot rows).
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
  'h-5 shrink-0 rounded-sm border border-[#f4d35e]/40 bg-[#f4d35e]/10 px-1 text-[8px] font-semibold text-[#f4d35e] transition hover:bg-[#f4d35e]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4d35e]/70 disabled:cursor-not-allowed disabled:border-white/15 disabled:bg-white/5 disabled:text-white/35' as const;

/** Saved coords list track button classes when active. */
export const DEFINING_WORLD_PLAZA_SAVED_COORDS_LIST_TRACK_BUTTON_ACTIVE_CLASS_NAME =
  'h-5 shrink-0 rounded-sm border border-[#f4d35e]/70 bg-[#f4d35e]/25 px-1 text-[8px] font-semibold text-[#fff3bf] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4d35e]/70 disabled:cursor-not-allowed disabled:border-white/15 disabled:bg-white/5 disabled:text-white/35' as const;

/** Saved coords row layout classes. */
export const DEFINING_WORLD_PLAZA_SAVED_COORDS_LIST_ROW_CLASS_NAME =
  'flex min-w-0 items-center gap-1' as const;

/** Saved coords delete button classes. */
export const DEFINING_WORLD_PLAZA_SAVED_COORDS_LIST_DELETE_BUTTON_CLASS_NAME =
  'flex size-5 shrink-0 items-center justify-center rounded-sm border border-white/20 bg-white/5 text-white/70 transition hover:border-red-500/70 hover:bg-red-500/25 hover:text-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/70 disabled:cursor-not-allowed disabled:opacity-40' as const;

/** Lucide icon size inside the saved coords delete button. */
export const DEFINING_WORLD_PLAZA_SAVED_COORDS_LIST_DELETE_ICON_CLASS_NAME =
  'size-3 shrink-0' as const;

/** Accessible label for deleting one saved coordinate row. */
export const LABELING_WORLD_PLAZA_SAVED_COORDS_LIST_DELETE_BUTTON =
  'Delete saved coordinates' as const;

/** Saved coords empty state text classes. */
export const DEFINING_WORLD_PLAZA_SAVED_COORDS_LIST_EMPTY_TEXT_CLASS_NAME =
  'text-[9px] text-white/55' as const;

/** Visible track action label in the saved coords list. */
export const DEFINING_WORLD_PLAZA_SAVED_COORDS_LIST_TRACK_BUTTON_LABEL =
  'Track' as const;

/** Saved coords section header label. */
export const DEFINING_WORLD_PLAZA_SAVED_COORDS_LIST_SECTION_LABEL =
  'Saved Coords' as const;

/** Empty saved coords message. */
export const DEFINING_WORLD_PLAZA_SAVED_COORDS_LIST_EMPTY_MESSAGE =
  'No coords saved yet.' as const;

/** Save action label when all coordinate slots are full. */
export const LABELING_WORLD_PLAZA_SAVED_COORDS_SAVE_AT_CAPACITY_BUTTON =
  'Max saved (3)' as const;
