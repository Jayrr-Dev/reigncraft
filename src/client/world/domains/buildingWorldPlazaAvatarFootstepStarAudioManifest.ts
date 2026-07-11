import { DEFINING_WORLD_PLAZA_AVATAR_FOOTSTEP_SURFACE_DEFINITIONS } from '@/components/world/domains/definingWorldPlazaAvatarFootstepSurfaceDefinitions';
import { resolvingWorldPlazaAvatarFootstepClipIdsForSurfaces } from '@/components/world/domains/resolvingWorldPlazaAvatarFootstepClipIdsForSurfaces';
import { buildingFilmcowFootstepStarAudioManifestForClipIds } from '@/components/world/footsteps/domains/buildingFilmcowFootstepStarAudioManifest';
import {
  DEFINING_FILMCOW_FOOTSTEP_BOOT_PRIORITY_SURFACE_KINDS,
  type DefiningFilmcowFootstepSurfaceKind,
} from '@/components/world/footsteps/domains/definingFilmcowFootstepSfxConstants';
import type { Manifest } from 'star-audio';

const DEFINING_WORLD_PLAZA_AVATAR_FOOTSTEP_SURFACE_KINDS = Object.keys(
  DEFINING_WORLD_PLAZA_AVATAR_FOOTSTEP_SURFACE_DEFINITIONS
) as DefiningFilmcowFootstepSurfaceKind[];

/**
 * Builds the star-audio preload manifest for every avatar footstep clip in use.
 */
export function buildingWorldPlazaAvatarFootstepStarAudioManifest(): Manifest {
  return buildingWorldPlazaAvatarFootstepStarAudioManifestForSurfaces(
    DEFINING_WORLD_PLAZA_AVATAR_FOOTSTEP_SURFACE_KINDS
  );
}

/**
 * Builds the boot-priority avatar footstep manifest for common spawn surfaces.
 */
export function buildingWorldPlazaAvatarFootstepBootPriorityStarAudioManifest(): Manifest {
  return buildingWorldPlazaAvatarFootstepStarAudioManifestForSurfaces(
    DEFINING_FILMCOW_FOOTSTEP_BOOT_PRIORITY_SURFACE_KINDS
  );
}

/**
 * Builds the deferred avatar footstep manifest for the remaining surfaces.
 */
export function buildingWorldPlazaAvatarFootstepDeferredStarAudioManifest(): Manifest {
  const priorityClipIds = new Set(
    resolvingWorldPlazaAvatarFootstepClipIdsForSurfaces(
      DEFINING_FILMCOW_FOOTSTEP_BOOT_PRIORITY_SURFACE_KINDS
    )
  );
  const deferredClipIds = resolvingWorldPlazaAvatarFootstepClipIdsForSurfaces(
    DEFINING_WORLD_PLAZA_AVATAR_FOOTSTEP_SURFACE_KINDS
  ).filter((clipId) => !priorityClipIds.has(clipId));

  return buildingFilmcowFootstepStarAudioManifestForClipIds(deferredClipIds);
}

/**
 * Builds an avatar footstep manifest for the clips used on one or more surfaces.
 */
export function buildingWorldPlazaAvatarFootstepStarAudioManifestForSurfaces(
  surfaces: readonly DefiningFilmcowFootstepSurfaceKind[]
): Manifest {
  return buildingFilmcowFootstepStarAudioManifestForClipIds(
    resolvingWorldPlazaAvatarFootstepClipIdsForSurfaces(surfaces)
  );
}
