import { computingWorldPlazaSfxEffectiveVolume } from '@/components/world/audio/computingWorldPlazaSfxEffectiveVolume';
import {
  DEFINING_WORLD_PLAZA_AVATAR_MELEE_CRIT_FATAL_SFX_TARGET_VOLUME,
  DEFINING_WORLD_PLAZA_AVATAR_MELEE_SWING_SFX_TARGET_VOLUME,
} from '@/components/world/domains/definingWorldPlazaAvatarMeleeSfxConstants';
import { gettingWorldPlazaSfxVolume } from '@/components/world/domains/managingWorldPlazaSfxVolumeStore';

/**
 * Resolves melee swing volume after applying the SFX volume slider.
 */
export function computingWorldPlazaAvatarMeleeSwingEffectiveTargetVolume(
  clipVolumeMultiplier = 1
): number {
  return computingWorldPlazaSfxEffectiveVolume({
    baseTargetVolume: DEFINING_WORLD_PLAZA_AVATAR_MELEE_SWING_SFX_TARGET_VOLUME,
    multipliers: [clipVolumeMultiplier],
    sliderVolume: gettingWorldPlazaSfxVolume(),
  });
}

/**
 * Resolves crit/fatal impact volume after applying the SFX volume slider.
 */
export function computingWorldPlazaAvatarMeleeCritFatalEffectiveTargetVolume(
  clipVolumeMultiplier = 1
): number {
  return computingWorldPlazaSfxEffectiveVolume({
    baseTargetVolume:
      DEFINING_WORLD_PLAZA_AVATAR_MELEE_CRIT_FATAL_SFX_TARGET_VOLUME,
    multipliers: [clipVolumeMultiplier],
    sliderVolume: gettingWorldPlazaSfxVolume(),
  });
}
