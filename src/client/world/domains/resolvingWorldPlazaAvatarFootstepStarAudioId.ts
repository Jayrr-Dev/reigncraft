import type { DefiningWorldPlazaAvatarFootstepClipId } from '@/components/world/domains/definingWorldPlazaAvatarFootstepSfxConstants';

/** Prefix for avatar footstep ids inside the star-audio manifest. */
export const DEFINING_WORLD_PLAZA_AVATAR_FOOTSTEP_STAR_AUDIO_ID_PREFIX =
  'avatar-footstep.' as const;

/**
 * Maps one footstep clip id to a star-audio manifest key.
 */
export function resolvingWorldPlazaAvatarFootstepStarAudioId(
  clipId: DefiningWorldPlazaAvatarFootstepClipId
): string {
  return `${DEFINING_WORLD_PLAZA_AVATAR_FOOTSTEP_STAR_AUDIO_ID_PREFIX}${clipId}`;
}
