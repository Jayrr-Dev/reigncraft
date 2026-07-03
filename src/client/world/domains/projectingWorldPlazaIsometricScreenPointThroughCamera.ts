import type { DefiningWorldPlazaCameraOffset } from "@/components/world/domains/definingWorldPlazaCameraOffset";
import { DEFINING_WORLD_PLAZA_CAMERA_ZOOM } from "@/components/world/domains/definingWorldPlazaCameraConstants";
import type { ConvertingWorldPlazaIsometricScreenPoint } from "@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint";
import type { DefiningWorldPlazaPixiViewportSize } from "@/components/world/domains/resolvingWorldPlazaPixiViewportSize";

/**
 * Maps an isometric world-local point to viewport screen space with zoom applied.
 *
 * @param worldLocalPoint - Unscaled grid projection in world container space.
 * @param cameraOffset - Current world container translation.
 */
export function projectingWorldPlazaIsometricWorldLocalToViewportScreenPoint(
  worldLocalPoint: ConvertingWorldPlazaIsometricScreenPoint,
  cameraOffset: DefiningWorldPlazaCameraOffset,
  worldZoom: number = DEFINING_WORLD_PLAZA_CAMERA_ZOOM,
): ConvertingWorldPlazaIsometricScreenPoint {
  return {
    x: worldLocalPoint.x * worldZoom + cameraOffset.x,
    y: worldLocalPoint.y * worldZoom + cameraOffset.y,
  };
}

/**
 * Inverse of {@link projectingWorldPlazaIsometricWorldLocalToViewportScreenPoint}.
 *
 * @param viewportPoint - Pointer or overlay position in viewport screen space.
 * @param cameraOffset - Current world container translation.
 */
export function projectingWorldPlazaViewportScreenPointToIsometricWorldLocal(
  viewportPoint: ConvertingWorldPlazaIsometricScreenPoint,
  cameraOffset: DefiningWorldPlazaCameraOffset,
  worldZoom: number = DEFINING_WORLD_PLAZA_CAMERA_ZOOM,
): ConvertingWorldPlazaIsometricScreenPoint {
  return {
    x: (viewportPoint.x - cameraOffset.x) / worldZoom,
    y: (viewportPoint.y - cameraOffset.y) / worldZoom,
  };
}

/**
 * Computes the world container offset that keeps the player centered at the
 * current zoom level.
 *
 * @param playerWorldLocalPoint - Unscaled grid projection for the player.
 * @param viewportSize - Live Pixi screen dimensions.
 */
export function computingWorldPlazaCameraOffsetForPlayerCenter(
  playerWorldLocalPoint: ConvertingWorldPlazaIsometricScreenPoint,
  viewportSize: DefiningWorldPlazaPixiViewportSize,
  worldZoom: number = DEFINING_WORLD_PLAZA_CAMERA_ZOOM,
): DefiningWorldPlazaCameraOffset {
  return {
    x: viewportSize.width / 2 - playerWorldLocalPoint.x * worldZoom,
    y: viewportSize.height / 2 - playerWorldLocalPoint.y * worldZoom,
  };
}
