import { DEFINING_WORLD_PLAZA_RANDOM_ANIMAL_SAVE_SLOT_INDEX } from '@/components/world/domains/definingWorldPlazaRandomAnimalLoadConstants';
import type { PlazaSaveSlotIndex } from '../../../../shared/plazaGameSession';

/** Save slots that are visible but not selectable yet. */
export const DEFINING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_TEMPORARILY_LOCKED_SLOT_INDICES =
  [3] as const satisfies readonly PlazaSaveSlotIndex[];

/** Save slot that boots the Random Animal load profile. */
export const DEFINING_PLAZA_SINGLE_PLAYER_RANDOM_ANIMAL_SAVE_SLOT_INDEX =
  DEFINING_WORLD_PLAZA_RANDOM_ANIMAL_SAVE_SLOT_INDEX;

/** Locked slot subtitle and action pill copy. */
export const LABELING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_COMING_SOON =
  'Coming soon' as const;

/** Save-slot picker toggle: skip onboarding coachmarks for this session preference. */
export const LABELING_PLAZA_SINGLE_PLAYER_DISABLE_TUTORIAL_TOGGLE =
  'Disable tutorial' as const;

/** Row wrapping the disable-tutorial switch above the first save slot. */
export const STYLING_PLAZA_SINGLE_PLAYER_DISABLE_TUTORIAL_ROW_CLASS_NAME =
  'flex cursor-pointer items-center justify-between gap-3 text-sm font-semibold text-ink' as const;

/** Visual track for the disable-tutorial switch. */
export const STYLING_PLAZA_SINGLE_PLAYER_DISABLE_TUTORIAL_SWITCH_TRACK_CLASS_NAME =
  'relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border-2 border-poster-teal/40 bg-ink/10 transition-colors has-[:checked]:border-poster-orange/70 has-[:checked]:bg-[linear-gradient(180deg,#e8a05c_0%,#c47a3a_100%)]' as const;

/** Hidden native checkbox driving the switch track. */
export const STYLING_PLAZA_SINGLE_PLAYER_DISABLE_TUTORIAL_SWITCH_INPUT_CLASS_NAME =
  'peer sr-only' as const;

/** Thumb knob for the disable-tutorial switch. */
export const STYLING_PLAZA_SINGLE_PLAYER_DISABLE_TUTORIAL_SWITCH_THUMB_CLASS_NAME =
  'pointer-events-none absolute left-0.5 size-5 rounded-full bg-parchment shadow-[0_2px_0_0_rgba(20,37,43,0.35)] transition-transform peer-checked:translate-x-5 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-poster-gold' as const;

/** Locked save slot row shell. */
export const STYLING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_LOCKED_ROW_CLASS_NAME =
  'plaza-btn-3d plaza-pop-in flex w-full items-center gap-1 rounded-md border-2 border-ink/15 bg-ink/5 px-2 py-2 opacity-60 shadow-[0_4px_0_0_rgba(44,74,82,0.35)] [--plaza-edge:rgba(44,74,82,0.35)] sm:gap-2 sm:px-3 sm:py-3';

/** Locked save slot select area. */
export const STYLING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_LOCKED_SELECT_BUTTON_CLASS_NAME =
  'flex min-w-0 flex-1 cursor-not-allowed items-center gap-3 rounded-md px-2 py-1 text-left sm:gap-4 sm:px-3';

/** Locked save slot action pill. */
export const STYLING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_LOCKED_PILL_CLASS_NAME =
  'inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-ink/10 px-2.5 py-1.5 text-xs font-extrabold uppercase tracking-wider text-ink-soft sm:px-3.5';
