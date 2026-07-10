import {
  DEFINING_FILMCOW_FOOTSTEP_CLIP_CATALOG,
  type DefiningFilmcowFootstepClipId,
} from '@/components/world/footsteps/domains/definingFilmcowFootstepSfxConstants';
import { resolvingFilmcowFootstepSfxStarAudioId } from '@/components/world/footsteps/domains/resolvingFilmcowFootstepSfxStarAudioId';
import { resolvingFilmcowFootstepSfxUrl } from '@/components/world/footsteps/domains/resolvingFilmcowFootstepSfxUrl';
import type { Manifest } from 'star-audio';

/**
 * Builds the star-audio preload manifest for every shipped FilmCow footstep clip.
 */
export function buildingFilmcowFootstepStarAudioManifest(): Manifest {
  const manifest: Manifest = {};

  for (const clipId of Object.keys(
    DEFINING_FILMCOW_FOOTSTEP_CLIP_CATALOG
  ) as DefiningFilmcowFootstepClipId[]) {
    manifest[resolvingFilmcowFootstepSfxStarAudioId(clipId)] = {
      src: resolvingFilmcowFootstepSfxUrl(clipId),
      group: 'sfx',
    };
  }

  return manifest;
}
