/**
 * Client-side visual + interaction constants for shared ground items.
 *
 * Authoritative lifecycle (spawning, despawn, pickup radius enforcement) lives
 * on the Colyseus server; this module only styles and projects the markers.
 *
 * @module components/world/inventory/domains/definingWorldPlazaGroundItemConstants
 */

/** Max Chebyshev tile distance from the player for a client-side pickup hint. */
export const DEFINING_WORLD_PLAZA_GROUND_ITEM_PICKUP_RADIUS_TILES =
  1.5 as const;

/** Cooldown before retrying auto-pickup when inventory is full (ms). */
export const DEFINING_WORLD_PLAZA_GROUND_ITEM_AUTO_PICKUP_FULL_INVENTORY_COOLDOWN_MS =
  1000 as const;

/** Base icon size in px before viewport HUD scaling. */
export const DEFINING_WORLD_PLAZA_GROUND_ITEM_ICON_BASE_PX = 28 as const;

/** Vertical float amplitude in px for the ground item bob animation. */
export const DEFINING_WORLD_PLAZA_GROUND_ITEM_FLOAT_AMPLITUDE_PX = 6 as const;

/** Float animation duration in seconds. */
export const DEFINING_WORLD_PLAZA_GROUND_ITEM_FLOAT_DURATION_S = 2.4 as const;

/** Ground offset above tile center in unscaled isometric px. */
export const DEFINING_WORLD_PLAZA_GROUND_ITEM_VERTICAL_OFFSET_PX = 8 as const;

/** Extra lift for the pickup hint label above the icon (px, before HUD scale). */
export const DEFINING_WORLD_PLAZA_GROUND_ITEM_PICKUP_HINT_LIFT_BASE_PX =
  10 as const;

/** CSS class for floating ground item animation. */
export const STYLING_WORLD_PLAZA_GROUND_ITEM_FLOAT_CLASS_NAME =
  'world-plaza-ground-item-float' as const;

/** Root class for one clickable ground item marker. */
export const STYLING_WORLD_PLAZA_GROUND_ITEM_ROOT_CLASS_NAME =
  'pointer-events-auto absolute left-0 top-0 z-50 flex flex-col items-center gap-0.5' as const;

/** Ground item icon button styling. */
export const STYLING_WORLD_PLAZA_GROUND_ITEM_BUTTON_CLASS_NAME =
  'flex items-center justify-center rounded-full border border-[#3a2618]/30 bg-[#fff4dc]/95 shadow-md transition hover:scale-105 hover:bg-[#fff4dc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6f8f5e]/70 disabled:cursor-not-allowed disabled:opacity-50' as const;

/** Quantity label under the ground item icon. */
export const STYLING_WORLD_PLAZA_GROUND_ITEM_QUANTITY_CLASS_NAME =
  'rounded-full bg-[#3a2618]/85 px-1.5 py-px text-[10px] font-semibold leading-none text-[#fff4dc] shadow-sm' as const;

/** In-range pickup hint label. */
export const STYLING_WORLD_PLAZA_GROUND_ITEM_PICKUP_HINT_CLASS_NAME =
  'rounded-sm bg-black/70 px-1 py-px text-[9px] font-medium leading-none text-white/90' as const;

/** Out-of-range hint label. */
export const STYLING_WORLD_PLAZA_GROUND_ITEM_TOO_FAR_HINT_CLASS_NAME =
  'rounded-sm bg-black/45 px-1 py-px text-[9px] font-medium leading-none text-white/70' as const;
