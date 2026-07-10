import type { DefiningWildlifeStudySfxClipId } from '@/components/world/wildlife/domains/definingWildlifeStudySfxConstants';

/** Prefix for wildlife study ids inside the star-audio manifest. */
export const DEFINING_WILDLIFE_STUDY_SFX_STAR_AUDIO_ID_PREFIX =
  'wildlife-study' as const;

/**
 * Stable star-audio manifest key for one study-complete clip.
 */
export function resolvingWildlifeStudySfxStarAudioId(
  clipId: DefiningWildlifeStudySfxClipId
): string {
  return `${DEFINING_WILDLIFE_STUDY_SFX_STAR_AUDIO_ID_PREFIX}.${clipId}`;
}
