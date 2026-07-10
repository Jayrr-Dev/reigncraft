import type { DefiningWildlifeSpeciesSfxClipId } from '@/components/world/wildlife/domains/definingWildlifeSpeciesSfxClipTypes';

/** Prefix for species vocal ids inside the star-audio manifest. */
export const DEFINING_WILDLIFE_SPECIES_STAR_AUDIO_ID_PREFIX =
  'wildlife-species.' as const;

/**
 * Maps one species vocal clip id to a star-audio manifest key.
 */
export function resolvingWildlifeSpeciesSfxStarAudioId(
  clipId: DefiningWildlifeSpeciesSfxClipId
): string {
  return `${DEFINING_WILDLIFE_SPECIES_STAR_AUDIO_ID_PREFIX}${clipId}`;
}
