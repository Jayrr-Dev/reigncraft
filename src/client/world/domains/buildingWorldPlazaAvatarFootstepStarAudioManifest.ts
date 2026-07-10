import { buildingFilmcowFootstepStarAudioManifest } from '@/components/world/footsteps/domains/buildingFilmcowFootstepStarAudioManifest';
import type { Manifest } from 'star-audio';

/**
 * Builds the star-audio preload manifest for every shipped avatar footstep clip.
 */
export function buildingWorldPlazaAvatarFootstepStarAudioManifest(): Manifest {
  return buildingFilmcowFootstepStarAudioManifest();
}
