import {
  DEFINING_WORLD_PLAZA_AVATAR_FOOTSTEP_SFX_TARGET_VOLUME,
  DEFINING_WORLD_PLAZA_AVATAR_JUMP_LANDING_SFX_TARGET_VOLUME,
} from '@/components/world/domains/definingWorldPlazaAvatarFootstepSfxConstants';
import { gettingWorldPlazaSfxVolume } from '@/components/world/domains/managingWorldPlazaSfxVolumeStore';

/**
 * Resolves avatar footstep volume after applying the SFX volume slider.
 */
export function computingWorldPlazaAvatarFootstepEffectiveTargetVolume(): number {
  return (
    DEFINING_WORLD_PLAZA_AVATAR_FOOTSTEP_SFX_TARGET_VOLUME *
    gettingWorldPlazaSfxVolume()
  );
}

/**
 * Resolves jump landing volume after applying the SFX volume slider.
 */
export function computingWorldPlazaAvatarJumpLandingEffectiveTargetVolume(): number {
  return (
    DEFINING_WORLD_PLAZA_AVATAR_JUMP_LANDING_SFX_TARGET_VOLUME *
    gettingWorldPlazaSfxVolume()
  );
}
