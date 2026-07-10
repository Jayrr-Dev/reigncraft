import type { DefiningWorldPlazaCozyTuneId } from '@/components/world/domains/definingWorldPlazaBiomeMusicConstants';

/** Prefix for Cozy Tunes ids inside the star-audio manifest. */
export const DEFINING_WORLD_PLAZA_BIOME_MUSIC_STAR_AUDIO_ID_PREFIX =
  'biome-music.' as const;

/**
 * Maps one Cozy Tunes id to a star-audio manifest key.
 */
export function resolvingWorldPlazaBiomeMusicStarAudioId(
  tuneId: DefiningWorldPlazaCozyTuneId
): string {
  return `${DEFINING_WORLD_PLAZA_BIOME_MUSIC_STAR_AUDIO_ID_PREFIX}${tuneId}`;
}
