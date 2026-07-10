import {
  DEFINING_WORLD_PLAZA_CAMPFIRE_AMBIENCE_SFX_CLIP_CATALOG,
  type DefiningWorldPlazaCampfireAmbienceClipId,
} from '@/components/world/fire/domains/definingWorldPlazaCampfireAmbienceConstants';
import { resolvingWorldPlazaCampfireAmbienceSfxUrl } from '@/components/world/fire/domains/resolvingWorldPlazaCampfireAmbienceSfxUrl';
import { resolvingWorldPlazaCampfireAmbienceStarAudioId } from '@/components/world/fire/domains/resolvingWorldPlazaCampfireAmbienceStarAudioId';
import type { Manifest } from 'star-audio';

/**
 * Builds the star-audio preload manifest for lit campfire ambience loops.
 */
export function buildingWorldPlazaCampfireAmbienceStarAudioManifest(): Manifest {
  const manifest: Manifest = {};

  for (const clipId of Object.keys(
    DEFINING_WORLD_PLAZA_CAMPFIRE_AMBIENCE_SFX_CLIP_CATALOG
  ) as DefiningWorldPlazaCampfireAmbienceClipId[]) {
    manifest[resolvingWorldPlazaCampfireAmbienceStarAudioId(clipId)] = {
      src: resolvingWorldPlazaCampfireAmbienceSfxUrl(clipId),
      group: 'sfx',
    };
  }

  return manifest;
}
