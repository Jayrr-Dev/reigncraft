import { computingWorldPlazaViewportHudScaledPx } from '@/components/world/domains/computingWorldPlazaViewportHudScale';
import {
  DEFINING_WORLD_PLAZA_ACTION_BAR_ANCHOR_TOP_BASE_PX,
  DEFINING_WORLD_PLAZA_ACTION_BAR_BUTTON_BASE_PX,
  DEFINING_WORLD_PLAZA_ACTION_BAR_MOBILE_SCALE,
  DEFINING_WORLD_PLAZA_ACTION_BAR_SCALE,
  DEFINING_WORLD_PLAZA_ACTION_BAR_SHELL_PADDING_BASE_PX,
} from '@/components/world/domains/definingWorldPlazaActionBarConstants';

/**
 * Vertical space from the viewport top through the bottom of the action bar shell.
 */
export function computingWorldPlazaActionBarOccupiedHeightPx(
  viewportHudScale: number,
  isMobile = false
): number {
  const designScale =
    DEFINING_WORLD_PLAZA_ACTION_BAR_SCALE *
    (isMobile ? DEFINING_WORLD_PLAZA_ACTION_BAR_MOBILE_SCALE : 1);
  const shellHeightPx = computingWorldPlazaViewportHudScaledPx(
    DEFINING_WORLD_PLAZA_ACTION_BAR_BUTTON_BASE_PX +
      2 * DEFINING_WORLD_PLAZA_ACTION_BAR_SHELL_PADDING_BASE_PX,
    viewportHudScale,
    designScale
  );

  return DEFINING_WORLD_PLAZA_ACTION_BAR_ANCHOR_TOP_BASE_PX + shellHeightPx;
}
