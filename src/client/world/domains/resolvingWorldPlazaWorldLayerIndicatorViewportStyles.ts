/**
 * Viewport sizing for the action-bar compass / minimap orb.
 *
 * @module components/world/domains/resolvingWorldPlazaWorldLayerIndicatorViewportStyles
 */

import {
  computingWorldPlazaViewportHudScaledPx,
  stylingWorldPlazaViewportHudSquarePx,
} from '@/components/world/domains/computingWorldPlazaViewportHudScale';
import {
  DEFINING_WORLD_PLAZA_ACTION_BAR_BUTTON_BASE_PX,
  DEFINING_WORLD_PLAZA_ACTION_BAR_ICON_BASE_PX,
  DEFINING_WORLD_PLAZA_ACTION_BAR_MOBILE_SCALE,
  DEFINING_WORLD_PLAZA_ACTION_BAR_SCALE,
} from '@/components/world/domains/definingWorldPlazaActionBarConstants';
import type { CSSProperties } from 'react';

export type DefiningWorldPlazaWorldLayerIndicatorViewportStyles = {
  readonly sphereStyle: CSSProperties;
  readonly iconSizePx: number;
};

/**
 * Viewport styles that size the compass sphere to match action bar buttons.
 *
 * @param viewportHudScale - Live scale from the plaza viewport frame
 * @param isMobile - When true, applies the action bar mobile shrink
 */
export function resolvingWorldPlazaWorldLayerIndicatorViewportStyles(
  viewportHudScale: number,
  isMobile = false
): DefiningWorldPlazaWorldLayerIndicatorViewportStyles {
  const designScale =
    DEFINING_WORLD_PLAZA_ACTION_BAR_SCALE *
    (isMobile ? DEFINING_WORLD_PLAZA_ACTION_BAR_MOBILE_SCALE : 1);

  return {
    sphereStyle: stylingWorldPlazaViewportHudSquarePx(
      DEFINING_WORLD_PLAZA_ACTION_BAR_BUTTON_BASE_PX,
      viewportHudScale,
      designScale
    ),
    iconSizePx: computingWorldPlazaViewportHudScaledPx(
      DEFINING_WORLD_PLAZA_ACTION_BAR_ICON_BASE_PX,
      viewportHudScale,
      designScale
    ),
  };
}
