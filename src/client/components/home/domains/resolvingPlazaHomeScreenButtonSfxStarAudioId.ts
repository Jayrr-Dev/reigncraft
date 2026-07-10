import type { DefiningPlazaHomeScreenButtonSfxClipId } from '@/components/home/domains/definingPlazaHomeScreenButtonSfxConstants';

/** Prefix for home screen button ids inside the star-audio manifest. */
export const DEFINING_PLAZA_HOME_SCREEN_BUTTON_SFX_STAR_AUDIO_ID_PREFIX =
  'plaza-home-button' as const;

/**
 * Stable star-audio manifest key for one home screen button clip.
 */
export function resolvingPlazaHomeScreenButtonSfxStarAudioId(
  clipId: DefiningPlazaHomeScreenButtonSfxClipId
): string {
  return `${DEFINING_PLAZA_HOME_SCREEN_BUTTON_SFX_STAR_AUDIO_ID_PREFIX}.${clipId}`;
}
