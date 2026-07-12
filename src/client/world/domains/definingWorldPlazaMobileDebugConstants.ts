/**
 * Mobile playtest debugging: URL flag, HUD styling, and copy labels.
 *
 * Enable the live HUD with `?debug=1` or `window.__WORLD_PLAZA_DEBUG__.enable()`.
 * Copy a full report from the debug HUD.
 *
 * @module components/world/domains/definingWorldPlazaMobileDebugConstants
 */

/** Starts with the debug HUD open when set in `.env.local`. */
export const DEFINING_WORLD_PLAZA_MOBILE_DEBUG_ENV_ENABLED =
  import.meta.env.NEXT_PUBLIC_WORLD_PLAZA_MOBILE_DEBUG === 'true';

/** URL query flag that opens the mobile debug HUD on load. */
export const DEFINING_WORLD_PLAZA_MOBILE_DEBUG_URL_QUERY_KEY = 'debug' as const;

/** URL query value that enables the mobile debug HUD. */
export const DEFINING_WORLD_PLAZA_MOBILE_DEBUG_URL_QUERY_VALUE = '1' as const;

/** sessionStorage key for HUD visibility after the player hides it. */
export const DEFINING_WORLD_PLAZA_MOBILE_DEBUG_HUD_OPEN_STORAGE_KEY =
  'world-plaza-mobile-debug-hud-open' as const;

/** Global console API key on `window`. */
export const DEFINING_WORLD_PLAZA_MOBILE_DEBUG_CONSOLE_API_KEY =
  '__WORLD_PLAZA_DEBUG__' as const;

/** Rolling frame history size for the lightweight mobile debug sampler. */
export const DEFINING_WORLD_PLAZA_MOBILE_DEBUG_FRAME_HISTORY_SIZE = 120;

/** HUD refresh interval (ms). */
export const DEFINING_WORLD_PLAZA_MOBILE_DEBUG_HUD_REFRESH_MS = 500;

/** Settings row label for one-tap report copy. */
export const LABELING_WORLD_PLAZA_MOBILE_DEBUG_COPY_REPORT =
  'Copy debug report' as const;

/** HUD primary copy button label. */
export const LABELING_WORLD_PLAZA_MOBILE_DEBUG_COPY_REPORT_BUTTON =
  'Copy report' as const;

/** Toast shown after a successful clipboard copy. */
export const LABELING_WORLD_PLAZA_MOBILE_DEBUG_COPY_SUCCESS =
  'Debug report copied. Paste it in chat or a bug report.' as const;

/** Toast shown when clipboard copy fails. */
export const LABELING_WORLD_PLAZA_MOBILE_DEBUG_COPY_FAILED =
  'Could not copy. Select the report text manually.' as const;

/** Fixed panel above the action bar on mobile. */
export const STYLING_WORLD_PLAZA_MOBILE_DEBUG_PANEL_CLASS_NAME =
  'pointer-events-auto fixed bottom-[calc(env(safe-area-inset-bottom,0px)+4.5rem)] left-2 right-2 z-[9997] max-w-md rounded-lg border border-cyan-300/35 bg-black/88 p-2 font-mono text-[10px] leading-snug text-cyan-50 shadow-lg backdrop-blur-md' as const;

/** Primary copy button inside the HUD. */
export const STYLING_WORLD_PLAZA_MOBILE_DEBUG_COPY_BUTTON_CLASS_NAME =
  'mt-1.5 w-full rounded-md border border-cyan-200/40 bg-cyan-500/20 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-cyan-50' as const;

/** Secondary hide button inside the HUD. */
export const STYLING_WORLD_PLAZA_MOBILE_DEBUG_HIDE_BUTTON_CLASS_NAME =
  'rounded border border-white/15 bg-white/5 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white/70' as const;

/** Settings mixer row for copy debug report. */
export const STYLING_WORLD_PLAZA_MOBILE_DEBUG_SETTINGS_BUTTON_CLASS_NAME =
  'mt-1 w-full rounded border border-white/15 bg-white/5 px-2 py-1.5 text-left text-[10px] font-semibold text-white/80' as const;
