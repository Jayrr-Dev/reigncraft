/**
 * Copy and styling for the exit-to-home confirmation dialog.
 *
 * @module components/world/domains/definingWorldPlazaExitHomeConfirmDialogConstants
 */

/** Full-viewport overlay behind the exit-home dialog. */
export const STYLING_WORLD_PLAZA_EXIT_HOME_CONFIRM_DIALOG_OVERLAY_CLASS_NAME =
  'pointer-events-auto fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4' as const;

/** Dialog panel shell. */
export const STYLING_WORLD_PLAZA_EXIT_HOME_CONFIRM_DIALOG_PANEL_CLASS_NAME =
  'w-full max-w-xs rounded-md border border-white/20 bg-[#0d1b2a]/95 p-4 shadow-lg backdrop-blur-sm' as const;

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
  'w-full rounded border border-white/20 px-2 py-1.5 text-[10px] font-semibold text-white/90 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4d35e]/70' as const;

/** Go home button classes. */
export const STYLING_WORLD_PLAZA_EXIT_HOME_CONFIRM_DIALOG_CONFIRM_BUTTON_CLASS_NAME =
  'w-full rounded bg-amber-600/90 px-2 py-1.5 text-[10px] font-semibold text-white transition hover:bg-amber-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/70' as const;
