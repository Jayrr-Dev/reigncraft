/**
 * Copy and styling for the exit-to-home confirmation dialog.
 *
 * @module components/world/domains/definingWorldPlazaExitHomeConfirmDialogConstants
 */

import { DEFINING_WORLD_PLAZA_CONFIRM_DIALOG_STYLE } from '@/components/world/domains/definingWorldPlazaConfirmDialogConstants';

/** Full-viewport overlay behind the exit-home dialog. */
export const STYLING_WORLD_PLAZA_EXIT_HOME_CONFIRM_DIALOG_OVERLAY_CLASS_NAME =
  DEFINING_WORLD_PLAZA_CONFIRM_DIALOG_STYLE.overlayFixed;

/** Dialog panel shell. */
export const STYLING_WORLD_PLAZA_EXIT_HOME_CONFIRM_DIALOG_PANEL_CLASS_NAME =
  DEFINING_WORLD_PLAZA_CONFIRM_DIALOG_STYLE.panel;

/** Dialog title. */
export const LABELING_WORLD_PLAZA_EXIT_HOME_CONFIRM_DIALOG_TITLE =
  'Leave the world?' as const;

/** Dialog body copy. */
export const LABELING_WORLD_PLAZA_EXIT_HOME_CONFIRM_DIALOG_MESSAGE =
  'Are you sure you want to return to the home screen?' as const;

/** Cancel button label. */
export const LABELING_WORLD_PLAZA_EXIT_HOME_CONFIRM_DIALOG_STAY_LABEL =
  'Stay' as const;

/** Confirm button label. */
export const LABELING_WORLD_PLAZA_EXIT_HOME_CONFIRM_DIALOG_CONFIRM_LABEL =
  'Go home' as const;

/** Accessible label for the dialog region. */
export const LABELING_WORLD_PLAZA_EXIT_HOME_CONFIRM_DIALOG_ARIA_LABEL =
  'Confirm return to home screen' as const;

/** Stay button classes. */
export const STYLING_WORLD_PLAZA_EXIT_HOME_CONFIRM_DIALOG_STAY_BUTTON_CLASS_NAME =
  DEFINING_WORLD_PLAZA_CONFIRM_DIALOG_STYLE.cancelButton;

/** Go home button classes. */
export const STYLING_WORLD_PLAZA_EXIT_HOME_CONFIRM_DIALOG_CONFIRM_BUTTON_CLASS_NAME =
  DEFINING_WORLD_PLAZA_CONFIRM_DIALOG_STYLE.confirmButton;

/** Dialog body layout classes. */
export const STYLING_WORLD_PLAZA_EXIT_HOME_CONFIRM_DIALOG_BODY_CLASS_NAME =
  DEFINING_WORLD_PLAZA_CONFIRM_DIALOG_STYLE.body;

/** Dialog title typography classes. */
export const STYLING_WORLD_PLAZA_EXIT_HOME_CONFIRM_DIALOG_TITLE_CLASS_NAME =
  DEFINING_WORLD_PLAZA_CONFIRM_DIALOG_STYLE.title;

/** Dialog message typography classes. */
export const STYLING_WORLD_PLAZA_EXIT_HOME_CONFIRM_DIALOG_MESSAGE_CLASS_NAME =
  DEFINING_WORLD_PLAZA_CONFIRM_DIALOG_STYLE.message;

/** Dialog action row layout classes. */
export const STYLING_WORLD_PLAZA_EXIT_HOME_CONFIRM_DIALOG_ACTIONS_CLASS_NAME =
  DEFINING_WORLD_PLAZA_CONFIRM_DIALOG_STYLE.actions;
