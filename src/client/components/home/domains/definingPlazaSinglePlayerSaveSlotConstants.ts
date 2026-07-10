import type { PlazaSaveSlotIndex } from '../../../../shared/plazaGameSession';

/** Save slots that are visible but not selectable yet. */
export const DEFINING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_TEMPORARILY_LOCKED_SLOT_INDICES =
  [2, 3] as const satisfies readonly PlazaSaveSlotIndex[];

/** Locked slot subtitle and action pill copy. */
export const LABELING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_COMING_SOON =
  'Coming soon' as const;

/** Locked save slot row shell. */
export const STYLING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_LOCKED_ROW_CLASS_NAME =
  'plaza-btn-3d plaza-pop-in flex w-full items-center gap-1 rounded-md border-2 border-ink/15 bg-ink/5 px-2 py-2 opacity-60 shadow-[0_4px_0_0_rgba(44,74,82,0.35)] [--plaza-edge:rgba(44,74,82,0.35)] sm:gap-2 sm:px-3 sm:py-3';

/** Locked save slot select area. */
export const STYLING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_LOCKED_SELECT_BUTTON_CLASS_NAME =
  'flex min-w-0 flex-1 cursor-not-allowed items-center gap-3 rounded-md px-2 py-1 text-left sm:gap-4 sm:px-3';

/** Locked save slot action pill. */
export const STYLING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_LOCKED_PILL_CLASS_NAME =
  'inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-ink/10 px-2.5 py-1.5 text-xs font-extrabold uppercase tracking-wider text-ink-soft sm:px-3.5';
