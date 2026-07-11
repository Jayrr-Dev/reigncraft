import { buildingWorldPlazaBiomeMusicStarAudioManifestForTuneIds } from '@/components/world/domains/buildingWorldPlazaBiomeMusicStarAudioManifest';
import type { DefiningWorldPlazaCozyTuneId } from '@/components/world/domains/definingWorldPlazaBiomeMusicConstants';
import { resolvingWorldPlazaBiomeMusicTuneIdsForBiomeKind } from '@/components/world/domains/resolvingWorldPlazaBiomeMusicTuneIdsForBiomeKind';
import { DEFINING_WILDLIFE_BOOT_PRELOAD_BIOME_KINDS } from '@/components/world/wildlife/domains/definingWildlifeBootTexturePreloadConstants';
import type { Manifest } from 'star-audio';

/**
 * Builds the boot-priority Cozy Tunes manifest for spawn biomes.
 *
 * Matches the wildlife boot biome set so the first minutes of play have music
 * decoded before the Pixi scene mounts.
 */
export function buildingWorldPlazaBiomeMusicBootStarAudioManifest(): Manifest {
  const tuneIds = new Set<DefiningWorldPlazaCozyTuneId>();

  for (const biomeKind of DEFINING_WILDLIFE_BOOT_PRELOAD_BIOME_KINDS) {
    for (const tuneId of resolvingWorldPlazaBiomeMusicTuneIdsForBiomeKind(
      biomeKind
    )) {
      tuneIds.add(tuneId);
    }
  }

  return buildingWorldPlazaBiomeMusicStarAudioManifestForTuneIds([...tuneIds]);
}
