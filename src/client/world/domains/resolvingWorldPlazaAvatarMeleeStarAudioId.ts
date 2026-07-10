import type { DefiningWorldPlazaAvatarMeleeClipId } from '@/components/world/domains/definingWorldPlazaAvatarMeleeSfxConstants';

/** Prefix for avatar melee ids inside the star-audio manifest. */
export const DEFINING_WORLD_PLAZA_AVATAR_MELEE_STAR_AUDIO_ID_PREFIX =
  'avatar-melee.' as const;

/**
 * Maps one melee clip id to a star-audio manifest key.
 */
export function resolvingWorldPlazaAvatarMeleeStarAudioId(
  clipId: DefiningWorldPlazaAvatarMeleeClipId
): string {
  return `${DEFINING_WORLD_PLAZA_AVATAR_MELEE_STAR_AUDIO_ID_PREFIX}${clipId}`;
}
