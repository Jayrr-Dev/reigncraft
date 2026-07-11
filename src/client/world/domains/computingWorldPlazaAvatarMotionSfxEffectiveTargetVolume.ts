import { computingWorldPlazaSfxEffectiveVolume } from '@/components/world/audio/computingWorldPlazaSfxEffectiveVolume';
import {
  DEFINING_WORLD_PLAZA_AVATAR_JUMP_TAKEOFF_SFX_TARGET_VOLUME,
  DEFINING_WORLD_PLAZA_AVATAR_ROLL_DODGE_SFX_TARGET_VOLUME,
  type DefiningWorldPlazaAvatarMotionSfxEventKind,
} from '@/components/world/domains/definingWorldPlazaAvatarMotionSfxConstants';
import { gettingWorldPlazaSfxVolume } from '@/components/world/domains/managingWorldPlazaSfxVolumeStore';

/**
 * Resolves jump takeoff volume after applying the SFX volume slider.
 */
export function computingWorldPlazaAvatarJumpTakeoffEffectiveTargetVolume(
  clipVolumeMultiplier = 1
): number {
  return computingWorldPlazaSfxEffectiveVolume({
    baseTargetVolume:
      DEFINING_WORLD_PLAZA_AVATAR_JUMP_TAKEOFF_SFX_TARGET_VOLUME,
    multipliers: [clipVolumeMultiplier],
    sliderVolume: gettingWorldPlazaSfxVolume(),
  });
}

/**
 * Resolves roll dodge volume after applying the SFX volume slider.
 */
export function computingWorldPlazaAvatarRollDodgeEffectiveTargetVolume(
  clipVolumeMultiplier = 1
): number {
  return computingWorldPlazaSfxEffectiveVolume({
    baseTargetVolume: DEFINING_WORLD_PLAZA_AVATAR_ROLL_DODGE_SFX_TARGET_VOLUME,
    multipliers: [clipVolumeMultiplier],
    sliderVolume: gettingWorldPlazaSfxVolume(),
  });
}

/**
 * Resolves motion-event volume after applying the SFX volume slider.
 */
export function computingWorldPlazaAvatarMotionSfxEffectiveTargetVolume(
  eventKind: DefiningWorldPlazaAvatarMotionSfxEventKind,
  clipVolumeMultiplier = 1
): number {
  if (eventKind === 'jump_takeoff') {
    return computingWorldPlazaAvatarJumpTakeoffEffectiveTargetVolume(
      clipVolumeMultiplier
    );
  }

  return computingWorldPlazaAvatarRollDodgeEffectiveTargetVolume(
    clipVolumeMultiplier
  );
}
