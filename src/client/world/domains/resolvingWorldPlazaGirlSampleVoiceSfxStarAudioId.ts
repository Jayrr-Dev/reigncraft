import type { DefiningWorldPlazaGirlSampleVoiceClipId } from '@/components/world/domains/definingWorldPlazaGirlSampleVoiceSfxConstants';

/** Prefix for girl voice ids inside the star-audio manifest. */
export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_VOICE_STAR_AUDIO_ID_PREFIX =
  'girl-sample-voice.' as const;

/**
 * Maps one girl voice clip id to a star-audio manifest key.
 */
export function resolvingWorldPlazaGirlSampleVoiceSfxStarAudioId(
  clipId: DefiningWorldPlazaGirlSampleVoiceClipId
): string {
  return `${DEFINING_WORLD_PLAZA_GIRL_SAMPLE_VOICE_STAR_AUDIO_ID_PREFIX}${clipId}`;
}
