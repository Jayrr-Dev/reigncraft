/**
 * Shared parchment confirmation dialog chrome for in-game prompts.
 *
 * Paint rules live in `index.css` under `.plaza-confirm-dialog-*`.
 *
 * @module components/world/domains/definingWorldPlazaConfirmDialogConstants
 */

import {
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE,
  STYLING_WORLD_PLAZA_GAMEPLAY_HUD_LIGHT_THEME_SCOPE_CLASS,
} from '@/components/world/domains/definingWorldPlazaGameplayHudStyleConstants';

/** Shared confirmation dialog layout and typography classes. */
export const DEFINING_WORLD_PLAZA_CONFIRM_DIALOG_STYLE = {
  /** Covers the full viewport (exit-home, app-level prompts). */
  overlayFixed:
    'plaza-confirm-dialog-overlay plaza-confirm-dialog-overlay--fixed',
  /** Covers the plaza playfield only (build mode, presence reconnect). */
  overlayAbsolute:
    'plaza-confirm-dialog-overlay plaza-confirm-dialog-overlay--absolute',
  panel: `plaza-panel plaza-confirm-dialog-panel ${STYLING_WORLD_PLAZA_GAMEPLAY_HUD_LIGHT_THEME_SCOPE_CLASS}`,
  body: 'space-y-2',
  actions: 'mt-4 flex flex-col gap-2',
  title: 'font-display text-base font-bold tracking-wide text-poster-teal-deep',
  message: 'text-sm font-medium italic leading-snug text-ink-soft',
  cancelButton: `plaza-btn-3d plaza-confirm-dialog-button plaza-confirm-dialog-button--secondary ${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.interactive.focusRingGold}`,
  confirmButton: `plaza-btn-3d plaza-confirm-dialog-button plaza-confirm-dialog-button--primary ${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.interactive.focusRingGold}`,
  singleActionButton: `plaza-btn-3d plaza-confirm-dialog-button plaza-confirm-dialog-button--primary ${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.interactive.focusRingGold}`,
} as const;
