import type { DefiningFilmcowFootstepClipId } from '@/components/world/footsteps/domains/definingFilmcowFootstepSfxConstants';
import { resolvingFilmcowFootstepSfxStarAudioId } from '@/components/world/footsteps/domains/resolvingFilmcowFootstepSfxStarAudioId';

/** @deprecated Use {@link resolvingFilmcowFootstepSfxStarAudioId}. Kept for avatar call sites. */
export const DEFINING_WORLD_PLAZA_AVATAR_FOOTSTEP_STAR_AUDIO_ID_PREFIX =
  'filmcow-footstep.' as const;

/**
 * Maps one footstep clip id to a star-audio manifest key.
 */
export function resolvingWorldPlazaAvatarFootstepStarAudioId(
  clipId: DefiningFilmcowFootstepClipId
): string {
  return resolvingFilmcowFootstepSfxStarAudioId(clipId);
}
