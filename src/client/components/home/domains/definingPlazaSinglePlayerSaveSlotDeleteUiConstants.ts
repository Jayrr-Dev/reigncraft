import { DEFINING_WORLD_PLAZA_CONFIRM_DIALOG_STYLE } from '@/components/world/domains/definingWorldPlazaConfirmDialogConstants';

/** Save slot row card shell. */
export const STYLING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_ROW_CLASS_NAME =
  'plaza-btn-3d plaza-pop-in flex w-full items-center gap-1 rounded-md border-2 border-poster-teal/50 bg-[linear-gradient(180deg,rgba(255,250,230,0.65)_0%,rgba(227,209,168,0.65)_100%)] px-2 py-2 shadow-[0_4px_0_0_rgba(44,74,82,0.7),0_8px_16px_rgba(20,28,26,0.2)] [--plaza-edge:rgba(44,74,82,0.7)] sm:gap-2 sm:px-3 sm:py-3';

/** Main select area inside a save slot row. */
export const STYLING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_SELECT_BUTTON_CLASS_NAME =
  'flex min-w-0 flex-1 cursor-pointer items-center gap-3 rounded-md px-2 py-1 text-left sm:gap-4 sm:px-3';

/** Slot title typography. */
export const STYLING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_TITLE_CLASS_NAME =
  'block truncate font-display text-base font-bold tracking-wide text-ink';

/** Slot subtitle typography. */
export const STYLING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_SUBTITLE_CLASS_NAME =
  'block truncate text-sm font-medium italic text-ink-soft';

/** Continue / new game pill base classes. */
export const STYLING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_ACTION_PILL_BASE_CLASS_NAME =
  'inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1.5 text-xs font-extrabold uppercase tracking-wider text-parchment sm:px-3.5';

/** Continue pill when the slot has save data. */
export const STYLING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_CONTINUE_PILL_CLASS_NAME =
  'bg-[linear-gradient(180deg,#c1592f_0%,#a2481f_100%)] shadow-[0_2px_0_0_#6d2c12]';

/** New game pill when the slot is empty. */
export const STYLING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_NEW_GAME_PILL_CLASS_NAME =
  'bg-[linear-gradient(180deg,#7a8c5c_0%,#5f7046_100%)] shadow-[0_2px_0_0_#3d4a2c]';

/** Inline delete icon button inside a save slot row. */
export const STYLING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_DELETE_BUTTON_CLASS_NAME =
  'flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-md text-ink-soft/55 transition-colors hover:bg-poster-orange/10 hover:text-poster-orange-deep disabled:cursor-not-allowed disabled:opacity-50';

/** Delete icon inside the save slot row. */
export const STYLING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_DELETE_ICON_CLASS_NAME =
  'size-5';

/** Accessible label for the save slot delete button. */
export const LABELING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_DELETE_BUTTON =
  'Delete save' as const;

/** Confirm dialog overlay. */
export const STYLING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_DELETE_CONFIRM_OVERLAY_CLASS_NAME =
  DEFINING_WORLD_PLAZA_CONFIRM_DIALOG_STYLE.overlayFixed;

/** Confirm dialog panel. */
export const STYLING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_DELETE_CONFIRM_PANEL_CLASS_NAME =
  DEFINING_WORLD_PLAZA_CONFIRM_DIALOG_STYLE.panel;

/** Confirm dialog body layout. */
export const STYLING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_DELETE_CONFIRM_BODY_CLASS_NAME =
  DEFINING_WORLD_PLAZA_CONFIRM_DIALOG_STYLE.body;

/** Confirm dialog title typography. */
export const STYLING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_DELETE_CONFIRM_TITLE_CLASS_NAME =
  DEFINING_WORLD_PLAZA_CONFIRM_DIALOG_STYLE.title;

/** Confirm dialog message typography. */
export const STYLING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_DELETE_CONFIRM_MESSAGE_CLASS_NAME =
  DEFINING_WORLD_PLAZA_CONFIRM_DIALOG_STYLE.message;

/** Confirm dialog action row. */
export const STYLING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_DELETE_CONFIRM_ACTIONS_CLASS_NAME =
  DEFINING_WORLD_PLAZA_CONFIRM_DIALOG_STYLE.actions;

/** Cancel delete button classes. */
export const STYLING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_DELETE_CONFIRM_CANCEL_BUTTON_CLASS_NAME =
  DEFINING_WORLD_PLAZA_CONFIRM_DIALOG_STYLE.cancelButton;

/** Confirm delete button classes. */
export const STYLING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_DELETE_CONFIRM_CONFIRM_BUTTON_CLASS_NAME =
  DEFINING_WORLD_PLAZA_CONFIRM_DIALOG_STYLE.confirmButton;

/** Confirm dialog accessible label. */
export const LABELING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_DELETE_CONFIRM_ARIA_LABEL =
  'Confirm save deletion' as const;

/** Confirm dialog title. */
export const LABELING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_DELETE_CONFIRM_TITLE =
  'Delete this save?' as const;

/** Confirm dialog body copy. */
export const LABELING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_DELETE_CONFIRM_MESSAGE =
  'This permanently removes your progress from this slot. You cannot undo it.' as const;

/** Cancel button label. */
export const LABELING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_DELETE_CONFIRM_CANCEL_LABEL =
  'Keep save' as const;

/** Confirm button label. */
export const LABELING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_DELETE_CONFIRM_CONFIRM_LABEL =
  'Delete save' as const;
