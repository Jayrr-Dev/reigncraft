/**
 * Declarative layout for the bottom-left minimap + environment bar stack.
 *
 * Edit values here to move the stack, change spacing, or avoid overlapping
 * the inventory hotbar on mobile.
 *
 * @module components/world/domains/definingWorldPlazaMiniMapStackConstants
 */

/**
 * Numbers used to push the minimap stack up when the mobile inventory hotbar
 * is open at the bottom of the screen.
 */
export type DefiningWorldPlazaMiniMapStackInventoryHotbarClearanceLayout = {
  /** How far the hotbar sits above the bottom edge of the screen. */
  readonly bottomInsetBasePx: number;
  /** Inner padding around the hotbar slots (top + bottom). */
  readonly shellPaddingBasePx: number;
  /** Makes the hotbar (and this clearance math) render larger on small screens. */
  readonly scale: number;
  /** Height/width of one inventory slot in the hotbar. */
  readonly slotBasePx: number;
  /** Extra breathing room between the hotbar and the minimap stack. */
  readonly stackGapBasePx: number;
};

/** Where the minimap + time/temperature bar sit for one screen size combo. */
export type DefiningWorldPlazaMiniMapStackViewportLayout = {
  /**
   * Distance from the left and bottom screen edges when nothing else pushes
   * the stack up. Increase to move the stack away from the corner; decrease
   * to tuck it closer.
   */
  readonly edgeInsetBasePx: number;
  /**
   * When set, the stack moves up to sit above the inventory hotbar instead of
   * using edgeInsetBasePx for bottom spacing. null = stay at the normal corner.
   */
  readonly inventoryHotbarClearance: DefiningWorldPlazaMiniMapStackInventoryHotbarClearanceLayout | null;
};

/** Shared hotbar clearance values for mobile embedded view. */
const DEFINING_WORLD_PLAZA_MINI_MAP_STACK_INVENTORY_HOTBAR_CLEARANCE: DefiningWorldPlazaMiniMapStackInventoryHotbarClearanceLayout =
  {
    bottomInsetBasePx: 12,
    shellPaddingBasePx: 4,
    scale: 1.25,
    slotBasePx: 40,
    stackGapBasePx: 8,
  };

/**
 * Minimap HUD stack layout keyed by viewport mode and platform.
 *
 * - embedded: normal in-feed / windowed game view
 * - fullscreen: expanded fullscreen game view
 * - desktop: wide screens (768px and up)
 * - mobile: narrow screens (under 768px)
 */
export const DEFINING_WORLD_PLAZA_MINI_MAP_STACK_LAYOUT = {
  /**
   * CSS classes for the outer wrapper that holds the time/temperature bar
   * and minimap. gap-1 controls the vertical space between those two pieces.
   */
  anchorClassName:
    'pointer-events-none absolute z-20 flex flex-col items-start gap-1 select-none',
  viewportLayouts: {
    /** Normal (non-fullscreen) game view. */
    embedded: {
      /** Wide screens — stack sits in the bottom-left corner. */
      desktop: {
        edgeInsetBasePx: 12,
        inventoryHotbarClearance: null,
      },
      /** Phone-sized screens — stack lifts above the bottom hotbar when it is visible. */
      mobile: {
        edgeInsetBasePx: 12,
        inventoryHotbarClearance:
          DEFINING_WORLD_PLAZA_MINI_MAP_STACK_INVENTORY_HOTBAR_CLEARANCE,
      },
    },
    /** Expanded fullscreen game view. */
    fullscreen: {
      /** Wide screens — slightly larger corner inset than embedded. */
      desktop: {
        edgeInsetBasePx: 16,
        inventoryHotbarClearance: null,
      },
      /** Phone-sized fullscreen — same corner inset; no hotbar lift. */
      mobile: {
        edgeInsetBasePx: 16,
        inventoryHotbarClearance: null,
      },
    },
  },
} as const satisfies {
  anchorClassName: string;
  viewportLayouts: Record<
    'embedded' | 'fullscreen',
    Record<'desktop' | 'mobile', DefiningWorldPlazaMiniMapStackViewportLayout>
  >;
};
