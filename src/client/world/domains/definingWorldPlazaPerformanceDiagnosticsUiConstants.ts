/**
 * UI styling for the plaza performance diagnostics toggle and overlay.
 *
 * @module components/world/domains/definingWorldPlazaPerformanceDiagnosticsUiConstants
 */

/**
 * When false, hides the Perf launcher. Overlay still opens via `?perf=1`,
 * env flag, or `window.__WORLD_PLAZA_PERF__.enable()`.
 */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_PERF_LAUNCHER_VISIBLE =
  false as const;

/** Compact top-left Perf launcher (sibling of Dev, not inside the panel). */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_TOGGLE_BUTTON_CLASS_NAME =
  'pointer-events-auto min-w-0 flex-1 rounded border border-amber-800 bg-amber-700 px-1 py-0.5 text-[8px] font-bold uppercase leading-none tracking-wide text-white shadow-sm transition hover:bg-amber-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-300' as const;

/** Perf launcher when diagnostics overlay is open. */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_TOGGLE_BUTTON_ACTIVE_CLASS_NAME =
  'pointer-events-auto min-w-0 flex-1 rounded border border-amber-900 bg-amber-600 px-1 py-0.5 text-[8px] font-bold uppercase leading-none tracking-wide text-white shadow-sm transition hover:bg-amber-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-300' as const;

/** Visible button label. */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_TOGGLE_BUTTON_LABEL =
  'Perf' as const;

/** Accessible label for the perf toggle. */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_TOGGLE_ARIA_LABEL =
  'Toggle performance diagnostics overlay' as const;

/** Compact FPS readout toggle (replaces always-on corner counter). */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FPS_TOGGLE_BUTTON_CLASS_NAME =
  'pointer-events-auto min-w-0 flex-1 rounded border border-emerald-800 bg-emerald-700 px-1 py-0.5 text-[8px] font-bold uppercase leading-none tracking-wide text-white shadow-sm transition hover:bg-emerald-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-300' as const;

/** FPS toggle when the corner readout is visible. */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FPS_TOGGLE_BUTTON_ACTIVE_CLASS_NAME =
  'pointer-events-auto min-w-0 flex-1 rounded border border-emerald-900 bg-emerald-600 px-1 py-0.5 text-[8px] font-bold uppercase leading-none tracking-wide text-white shadow-sm transition hover:bg-emerald-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-300' as const;

/** Visible FPS toggle label. */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FPS_TOGGLE_BUTTON_LABEL =
  'FPS' as const;

/** Accessible label for the FPS readout toggle. */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FPS_TOGGLE_ARIA_LABEL =
  'Toggle FPS readout' as const;

/** sessionStorage key for corner FPS readout visibility. */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FPS_READOUT_VISIBLE_STORAGE_KEY =
  'world-plaza-fps-readout-visible' as const;

/** Corner FPS starts hidden; player turns it on with the FPS button. */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FPS_READOUT_DEFAULT_VISIBLE =
  false as const;

/** Suffix after the numeric FPS value. */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FPS_READOUT_SUFFIX =
  ' FPS' as const;

/** Placeholder while the corner FPS sampler has not produced a sample yet. */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FPS_READOUT_PLACEHOLDER =
  '- FPS' as const;

/** Fixed portal panel rendered outside the plaza viewport (not clipped). */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_OVERLAY_CLASS_NAME =
  'pointer-events-auto fixed left-4 top-20 z-[9999] flex max-h-[calc(100vh-5rem)] max-w-[min(94vw,28rem)] flex-col rounded-md border border-amber-300/40 bg-black/90 p-2.5 font-mono text-[10px] leading-relaxed text-amber-50 shadow-lg backdrop-blur-sm' as const;

/** Scrollable tab body inside the perf overlay (wheel scroll, no bar). */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_OVERLAY_TAB_BODY_CLASS_NAME =
  'scrollbar-none min-h-0 flex-1 overflow-y-auto' as const;

/** Separator between live and session-average FPS in the overlay header. */
export const LABELING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_OVERLAY_FPS_SEPARATOR =
  ' · avg ' as const;

/** Separator before session-minimum FPS in the overlay header. */
export const LABELING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_OVERLAY_FPS_MIN_SEPARATOR =
  ' · min ' as const;
