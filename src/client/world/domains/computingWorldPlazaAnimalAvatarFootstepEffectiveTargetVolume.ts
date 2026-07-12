/**
 * Volume helpers for playable-animal footstep one-shots.
 *
 * Uses full avatar base loudness (not NPC 1/3), scaled by wildlife size tier.
 *
 * @module components/world/domains/computingWorldPlazaAnimalAvatarFootstepEffectiveTargetVolume
 */

import { computingWorldPlazaSfxEffectiveVolume } from '@/components/world/audio/computingWorldPlazaSfxEffectiveVolume';
import {
  DEFINING_WORLD_PLAZA_AVATAR_FOOTSTEP_SFX_TARGET_VOLUME,
  DEFINING_WORLD_PLAZA_AVATAR_JUMP_LANDING_SFX_TARGET_VOLUME,
} from '@/components/world/domains/definingWorldPlazaAvatarFootstepSfxConstants';
import { gettingWorldPlazaSfxVolume } from '@/components/world/domains/managingWorldPlazaSfxVolumeStore';
import {
  DEFINING_FILMCOW_FOOTSTEP_WILDLIFE_SIZE_TIER_VOLUME_SCALE,
  DEFINING_FILMCOW_FOOTSTEP_WILDLIFE_SURFACE_DEFINITIONS,
  type DefiningFilmcowFootstepClipId,
  type DefiningFilmcowFootstepSurfaceKind,
  type DefiningFilmcowFootstepWildlifeSizeTier,
} from '@/components/world/footsteps/domains/definingFilmcowFootstepSfxConstants';
import {
  resolvingFilmcowFootstepClipEntryId,
  resolvingFilmcowFootstepSurfaceVolumeMultiplier,
  type DefiningFilmcowFootstepVolumeGroupKind,
} from '@/components/world/footsteps/domains/resolvingFilmcowFootstepClipEntries';

/**
 * Surface × group × size-tier volume multiplier for one animal footstep play.
 */
export function resolvingWorldPlazaAnimalAvatarFootstepVolumeMultiplier(
  surfaceKind: DefiningFilmcowFootstepSurfaceKind,
  volumeGroupKind: DefiningFilmcowFootstepVolumeGroupKind,
  clipId: DefiningFilmcowFootstepClipId,
  sizeTier: DefiningFilmcowFootstepWildlifeSizeTier
): number {
  const surfaceDefinition =
    DEFINING_FILMCOW_FOOTSTEP_WILDLIFE_SURFACE_DEFINITIONS[surfaceKind];
  const surfaceMultiplier = resolvingFilmcowFootstepSurfaceVolumeMultiplier(
    surfaceDefinition,
    volumeGroupKind,
    clipId
  );

  return (
    surfaceMultiplier *
    DEFINING_FILMCOW_FOOTSTEP_WILDLIFE_SIZE_TIER_VOLUME_SCALE[sizeTier]
  );
}

/**
 * Effective walk/run volume for a local animal avatar footstep.
 */
export function computingWorldPlazaAnimalAvatarFootstepEffectiveTargetVolume(
  surfaceVolumeMultiplier = 1
): number {
  return computingWorldPlazaSfxEffectiveVolume({
    baseTargetVolume: DEFINING_WORLD_PLAZA_AVATAR_FOOTSTEP_SFX_TARGET_VOLUME,
    multipliers: [surfaceVolumeMultiplier],
    sliderVolume: gettingWorldPlazaSfxVolume(),
  });
}

/**
 * Effective jump-landing volume for a local animal avatar.
 */
export function computingWorldPlazaAnimalAvatarJumpLandingEffectiveTargetVolume(
  surfaceVolumeMultiplier = 1
): number {
  return computingWorldPlazaSfxEffectiveVolume({
    baseTargetVolume:
      DEFINING_WORLD_PLAZA_AVATAR_JUMP_LANDING_SFX_TARGET_VOLUME,
    multipliers: [surfaceVolumeMultiplier],
    sliderVolume: gettingWorldPlazaSfxVolume(),
  });
}

/**
 * Wildlife landing clip id for one surface (animal avatar jump land).
 */
export function resolvingWorldPlazaAnimalAvatarJumpLandingClipId(
  surfaceKind: DefiningFilmcowFootstepSurfaceKind
): DefiningFilmcowFootstepClipId {
  return resolvingFilmcowFootstepClipEntryId(
    DEFINING_FILMCOW_FOOTSTEP_WILDLIFE_SURFACE_DEFINITIONS[surfaceKind]
      .landingClipId
  );
}
