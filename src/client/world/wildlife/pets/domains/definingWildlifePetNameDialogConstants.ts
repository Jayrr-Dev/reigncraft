/**
 * Copy and parchment chrome for the one-shot companion naming dialog.
 *
 * @module components/world/wildlife/pets/domains/definingWildlifePetNameDialogConstants
 */

import { DEFINING_WORLD_PLAZA_CONFIRM_DIALOG_STYLE } from '@/components/world/domains/definingWorldPlazaConfirmDialogConstants';
import { DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE } from '@/components/world/domains/definingWorldPlazaGameplayHudStyleConstants';

/** Dialog title. */
export const LABELING_WILDLIFE_PET_NAME_DIALOG_TITLE =
  'Name your companion' as const;

/** Helper under the title. */
export const LABELING_WILDLIFE_PET_NAME_DIALOG_MESSAGE =
  'Choose carefully. You cannot rename them later.' as const;

/** Input placeholder. */
export const LABELING_WILDLIFE_PET_NAME_DIALOG_PLACEHOLDER = 'Name?' as const;

/** Confirm button. */
export const LABELING_WILDLIFE_PET_NAME_DIALOG_CONFIRM_LABEL = 'Name' as const;

/** Cancel button. */
export const LABELING_WILDLIFE_PET_NAME_DIALOG_CANCEL_LABEL = 'Cancel' as const;

/** Accessible dialog label. */
export const LABELING_WILDLIFE_PET_NAME_DIALOG_ARIA_LABEL =
  'Name your companion' as const;

/** Max characters for a companion name. */
export const DEFINING_WILDLIFE_PET_NAME_DIALOG_MAX_LENGTH = 24 as const;

/** Full-viewport overlay. */
export const STYLING_WILDLIFE_PET_NAME_DIALOG_OVERLAY_CLASS_NAME =
  DEFINING_WORLD_PLAZA_CONFIRM_DIALOG_STYLE.overlayFixed;

/** Parchment panel. */
export const STYLING_WILDLIFE_PET_NAME_DIALOG_PANEL_CLASS_NAME =
  DEFINING_WORLD_PLAZA_CONFIRM_DIALOG_STYLE.panel;

/** Body stack. */
export const STYLING_WILDLIFE_PET_NAME_DIALOG_BODY_CLASS_NAME =
  DEFINING_WORLD_PLAZA_CONFIRM_DIALOG_STYLE.body;

/** Centered species portrait above the title. */
export const STYLING_WILDLIFE_PET_NAME_DIALOG_PORTRAIT_FRAME_CLASS_NAME =
  'mx-auto mb-3 relative size-20 shrink-0 overflow-hidden rounded-md border border-poster-wood/40 bg-parchment-dark/40' as const;

/** Zoom on the naming dialog portrait (slightly looser than the modal chip). */
export const DEFINING_WILDLIFE_PET_NAME_DIALOG_PORTRAIT_ZOOM = 1.45 as const;

/** Title. */
export const STYLING_WILDLIFE_PET_NAME_DIALOG_TITLE_CLASS_NAME =
  DEFINING_WORLD_PLAZA_CONFIRM_DIALOG_STYLE.title;

/** Message. */
export const STYLING_WILDLIFE_PET_NAME_DIALOG_MESSAGE_CLASS_NAME =
  DEFINING_WORLD_PLAZA_CONFIRM_DIALOG_STYLE.message;

/** Actions row (Cancel | Name side by side). */
export const STYLING_WILDLIFE_PET_NAME_DIALOG_ACTIONS_CLASS_NAME =
  'mt-4 flex flex-row gap-2' as const;

/** Cancel button. */
export const STYLING_WILDLIFE_PET_NAME_DIALOG_CANCEL_BUTTON_CLASS_NAME =
  `${DEFINING_WORLD_PLAZA_CONFIRM_DIALOG_STYLE.cancelButton} flex-1` as const;

/** Confirm button. */
export const STYLING_WILDLIFE_PET_NAME_DIALOG_CONFIRM_BUTTON_CLASS_NAME =
  `${DEFINING_WORLD_PLAZA_CONFIRM_DIALOG_STYLE.confirmButton} flex-1` as const;

/** Name input field. */
export const STYLING_WILDLIFE_PET_NAME_DIALOG_INPUT_CLASS_NAME =
  `mt-1 w-full rounded-md border border-poster-wood/45 bg-parchment-dark/40 px-2.5 py-2 font-body text-sm text-ink outline-none placeholder:text-ink-soft/70 ${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.interactive.focusRingGold}` as const;
