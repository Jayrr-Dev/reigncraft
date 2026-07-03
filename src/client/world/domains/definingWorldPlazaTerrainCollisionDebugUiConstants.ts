/**
 * UI styling for the plaza terrain collision debug toggle.
 *
 * @module components/world/domains/definingWorldPlazaTerrainCollisionDebugUiConstants
 */

/** Collision debug toggle button classes when inactive. */
export const DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_TOGGLE_BUTTON_CLASS_NAME =
  "pointer-events-auto rounded-md border border-white/20 bg-black/50 px-2.5 py-1 text-[10px] font-semibold text-white transition hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70" as const;

/** Collision debug toggle button classes when active. */
export const DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_TOGGLE_BUTTON_ACTIVE_CLASS_NAME =
  "pointer-events-auto rounded-md border border-cyan-300/70 bg-cyan-400/15 px-2.5 py-1 text-[10px] font-semibold text-cyan-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70" as const;

/** Visible button label. */
export const DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_TOGGLE_BUTTON_LABEL =
  "Collision" as const;

/** Accessible label for the collision debug toggle. */
export const DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_TOGGLE_ARIA_LABEL =
  "Toggle collision debug overlay" as const;
