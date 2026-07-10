import {
  DEFINING_WORLD_PLAZA_AVATAR_JUMP_TAKEOFF_SFX_TARGET_VOLUME,
  DEFINING_WORLD_PLAZA_AVATAR_ROLL_DODGE_SFX_TARGET_VOLUME,
  type DefiningWorldPlazaAvatarMotionSfxEventKind,
} from '@/components/world/domains/definingWorldPlazaAvatarMotionSfxConstants';
import { gettingWorldPlazaSfxVolume } from '@/components/world/domains/managingWorldPlazaSfxVolumeStore';

/**
 * Resolves jump takeoff volume after applying the SFX volume slider.
 */
export function computingWorldPlazaAvatarJumpTakeoffEffectiveTargetVolume(): number {
  return (
    DEFINING_WORLD_PLAZA_AVATAR_JUMP_TAKEOFF_SFX_TARGET_VOLUME *
    gettingWorldPlazaSfxVolume()
  );
}

/**
 * Resolves roll dodge volume after applying the SFX volume slider.
 */
export function computingWorldPlazaAvatarRollDodgeEffectiveTargetVolume(): number {
  return (
    DEFINING_WORLD_PLAZA_AVATAR_ROLL_DODGE_SFX_TARGET_VOLUME *
    gettingWorldPlazaSfxVolume()
  );
}

/**
 * Resolves motion-event volume after applying the SFX volume slider.
 */
export function computingWorldPlazaAvatarMotionSfxEffectiveTargetVolume(
  eventKind: DefiningWorldPlazaAvatarMotionSfxEventKind
): number {
  if (eventKind === 'jump_takeoff') {
    return computingWorldPlazaAvatarJumpTakeoffEffectiveTargetVolume();
  }

  return computingWorldPlazaAvatarRollDodgeEffectiveTargetVolume();
}
