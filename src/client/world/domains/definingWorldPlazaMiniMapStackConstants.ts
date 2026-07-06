/**
 * Declarative layout for the bottom-left unified minimap card (environment bar + map).
 *
 * @module components/world/domains/definingWorldPlazaMiniMapStackConstants
 */

import { DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_MINI_MAP_STACK_ANCHOR_CLASS_NAME } from '@/components/world/domains/definingWorldPlazaGameplayHudLayoutConstants';

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
   * using edgeInsetBasePx for bottom spacing. null = bottom edge aligns with
   * the hotbar bottom (same inset as edgeInsetBasePx).
   */
  readonly inventoryHotbarClearance: DefiningWorldPlazaMiniMapStackInventoryHotbarClearanceLayout | null;
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
   * CSS classes for the outer wrapper that positions the unified minimap card
   * in the bottom-left HUD corner.
   */
  anchorClassName:
    DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_MINI_MAP_STACK_ANCHOR_CLASS_NAME,
  /**
   * Shared parchment card chrome for the time/temperature bar and minimap.
   * Matches the aged-paper poster panels used on the home screen menus.
   */
  cardClassName:
    'flex flex-col rounded-md border-2 border-poster-teal/70 bg-[linear-gradient(165deg,#f0e2c4_0%,#e3d1a8_100%)] p-0.5 shadow-[inset_0_0_0_1px_rgba(255,250,230,0.6),0_3px_0_0_rgba(44,74,82,0.7),0_8px_16px_rgba(20,28,26,0.35)]',
  /** Inner frame that insets the minimap canvas like a framed game map. */
  mapFrameClassName:
    'overflow-hidden rounded-sm border border-poster-teal/45 shadow-[inset_0_1px_3px_rgba(20,28,26,0.4)]',
  environmentBarClassName:
    'flex w-full items-center justify-between gap-1 px-0.5 pb-0.5 pt-0 font-display text-[10px] font-bold leading-none text-ink',
  environmentBarMobileClassName: 'gap-0.5 text-[9px]',
  environmentBarValueClassName: 'min-w-0 shrink whitespace-nowrap tabular-nums',
  viewportLayouts: {
    /** Normal (non-fullscreen) game view. */
    embedded: {
      /** Wide screens — stack sits in the bottom-left corner. */
      desktop: {
        edgeInsetBasePx: 12,
        inventoryHotbarClearance: null,
      },
      /**
       * Phone-sized screens — minimap bottom aligns with the inventory hotbar bottom
       * (both use a 12px bottom inset; see inventory hotbar bottom-3).
       */
      mobile: {
        edgeInsetBasePx: 12,
        inventoryHotbarClearance: null,
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
  cardClassName: string;
  mapFrameClassName: string;
  environmentBarClassName: string;
  environmentBarMobileClassName: string;
  environmentBarValueClassName: string;
  viewportLayouts: Record<
    'embedded' | 'fullscreen',
    Record<'desktop' | 'mobile', DefiningWorldPlazaMiniMapStackViewportLayout>
  >;
};
