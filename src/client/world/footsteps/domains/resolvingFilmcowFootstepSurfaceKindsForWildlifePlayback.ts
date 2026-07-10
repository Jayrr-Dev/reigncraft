import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import type { DefiningFilmcowFootstepSurfaceKind } from '@/components/world/footsteps/domains/definingFilmcowFootstepSfxConstants';
import { resolvingFilmcowFootstepSurfaceAtWorldPoint } from '@/components/world/footsteps/domains/resolvingFilmcowFootstepSurfaceAtWorldPoint';
import { DEFINING_WILDLIFE_FOOTSTEP_MAX_AUDIBLE_DISTANCE_GRID } from '@/components/world/wildlife/domains/definingWildlifeFootstepSfxConstants';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';

function computingWildlifeFootstepDistanceGrid(
  listenerPoint: DefiningWorldPlazaWorldPoint | null,
  sourcePoint: DefiningWorldPlazaWorldPoint
): number {
  if (!listenerPoint) {
    return 0;
  }

  return Math.hypot(
    listenerPoint.x - sourcePoint.x,
    listenerPoint.y - sourcePoint.y
  );
}

/**
 * Resolves the ground surfaces that should be warmed for nearby wildlife footsteps.
 */
export function resolvingFilmcowFootstepSurfaceKindsForWildlifePlayback(
  listenerPoint: DefiningWorldPlazaWorldPoint | null,
  instances: readonly DefiningWildlifeInstance[]
): DefiningFilmcowFootstepSurfaceKind[] {
  const surfaceKinds = new Set<DefiningFilmcowFootstepSurfaceKind>();

  if (listenerPoint) {
    surfaceKinds.add(
      resolvingFilmcowFootstepSurfaceAtWorldPoint(listenerPoint)
    );
  }

  for (const instance of instances) {
    if (instance.isDead) {
      continue;
    }

    const distanceGrid = computingWildlifeFootstepDistanceGrid(
      listenerPoint,
      instance.position
    );

    if (
      listenerPoint &&
      distanceGrid > DEFINING_WILDLIFE_FOOTSTEP_MAX_AUDIBLE_DISTANCE_GRID
    ) {
      continue;
    }

    surfaceKinds.add(
      resolvingFilmcowFootstepSurfaceAtWorldPoint(instance.position)
    );
  }

  return [...surfaceKinds];
}
