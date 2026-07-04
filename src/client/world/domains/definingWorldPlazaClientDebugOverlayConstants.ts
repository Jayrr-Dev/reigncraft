/**
 * UI styling for the always-on client debug overlay.
 *
 * @module components/world/domains/definingWorldPlazaClientDebugOverlayConstants
 */

/** Max lines shown in the floating overlay panel. */
export const DEFINING_WORLD_PLAZA_CLIENT_DEBUG_OVERLAY_MAX_LINES = 8 as const;

/** Max lines painted on the minimap chrome layer. */
export const DEFINING_WORLD_PLAZA_CLIENT_DEBUG_MINI_MAP_MAX_LINES = 4 as const;

/** Fixed panel in the top-right corner (embedded layout). */
export const DEFINING_WORLD_PLAZA_CLIENT_DEBUG_OVERLAY_CLASS_NAME =
  'pointer-events-none fixed top-2 right-2 z-[9998] max-w-[min(92vw,14rem)] rounded border border-red-400/30 bg-black/80 px-1.5 py-0.5 font-mono text-[8px] leading-none text-red-100/90 shadow backdrop-blur-sm' as const;

/** Fullscreen layout anchor (top-right, clears expanded chrome). */
export const DEFINING_WORLD_PLAZA_CLIENT_DEBUG_OVERLAY_FULLSCREEN_CLASS_NAME =
  'pointer-events-none fixed top-2 right-2 z-[9998] max-w-[min(92vw,14rem)] rounded border border-red-400/30 bg-black/80 px-1.5 py-0.5 font-mono text-[8px] leading-none text-red-100/90 shadow backdrop-blur-sm' as const;

/** Status line color in the overlay. */
export const DEFINING_WORLD_PLAZA_CLIENT_DEBUG_OVERLAY_STATUS_TEXT_CLASS_NAME =
  'text-amber-100/90' as const;

/** Error line color in the overlay. */
export const DEFINING_WORLD_PLAZA_CLIENT_DEBUG_OVERLAY_ERROR_TEXT_CLASS_NAME =
  'text-red-200' as const;
