/**
 * Shared close-button styling for plaza dev/debug panels.
 *
 * @module components/world/domains/definingWorldPlazaDevPanelCloseButtonConstants
 */

/** Base classes for the compact X close control on dev panels. */
export const STYLING_WORLD_PLAZA_DEV_PANEL_CLOSE_BUTTON_CLASS_NAME =
  'pointer-events-auto flex size-5 shrink-0 items-center justify-center rounded border border-white/15 text-white/70 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35' as const;

/** Accessible label for closing the perf diagnostics overlay. */
export const LABELING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_OVERLAY_CLOSE =
  'Close performance diagnostics' as const;

/** Accessible label for closing the Features debug panel. */
export const LABELING_WORLD_PLAZA_FEATURES_DEBUG_PANEL_CLOSE =
  'Close features panel' as const;

/** Accessible label for closing the avatar skin selector panel. */
export const LABELING_WORLD_PLAZA_AVATAR_SKIN_SELECTOR_PANEL_CLOSE =
  'Close character panel' as const;
