import {
  DEFINING_WORLD_PLAZA_CAMERA_FOLLOW_DEAD_ZONE_BOTTOM_MIN_RADIUS_PX,
  DEFINING_WORLD_PLAZA_CAMERA_FOLLOW_DEAD_ZONE_BOTTOM_RADIUS_MULTIPLIER,
  DEFINING_WORLD_PLAZA_CAMERA_FOLLOW_DEAD_ZONE_MIN_RADIUS_PX,
  DEFINING_WORLD_PLAZA_CAMERA_FOLLOW_DEAD_ZONE_SCREEN_FRACTION,
  DEFINING_WORLD_PLAZA_CAMERA_FOLLOW_DEAD_ZONE_TOP_MIN_RADIUS_PX,
  DEFINING_WORLD_PLAZA_CAMERA_FOLLOW_DEAD_ZONE_TOP_RADIUS_MULTIPLIER,
  DEFINING_WORLD_PLAZA_CAMERA_MOBILE_FOLLOW_DEAD_ZONE_BOTTOM_MIN_RADIUS_PX,
  DEFINING_WORLD_PLAZA_CAMERA_MOBILE_FOLLOW_DEAD_ZONE_BOTTOM_RADIUS_MULTIPLIER,
  DEFINING_WORLD_PLAZA_CAMERA_MOBILE_FOLLOW_DEAD_ZONE_MIN_RADIUS_PX,
  DEFINING_WORLD_PLAZA_CAMERA_MOBILE_FOLLOW_DEAD_ZONE_SCREEN_FRACTION,
  DEFINING_WORLD_PLAZA_CAMERA_MOBILE_FOLLOW_DEAD_ZONE_TOP_MIN_RADIUS_PX,
  DEFINING_WORLD_PLAZA_CAMERA_MOBILE_FOLLOW_DEAD_ZONE_TOP_RADIUS_MULTIPLIER,
  DEFINING_WORLD_PLAZA_CAMERA_ZOOM,
} from "@/components/world/domains/definingWorldPlazaCameraConstants";
import type { DefiningWorldPlazaCameraOffset } from "@/components/world/domains/definingWorldPlazaCameraOffset";
import type { ConvertingWorldPlazaIsometricScreenPoint } from "@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint";
import {
  computingWorldPlazaCameraOffsetForPlayerCenter,
  projectingWorldPlazaIsometricWorldLocalToViewportScreenPoint,
} from "@/components/world/domains/projectingWorldPlazaIsometricScreenPointThroughCamera";
import type { DefiningWorldPlazaPixiViewportSize } from "@/components/world/domains/resolvingWorldPlazaPixiViewportSize";

/** Axis-aligned follow dead-zone half-extents in viewport pixels. */
export interface DefiningWorldPlazaCameraFollowDeadZoneHalfExtentsPx {
  /** Half-width on the left and right. */
  halfWidthPx: number;
  /** Half-height toward the top of the screen (smaller = earlier follow). */
  halfHeightTopPx: number;
  /** Half-height toward the bottom of the screen (larger = later follow). */
  halfHeightBottomPx: number;
}

/**
 * Resolves the base follow dead-zone radius for the current viewport.
 *
 * @param viewportSize - Live Pixi screen dimensions.
 * @param isMobile - True on narrow viewports where the dead zone is widened.
 */
export function resolvingWorldPlazaCameraFollowDeadZoneRadiusPx(
  viewportSize: DefiningWorldPlazaPixiViewportSize,
  isMobile = false,
): number {
  const minViewportDimensionPx = Math.min(
    viewportSize.width,
    viewportSize.height,
  );
  const minRadiusPx = isMobile
    ? DEFINING_WORLD_PLAZA_CAMERA_MOBILE_FOLLOW_DEAD_ZONE_MIN_RADIUS_PX
    : DEFINING_WORLD_PLAZA_CAMERA_FOLLOW_DEAD_ZONE_MIN_RADIUS_PX;
  const screenFraction = isMobile
    ? DEFINING_WORLD_PLAZA_CAMERA_MOBILE_FOLLOW_DEAD_ZONE_SCREEN_FRACTION
    : DEFINING_WORLD_PLAZA_CAMERA_FOLLOW_DEAD_ZONE_SCREEN_FRACTION;

  return Math.max(
    minRadiusPx,
    minViewportDimensionPx * screenFraction,
  );
}

/**
 * Resolves asymmetric dead-zone half-extents. The top edge is tighter and the
 * bottom edge is wider so upward movement follows sooner and downward later.
 *
 * @param viewportSize - Live Pixi screen dimensions.
 * @param isMobile - True on narrow viewports where the dead zone is widened.
 */
export function resolvingWorldPlazaCameraFollowDeadZoneHalfExtentsPx(
  viewportSize: DefiningWorldPlazaPixiViewportSize,
  isMobile = false,
): DefiningWorldPlazaCameraFollowDeadZoneHalfExtentsPx {
  const baseRadiusPx = resolvingWorldPlazaCameraFollowDeadZoneRadiusPx(
    viewportSize,
    isMobile,
  );
  const topMinRadiusPx = isMobile
    ? DEFINING_WORLD_PLAZA_CAMERA_MOBILE_FOLLOW_DEAD_ZONE_TOP_MIN_RADIUS_PX
    : DEFINING_WORLD_PLAZA_CAMERA_FOLLOW_DEAD_ZONE_TOP_MIN_RADIUS_PX;
  const topRadiusMultiplier = isMobile
    ? DEFINING_WORLD_PLAZA_CAMERA_MOBILE_FOLLOW_DEAD_ZONE_TOP_RADIUS_MULTIPLIER
    : DEFINING_WORLD_PLAZA_CAMERA_FOLLOW_DEAD_ZONE_TOP_RADIUS_MULTIPLIER;
  const bottomMinRadiusPx = isMobile
    ? DEFINING_WORLD_PLAZA_CAMERA_MOBILE_FOLLOW_DEAD_ZONE_BOTTOM_MIN_RADIUS_PX
    : DEFINING_WORLD_PLAZA_CAMERA_FOLLOW_DEAD_ZONE_BOTTOM_MIN_RADIUS_PX;
  const bottomRadiusMultiplier = isMobile
    ? DEFINING_WORLD_PLAZA_CAMERA_MOBILE_FOLLOW_DEAD_ZONE_BOTTOM_RADIUS_MULTIPLIER
    : DEFINING_WORLD_PLAZA_CAMERA_FOLLOW_DEAD_ZONE_BOTTOM_RADIUS_MULTIPLIER;

  return {
    halfWidthPx: baseRadiusPx,
    halfHeightTopPx: Math.max(
      topMinRadiusPx,
      baseRadiusPx * topRadiusMultiplier,
    ),
    halfHeightBottomPx: Math.max(
      bottomMinRadiusPx,
      baseRadiusPx * bottomRadiusMultiplier,
    ),
  };
}

/**
 * Computes the next camera offset with a centered dead zone before follow begins.
 *
 * While the player stays inside the dead zone, the prior offset is kept. Once
 * they cross an edge, the camera pans just enough to pin them on the boundary.
 *
 * @param playerWorldLocalPoint - Unscaled grid projection for the player.
 * @param viewportSize - Live Pixi screen dimensions.
 * @param currentCameraOffset - Camera offset from the previous frame.
 * @param deadZoneHalfExtentsPx - Axis-aligned follow dead-zone half-extents.
 */
export function computingWorldPlazaCameraOffsetWithFollowDeadZone(
  playerWorldLocalPoint: ConvertingWorldPlazaIsometricScreenPoint,
  viewportSize: DefiningWorldPlazaPixiViewportSize,
  currentCameraOffset: DefiningWorldPlazaCameraOffset,
  deadZoneHalfExtentsPx: DefiningWorldPlazaCameraFollowDeadZoneHalfExtentsPx,
  worldZoom: number = DEFINING_WORLD_PLAZA_CAMERA_ZOOM,
): DefiningWorldPlazaCameraOffset {
  const playerViewportPoint =
    projectingWorldPlazaIsometricWorldLocalToViewportScreenPoint(
      playerWorldLocalPoint,
      currentCameraOffset,
      worldZoom,
    );
  const viewportCenterX = viewportSize.width / 2;
  const viewportCenterY = viewportSize.height / 2;
  const deltaX = playerViewportPoint.x - viewportCenterX;
  const deltaY = playerViewportPoint.y - viewportCenterY;
  const { halfWidthPx, halfHeightTopPx, halfHeightBottomPx } =
    deadZoneHalfExtentsPx;

  const isInsideDeadZone =
    Math.abs(deltaX) <= halfWidthPx &&
    deltaY >= -halfHeightTopPx &&
    deltaY <= halfHeightBottomPx;

  if (isInsideDeadZone) {
    return {
      x: currentCameraOffset.x,
      y: currentCameraOffset.y,
    };
  }

  const clampedDeltaX = Math.max(
    -halfWidthPx,
    Math.min(halfWidthPx, deltaX),
  );
  const clampedDeltaY = Math.max(
    -halfHeightTopPx,
    Math.min(halfHeightBottomPx, deltaY),
  );
  const desiredPlayerViewportX = viewportCenterX + clampedDeltaX;
  const desiredPlayerViewportY = viewportCenterY + clampedDeltaY;

  return {
    x: desiredPlayerViewportX - playerWorldLocalPoint.x * worldZoom,
    y: desiredPlayerViewportY - playerWorldLocalPoint.y * worldZoom,
  };
}

/**
 * Computes the camera offset for this frame, centering once then applying the
 * follow dead zone on later frames.
 *
 * @param playerWorldLocalPoint - Unscaled grid projection for the player.
 * @param viewportSize - Live Pixi screen dimensions.
 * @param currentCameraOffset - Camera offset from the previous frame.
 * @param hasInitializedCamera - Whether the camera has centered on the player once.
 * @param worldZoom - Active world-container zoom for this frame.
 * @param isMobile - True on narrow viewports where the dead zone is widened.
 */
export function computingWorldPlazaCameraOffsetForPlayerFollow(
  playerWorldLocalPoint: ConvertingWorldPlazaIsometricScreenPoint,
  viewportSize: DefiningWorldPlazaPixiViewportSize,
  currentCameraOffset: DefiningWorldPlazaCameraOffset,
  hasInitializedCamera: boolean,
  worldZoom: number = DEFINING_WORLD_PLAZA_CAMERA_ZOOM,
  isMobile = false,
): DefiningWorldPlazaCameraOffset {
  if (!hasInitializedCamera) {
    return computingWorldPlazaCameraOffsetForPlayerCenter(
      playerWorldLocalPoint,
      viewportSize,
      worldZoom,
    );
  }

  return computingWorldPlazaCameraOffsetWithFollowDeadZone(
    playerWorldLocalPoint,
    viewportSize,
    currentCameraOffset,
    resolvingWorldPlazaCameraFollowDeadZoneHalfExtentsPx(viewportSize, isMobile),
    worldZoom,
  );
}
