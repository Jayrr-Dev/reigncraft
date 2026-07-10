import type { DefiningWorldPlazaBiomeAmbienceClipId } from '@/components/world/domains/definingWorldPlazaBiomeAmbienceConstants';

/** Prefix for biome ambience ids inside the star-audio manifest. */
export const DEFINING_WORLD_PLAZA_BIOME_AMBIENCE_STAR_AUDIO_ID_PREFIX =
  'biome-ambience.' as const;

/**
 * Maps one FilmCow ambience clip id to a star-audio manifest key.
 */
export function resolvingWorldPlazaBiomeAmbienceStarAudioId(
  clipId: DefiningWorldPlazaBiomeAmbienceClipId
): string {
  return `${DEFINING_WORLD_PLAZA_BIOME_AMBIENCE_STAR_AUDIO_ID_PREFIX}${clipId}`;
}
