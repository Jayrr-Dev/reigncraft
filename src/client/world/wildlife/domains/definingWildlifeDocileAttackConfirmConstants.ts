/**
 * Copy and chrome for the docile-animal Betray? confirmation dialog.
 *
 * @module components/world/wildlife/domains/definingWildlifeDocileAttackConfirmConstants
 */

import { DEFINING_WORLD_PLAZA_CONFIRM_DIALOG_STYLE } from '@/components/world/domains/definingWorldPlazaConfirmDialogConstants';

/** Dialog title (confirm phase). */
export const LABELING_WILDLIFE_DOCILE_ATTACK_CONFIRM_TITLE = 'Betray?' as const;

/** Dialog title while the betrayal windup runs. */
export const LABELING_WILDLIFE_DOCILE_ATTACK_CONFIRM_BETRAYING_TITLE =
  'Betraying....' as const;

/** Dialog body. `{name}` is replaced with the species display name. */
export const LABELING_WILDLIFE_DOCILE_ATTACK_CONFIRM_MESSAGE =
  'This {name} is friendly. Betray it anyway?' as const;

/** Confirm button. */
export const LABELING_WILDLIFE_DOCILE_ATTACK_CONFIRM_ATTACK_LABEL =
  'Betray' as const;

/** Cancel button. */
export const LABELING_WILDLIFE_DOCILE_ATTACK_CONFIRM_CANCEL_LABEL =
  'Cancel' as const;

/** Accessible dialog label (confirm phase). */
export const LABELING_WILDLIFE_DOCILE_ATTACK_CONFIRM_ARIA_LABEL =
  'Confirm betrayal of friendly animal' as const;

/** Accessible dialog label (windup phase). */
export const LABELING_WILDLIFE_DOCILE_ATTACK_CONFIRM_BETRAYING_ARIA_LABEL =
  'Betraying friendly animal' as const;

/** Bundled Iconify id for the backstab glyph. */
export const DEFINING_WILDLIFE_DOCILE_ATTACK_CONFIRM_BACKSTAB_ICON =
  'game-icons:backstab' as const;

/** Delay after confirming Betray before damage applies (ms). */
export const DEFINING_WILDLIFE_DOCILE_ATTACK_CONFIRM_BETRAY_WINDUP_MS =
  2_000 as const;

/** Backstab icon size in the dialog title row (px). */
export const DEFINING_WILDLIFE_DOCILE_ATTACK_CONFIRM_ICON_SIZE_PX = 28 as const;

export const STYLING_WILDLIFE_DOCILE_ATTACK_CONFIRM_OVERLAY_CLASS_NAME =
  DEFINING_WORLD_PLAZA_CONFIRM_DIALOG_STYLE.overlayAbsolute;

export const STYLING_WILDLIFE_DOCILE_ATTACK_CONFIRM_PANEL_CLASS_NAME =
  DEFINING_WORLD_PLAZA_CONFIRM_DIALOG_STYLE.panel;

export const STYLING_WILDLIFE_DOCILE_ATTACK_CONFIRM_BODY_CLASS_NAME =
  DEFINING_WORLD_PLAZA_CONFIRM_DIALOG_STYLE.body;

export const STYLING_WILDLIFE_DOCILE_ATTACK_CONFIRM_ACTIONS_CLASS_NAME =
  DEFINING_WORLD_PLAZA_CONFIRM_DIALOG_STYLE.actions;

export const STYLING_WILDLIFE_DOCILE_ATTACK_CONFIRM_TITLE_CLASS_NAME =
  DEFINING_WORLD_PLAZA_CONFIRM_DIALOG_STYLE.title;

export const STYLING_WILDLIFE_DOCILE_ATTACK_CONFIRM_TITLE_ROW_CLASS_NAME =
  'flex items-center justify-center gap-2';

export const STYLING_WILDLIFE_DOCILE_ATTACK_CONFIRM_MESSAGE_CLASS_NAME =
  DEFINING_WORLD_PLAZA_CONFIRM_DIALOG_STYLE.message;

export const STYLING_WILDLIFE_DOCILE_ATTACK_CONFIRM_CANCEL_BUTTON_CLASS_NAME =
  DEFINING_WORLD_PLAZA_CONFIRM_DIALOG_STYLE.cancelButton;

export const STYLING_WILDLIFE_DOCILE_ATTACK_CONFIRM_ATTACK_BUTTON_CLASS_NAME =
  DEFINING_WORLD_PLAZA_CONFIRM_DIALOG_STYLE.confirmButton;

export const STYLING_WILDLIFE_DOCILE_ATTACK_CONFIRM_ICON_CLASS_NAME =
  'shrink-0 text-poster-teal-deep';

export const STYLING_WILDLIFE_DOCILE_ATTACK_CONFIRM_PROGRESS_TRACK_CLASS_NAME =
  'mt-3 h-2 w-full overflow-hidden rounded-sm border border-poster-teal/30 bg-parchment/80';

export const STYLING_WILDLIFE_DOCILE_ATTACK_CONFIRM_PROGRESS_FILL_CLASS_NAME =
  'h-full bg-poster-teal-deep transition-[width] duration-75 ease-linear';

/**
 * Builds the confirm message for one species display name.
 */
export function formattingWildlifeDocileAttackConfirmMessage(
  displayName: string
): string {
  return LABELING_WILDLIFE_DOCILE_ATTACK_CONFIRM_MESSAGE.replace(
    '{name}',
    displayName.toLowerCase()
  );
}

/**
 * Clamps betrayal windup progress to 0..1 from elapsed ms.
 */
export function computingWildlifeDocileAttackConfirmBetrayProgressRatio(
  elapsedMs: number,
  windupMs: number = DEFINING_WILDLIFE_DOCILE_ATTACK_CONFIRM_BETRAY_WINDUP_MS
): number {
  if (windupMs <= 0) {
    return 1;
  }

  return Math.max(0, Math.min(1, elapsedMs / windupMs));
}
