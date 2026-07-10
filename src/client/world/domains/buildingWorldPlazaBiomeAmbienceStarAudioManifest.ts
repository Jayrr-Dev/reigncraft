import {
  DEFINING_WORLD_PLAZA_BIOME_AMBIENCE_CLIP_CATALOG,
  type DefiningWorldPlazaBiomeAmbienceClipId,
} from '@/components/world/domains/definingWorldPlazaBiomeAmbienceConstants';
import { resolvingWorldPlazaBiomeAmbienceStarAudioId } from '@/components/world/domains/resolvingWorldPlazaBiomeAmbienceStarAudioId';
import { resolvingWorldPlazaBiomeAmbienceUrl } from '@/components/world/domains/resolvingWorldPlazaBiomeAmbienceUrl';
import type { Manifest } from 'star-audio';

/**
 * Builds the star-audio preload manifest for every shipped ambience loop.
 */
export function buildingWorldPlazaBiomeAmbienceStarAudioManifest(): Manifest {
  const manifest: Manifest = {};

  for (const clipId of Object.keys(
    DEFINING_WORLD_PLAZA_BIOME_AMBIENCE_CLIP_CATALOG
  ) as DefiningWorldPlazaBiomeAmbienceClipId[]) {
    manifest[resolvingWorldPlazaBiomeAmbienceStarAudioId(clipId)] = {
      src: resolvingWorldPlazaBiomeAmbienceUrl(clipId),
      group: 'sfx',
    };
  }

  return manifest;
}
