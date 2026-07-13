/**
 * Declarative layout for the action-bar minimap dropdown card.
 *
 * @module components/world/domains/definingWorldPlazaMiniMapStackConstants
 */

import {
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE,
  STYLING_WORLD_PLAZA_GAMEPLAY_HUD_PARCHMENT_CARD_CLASS,
  STYLING_WORLD_PLAZA_GAMEPLAY_HUD_PARCHMENT_CARD_INSET_FRAME_CLASS,
} from '@/components/world/domains/definingWorldPlazaGameplayHudStyleConstants';

/** Where the minimap card sits for one screen size combo (edge insets for Dev tools). */
export type DefiningWorldPlazaMiniMapStackViewportLayout = {
  /**
   * Distance from the left and top screen edges for top-left chrome that used
   * to share a column with the minimap (Dev tools).
   */
  readonly edgeInsetBasePx: number;
};

/**
 * Minimap HUD layout keyed by viewport mode and platform.
 *
 * - embedded: normal in-feed / windowed game view
 * - fullscreen: expanded fullscreen game view
 * - desktop: wide screens (768px and up)
 * - mobile: narrow screens (under 768px)
 */
export const DEFINING_WORLD_PLAZA_MINI_MAP_STACK_LAYOUT = {
  /**
   * Dropdown shell under the action-bar layer orb (same pattern as hunger /
   * temperature / day-night panels).
   */
  dropdownClassName:
    `${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.cssShell.actionBarDropdown} pointer-events-auto absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2` as const,
  /** Column that hosts the parchment minimap card. */
  columnClassName: 'relative flex flex-col items-start',
  /**
   * Shared parchment card chrome for the minimap.
   * Matches the aged-paper poster panels used on the home screen menus.
   */
  cardClassName: STYLING_WORLD_PLAZA_GAMEPLAY_HUD_PARCHMENT_CARD_CLASS,
  /** Inner frame that insets the minimap canvas like a framed game map. */
  mapFrameClassName:
    STYLING_WORLD_PLAZA_GAMEPLAY_HUD_PARCHMENT_CARD_INSET_FRAME_CLASS,
  /** Top inset for top-left chrome (Dev tools) — matches the action bar row. */
  topInsetBasePx: 4,
  /** Parchment card vertical padding (p-0.5 top + bottom). */
  cardVerticalChromeBasePx: 4,
  /** Gap below top-left chrome when stacking Dev tools under other HUD. */
  belowMinimapGapBasePx: 6,
  viewportLayouts: {
    /** Normal (non-fullscreen) game view. */
    embedded: {
      desktop: {
        edgeInsetBasePx: 4,
      },
      mobile: {
        edgeInsetBasePx: 4,
      },
    },
    /** Expanded fullscreen game view. */
    fullscreen: {
      desktop: {
        edgeInsetBasePx: 4,
      },
      mobile: {
        edgeInsetBasePx: 4,
      },
    },
  },
} as const satisfies {
  dropdownClassName: string;
  columnClassName: string;
  cardClassName: string;
  mapFrameClassName: string;
  topInsetBasePx: number;
  cardVerticalChromeBasePx: number;
  belowMinimapGapBasePx: number;
  viewportLayouts: Record<
    'embedded' | 'fullscreen',
    Record<'desktop' | 'mobile', DefiningWorldPlazaMiniMapStackViewportLayout>
  >;
};
