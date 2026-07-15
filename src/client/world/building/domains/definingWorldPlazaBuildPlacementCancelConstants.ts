/**
 * Declarative copy and chrome for canceling an armed build / craft placement.
 *
 * @module components/world/building/domains/definingWorldPlazaBuildPlacementCancelConstants
 */

/** Visible Cancel label while a placeable ghost is armed. */
export const LABELING_WORLD_PLAZA_BUILD_PLACEMENT_CANCEL = 'Cancel' as const;

/** Accessible name for the placement Cancel control. */
export const LABELING_WORLD_PLAZA_BUILD_PLACEMENT_CANCEL_ARIA =
  'Cancel placement and return materials' as const;

/** Iconify glyph for the placement Cancel control. */
export const DEFINING_WORLD_PLAZA_BUILD_PLACEMENT_CANCEL_ICONIFY_ICON =
  'mdi:close' as const;

/**
 * Full-width Cancel button that replaces Items / Craft / Claim while placing.
 */
export const STYLING_WORLD_PLAZA_BUILD_PLACEMENT_CANCEL_BUTTON_CLASS_NAME =
  'pointer-events-auto inline-flex w-full items-center justify-center gap-2 rounded-md border border-rose-300/70 bg-[linear-gradient(180deg,#6b2a2a_0%,#3a1515_100%)] px-3 py-2.5 font-bold uppercase tracking-[0.08em] text-rose-50 shadow-[0_0_0_1px_rgba(251,113,133,0.28),0_2px_8px_rgba(0,0,0,0.45)] backdrop-blur-sm transition-[transform,filter] hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/70' as const;

/** Icon size class inside the Cancel control. */
export const STYLING_WORLD_PLAZA_BUILD_PLACEMENT_CANCEL_ICON_CLASS_NAME =
  'size-4 shrink-0 text-current' as const;

/** Label class inside the Cancel control. */
export const STYLING_WORLD_PLAZA_BUILD_PLACEMENT_CANCEL_LABEL_CLASS_NAME =
  'text-sm leading-none' as const;
