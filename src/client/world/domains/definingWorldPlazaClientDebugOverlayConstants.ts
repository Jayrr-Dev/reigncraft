/**
 * UI styling for the always-on client debug overlay.
 *
 * @module components/world/domains/definingWorldPlazaClientDebugOverlayConstants
 */

/** Max lines shown in the floating overlay panel. */
export const DEFINING_WORLD_PLAZA_CLIENT_DEBUG_OVERLAY_MAX_LINES = 8 as const;

/** Max lines painted on the minimap chrome layer. */
export const DEFINING_WORLD_PLAZA_CLIENT_DEBUG_MINI_MAP_MAX_LINES = 4 as const;

/** Fixed panel above the minimap (embedded layout). */
export const DEFINING_WORLD_PLAZA_CLIENT_DEBUG_OVERLAY_CLASS_NAME =
  "pointer-events-none fixed bottom-[7.75rem] left-4 z-[9998] max-w-[min(92vw,18rem)] rounded-md border border-red-400/40 bg-black/85 p-2 font-mono text-[9px] leading-snug text-red-100 shadow-lg backdrop-blur-sm" as const;

/** Fullscreen layout offset (matches minimap fullscreen anchor). */
export const DEFINING_WORLD_PLAZA_CLIENT_DEBUG_OVERLAY_FULLSCREEN_CLASS_NAME =
  "pointer-events-none fixed bottom-[11.5rem] left-4 z-[9998] max-w-[min(92vw,18rem)] rounded-md border border-red-400/40 bg-black/85 p-2 font-mono text-[9px] leading-snug text-red-100 shadow-lg backdrop-blur-sm" as const;

/** Status line color in the overlay. */
export const DEFINING_WORLD_PLAZA_CLIENT_DEBUG_OVERLAY_STATUS_TEXT_CLASS_NAME =
  "text-amber-100/90" as const;

/** Error line color in the overlay. */
export const DEFINING_WORLD_PLAZA_CLIENT_DEBUG_OVERLAY_ERROR_TEXT_CLASS_NAME =
  "text-red-200" as const;
