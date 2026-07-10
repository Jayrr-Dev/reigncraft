import type { DefiningWorldPlazaCampfireAmbienceClipId } from '@/components/world/fire/domains/definingWorldPlazaCampfireAmbienceConstants';

const DEFINING_WORLD_PLAZA_CAMPFIRE_AMBIENCE_STAR_AUDIO_ID_PREFIX =
  'campfire-ambience.' as const;

/**
 * Stable star-audio manifest key for one campfire ambience clip.
 */
export function resolvingWorldPlazaCampfireAmbienceStarAudioId(
  clipId: DefiningWorldPlazaCampfireAmbienceClipId
): string {
  return `${DEFINING_WORLD_PLAZA_CAMPFIRE_AMBIENCE_STAR_AUDIO_ID_PREFIX}${clipId}`;
}
