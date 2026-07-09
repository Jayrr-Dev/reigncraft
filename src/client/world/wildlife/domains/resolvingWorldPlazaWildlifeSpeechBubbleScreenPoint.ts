import { computingWorldBuildingWorldLayerScreenOffsetPx } from '@/components/world/building/domains/computingWorldBuildingWorldLayerScreenOffsetPx';
import { convertingWorldPlazaGridPointToIsometricScreenPoint } from '@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint';
import type { DefiningWorldPlazaCameraOffset } from '@/components/world/domains/definingWorldPlazaCameraOffset';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaPlayerWorldLayer } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { projectingWorldPlazaIsometricWorldLocalToViewportScreenPoint } from '@/components/world/domains/projectingWorldPlazaIsometricScreenPointThroughCamera';
import { computingWildlifeSpeechOffsetAboveAnchorPx } from '@/components/world/wildlife/domains/computingWildlifeSpeechBubbleScreenOffset';

export type ResolvingWorldPlazaWildlifeSpeechBubbleScreenPointParams = {
  gridPoint: DefiningWorldPlazaWorldPoint;
  sizeScale: number;
  cameraOffset: DefiningWorldPlazaCameraOffset;
  cameraWorldZoom: number;
  /** Sheet frame height for head-lift math. */
  frameHeightPx?: number;
  /** Airborne visual lift while jumping (screen px). */
  jumpArcOffsetPx?: number;
};

/**
 * Maps wildlife speech text to screen coordinates directly above the sprite head.
 */
export function resolvingWorldPlazaWildlifeSpeechBubbleScreenPoint({
  gridPoint,
  sizeScale,
  cameraOffset,
  cameraWorldZoom,
  frameHeightPx,
  jumpArcOffsetPx = 0,
}: ResolvingWorldPlazaWildlifeSpeechBubbleScreenPointParams): {
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
  const speechLiftPx = computingWildlifeSpeechOffsetAboveAnchorPx(
    sizeScale,
    frameHeightPx
  );

  return {
    x: viewportPoint.x,
    y:
      viewportPoint.y +
      standingLayerOffsetPx * cameraWorldZoom -
      jumpArcOffsetPx * cameraWorldZoom -
      speechLiftPx * cameraWorldZoom,
  };
}
