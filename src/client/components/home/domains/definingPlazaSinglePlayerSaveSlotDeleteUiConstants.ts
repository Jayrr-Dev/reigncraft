import { DEFINING_WORLD_PLAZA_CONFIRM_DIALOG_STYLE } from '@/components/world/domains/definingWorldPlazaConfirmDialogConstants';

/** Delete button on a populated save slot row. */
export const STYLING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_DELETE_BUTTON_CLASS_NAME =
  'plaza-btn-3d flex w-11 shrink-0 cursor-pointer items-center justify-center self-stretch rounded-md border-2 border-poster-orange/50 bg-[linear-gradient(180deg,#c1592f_0%,#a2481f_100%)] text-parchment shadow-[0_4px_0_0_#6d2c12] [--plaza-edge:#6d2c12] disabled:cursor-not-allowed disabled:opacity-50';

/** Delete icon inside the save slot delete button. */
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
