import {
  DEFINING_WORLD_PLAZA_LAVA_AMBIENCE_SFX_CLIP_CATALOG,
  type DefiningWorldPlazaLavaAmbienceClipId,
} from '@/components/world/fire/domains/definingWorldPlazaLavaAmbienceConstants';
import { resolvingWorldPlazaLavaAmbienceSfxUrl } from '@/components/world/fire/domains/resolvingWorldPlazaLavaAmbienceSfxUrl';
import { resolvingWorldPlazaLavaAmbienceStarAudioId } from '@/components/world/fire/domains/resolvingWorldPlazaLavaAmbienceStarAudioId';
import type { Manifest } from 'star-audio';

/**
 * Builds the star-audio preload manifest for lava proximity ambience loops.
 */
export function buildingWorldPlazaLavaAmbienceStarAudioManifest(): Manifest {
  const manifest: Manifest = {};

  for (const clipId of Object.keys(
    DEFINING_WORLD_PLAZA_LAVA_AMBIENCE_SFX_CLIP_CATALOG
  ) as DefiningWorldPlazaLavaAmbienceClipId[]) {
    manifest[resolvingWorldPlazaLavaAmbienceStarAudioId(clipId)] = {
      src: resolvingWorldPlazaLavaAmbienceSfxUrl(clipId),
      group: 'sfx',
    };
  }

  return manifest;
}
