import type { DefiningFilmcowFootstepClipId } from '@/components/world/footsteps/domains/definingFilmcowFootstepSfxConstants';
import { resolvingFilmcowFootstepSfxStarAudioId } from '@/components/world/footsteps/domains/resolvingFilmcowFootstepSfxStarAudioId';

/**
 * Maps one wildlife footstep clip id to a star-audio manifest key.
 */
export function resolvingWildlifeFootstepStarAudioId(
  clipId: DefiningFilmcowFootstepClipId
): string {
  return resolvingFilmcowFootstepSfxStarAudioId(clipId);
}
