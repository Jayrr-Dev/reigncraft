import { resolvingWorldPlazaPlayerNameLabelScreenPoint } from '@/components/world/domains/resolvingWorldPlazaPlayerNameLabelScreenPoint';
import { DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BAR_OFFSET_BELOW_NAME_LABEL_PX } from '@/components/world/health/domains/definingWorldPlazaEntityHealthBarConstants';

export type ResolvingWorldPlazaEntityHealthBarScreenPointParams = Parameters<
  typeof resolvingWorldPlazaPlayerNameLabelScreenPoint
>[0];

/**
 * Maps an entity health bar to screen coordinates just below the name label.
 */
export function resolvingWorldPlazaEntityHealthBarScreenPoint(
  params: ResolvingWorldPlazaEntityHealthBarScreenPointParams
): {
  x: number;
  y: number;
} {
  const nameLabelPoint = resolvingWorldPlazaPlayerNameLabelScreenPoint(params);

  return {
    x: nameLabelPoint.x,
    y:
      nameLabelPoint.y +
      DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BAR_OFFSET_BELOW_NAME_LABEL_PX *
        params.cameraWorldZoom,
  };
}
