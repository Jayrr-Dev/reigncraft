import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';
import {
  DEFINING_WORLD_PLAZA_BIOME_MUSIC_BY_KIND,
  DEFINING_WORLD_PLAZA_BIOME_MUSIC_NIGHT_OVERRIDES,
  type DefiningWorldPlazaCozyTuneId,
} from '@/components/world/domains/definingWorldPlazaBiomeMusicConstants';

/**
 * Returns the daytime and optional night Cozy Tunes ids for one biome.
 */
export function resolvingWorldPlazaBiomeMusicTuneIdsForBiomeKind(
  biomeKind: DefiningWorldPlazaBiomeKind
): readonly DefiningWorldPlazaCozyTuneId[] {
  const tuneIds = new Set<DefiningWorldPlazaCozyTuneId>();

  tuneIds.add(DEFINING_WORLD_PLAZA_BIOME_MUSIC_BY_KIND[biomeKind]);

  const nightTuneId =
    DEFINING_WORLD_PLAZA_BIOME_MUSIC_NIGHT_OVERRIDES[biomeKind];

  if (nightTuneId) {
    tuneIds.add(nightTuneId);
  }

  return [...tuneIds];
}
