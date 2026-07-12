import type { Manifest } from '@/components/world/audio/definingWorldPlazaAudioTypes';
import {
  DEFINING_WORLD_PLAZA_BIOME_AMBIENCE_CLIP_CATALOG,
  type DefiningWorldPlazaBiomeAmbienceClipId,
} from '@/components/world/domains/definingWorldPlazaBiomeAmbienceConstants';
import { resolvingWorldPlazaBiomeAmbienceStarAudioId } from '@/components/world/domains/resolvingWorldPlazaBiomeAmbienceStarAudioId';
import { resolvingWorldPlazaBiomeAmbienceUrl } from '@/components/world/domains/resolvingWorldPlazaBiomeAmbienceUrl';

/**
 * Builds a manifest for an explicit ambience clip set.
 */
export function buildingWorldPlazaBiomeAmbienceStarAudioManifestForClipIds(
  clipIds: readonly DefiningWorldPlazaBiomeAmbienceClipId[]
): Manifest {
  const manifest: Manifest = {};

  for (const clipId of clipIds) {
    manifest[resolvingWorldPlazaBiomeAmbienceStarAudioId(clipId)] = {
      src: resolvingWorldPlazaBiomeAmbienceUrl(clipId),
      group: 'ambience',
      stream: true,
    };
  }

  return manifest;
}

/** Builds the legacy full ambience manifest for tests and broad tooling. */
export function buildingWorldPlazaBiomeAmbienceStarAudioManifest(): Manifest {
  return buildingWorldPlazaBiomeAmbienceStarAudioManifestForClipIds(
    Object.keys(
      DEFINING_WORLD_PLAZA_BIOME_AMBIENCE_CLIP_CATALOG
    ) as DefiningWorldPlazaBiomeAmbienceClipId[]
  );
}
