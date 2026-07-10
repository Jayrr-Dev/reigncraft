import type { DefiningPlazaBookSfxClipId } from '@/components/home/domains/definingPlazaBookSfxConstants';

/** Prefix for book UI ids inside the star-audio manifest. */
export const DEFINING_PLAZA_BOOK_SFX_STAR_AUDIO_ID_PREFIX =
  'plaza-book' as const;

/**
 * Stable star-audio manifest key for one book UI clip.
 */
export function resolvingPlazaBookSfxStarAudioId(
  clipId: DefiningPlazaBookSfxClipId
): string {
  return `${DEFINING_PLAZA_BOOK_SFX_STAR_AUDIO_ID_PREFIX}.${clipId}`;
}
