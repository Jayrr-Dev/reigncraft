import { convertingWorldPlazaGridPointToIsometricScreenPoint } from "@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint";
import type { DefiningWorldPlazaCameraOffset } from "@/components/world/domains/definingWorldPlazaCameraOffset";
import { projectingWorldPlazaIsometricWorldLocalToViewportScreenPoint } from "@/components/world/domains/projectingWorldPlazaIsometricScreenPointThroughCamera";
import type { DefiningWorldPlazaWorldPoint } from "@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint";

/**
 * Maps a plaza grid point to viewport screen coordinates for DOM overlays.
 *
 * @param gridPoint - Continuous or tile grid coordinates.
 * @param cameraOffset - Current camera translation.
 * @param cameraWorldZoom - Effective world zoom multiplier.
 */
export function projectingWorldPlazaGridPointToViewportScreenPoint(
  gridPoint: DefiningWorldPlazaWorldPoint,
  cameraOffset: DefiningWorldPlazaCameraOffset,
  cameraWorldZoom: number,
): {
  x: number;
  y: number;
} {
  const worldLocalPoint = convertingWorldPlazaGridPointToIsometricScreenPoint(
    gridPoint,
  );

  return projectingWorldPlazaIsometricWorldLocalToViewportScreenPoint(
    worldLocalPoint,
    cameraOffset,
    cameraWorldZoom,
  );
}
