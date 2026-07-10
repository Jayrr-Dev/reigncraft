import type { DefiningWildlifeFarmAnimalSfxClipId } from '@/components/world/wildlife/domains/definingWildlifeFarmAnimalSfxConstants';

/** Prefix for farm animal ids inside the star-audio manifest. */
export const DEFINING_WILDLIFE_SPECIES_STAR_AUDIO_ID_PREFIX =
  'wildlife-species.' as const;

/**
 * Maps one farm animal clip id to a star-audio manifest key.
 */
export function resolvingWildlifeSpeciesSfxStarAudioId(
  clipId: DefiningWildlifeFarmAnimalSfxClipId
): string {
  return `${DEFINING_WILDLIFE_SPECIES_STAR_AUDIO_ID_PREFIX}${clipId}`;
}
