import {
  DEFINING_WORLD_PLAZA_COZY_TUNES_CATALOG,
  type DefiningWorldPlazaCozyTuneId,
} from '@/components/world/domains/definingWorldPlazaBiomeMusicConstants';
import { resolvingWorldPlazaBiomeMusicStarAudioId } from '@/components/world/domains/resolvingWorldPlazaBiomeMusicStarAudioId';
import { resolvingWorldPlazaBiomeMusicUrl } from '@/components/world/domains/resolvingWorldPlazaBiomeMusicUrl';
import type { Manifest } from '@/components/world/audio/definingWorldPlazaAudioTypes';

function buildingWorldPlazaBiomeMusicStarAudioManifestEntry(
  tuneId: DefiningWorldPlazaCozyTuneId
): Manifest {
  return {
    [resolvingWorldPlazaBiomeMusicStarAudioId(tuneId)]: {
      src: resolvingWorldPlazaBiomeMusicUrl(tuneId),
      group: 'music',
    },
  };
}

/**
 * Builds the star-audio preload manifest for every shipped Cozy Tunes track.
 */
export function buildingWorldPlazaBiomeMusicStarAudioManifest(): Manifest {
  return buildingWorldPlazaBiomeMusicStarAudioManifestForTuneIds(
    Object.keys(
      DEFINING_WORLD_PLAZA_COZY_TUNES_CATALOG
    ) as DefiningWorldPlazaCozyTuneId[]
  );
}

/**
 * Builds a star-audio preload manifest for one or more Cozy Tunes tracks.
 */
export function buildingWorldPlazaBiomeMusicStarAudioManifestForTuneIds(
  tuneIds: readonly DefiningWorldPlazaCozyTuneId[]
): Manifest {
  const manifest: Manifest = {};

  for (const tuneId of tuneIds) {
    Object.assign(
      manifest,
      buildingWorldPlazaBiomeMusicStarAudioManifestEntry(tuneId)
    );
  }

  return manifest;
}
