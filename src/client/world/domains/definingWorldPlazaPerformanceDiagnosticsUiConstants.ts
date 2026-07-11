/**
 * UI styling for the plaza performance diagnostics toggle and overlay.
 *
 * @module components/world/domains/definingWorldPlazaPerformanceDiagnosticsUiConstants
 */

/** Compact top-left Perf launcher (sibling of Dev, not inside the panel). */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_TOGGLE_BUTTON_CLASS_NAME =
  'pointer-events-auto shrink-0 rounded-md border border-amber-800 bg-amber-700 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow transition hover:bg-amber-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300' as const;

/** Perf launcher when diagnostics overlay is open. */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_TOGGLE_BUTTON_ACTIVE_CLASS_NAME =
  'pointer-events-auto shrink-0 rounded-md border border-amber-900 bg-amber-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow transition hover:bg-amber-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300' as const;

/** Visible button label. */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_TOGGLE_BUTTON_LABEL =
  'Perf' as const;

/** Gap between Perf label and live FPS readout on the badge. */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_TOGGLE_FPS_CLASS_NAME =
  'ml-1.5 font-mono font-semibold normal-case tracking-normal tabular-nums text-white' as const;

/** Placeholder while the badge FPS sampler has not produced a sample yet. */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_TOGGLE_FPS_PLACEHOLDER =
  '—' as const;

/** Accessible label for the perf toggle. */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_TOGGLE_ARIA_LABEL =
  'Toggle performance diagnostics overlay' as const;

/** Fixed portal panel rendered outside the plaza viewport (not clipped). */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_OVERLAY_CLASS_NAME =
  'pointer-events-auto fixed left-4 top-20 z-[9999] flex max-h-[calc(100vh-5rem)] max-w-[min(94vw,28rem)] flex-col rounded-md border border-amber-300/40 bg-black/90 p-2.5 font-mono text-[10px] leading-relaxed text-amber-50 shadow-lg backdrop-blur-sm' as const;

/** Scrollable tab body inside the perf overlay. */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_OVERLAY_TAB_BODY_CLASS_NAME =
  'min-h-0 flex-1 overflow-y-auto' as const;
