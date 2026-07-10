import {
  DEFINING_WORLD_PLAZA_AVATAR_MELEE_CRIT_FATAL_SFX_TARGET_VOLUME,
  DEFINING_WORLD_PLAZA_AVATAR_MELEE_SWING_SFX_TARGET_VOLUME,
} from '@/components/world/domains/definingWorldPlazaAvatarMeleeSfxConstants';
import { gettingWorldPlazaSfxVolume } from '@/components/world/domains/managingWorldPlazaSfxVolumeStore';

/**
 * Resolves melee swing volume after applying the SFX volume slider.
 */
export function computingWorldPlazaAvatarMeleeSwingEffectiveTargetVolume(): number {
  return (
    DEFINING_WORLD_PLAZA_AVATAR_MELEE_SWING_SFX_TARGET_VOLUME *
    gettingWorldPlazaSfxVolume()
  );
}

/**
 * Resolves crit/fatal impact volume after applying the SFX volume slider.
 */
export function computingWorldPlazaAvatarMeleeCritFatalEffectiveTargetVolume(): number {
  return (
    DEFINING_WORLD_PLAZA_AVATAR_MELEE_CRIT_FATAL_SFX_TARGET_VOLUME *
    gettingWorldPlazaSfxVolume()
  );
}
