import {
  buildingFilmcowFootstepBootPriorityStarAudioManifest,
  buildingFilmcowFootstepDeferredStarAudioManifest,
  buildingFilmcowFootstepStarAudioManifest,
} from '@/components/world/footsteps/domains/buildingFilmcowFootstepStarAudioManifest';
import type { Manifest } from 'star-audio';

/**
 * Builds the star-audio preload manifest for every shipped avatar footstep clip.
 */
export function buildingWorldPlazaAvatarFootstepStarAudioManifest(): Manifest {
  return buildingFilmcowFootstepStarAudioManifest();
}

/**
 * Builds the boot-priority avatar footstep manifest for common spawn surfaces.
 */
export function buildingWorldPlazaAvatarFootstepBootPriorityStarAudioManifest(): Manifest {
  return buildingFilmcowFootstepBootPriorityStarAudioManifest();
}

/**
 * Builds the deferred avatar footstep manifest for the remaining surfaces.
 */
export function buildingWorldPlazaAvatarFootstepDeferredStarAudioManifest(): Manifest {
  return buildingFilmcowFootstepDeferredStarAudioManifest();
}
