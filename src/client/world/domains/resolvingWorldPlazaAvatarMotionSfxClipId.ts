import {
  DEFINING_WORLD_PLAZA_AVATAR_JUMP_TAKEOFF_SFX_CLIP_IDS,
  DEFINING_WORLD_PLAZA_AVATAR_ROLL_DODGE_SFX_CLIP_IDS,
  type DefiningWorldPlazaAvatarMotionSfxEventKind,
} from '@/components/world/domains/definingWorldPlazaAvatarMotionSfxConstants';
import type { DefiningFilmcowFootstepClipId } from '@/components/world/footsteps/domains/definingFilmcowFootstepSfxConstants';

/**
 * Returns how many clips rotate for one motion SFX event kind.
 */
export function resolvingWorldPlazaAvatarMotionSfxClipPoolLength(
  eventKind: DefiningWorldPlazaAvatarMotionSfxEventKind
): number {
  if (eventKind === 'jump_takeoff') {
    return DEFINING_WORLD_PLAZA_AVATAR_JUMP_TAKEOFF_SFX_CLIP_IDS.length;
  }

  return DEFINING_WORLD_PLAZA_AVATAR_ROLL_DODGE_SFX_CLIP_IDS.length;
}

/**
 * Picks the next clip id for one motion SFX event kind.
 */
export function resolvingWorldPlazaAvatarMotionSfxClipId(
  eventKind: DefiningWorldPlazaAvatarMotionSfxEventKind,
  clipIndex: number
): DefiningFilmcowFootstepClipId {
  const pool =
    eventKind === 'jump_takeoff'
      ? DEFINING_WORLD_PLAZA_AVATAR_JUMP_TAKEOFF_SFX_CLIP_IDS
      : DEFINING_WORLD_PLAZA_AVATAR_ROLL_DODGE_SFX_CLIP_IDS;

  const normalizedIndex =
    ((clipIndex % pool.length) + pool.length) % pool.length;

  return pool[normalizedIndex] ?? pool[0];
}
