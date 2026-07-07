import { computingWorldPlazaViewportHudScaledPx } from '@/components/world/domains/computingWorldPlazaViewportHudScale';
import { DEFINING_WORLD_PLAZA_GROUND_ITEM_BOTTOM_HUD_OCCLUSION_INSET_BASE_PX } from '@/components/world/inventory/domains/definingWorldPlazaGroundItemConstants';

/**
 * Returns true when a ground item marker projects into the bottom HUD band
 * (hotbar, hunger row, minimap clearance) and should stay hidden.
 */
export function checkingWorldPlazaGroundItemMarkerOccludedByBottomHud(
  screenPointY: number,
  viewportHeightPx: number,
  viewportHudScale: number
): boolean {
  if (viewportHeightPx <= 0) {
    return false;
  }

  const bottomHudBandPx = computingWorldPlazaViewportHudScaledPx(
    DEFINING_WORLD_PLAZA_GROUND_ITEM_BOTTOM_HUD_OCCLUSION_INSET_BASE_PX,
    viewportHudScale
  );

  return screenPointY >= viewportHeightPx - bottomHudBandPx;
}
