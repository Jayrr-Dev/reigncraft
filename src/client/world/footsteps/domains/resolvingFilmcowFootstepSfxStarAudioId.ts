import type { DefiningFilmcowFootstepClipId } from '@/components/world/footsteps/domains/definingFilmcowFootstepSfxConstants';

/** Prefix for FilmCow footstep ids inside the star-audio manifest. */
export const DEFINING_FILMCOW_FOOTSTEP_STAR_AUDIO_ID_PREFIX =
  'filmcow-footstep.' as const;

/**
 * Maps one footstep clip id to a star-audio manifest key.
 */
export function resolvingFilmcowFootstepSfxStarAudioId(
  clipId: DefiningFilmcowFootstepClipId
): string {
  return `${DEFINING_FILMCOW_FOOTSTEP_STAR_AUDIO_ID_PREFIX}${clipId}`;
}
