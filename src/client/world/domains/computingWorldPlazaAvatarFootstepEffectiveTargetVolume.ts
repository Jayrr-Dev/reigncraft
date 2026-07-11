import { computingWorldPlazaSfxEffectiveVolume } from '@/components/world/audio/computingWorldPlazaSfxEffectiveVolume';
import {
  DEFINING_WORLD_PLAZA_AVATAR_FOOTSTEP_SFX_TARGET_VOLUME,
  DEFINING_WORLD_PLAZA_AVATAR_JUMP_LANDING_SFX_TARGET_VOLUME,
} from '@/components/world/domains/definingWorldPlazaAvatarFootstepSfxConstants';
import { gettingWorldPlazaSfxVolume } from '@/components/world/domains/managingWorldPlazaSfxVolumeStore';

/**
 * Resolves avatar footstep volume after applying the SFX volume slider and
 * optional surface/group/clip multipliers.
 */
export function computingWorldPlazaAvatarFootstepEffectiveTargetVolume(
  surfaceVolumeMultiplier = 1
): number {
  return computingWorldPlazaSfxEffectiveVolume({
    baseTargetVolume: DEFINING_WORLD_PLAZA_AVATAR_FOOTSTEP_SFX_TARGET_VOLUME,
    multipliers: [surfaceVolumeMultiplier],
    sliderVolume: gettingWorldPlazaSfxVolume(),
  });
}

/**
 * Resolves jump landing volume after applying the SFX volume slider and
 * optional surface/group/clip multipliers.
 */
export function computingWorldPlazaAvatarJumpLandingEffectiveTargetVolume(
  surfaceVolumeMultiplier = 1
): number {
  return computingWorldPlazaSfxEffectiveVolume({
    baseTargetVolume:
      DEFINING_WORLD_PLAZA_AVATAR_JUMP_LANDING_SFX_TARGET_VOLUME,
    multipliers: [surfaceVolumeMultiplier],
    sliderVolume: gettingWorldPlazaSfxVolume(),
  });
}
