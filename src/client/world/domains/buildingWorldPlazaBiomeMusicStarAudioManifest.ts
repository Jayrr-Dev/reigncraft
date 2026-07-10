import {
  DEFINING_WORLD_PLAZA_COZY_TUNES_CATALOG,
  type DefiningWorldPlazaCozyTuneId,
} from '@/components/world/domains/definingWorldPlazaBiomeMusicConstants';
import { resolvingWorldPlazaBiomeMusicStarAudioId } from '@/components/world/domains/resolvingWorldPlazaBiomeMusicStarAudioId';
import { resolvingWorldPlazaBiomeMusicUrl } from '@/components/world/domains/resolvingWorldPlazaBiomeMusicUrl';
import type { Manifest } from 'star-audio';

/**
 * Builds the star-audio preload manifest for every shipped Cozy Tunes track.
 */
export function buildingWorldPlazaBiomeMusicStarAudioManifest(): Manifest {
  const manifest: Manifest = {};

  for (const tuneId of Object.keys(
    DEFINING_WORLD_PLAZA_COZY_TUNES_CATALOG
  ) as DefiningWorldPlazaCozyTuneId[]) {
    manifest[resolvingWorldPlazaBiomeMusicStarAudioId(tuneId)] = {
      src: resolvingWorldPlazaBiomeMusicUrl(tuneId),
      group: 'music',
    };
  }

  return manifest;
}
