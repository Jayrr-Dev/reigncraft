import type { DefiningWorldPlazaDeathSfxClipId } from '@/components/world/audio/lifecycle/definingWorldPlazaDeathSfxConstants';

/** Prefix for player-death ids inside the star-audio manifest. */
export const DEFINING_WORLD_PLAZA_DEATH_SFX_STAR_AUDIO_ID_PREFIX =
  'world-plaza-death' as const;

/**
 * Stable star-audio manifest key for one player-death clip.
 */
export function resolvingWorldPlazaDeathSfxStarAudioId(
  clipId: DefiningWorldPlazaDeathSfxClipId
): string {
  return `${DEFINING_WORLD_PLAZA_DEATH_SFX_STAR_AUDIO_ID_PREFIX}.${clipId}`;
}
