/**
 * UI styling for the plaza performance diagnostics toggle and overlay.
 *
 * @module components/world/domains/definingWorldPlazaPerformanceDiagnosticsUiConstants
 */

import { STYLING_WORLD_PLAZA_DEV_MODE_PANEL_TOGGLE_BUTTON_CLASS_NAME } from '@/components/world/domains/definingWorldPlazaDevModePanelConstants';

/** Perf toggle button classes when inactive. */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_TOGGLE_BUTTON_CLASS_NAME =
  `${STYLING_WORLD_PLAZA_DEV_MODE_PANEL_TOGGLE_BUTTON_CLASS_NAME} focus-visible:ring-amber-300/70` as const;

/** Perf toggle button classes when active. */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_TOGGLE_BUTTON_ACTIVE_CLASS_NAME =
  `${STYLING_WORLD_PLAZA_DEV_MODE_PANEL_TOGGLE_BUTTON_CLASS_NAME} border-amber-300/70 bg-amber-400/15 text-amber-100 focus-visible:ring-amber-300/70` as const;

/** Visible button label. */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_TOGGLE_BUTTON_LABEL =
  'Perf' as const;

/** Accessible label for the perf toggle. */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_TOGGLE_ARIA_LABEL =
  'Toggle performance diagnostics overlay' as const;

/** Fixed portal panel rendered outside the plaza viewport (not clipped). */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_OVERLAY_CLASS_NAME =
  'pointer-events-auto fixed left-4 top-20 z-[9999] flex max-h-[calc(100vh-5rem)] max-w-[min(92vw,24rem)] flex-col rounded-md border border-amber-300/40 bg-black/90 p-2.5 font-mono text-[10px] leading-relaxed text-amber-50 shadow-lg backdrop-blur-sm' as const;

/** Scrollable tab body inside the perf overlay. */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_OVERLAY_TAB_BODY_CLASS_NAME =
  'min-h-0 flex-1 overflow-y-auto' as const;

/** One render-layer checkbox row in the perf overlay. */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_RENDER_LAYER_TOGGLE_ROW_CLASS_NAME =
  'pointer-events-auto flex cursor-pointer select-none items-center gap-2 text-amber-50 hover:text-amber-100' as const;
