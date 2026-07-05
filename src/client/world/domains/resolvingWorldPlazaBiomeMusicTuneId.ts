import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';
import {
  DEFINING_WORLD_PLAZA_BIOME_MUSIC_BY_KIND,
  DEFINING_WORLD_PLAZA_BIOME_MUSIC_NIGHT_OVERRIDES,
  type DefiningWorldPlazaCozyTuneId,
} from '@/components/world/domains/definingWorldPlazaBiomeMusicConstants';

/**
 * Picks the Cozy Tunes track for one biome and time of day.
 */
export function resolvingWorldPlazaBiomeMusicTuneId(
  biomeKind: DefiningWorldPlazaBiomeKind,
  isDaytime: boolean
): DefiningWorldPlazaCozyTuneId {
  if (!isDaytime) {
    const nightTrack =
      DEFINING_WORLD_PLAZA_BIOME_MUSIC_NIGHT_OVERRIDES[biomeKind];

    if (nightTrack) {
      return nightTrack;
    }
  }

  return DEFINING_WORLD_PLAZA_BIOME_MUSIC_BY_KIND[biomeKind];
}
