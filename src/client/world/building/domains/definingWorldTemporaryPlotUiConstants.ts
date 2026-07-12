/**
 * Temporary tiles section styling for claim mode.
 *
 * @module components/world/building/domains/definingWorldTemporaryPlotUiConstants
 */

/** Temporary tiles section label. */
export const DEFINING_WORLD_TEMPORARY_PLOT_LIST_SECTION_LABEL =
  'Temporary Tiles' as const;

/** Temporary tiles empty state message. */
export const DEFINING_WORLD_TEMPORARY_PLOT_LIST_EMPTY_MESSAGE =
  'No temporary tiles yet. Use Temp Claim on the map.' as const;

/** Temporary tiles empty state text classes. */
export const DEFINING_WORLD_TEMPORARY_PLOT_LIST_EMPTY_TEXT_CLASS_NAME =
  'text-[9px] text-white/55' as const;

/** Temporary tile coordinate badge classes. */
export const DEFINING_WORLD_TEMPORARY_PLOT_LIST_BADGE_CLASS_NAME =
  'h-5 min-w-0 flex-[1_1_calc((100%-0.5rem)/2)] max-w-full shrink-0 justify-center truncate rounded-sm border border-purple-700/45 bg-purple-600/20 px-0.5 text-[9px] font-medium tabular-nums text-purple-100' as const;

/** Temporary tile row layout classes. */
export const DEFINING_WORLD_TEMPORARY_PLOT_LIST_ROW_CLASS_NAME =
  'flex min-w-0 items-center gap-1' as const;

/** Temporary tile delete button classes. */
export const DEFINING_WORLD_TEMPORARY_PLOT_LIST_DELETE_BUTTON_CLASS_NAME =
  'flex size-5 shrink-0 items-center justify-center rounded-sm border border-white/20 bg-white/5 text-white/70 transition hover:border-red-500/70 hover:bg-red-500/25 hover:text-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/70 disabled:cursor-not-allowed disabled:opacity-40' as const;

/** Lucide icon size inside the temporary tile delete button. */
export const DEFINING_WORLD_TEMPORARY_PLOT_LIST_DELETE_ICON_CLASS_NAME =
  'size-3 shrink-0' as const;

/** Accessible label for deleting one temporary tile row. */
export const LABELING_WORLD_TEMPORARY_PLOT_LIST_DELETE_BUTTON =
  'Remove temporary tile' as const;

/** Claim popover temporary claim action label. */
export const LABELING_WORLD_TEMPORARY_PLOT_CLAIM_TILE_POPOVER_BUTTON =
  'Temp Claim' as const;
