import type { DefiningWorldPlazaLavaAmbienceClipId } from '@/components/world/fire/domains/definingWorldPlazaLavaAmbienceConstants';

const RESOLVING_WORLD_PLAZA_LAVA_AMBIENCE_STAR_AUDIO_ID_PREFIX =
  'lava-ambience.' as const;

/**
 * Stable star-audio manifest key for one lava ambience clip.
 */
export function resolvingWorldPlazaLavaAmbienceStarAudioId(
  clipId: DefiningWorldPlazaLavaAmbienceClipId
): string {
  return `${RESOLVING_WORLD_PLAZA_LAVA_AMBIENCE_STAR_AUDIO_ID_PREFIX}${clipId}`;
}
