/**
 * Default constants and shared styling tokens for the inventory engine.
 *
 * @module components/inventory/domains/definingInventoryConstants
 */

/** Default slot count when none is specified. */
export const DEFINING_INVENTORY_DEFAULT_CAPACITY = 9 as const;

/** Px before a drag activates (matches profile block inventory). */
export const DEFINING_INVENTORY_DRAG_ACTIVATION_PX = 8 as const;

/** Hold duration before touch drag activates so taps stay clickable (ms). */
export const DEFINING_INVENTORY_TOUCH_DRAG_ACTIVATION_DELAY_MS = 180 as const;

/** Movement allowed during a touch drag hold before activation cancels (px). */
export const DEFINING_INVENTORY_TOUCH_DRAG_ACTIVATION_TOLERANCE_PX = 8 as const;

/** Debounce delay before persisting inventory state (ms). */
export const DEFINING_INVENTORY_PERSIST_DEBOUNCE_MS = 300 as const;

/** TanStack Query key root for inventory state. */
export const DEFINING_INVENTORY_QUERY_KEY_ROOT = 'inventory-state' as const;

/** Outer grid wrapper for a single-row inventory bar. */
export const STYLING_INVENTORY_GRID_WRAPPER =
  'flex touch-none overscroll-none items-center gap-1' as const;

/** Individual slot cell base styling. */
export const STYLING_INVENTORY_SLOT_CELL =
  'relative flex size-10 shrink-0 touch-none items-center justify-center rounded-sm border border-white/20 bg-black/40 transition-colors' as const;

/** Empty slot styling (dashed border). */
export const STYLING_INVENTORY_SLOT_CELL_EMPTY =
  'border-dashed border-white/15 bg-black/25' as const;

/** Valid drop target highlight. */
export const STYLING_INVENTORY_SLOT_DROP_TARGET_VALID =
  'border-primary/70 bg-primary/15 ring-1 ring-primary/40' as const;

/** Invalid drop target highlight. */
export const STYLING_INVENTORY_SLOT_DROP_TARGET_INVALID =
  'border-destructive/40 ring-1 ring-destructive/30' as const;

/** Drag overlay shell. */
export const STYLING_INVENTORY_DRAG_OVERLAY =
  'pointer-events-none overflow-hidden rounded-sm border border-white/30 bg-black/70 shadow-lg backdrop-blur-sm' as const;

/** Quantity badge on stacked items. */
export const STYLING_INVENTORY_ITEM_QUANTITY_BADGE =
  'pointer-events-none absolute -bottom-0.5 -right-0.5 flex min-h-4 min-w-4 items-center justify-center rounded-none bg-black/80 px-0.5 text-[9px] font-semibold leading-none text-white' as const;

/** Accessible label for dragging an item. */
export const LABELING_INVENTORY_DRAG_ITEM =
  'Drag to move, swap, or drop outside to remove' as const;
