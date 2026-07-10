import {
  DEFINING_FILMCOW_FOOTSTEP_BOOT_PRIORITY_SURFACE_KINDS,
  DEFINING_FILMCOW_FOOTSTEP_CLIP_CATALOG,
  DEFINING_FILMCOW_FOOTSTEP_SURFACE_DEFINITIONS,
  type DefiningFilmcowFootstepClipId,
  type DefiningFilmcowFootstepSurfaceKind,
} from '@/components/world/footsteps/domains/definingFilmcowFootstepSfxConstants';
import { resolvingFilmcowFootstepClipIdsForSurfaces } from '@/components/world/footsteps/domains/resolvingFilmcowFootstepClipIdsForSurfaces';
import { resolvingFilmcowFootstepSfxStarAudioId } from '@/components/world/footsteps/domains/resolvingFilmcowFootstepSfxStarAudioId';
import { resolvingFilmcowFootstepSfxUrl } from '@/components/world/footsteps/domains/resolvingFilmcowFootstepSfxUrl';
import type { Manifest } from 'star-audio';

function buildingFilmcowFootstepStarAudioManifestForClipIds(
  clipIds: readonly DefiningFilmcowFootstepClipId[]
): Manifest {
  const manifest: Manifest = {};

  for (const clipId of clipIds) {
    manifest[resolvingFilmcowFootstepSfxStarAudioId(clipId)] = {
      src: resolvingFilmcowFootstepSfxUrl(clipId),
      group: 'sfx',
    };
  }

  return manifest;
}

/**
 * Builds the star-audio preload manifest for every shipped plaza footstep clip.
 */
export function buildingFilmcowFootstepStarAudioManifest(): Manifest {
  return buildingFilmcowFootstepStarAudioManifestForClipIds(
    Object.keys(
      DEFINING_FILMCOW_FOOTSTEP_CLIP_CATALOG
    ) as DefiningFilmcowFootstepClipId[]
  );
}

/**
 * Builds the boot-priority footstep manifest for common early spawn surfaces.
 */
export function buildingFilmcowFootstepBootPriorityStarAudioManifest(): Manifest {
  return buildingFilmcowFootstepStarAudioManifestForClipIds(
    resolvingFilmcowFootstepClipIdsForSurfaces(
      DEFINING_FILMCOW_FOOTSTEP_BOOT_PRIORITY_SURFACE_KINDS
    )
  );
}

/**
 * Builds the deferred footstep manifest for remaining surfaces.
 */
export function buildingFilmcowFootstepDeferredStarAudioManifest(): Manifest {
  const priorityClipIds = new Set(
    resolvingFilmcowFootstepClipIdsForSurfaces(
      DEFINING_FILMCOW_FOOTSTEP_BOOT_PRIORITY_SURFACE_KINDS
    )
  );
  const prioritySurfaceKinds = new Set<DefiningFilmcowFootstepSurfaceKind>(
    DEFINING_FILMCOW_FOOTSTEP_BOOT_PRIORITY_SURFACE_KINDS
  );
  const deferredSurfaces = (
    Object.keys(
      DEFINING_FILMCOW_FOOTSTEP_SURFACE_DEFINITIONS
    ) as DefiningFilmcowFootstepSurfaceKind[]
  ).filter((surfaceKind) => !prioritySurfaceKinds.has(surfaceKind));

  const deferredClipIds = resolvingFilmcowFootstepClipIdsForSurfaces(
    deferredSurfaces
  ).filter((clipId) => !priorityClipIds.has(clipId));

  return buildingFilmcowFootstepStarAudioManifestForClipIds(deferredClipIds);
}
