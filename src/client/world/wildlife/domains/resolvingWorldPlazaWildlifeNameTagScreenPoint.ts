import { computingWorldBuildingWorldLayerScreenOffsetPx } from '@/components/world/building/domains/computingWorldBuildingWorldLayerScreenOffsetPx';
import { convertingWorldPlazaGridPointToIsometricScreenPoint } from '@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint';
import type { DefiningWorldPlazaCameraOffset } from '@/components/world/domains/definingWorldPlazaCameraOffset';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaPlayerWorldLayer } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { projectingWorldPlazaIsometricWorldLocalToViewportScreenPoint } from '@/components/world/domains/projectingWorldPlazaIsometricScreenPointThroughCamera';
import { computingWildlifeNameTagOffsetAboveAnchorPx } from '@/components/world/wildlife/domains/computingWildlifeNameTagScreenOffset';

export type ResolvingWorldPlazaWildlifeNameTagScreenPointParams = {
  gridPoint: DefiningWorldPlazaWorldPoint;
  sizeScale: number;
  cameraOffset: DefiningWorldPlazaCameraOffset;
  cameraWorldZoom: number;
  /** Airborne visual lift while jumping (screen px). */
  jumpArcOffsetPx?: number;
};

/**
 * Maps a wildlife name tag to screen coordinates just above the sprite head,
 * below combat floats and speech bubbles.
 */
export function resolvingWorldPlazaWildlifeNameTagScreenPoint({
  gridPoint,
  sizeScale,
  cameraOffset,
  cameraWorldZoom,
  jumpArcOffsetPx = 0,
}: ResolvingWorldPlazaWildlifeNameTagScreenPointParams): {
  x: number;
  y: number;
} {
  const worldLocalPoint =
    convertingWorldPlazaGridPointToIsometricScreenPoint(gridPoint);
  const standingLayerOffsetPx = computingWorldBuildingWorldLayerScreenOffsetPx(
    resolvingWorldPlazaPlayerWorldLayer(gridPoint)
  );
  const viewportPoint =
    projectingWorldPlazaIsometricWorldLocalToViewportScreenPoint(
      worldLocalPoint,
      cameraOffset,
      cameraWorldZoom
    );
  const nameTagLiftPx = computingWildlifeNameTagOffsetAboveAnchorPx(sizeScale);

  return {
    x: viewportPoint.x,
    y:
      viewportPoint.y +
      standingLayerOffsetPx * cameraWorldZoom -
      jumpArcOffsetPx * cameraWorldZoom -
      nameTagLiftPx * cameraWorldZoom,
  };
}
