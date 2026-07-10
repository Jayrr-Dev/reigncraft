import {
  DEFINING_WORLD_PLAZA_AVATAR_MOTION_KIND_RUN,
  type DefiningWorldPlazaAvatarMotionKind,
} from '@/components/world/domains/definingWorldPlazaAvatarMotionConstants';
import {
  DEFINING_WORLD_PLAZA_AVATAR_FOOTSTEP_MOTION_KINDS,
  DEFINING_WORLD_PLAZA_AVATAR_FOOTSTEP_STRIDES_PER_ANIMATION_CYCLE,
  type DefiningWorldPlazaAvatarFootstepClipId,
  type DefiningWorldPlazaAvatarFootstepSurfaceKind,
} from '@/components/world/domains/definingWorldPlazaAvatarFootstepSfxConstants';
import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';
import {
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_RUN_ANIMATION_FPS,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_RUN_MOTION_SHEET_LAYOUT,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_ANIMATION_FPS,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_MOTION_SHEET_LAYOUT,
} from '@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import {
  resolvingFilmcowFootstepLandingClipId,
  resolvingFilmcowFootstepNextClipId,
  resolvingFilmcowFootstepRunPlaybackRate,
} from '@/components/world/footsteps/domains/resolvingFilmcowFootstepPlayback';
import {
  resolvingFilmcowFootstepSurfaceAtWorldPoint,
  resolvingFilmcowFootstepSurfaceForBiomeKind,
} from '@/components/world/footsteps/domains/resolvingFilmcowFootstepSurfaceAtWorldPoint';

/**
 * Returns true when the avatar motion kind should keep the footstep loop running.
 */
export function checkingWorldPlazaAvatarMotionKindPlaysFootsteps(
  motionKind: DefiningWorldPlazaAvatarMotionKind
): boolean {
  return DEFINING_WORLD_PLAZA_AVATAR_FOOTSTEP_MOTION_KINDS.includes(
    motionKind as (typeof DEFINING_WORLD_PLAZA_AVATAR_FOOTSTEP_MOTION_KINDS)[number]
  );
}

/**
 * Resolves the footstep surface for one plaza biome.
 */
export function resolvingWorldPlazaAvatarFootstepSurfaceForBiomeKind(
  biomeKind: DefiningWorldPlazaBiomeKind
): DefiningWorldPlazaAvatarFootstepSurfaceKind {
  return resolvingFilmcowFootstepSurfaceForBiomeKind(biomeKind);
}

/**
 * Resolves the footstep surface under the player's current position.
 */
export function resolvingWorldPlazaAvatarFootstepSurfaceAtWorldPoint(
  worldPoint: DefiningWorldPlazaWorldPoint | null | undefined
): DefiningWorldPlazaAvatarFootstepSurfaceKind {
  return resolvingFilmcowFootstepSurfaceAtWorldPoint(worldPoint);
}

/**
 * Resolves the interval between footstep one-shots for the current motion kind.
 */
export function computingWorldPlazaAvatarFootstepIntervalMs(
  motionKind: DefiningWorldPlazaAvatarMotionKind
): number | null {
  if (!checkingWorldPlazaAvatarMotionKindPlaysFootsteps(motionKind)) {
    return null;
  }

  const animationFps =
    motionKind === DEFINING_WORLD_PLAZA_AVATAR_MOTION_KIND_RUN
      ? DEFINING_WORLD_PLAZA_GIRL_SAMPLE_RUN_ANIMATION_FPS
      : DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_ANIMATION_FPS;

  const frameCount =
    motionKind === DEFINING_WORLD_PLAZA_AVATAR_MOTION_KIND_RUN
      ? DEFINING_WORLD_PLAZA_GIRL_SAMPLE_RUN_MOTION_SHEET_LAYOUT.frameCount
      : DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_MOTION_SHEET_LAYOUT.frameCount;

  const cycleDurationMs = (frameCount / animationFps) * 1000;

  return (
    cycleDurationMs /
    DEFINING_WORLD_PLAZA_AVATAR_FOOTSTEP_STRIDES_PER_ANIMATION_CYCLE
  );
}

/**
 * Resolves the next clip id for one surface, motion kind, and step index.
 */
export function resolvingWorldPlazaAvatarFootstepNextClipId(
  surfaceKind: DefiningWorldPlazaAvatarFootstepSurfaceKind,
  motionKind: DefiningWorldPlazaAvatarMotionKind,
  clipIndex: number
): DefiningWorldPlazaAvatarFootstepClipId {
  const footstepMotionKind =
    motionKind === DEFINING_WORLD_PLAZA_AVATAR_MOTION_KIND_RUN ? 'run' : 'walk';

  return resolvingFilmcowFootstepNextClipId(
    surfaceKind,
    footstepMotionKind,
    clipIndex
  );
}

/**
 * Resolves the jump landing clip for one ground surface.
 */
export function resolvingWorldPlazaAvatarJumpLandingClipId(
  surfaceKind: DefiningWorldPlazaAvatarFootstepSurfaceKind
): DefiningWorldPlazaAvatarFootstepClipId {
  return resolvingFilmcowFootstepLandingClipId(surfaceKind);
}

/**
 * Resolves playback rate for the current avatar motion kind.
 */
export function resolvingWorldPlazaAvatarFootstepPlaybackRate(
  motionKind: DefiningWorldPlazaAvatarMotionKind,
  surfaceKind: DefiningWorldPlazaAvatarFootstepSurfaceKind
): number {
  if (motionKind !== DEFINING_WORLD_PLAZA_AVATAR_MOTION_KIND_RUN) {
    return 1;
  }

  return resolvingFilmcowFootstepRunPlaybackRate(surfaceKind);
}
