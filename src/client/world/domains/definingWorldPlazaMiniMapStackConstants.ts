/**
 * Declarative layout for the bottom-left unified minimap card (environment bar + map).
 *
 * @module components/world/domains/definingWorldPlazaMiniMapStackConstants
 */

import { DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_MINI_MAP_STACK_ANCHOR_CLASS_NAME } from '@/components/world/domains/definingWorldPlazaGameplayHudLayoutConstants';
import {
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE,
  STYLING_WORLD_PLAZA_GAMEPLAY_HUD_PARCHMENT_CARD_CLASS,
  STYLING_WORLD_PLAZA_GAMEPLAY_HUD_PARCHMENT_CARD_INSET_FRAME_CLASS,
} from '@/components/world/domains/definingWorldPlazaGameplayHudStyleConstants';

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
  /** Base font size for time/temperature values before viewport HUD scale. */
  readonly environmentBarValueTextBasePx: number;
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
   * Column that hosts the parchment minimap card plus an absolute toast stack
   * anchored just above the card.
   */
  columnClassName: 'relative flex flex-col items-start',
  /** Absolute host for Sonner so empty toasts do not push the minimap. */
  toastHostClassName:
    'pointer-events-none absolute bottom-full left-0 z-30 mb-1.5 flex w-full flex-col items-stretch overflow-visible',
  /**
   * Shared parchment card chrome for the time/temperature bar and minimap.
   * Matches the aged-paper poster panels used on the home screen menus.
   */
  cardClassName: STYLING_WORLD_PLAZA_GAMEPLAY_HUD_PARCHMENT_CARD_CLASS,
  /** Inner frame that insets the minimap canvas like a framed game map. */
  mapFrameClassName:
    STYLING_WORLD_PLAZA_GAMEPLAY_HUD_PARCHMENT_CARD_INSET_FRAME_CLASS,
  environmentBarClassName:
    DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.typography.environmentBar,
  environmentBarMobileClassName:
    DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.typography.environmentBarMobile,
  environmentBarValueClassName:
    DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.typography.environmentBarValue,
  environmentBarValueMobileClassName:
    DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.typography
      .environmentBarValueMobile,
  viewportLayouts: {
    /** Normal (non-fullscreen) game view. */
    embedded: {
      /** Wide screens — stack sits in the bottom-left corner. */
      desktop: {
        edgeInsetBasePx: 12,
        inventoryHotbarClearance: null,
        environmentBarValueTextBasePx: 12,
      },
      /**
       * Phone-sized screens — minimap bottom aligns with the inventory hotbar bottom
       * (both use a 12px bottom inset; see inventory hotbar bottom-3).
       */
      mobile: {
        edgeInsetBasePx: 12,
        inventoryHotbarClearance: null,
        environmentBarValueTextBasePx: 10,
      },
    },
    /** Expanded fullscreen game view. */
    fullscreen: {
      /** Wide screens — slightly larger corner inset than embedded. */
      desktop: {
        edgeInsetBasePx: 16,
        inventoryHotbarClearance: null,
        environmentBarValueTextBasePx: 14,
      },
      /** Phone-sized fullscreen — same corner inset; no hotbar lift. */
      mobile: {
        edgeInsetBasePx: 16,
        inventoryHotbarClearance: null,
        environmentBarValueTextBasePx: 10,
      },
    },
  },
} as const satisfies {
  anchorClassName: string;
  columnClassName: string;
  toastHostClassName: string;
  cardClassName: string;
  mapFrameClassName: string;
  environmentBarClassName: string;
  environmentBarMobileClassName: string;
  environmentBarValueClassName: string;
  environmentBarValueMobileClassName: string;
  viewportLayouts: Record<
    'embedded' | 'fullscreen',
    Record<'desktop' | 'mobile', DefiningWorldPlazaMiniMapStackViewportLayout>
  >;
};
