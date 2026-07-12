/**
 * Declarative layout for the top-left unified minimap card (environment bar + map).
 *
 * @module components/world/domains/definingWorldPlazaMiniMapStackConstants
 */

import { DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_MINI_MAP_STACK_ANCHOR_CLASS_NAME } from '@/components/world/domains/definingWorldPlazaGameplayHudLayoutConstants';
import {
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE,
  STYLING_WORLD_PLAZA_GAMEPLAY_HUD_PARCHMENT_CARD_CLASS,
  STYLING_WORLD_PLAZA_GAMEPLAY_HUD_PARCHMENT_CARD_INSET_FRAME_CLASS,
} from '@/components/world/domains/definingWorldPlazaGameplayHudStyleConstants';

/** Where the minimap + time/temperature bar sit for one screen size combo. */
export type DefiningWorldPlazaMiniMapStackViewportLayout = {
  /**
   * Distance from the left and top screen edges when nothing else pushes
   * the stack down. Increase to move the stack away from the corner; decrease
   * to tuck it closer.
   */
  readonly edgeInsetBasePx: number;
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
   * in the top-left HUD corner.
   */
  anchorClassName:
    DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_MINI_MAP_STACK_ANCHOR_CLASS_NAME,
  /**
   * Column that hosts the parchment minimap card plus an absolute toast stack
   * anchored just below the card.
   */
  columnClassName: 'relative flex flex-col items-start',
  /** Absolute host for Sonner so empty toasts do not push the minimap. */
  toastHostClassName:
    'pointer-events-none absolute top-full left-0 z-30 mt-1.5 flex w-full flex-col items-stretch overflow-visible',
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
  /** Top inset — matches the action bar row (`anchorTopBasePx`). */
  topInsetBasePx: 4,
  /** Parchment card vertical padding (p-0.5 top + bottom). */
  cardVerticalChromeBasePx: 4,
  /** Environment bar row height before viewport HUD scale. */
  environmentBarOccupiedBasePx: {
    desktop: 16,
    mobile: 12,
  },
  /** Gap before Dev tools / other chrome below the minimap card. */
  belowMinimapGapBasePx: 6,
  viewportLayouts: {
    /** Normal (non-fullscreen) game view. */
    embedded: {
      /** Wide screens — stack sits in the top-left corner. */
      desktop: {
        edgeInsetBasePx: 6,
        environmentBarValueTextBasePx: 11,
      },
      /** Phone-sized screens — same top-left corner as the action bar row. */
      mobile: {
        edgeInsetBasePx: 6,
        environmentBarValueTextBasePx: 9,
      },
    },
    /** Expanded fullscreen game view. */
    fullscreen: {
      /** Wide screens — slightly larger corner inset than embedded. */
      desktop: {
        edgeInsetBasePx: 8,
        environmentBarValueTextBasePx: 12,
      },
      /** Phone-sized fullscreen — same top-left anchor. */
      mobile: {
        edgeInsetBasePx: 8,
        environmentBarValueTextBasePx: 9,
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
  topInsetBasePx: number;
  cardVerticalChromeBasePx: number;
  environmentBarOccupiedBasePx: Record<'desktop' | 'mobile', number>;
  belowMinimapGapBasePx: number;
  viewportLayouts: Record<
    'embedded' | 'fullscreen',
    Record<'desktop' | 'mobile', DefiningWorldPlazaMiniMapStackViewportLayout>
  >;
};
