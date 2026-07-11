import { computingWorldBuildingWorldLayerScreenOffsetPx } from '@/components/world/building/domains/computingWorldBuildingWorldLayerScreenOffsetPx';
import { convertingWorldPlazaGridPointToIsometricScreenPoint } from '@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint';
import type { DefiningWorldPlazaCameraOffset } from '@/components/world/domains/definingWorldPlazaCameraOffset';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaPlayerWorldLayer } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { projectingWorldPlazaIsometricWorldLocalToViewportScreenPoint } from '@/components/world/domains/projectingWorldPlazaIsometricScreenPointThroughCamera';
import {
  DEFINING_WORLD_PLAZA_ENTITY_HEALTH_FLOAT_TEXT_OFFSET_ABOVE_AVATAR_PX,
  DEFINING_WORLD_PLAZA_ENTITY_HEALTH_FLOAT_TEXT_STACK_GAP_PX,
} from '@/components/world/health/domains/definingWorldPlazaEntityHealthFloatTextConstants';
import { DEFINING_WILDLIFE_VITALS_BAR_LIFT_PX } from '@/components/world/wildlife/domains/definingWildlifeVitalsBarConstants';

export type ResolvingWorldPlazaWildlifeHealthFloatTextScreenPointParams = {
  gridPoint: DefiningWorldPlazaWorldPoint;
  sizeScale: number;
  cameraOffset: DefiningWorldPlazaCameraOffset;
  cameraWorldZoom: number;
  stackIndex: number;
  /** Airborne visual lift while jumping (screen px). */
  jumpArcOffsetPx?: number;
};

/**
 * Maps a wildlife combat float to screen coordinates above the sprite head.
 */
export function resolvingWorldPlazaWildlifeHealthFloatTextScreenPoint({
  gridPoint,
  sizeScale,
  cameraOffset,
  cameraWorldZoom,
  stackIndex,
  jumpArcOffsetPx = 0,
}: ResolvingWorldPlazaWildlifeHealthFloatTextScreenPointParams): {
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
  const barLiftPx = DEFINING_WILDLIFE_VITALS_BAR_LIFT_PX * sizeScale;

  return {
    x: viewportPoint.x,
    y:
      viewportPoint.y +
      standingLayerOffsetPx * cameraWorldZoom -
      jumpArcOffsetPx * cameraWorldZoom -
      barLiftPx * cameraWorldZoom -
      (DEFINING_WORLD_PLAZA_ENTITY_HEALTH_FLOAT_TEXT_OFFSET_ABOVE_AVATAR_PX +
        stackIndex *
          DEFINING_WORLD_PLAZA_ENTITY_HEALTH_FLOAT_TEXT_STACK_GAP_PX) *
        cameraWorldZoom,
  };
}
