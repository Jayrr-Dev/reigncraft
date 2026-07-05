/**
 * Declarative layout for the bottom-left minimap + environment bar stack.
 *
 * @module components/world/domains/definingWorldPlazaMiniMapStackConstants
 */

/** Extra bottom clearance when the mobile inventory hotbar is visible. */
export type DefiningWorldPlazaMiniMapStackInventoryHotbarClearanceLayout = {
  readonly bottomInsetBasePx: number;
  readonly shellPaddingBasePx: number;
  readonly scale: number;
  readonly slotBasePx: number;
  readonly stackGapBasePx: number;
};

/** Anchor offsets for one viewport mode + platform pair. */
export type DefiningWorldPlazaMiniMapStackViewportLayout = {
  readonly edgeInsetBasePx: number;
  readonly inventoryHotbarClearance: DefiningWorldPlazaMiniMapStackInventoryHotbarClearanceLayout | null;
};

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
 * Mobile is viewport width under 768px.
 */
export const DEFINING_WORLD_PLAZA_MINI_MAP_STACK_LAYOUT = {
  anchorClassName:
    'pointer-events-none absolute z-20 flex flex-col items-start gap-1 select-none',
  viewportLayouts: {
    embedded: {
      desktop: {
        edgeInsetBasePx: 12,
        inventoryHotbarClearance: null,
      },
      mobile: {
        edgeInsetBasePx: 12,
        inventoryHotbarClearance:
          DEFINING_WORLD_PLAZA_MINI_MAP_STACK_INVENTORY_HOTBAR_CLEARANCE,
      },
    },
    fullscreen: {
      desktop: {
        edgeInsetBasePx: 16,
        inventoryHotbarClearance: null,
      },
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
