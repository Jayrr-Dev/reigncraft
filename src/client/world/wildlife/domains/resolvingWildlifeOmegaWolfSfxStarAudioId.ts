import type { DefiningWildlifeOmegaWolfSfxClipId } from '@/components/world/wildlife/domains/definingWildlifeOmegaWolfSfxConstants';

/** Prefix for Omega Wolf ids inside the star-audio manifest. */
export const DEFINING_WILDLIFE_OMEGA_WOLF_STAR_AUDIO_ID_PREFIX =
  'wildlife-omega-wolf.' as const;

/**
 * Maps one Omega Wolf clip id to a star-audio manifest key.
 */
export function resolvingWildlifeOmegaWolfSfxStarAudioId(
  clipId: DefiningWildlifeOmegaWolfSfxClipId
): string {
  return `${DEFINING_WILDLIFE_OMEGA_WOLF_STAR_AUDIO_ID_PREFIX}${clipId}`;
}
