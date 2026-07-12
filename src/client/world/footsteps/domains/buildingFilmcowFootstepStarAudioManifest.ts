import {
  DEFINING_FILMCOW_FOOTSTEP_BOOT_PRIORITY_SURFACE_KINDS,
  DEFINING_FILMCOW_FOOTSTEP_CLIP_CATALOG,
  type DefiningFilmcowFootstepClipId,
} from '@/components/world/footsteps/domains/definingFilmcowFootstepSfxConstants';
import { resolvingFilmcowFootstepClipIdsForSurfaces } from '@/components/world/footsteps/domains/resolvingFilmcowFootstepClipIdsForSurfaces';
import { resolvingFilmcowFootstepSfxStarAudioId } from '@/components/world/footsteps/domains/resolvingFilmcowFootstepSfxStarAudioId';
import { resolvingFilmcowFootstepSfxUrl } from '@/components/world/footsteps/domains/resolvingFilmcowFootstepSfxUrl';
import type { Manifest } from '@/components/world/audio/definingWorldPlazaAudioTypes';

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

export { buildingFilmcowFootstepStarAudioManifestForClipIds };

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
 * Builds the deferred footstep manifest for every clip not warmed at boot priority.
 */
export function buildingFilmcowFootstepDeferredStarAudioManifest(): Manifest {
  const priorityClipIds = new Set(
    resolvingFilmcowFootstepClipIdsForSurfaces(
      DEFINING_FILMCOW_FOOTSTEP_BOOT_PRIORITY_SURFACE_KINDS
    )
  );
  const deferredClipIds = (
    Object.keys(
      DEFINING_FILMCOW_FOOTSTEP_CLIP_CATALOG
    ) as DefiningFilmcowFootstepClipId[]
  ).filter((clipId) => !priorityClipIds.has(clipId));

  return buildingFilmcowFootstepStarAudioManifestForClipIds(deferredClipIds);
}
