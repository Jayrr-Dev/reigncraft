import {
  DEFINING_WORLD_PLAZA_AVATAR_FOOTSTEP_MOTION_KINDS,
  DEFINING_WORLD_PLAZA_AVATAR_FOOTSTEP_RUN_PLAYBACK_RATE,
  DEFINING_WORLD_PLAZA_AVATAR_FOOTSTEP_STRIDES_PER_ANIMATION_CYCLE,
  DEFINING_WORLD_PLAZA_AVATAR_FOOTSTEP_SURFACE_DEFINITIONS,
  DEFINING_WORLD_PLAZA_BIOME_AVATAR_FOOTSTEP_SURFACE_BY_KIND,
  type DefiningWorldPlazaAvatarFootstepClipId,
  type DefiningWorldPlazaAvatarFootstepSurfaceKind,
} from '@/components/world/domains/definingWorldPlazaAvatarFootstepSfxConstants';
import {
  DEFINING_WORLD_PLAZA_AVATAR_MOTION_KIND_RUN,
  type DefiningWorldPlazaAvatarMotionKind,
} from '@/components/world/domains/definingWorldPlazaAvatarMotionConstants';
import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';
import {
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_RUN_ANIMATION_FPS,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_RUN_MOTION_SHEET_LAYOUT,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_ANIMATION_FPS,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_MOTION_SHEET_LAYOUT,
} from '@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaBiomeAtWorldPoint } from '@/components/world/domains/resolvingWorldPlazaBiomeAtWorldPoint';

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
 * Resolves the Free Footsteps Pack surface for one plaza biome.
 */
export function resolvingWorldPlazaAvatarFootstepSurfaceForBiomeKind(
  biomeKind: DefiningWorldPlazaBiomeKind
): DefiningWorldPlazaAvatarFootstepSurfaceKind {
  return DEFINING_WORLD_PLAZA_BIOME_AVATAR_FOOTSTEP_SURFACE_BY_KIND[biomeKind];
}

/**
 * Resolves the Free Footsteps Pack surface under the player's current position.
 */
export function resolvingWorldPlazaAvatarFootstepSurfaceAtWorldPoint(
  worldPoint: DefiningWorldPlazaWorldPoint | null | undefined
): DefiningWorldPlazaAvatarFootstepSurfaceKind {
  if (!worldPoint) {
    return DEFINING_WORLD_PLAZA_BIOME_AVATAR_FOOTSTEP_SURFACE_BY_KIND.plains;
  }

  const biome = resolvingWorldPlazaBiomeAtWorldPoint(worldPoint);

  return resolvingWorldPlazaAvatarFootstepSurfaceForBiomeKind(biome.kind);
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
 * Resolves the clip ids that should rotate for one surface and motion kind.
 */
export function resolvingWorldPlazaAvatarFootstepClipIdsForSurfaceAndMotion(
  surfaceKind: DefiningWorldPlazaAvatarFootstepSurfaceKind,
  motionKind: DefiningWorldPlazaAvatarMotionKind
): DefiningWorldPlazaAvatarFootstepClipId[] {
  const surfaceDefinition =
    DEFINING_WORLD_PLAZA_AVATAR_FOOTSTEP_SURFACE_DEFINITIONS[surfaceKind];

  if (motionKind === DEFINING_WORLD_PLAZA_AVATAR_MOTION_KIND_RUN) {
    return surfaceDefinition.runClipIds;
  }

  return surfaceDefinition.walkClipIds;
}

/**
 * Resolves the next clip id for one surface, motion kind, and step index.
 */
export function resolvingWorldPlazaAvatarFootstepNextClipId(
  surfaceKind: DefiningWorldPlazaAvatarFootstepSurfaceKind,
  motionKind: DefiningWorldPlazaAvatarMotionKind,
  clipIndex: number
): DefiningWorldPlazaAvatarFootstepClipId {
  const clipIds = resolvingWorldPlazaAvatarFootstepClipIdsForSurfaceAndMotion(
    surfaceKind,
    motionKind
  );

  const normalizedIndex =
    ((clipIndex % clipIds.length) + clipIds.length) % clipIds.length;

  return clipIds[normalizedIndex];
}

/**
 * Resolves the jump landing clip for one ground surface.
 */
export function resolvingWorldPlazaAvatarJumpLandingClipId(
  surfaceKind: DefiningWorldPlazaAvatarFootstepSurfaceKind
): DefiningWorldPlazaAvatarFootstepClipId {
  return DEFINING_WORLD_PLAZA_AVATAR_FOOTSTEP_SURFACE_DEFINITIONS[surfaceKind]
    .landingClipId;
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

  const runClipIds =
    DEFINING_WORLD_PLAZA_AVATAR_FOOTSTEP_SURFACE_DEFINITIONS[surfaceKind]
      .runClipIds;
  const walkClipIds =
    DEFINING_WORLD_PLAZA_AVATAR_FOOTSTEP_SURFACE_DEFINITIONS[surfaceKind]
      .walkClipIds;

  if (runClipIds.length === 1 && runClipIds[0] === walkClipIds[0]) {
    return DEFINING_WORLD_PLAZA_AVATAR_FOOTSTEP_RUN_PLAYBACK_RATE;
  }

  return 1;
}
