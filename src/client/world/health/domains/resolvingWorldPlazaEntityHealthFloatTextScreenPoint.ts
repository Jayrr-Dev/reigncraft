import {
  DEFINING_WORLD_PLAZA_ENTITY_HEALTH_FLOAT_TEXT_OFFSET_ABOVE_BAR_PX,
  DEFINING_WORLD_PLAZA_ENTITY_HEALTH_FLOAT_TEXT_STACK_GAP_PX,
} from '@/components/world/health/domains/definingWorldPlazaEntityHealthFloatTextConstants';
import { resolvingWorldPlazaEntityHealthBarScreenPoint } from '@/components/world/health/domains/resolvingWorldPlazaEntityHealthBarScreenPoint';

export type ResolvingWorldPlazaEntityHealthFloatTextScreenPointParams =
  Parameters<typeof resolvingWorldPlazaEntityHealthBarScreenPoint>[0] & {
    stackIndex: number;
  };

/**
 * Maps a combat float to screen coordinates above the health bar.
 */
export function resolvingWorldPlazaEntityHealthFloatTextScreenPoint({
  stackIndex,
  ...params
}: ResolvingWorldPlazaEntityHealthFloatTextScreenPointParams): {
  x: number;
  y: number;
} {
  const healthBarPoint = resolvingWorldPlazaEntityHealthBarScreenPoint(params);

  return {
    x: healthBarPoint.x,
    y:
      healthBarPoint.y -
      (DEFINING_WORLD_PLAZA_ENTITY_HEALTH_FLOAT_TEXT_OFFSET_ABOVE_BAR_PX +
        stackIndex *
          DEFINING_WORLD_PLAZA_ENTITY_HEALTH_FLOAT_TEXT_STACK_GAP_PX) *
        params.cameraWorldZoom,
  };
}
