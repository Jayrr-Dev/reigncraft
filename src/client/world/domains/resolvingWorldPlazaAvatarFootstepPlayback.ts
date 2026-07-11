import {
  DEFINING_WORLD_PLAZA_AVATAR_FOOTSTEP_MAX_RUN_PLAYBACK_DURATION_S,
  DEFINING_WORLD_PLAZA_AVATAR_FOOTSTEP_MAX_WALK_PLAYBACK_DURATION_S,
  DEFINING_WORLD_PLAZA_AVATAR_FOOTSTEP_MOTION_KINDS,
  DEFINING_WORLD_PLAZA_AVATAR_FOOTSTEP_SHORT_RUN_PLAYBACK_RATE,
  DEFINING_WORLD_PLAZA_AVATAR_FOOTSTEP_STRIDES_PER_ANIMATION_CYCLE,
  type DefiningWorldPlazaAvatarFootstepClipId,
  type DefiningWorldPlazaAvatarFootstepSurfaceKind,
} from '@/components/world/domains/definingWorldPlazaAvatarFootstepSfxConstants';
import {
  DEFINING_WORLD_PLAZA_AVATAR_FOOTSTEP_SHORT_RUN_CLIP_IDS,
  DEFINING_WORLD_PLAZA_AVATAR_FOOTSTEP_SURFACE_DEFINITIONS,
} from '@/components/world/domains/definingWorldPlazaAvatarFootstepSurfaceDefinitions';
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
import type { DefiningFilmcowFootstepClipEntry } from '@/components/world/footsteps/domains/definingFilmcowFootstepSfxConstants';
import {
  resolvingFilmcowFootstepClipEntryId,
  resolvingFilmcowFootstepSurfaceVolumeMultiplier,
  type DefiningFilmcowFootstepVolumeGroupKind,
} from '@/components/world/footsteps/domains/resolvingFilmcowFootstepClipEntries';
import { resolvingFilmcowFootstepRunPlaybackRate } from '@/components/world/footsteps/domains/resolvingFilmcowFootstepPlayback';
import {
  resolvingFilmcowFootstepSurfaceAtWorldPoint,
  resolvingFilmcowFootstepSurfaceForBiomeKind,
} from '@/components/world/footsteps/domains/resolvingFilmcowFootstepSurfaceAtWorldPoint';

type DefiningWorldPlazaAvatarFootstepMotionKind = 'walk' | 'run';

function resolvingWorldPlazaAvatarFootstepClipEntriesForSurfaceAndMotion(
  surfaceKind: DefiningWorldPlazaAvatarFootstepSurfaceKind,
  motionKind: DefiningWorldPlazaAvatarFootstepMotionKind
): readonly DefiningFilmcowFootstepClipEntry[] {
  const surfaceDefinition =
    DEFINING_WORLD_PLAZA_AVATAR_FOOTSTEP_SURFACE_DEFINITIONS[surfaceKind];

  return motionKind === 'run'
    ? surfaceDefinition.runClipIds
    : surfaceDefinition.walkClipIds;
}

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
 * Resolves the next clip entry for one surface, motion kind, and step index.
 */
export function resolvingWorldPlazaAvatarFootstepNextClipEntry(
  surfaceKind: DefiningWorldPlazaAvatarFootstepSurfaceKind,
  motionKind: DefiningWorldPlazaAvatarMotionKind,
  clipIndex: number
): DefiningFilmcowFootstepClipEntry {
  const footstepMotionKind: DefiningWorldPlazaAvatarFootstepMotionKind =
    motionKind === DEFINING_WORLD_PLAZA_AVATAR_MOTION_KIND_RUN ? 'run' : 'walk';
  const clipEntries =
    resolvingWorldPlazaAvatarFootstepClipEntriesForSurfaceAndMotion(
      surfaceKind,
      footstepMotionKind
    );
  const normalizedIndex =
    ((clipIndex % clipEntries.length) + clipEntries.length) %
    clipEntries.length;

  return clipEntries[normalizedIndex];
}

/**
 * Resolves the next clip id for one surface, motion kind, and step index.
 */
export function resolvingWorldPlazaAvatarFootstepNextClipId(
  surfaceKind: DefiningWorldPlazaAvatarFootstepSurfaceKind,
  motionKind: DefiningWorldPlazaAvatarMotionKind,
  clipIndex: number
): DefiningWorldPlazaAvatarFootstepClipId {
  return resolvingFilmcowFootstepClipEntryId(
    resolvingWorldPlazaAvatarFootstepNextClipEntry(
      surfaceKind,
      motionKind,
      clipIndex
    )
  );
}

/**
 * Resolves the jump landing clip entry for one ground surface.
 */
export function resolvingWorldPlazaAvatarJumpLandingClipEntry(
  surfaceKind: DefiningWorldPlazaAvatarFootstepSurfaceKind
): DefiningFilmcowFootstepClipEntry {
  return DEFINING_WORLD_PLAZA_AVATAR_FOOTSTEP_SURFACE_DEFINITIONS[surfaceKind]
    .landingClipId;
}

/**
 * Resolves the jump landing clip for one ground surface.
 */
export function resolvingWorldPlazaAvatarJumpLandingClipId(
  surfaceKind: DefiningWorldPlazaAvatarFootstepSurfaceKind
): DefiningWorldPlazaAvatarFootstepClipId {
  return resolvingFilmcowFootstepClipEntryId(
    resolvingWorldPlazaAvatarJumpLandingClipEntry(surfaceKind)
  );
}

/**
 * Resolves surface/group/clip volume multipliers for one avatar footstep play.
 */
export function resolvingWorldPlazaAvatarFootstepVolumeMultiplier(
  surfaceKind: DefiningWorldPlazaAvatarFootstepSurfaceKind,
  volumeGroupKind: DefiningFilmcowFootstepVolumeGroupKind,
  clipEntry: DefiningFilmcowFootstepClipEntry
): number {
  return resolvingFilmcowFootstepSurfaceVolumeMultiplier(
    DEFINING_WORLD_PLAZA_AVATAR_FOOTSTEP_SURFACE_DEFINITIONS[surfaceKind],
    volumeGroupKind,
    clipEntry
  );
}

function checkingWorldPlazaAvatarFootstepClipUsesShortRunPlayback(
  clipId: DefiningWorldPlazaAvatarFootstepClipId
): boolean {
  return DEFINING_WORLD_PLAZA_AVATAR_FOOTSTEP_SHORT_RUN_CLIP_IDS.includes(
    clipId as (typeof DEFINING_WORLD_PLAZA_AVATAR_FOOTSTEP_SHORT_RUN_CLIP_IDS)[number]
  );
}

/**
 * Resolves playback rate for the current avatar motion kind.
 */
export function resolvingWorldPlazaAvatarFootstepPlaybackRate(
  motionKind: DefiningWorldPlazaAvatarMotionKind,
  surfaceKind: DefiningWorldPlazaAvatarFootstepSurfaceKind,
  clipId: DefiningWorldPlazaAvatarFootstepClipId
): number {
  if (motionKind !== DEFINING_WORLD_PLAZA_AVATAR_MOTION_KIND_RUN) {
    return 1;
  }

  if (checkingWorldPlazaAvatarFootstepClipUsesShortRunPlayback(clipId)) {
    return DEFINING_WORLD_PLAZA_AVATAR_FOOTSTEP_SHORT_RUN_PLAYBACK_RATE;
  }

  return resolvingFilmcowFootstepRunPlaybackRate(surfaceKind);
}

/**
 * Hard playback duration cap so one-shots never bleed into the next step.
 */
export function resolvingWorldPlazaAvatarFootstepPlaybackDurationS(
  motionKind: DefiningWorldPlazaAvatarMotionKind
): number | undefined {
  if (motionKind === DEFINING_WORLD_PLAZA_AVATAR_MOTION_KIND_RUN) {
    return DEFINING_WORLD_PLAZA_AVATAR_FOOTSTEP_MAX_RUN_PLAYBACK_DURATION_S;
  }

  if (checkingWorldPlazaAvatarMotionKindPlaysFootsteps(motionKind)) {
    return DEFINING_WORLD_PLAZA_AVATAR_FOOTSTEP_MAX_WALK_PLAYBACK_DURATION_S;
  }

  return undefined;
}
