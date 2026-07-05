/**
 * Styling for the in-game how-to-play tutorial overlay.
 *
 * @module components/world/domains/definingWorldPlazaTutorialOverlayConstants
 */

/** Tutorial modal overlay classes (covers the plaza viewport). */
export const DEFINING_WORLD_PLAZA_TUTORIAL_OVERLAY_CLASS_NAME =
  'pointer-events-auto fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6' as const;

/** Accessible label for the tutorial action bar control. */
export const LABELING_WORLD_PLAZA_ACTION_BAR_TUTORIAL =
  'How to play' as const;

/** Accessible label for the tutorial modal dialog. */
export const LABELING_WORLD_PLAZA_TUTORIAL_OVERLAY_DIALOG =
  'How to play tutorial' as const;
