import {
  DEFINING_WORLD_PLAZA_AVATAR_JUMP_TAKEOFF_SFX_MAX_PLAYBACK_DURATION_S,
  DEFINING_WORLD_PLAZA_AVATAR_JUMP_TAKEOFF_SFX_PLAYBACK_RATE,
  DEFINING_WORLD_PLAZA_AVATAR_ROLL_DODGE_SFX_MAX_PLAYBACK_DURATION_S,
  DEFINING_WORLD_PLAZA_AVATAR_ROLL_DODGE_SFX_PLAYBACK_RATE,
  type DefiningWorldPlazaAvatarMotionSfxEventKind,
} from '@/components/world/domains/definingWorldPlazaAvatarMotionSfxConstants';

/**
 * Resolves playback rate for one avatar motion SFX event.
 */
export function resolvingWorldPlazaAvatarMotionSfxPlaybackRate(
  eventKind: DefiningWorldPlazaAvatarMotionSfxEventKind
): number {
  if (eventKind === 'jump_takeoff') {
    return DEFINING_WORLD_PLAZA_AVATAR_JUMP_TAKEOFF_SFX_PLAYBACK_RATE;
  }

  return DEFINING_WORLD_PLAZA_AVATAR_ROLL_DODGE_SFX_PLAYBACK_RATE;
}

/**
 * Resolves max one-shot duration for one avatar motion SFX event.
 */
export function resolvingWorldPlazaAvatarMotionSfxPlaybackDurationS(
  eventKind: DefiningWorldPlazaAvatarMotionSfxEventKind
): number {
  if (eventKind === 'jump_takeoff') {
    return DEFINING_WORLD_PLAZA_AVATAR_JUMP_TAKEOFF_SFX_MAX_PLAYBACK_DURATION_S;
  }

  return DEFINING_WORLD_PLAZA_AVATAR_ROLL_DODGE_SFX_MAX_PLAYBACK_DURATION_S;
}
