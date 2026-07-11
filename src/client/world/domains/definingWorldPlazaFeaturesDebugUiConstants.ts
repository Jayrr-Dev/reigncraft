/**
 * UI styling for the plaza Features debug panel.
 *
 * @module components/world/domains/definingWorldPlazaFeaturesDebugUiConstants
 */

/** Features toggle button classes when the panel is closed. */
export const DEFINING_WORLD_PLAZA_FEATURES_DEBUG_TOGGLE_BUTTON_CLASS_NAME =
  'pointer-events-auto rounded-md border border-white/20 bg-black/50 px-2.5 py-1 text-[10px] font-semibold text-white transition hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/70' as const;

/** Features toggle button classes when the panel is open. */
export const DEFINING_WORLD_PLAZA_FEATURES_DEBUG_TOGGLE_BUTTON_ACTIVE_CLASS_NAME =
  'pointer-events-auto rounded-md border border-sky-300/70 bg-sky-400/15 px-2.5 py-1 text-[10px] font-semibold text-sky-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/70' as const;

/** Visible label on the Features toggle button. */
export const DEFINING_WORLD_PLAZA_FEATURES_DEBUG_TOGGLE_BUTTON_LABEL =
  'Features' as const;

/** Accessible label for the Features toggle. */
export const DEFINING_WORLD_PLAZA_FEATURES_DEBUG_TOGGLE_ARIA_LABEL =
  'Toggle plaza feature flags' as const;

/** Expanded feature flag panel below the Features toggle. */
export const DEFINING_WORLD_PLAZA_FEATURES_DEBUG_PANEL_CLASS_NAME =
  'pointer-events-auto flex w-max max-w-[12rem] flex-col gap-1 rounded-md border border-sky-300/40 bg-black/85 p-1.5 shadow-lg backdrop-blur-sm' as const;

/** Section heading inside the Features panel. */
export const DEFINING_WORLD_PLAZA_FEATURES_DEBUG_PANEL_HEADING_CLASS_NAME =
  'px-1 text-[8px] font-semibold uppercase tracking-[0.14em] text-white/45' as const;

/** Base classes shared by every feature toggle button. */
export const DEFINING_WORLD_PLAZA_FEATURES_DEBUG_OPTION_BUTTON_BASE_CLASS_NAME =
  'rounded border px-2 py-0.5 text-left text-[10px] font-semibold transition-colors' as const;

/** Classes applied to an enabled feature toggle button. */
export const DEFINING_WORLD_PLAZA_FEATURES_DEBUG_OPTION_BUTTON_ACTIVE_CLASS_NAME =
  'border-sky-300 bg-sky-400/30 text-sky-50' as const;

/** Classes applied to a disabled feature toggle button. */
export const DEFINING_WORLD_PLAZA_FEATURES_DEBUG_OPTION_BUTTON_INACTIVE_CLASS_NAME =
  'border-white/20 bg-black/40 text-white/90 hover:bg-sky-400/10' as const;

/** Label for the island world feature toggle. */
export const DEFINING_WORLD_PLAZA_ISLAND_MODE_FEATURE_TOGGLE_LABEL =
  'Island world' as const;

/** Helper text shown under the island world toggle. */
export const DEFINING_WORLD_PLAZA_ISLAND_MODE_FEATURE_TOGGLE_DESCRIPTION =
  'Land to 1000, ocean beyond. Sandy beaches appear at the shoreline.' as const;

/** Label for the procedural trees and rocks feature toggle. */
export const DEFINING_WORLD_PLAZA_PROCEDURAL_TREES_AND_ROCKS_FEATURE_TOGGLE_LABEL =
  'Procedural trees & rocks' as const;

/** Helper text shown under the procedural trees and rocks toggle. */
export const DEFINING_WORLD_PLAZA_PROCEDURAL_TREES_AND_ROCKS_FEATURE_TOGGLE_DESCRIPTION =
  'Bake Graphics forests and stone columns. Off skips spawn and draw for a smoother walk.' as const;

/** Helper text description classes. */
export const DEFINING_WORLD_PLAZA_FEATURES_DEBUG_OPTION_DESCRIPTION_CLASS_NAME =
  'px-1 text-[8px] leading-snug text-white/55' as const;

/** Section heading for the Gemini connectivity test. */
export const DEFINING_WORLD_PLAZA_GEMINI_TEST_SECTION_HEADING =
  'Gemini' as const;

/** Label for the Gemini connectivity test button. */
export const DEFINING_WORLD_PLAZA_GEMINI_TEST_BUTTON_LABEL =
  'Test connection' as const;

/** Label shown while a Gemini connectivity test is in flight. */
export const DEFINING_WORLD_PLAZA_GEMINI_TEST_PENDING_LABEL =
  'Testing...' as const;

/** Helper text under the Gemini connectivity test button. */
export const DEFINING_WORLD_PLAZA_GEMINI_TEST_DESCRIPTION =
  'Sends a short ping through the server proxy to verify the API key.' as const;

/** Classes for a successful Gemini connectivity test result. */
export const DEFINING_WORLD_PLAZA_GEMINI_TEST_SUCCESS_TEXT_CLASS_NAME =
  'px-1 text-[8px] leading-snug text-sky-200' as const;

/** Classes for a failed Gemini connectivity test result. */
export const DEFINING_WORLD_PLAZA_GEMINI_TEST_ERROR_TEXT_CLASS_NAME =
  'px-1 text-[8px] leading-snug text-amber-200' as const;
