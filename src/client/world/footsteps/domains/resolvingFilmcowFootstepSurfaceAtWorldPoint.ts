import {
  DEFINING_FILMCOW_BIOME_FOOTSTEP_SURFACE_BY_KIND,
  type DefiningFilmcowFootstepSurfaceKind,
} from '@/components/world/footsteps/domains/definingFilmcowFootstepSfxConstants';
import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaBiomeAtWorldPoint } from '@/components/world/domains/resolvingWorldPlazaBiomeAtWorldPoint';

/**
 * Resolves the footstep surface for one plaza biome.
 */
export function resolvingFilmcowFootstepSurfaceForBiomeKind(
  biomeKind: DefiningWorldPlazaBiomeKind
): DefiningFilmcowFootstepSurfaceKind {
  return DEFINING_FILMCOW_BIOME_FOOTSTEP_SURFACE_BY_KIND[biomeKind];
}

/**
 * Resolves the footstep surface under one world point.
 */
export function resolvingFilmcowFootstepSurfaceAtWorldPoint(
  worldPoint: DefiningWorldPlazaWorldPoint | null | undefined
): DefiningFilmcowFootstepSurfaceKind {
  if (!worldPoint) {
    return DEFINING_FILMCOW_BIOME_FOOTSTEP_SURFACE_BY_KIND.plains;
  }

  const biome = resolvingWorldPlazaBiomeAtWorldPoint(worldPoint);

  return resolvingFilmcowFootstepSurfaceForBiomeKind(biome.kind);
}
