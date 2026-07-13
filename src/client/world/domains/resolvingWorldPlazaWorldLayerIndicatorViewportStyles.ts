/**
 * Viewport sizing for the action-bar world-layer orb.
 *
 * @module components/world/domains/resolvingWorldPlazaWorldLayerIndicatorViewportStyles
 */

import {
  computingWorldPlazaViewportHudScaledPx,
  stylingWorldPlazaViewportHudSquarePx,
} from '@/components/world/domains/computingWorldPlazaViewportHudScale';
import {
  DEFINING_WORLD_PLAZA_ACTION_BAR_BUTTON_BASE_PX,
  DEFINING_WORLD_PLAZA_ACTION_BAR_MOBILE_SCALE,
  DEFINING_WORLD_PLAZA_ACTION_BAR_SCALE,
} from '@/components/world/domains/definingWorldPlazaActionBarConstants';
import type { CSSProperties } from 'react';

/** Design-space font size for the layer readout inside the orb. */
export const DEFINING_WORLD_PLAZA_WORLD_LAYER_INDICATOR_VALUE_BASE_PX =
  9 as const;

export type DefiningWorldPlazaWorldLayerIndicatorViewportStyles = {
  readonly sphereStyle: CSSProperties;
  readonly valueStyle: CSSProperties;
};

/**
 * Viewport styles that size the world-layer sphere to match action bar buttons.
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

  const valueSizePx = computingWorldPlazaViewportHudScaledPx(
    DEFINING_WORLD_PLAZA_WORLD_LAYER_INDICATOR_VALUE_BASE_PX,
    viewportHudScale,
    designScale
  );

  return {
    sphereStyle: stylingWorldPlazaViewportHudSquarePx(
      DEFINING_WORLD_PLAZA_ACTION_BAR_BUTTON_BASE_PX,
      viewportHudScale,
      designScale
    ),
    valueStyle: {
      fontSize: `${valueSizePx}px`,
      textShadow: '0 1px 1px rgba(0, 0, 0, 0.75), 0 0 2px rgba(0, 0, 0, 0.45)',
    },
  };
}
