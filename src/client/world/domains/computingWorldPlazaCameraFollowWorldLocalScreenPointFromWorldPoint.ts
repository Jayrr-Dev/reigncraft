import { computingWorldBuildingWorldLayerScreenOffsetPx } from "@/components/world/building/domains/computingWorldBuildingWorldLayerScreenOffsetPx";
import {
  convertingWorldPlazaGridPointToIsometricScreenPoint,
  type ConvertingWorldPlazaIsometricScreenPoint,
} from "@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint";
import type { DefiningWorldPlazaWorldPoint } from "@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint";
import { resolvingWorldPlazaPlayerWorldLayer } from "@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint";

/**
 * Projects a world point to the screen-local anchor the camera should follow.
 *
 * Includes standing-layer vertical lift so avatars on raised terrain and
 * platforms stay centered instead of drifting toward the top of the viewport.
 *
 * @module components/world/domains/computingWorldPlazaCameraFollowWorldLocalScreenPointFromWorldPoint
 */

/**
 * Returns the unscaled world-local screen point used for camera follow.
 *
 * @param worldPoint - Player position in grid space, including standing layer.
 */
export function computingWorldPlazaCameraFollowWorldLocalScreenPointFromWorldPoint(
  worldPoint: DefiningWorldPlazaWorldPoint,
): ConvertingWorldPlazaIsometricScreenPoint {
  const screenPoint = convertingWorldPlazaGridPointToIsometricScreenPoint(worldPoint);
  const standingLayerOffsetPx = computingWorldBuildingWorldLayerScreenOffsetPx(
    resolvingWorldPlazaPlayerWorldLayer(worldPoint),
  );

  return {
    x: screenPoint.x,
    y: screenPoint.y + standingLayerOffsetPx,
  };
}
