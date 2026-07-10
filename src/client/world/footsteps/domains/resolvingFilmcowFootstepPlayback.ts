import { DEFINING_WORLD_PLAZA_AVATAR_FOOTSTEP_SURFACE_DEFINITIONS } from '@/components/world/domains/definingWorldPlazaAvatarFootstepSurfaceDefinitions';
import {
  DEFINING_FILMCOW_FOOTSTEP_LONG_COMPOSITE_CLIP_IDS,
  DEFINING_FILMCOW_FOOTSTEP_MAX_RUN_PLAYBACK_DURATION_S,
  DEFINING_FILMCOW_FOOTSTEP_MAX_WALK_PLAYBACK_DURATION_S,
  DEFINING_FILMCOW_FOOTSTEP_SHORT_RUN_CLIP_IDS,
  DEFINING_FILMCOW_FOOTSTEP_SHORT_RUN_PLAYBACK_RATE,
  DEFINING_FILMCOW_FOOTSTEP_SURFACE_DEFINITIONS,
  DEFINING_FILMCOW_FOOTSTEP_WILDLIFE_SIZE_TIER_CLIP_OVERRIDES,
  type DefiningFilmcowFootstepClipId,
  type DefiningFilmcowFootstepSurfaceKind,
  type DefiningFilmcowFootstepWildlifeSizeTier,
} from '@/components/world/footsteps/domains/definingFilmcowFootstepSfxConstants';

export type DefiningFilmcowFootstepMotionKind = 'walk' | 'run';

function mergingFilmcowFootstepClipIds(
  surfaceClipIds: readonly DefiningFilmcowFootstepClipId[],
  tierClipIds: readonly DefiningFilmcowFootstepClipId[]
): DefiningFilmcowFootstepClipId[] {
  if (tierClipIds.length === 0) {
    return [...surfaceClipIds];
  }

  const mergedClipIds: DefiningFilmcowFootstepClipId[] = [];

  for (const clipId of tierClipIds) {
    if (!mergedClipIds.includes(clipId)) {
      mergedClipIds.push(clipId);
    }
  }

  for (const clipId of surfaceClipIds) {
    if (!mergedClipIds.includes(clipId)) {
      mergedClipIds.push(clipId);
    }
  }

  return mergedClipIds;
}

function checkingFilmcowFootstepClipIsLongComposite(
  clipId: DefiningFilmcowFootstepClipId
): boolean {
  return DEFINING_FILMCOW_FOOTSTEP_LONG_COMPOSITE_CLIP_IDS.includes(
    clipId as (typeof DEFINING_FILMCOW_FOOTSTEP_LONG_COMPOSITE_CLIP_IDS)[number]
  );
}

/**
 * Drops FilmCow composite run loops from one-shot rotation pools.
 */
export function filteringFilmcowFootstepClipIdsToShortOneShots(
  clipIds: readonly DefiningFilmcowFootstepClipId[]
): DefiningFilmcowFootstepClipId[] {
  return clipIds.filter(
    (clipId) => !checkingFilmcowFootstepClipIsLongComposite(clipId)
  );
}

function checkingFilmcowFootstepClipUsesShortRunPlayback(
  clipId: DefiningFilmcowFootstepClipId
): boolean {
  return DEFINING_FILMCOW_FOOTSTEP_SHORT_RUN_CLIP_IDS.includes(
    clipId as (typeof DEFINING_FILMCOW_FOOTSTEP_SHORT_RUN_CLIP_IDS)[number]
  );
}

/**
 * Resolves the clip ids that should rotate for one surface and motion kind.
 */
export function resolvingFilmcowFootstepClipIdsForSurfaceAndMotion(
  surfaceKind: DefiningFilmcowFootstepSurfaceKind,
  motionKind: DefiningFilmcowFootstepMotionKind,
  wildlifeSizeTier: DefiningFilmcowFootstepWildlifeSizeTier | null = null
): DefiningFilmcowFootstepClipId[] {
  const surfaceDefinition =
    DEFINING_FILMCOW_FOOTSTEP_SURFACE_DEFINITIONS[surfaceKind];
  const surfaceClipIds =
    motionKind === 'run'
      ? surfaceDefinition.runClipIds
      : surfaceDefinition.walkClipIds;

  if (!wildlifeSizeTier) {
    return [...surfaceClipIds];
  }

  const tierOverrides =
    DEFINING_FILMCOW_FOOTSTEP_WILDLIFE_SIZE_TIER_CLIP_OVERRIDES[
      wildlifeSizeTier
    ];
  const tierClipIds =
    motionKind === 'run' ? tierOverrides.runClipIds : tierOverrides.walkClipIds;

  return mergingFilmcowFootstepClipIds(surfaceClipIds, tierClipIds);
}

/**
 * Wildlife uses avatar short-one-shot pools plus size-tier overrides.
 */
export function resolvingFilmcowFootstepWildlifeClipIdsForSurfaceAndMotion(
  surfaceKind: DefiningFilmcowFootstepSurfaceKind,
  motionKind: DefiningFilmcowFootstepMotionKind,
  wildlifeSizeTier: DefiningFilmcowFootstepWildlifeSizeTier
): DefiningFilmcowFootstepClipId[] {
  const surfaceDefinition =
    DEFINING_WORLD_PLAZA_AVATAR_FOOTSTEP_SURFACE_DEFINITIONS[surfaceKind];
  const surfaceClipIds =
    motionKind === 'run'
      ? surfaceDefinition.runClipIds
      : surfaceDefinition.walkClipIds;
  const tierOverrides =
    DEFINING_FILMCOW_FOOTSTEP_WILDLIFE_SIZE_TIER_CLIP_OVERRIDES[
      wildlifeSizeTier
    ];
  const tierClipIds =
    motionKind === 'run' ? tierOverrides.runClipIds : tierOverrides.walkClipIds;

  return filteringFilmcowFootstepClipIdsToShortOneShots(
    mergingFilmcowFootstepClipIds(surfaceClipIds, tierClipIds)
  );
}

/**
 * Resolves the next clip id for one surface, motion kind, and step index.
 */
export function resolvingFilmcowFootstepNextClipId(
  surfaceKind: DefiningFilmcowFootstepSurfaceKind,
  motionKind: DefiningFilmcowFootstepMotionKind,
  clipIndex: number,
  wildlifeSizeTier: DefiningFilmcowFootstepWildlifeSizeTier | null = null
): DefiningFilmcowFootstepClipId {
  const clipIds = resolvingFilmcowFootstepClipIdsForSurfaceAndMotion(
    surfaceKind,
    motionKind,
    wildlifeSizeTier
  );

  const normalizedIndex =
    ((clipIndex % clipIds.length) + clipIds.length) % clipIds.length;

  return clipIds[normalizedIndex];
}

/**
 * Resolves the next wildlife footstep clip using short one-shots only.
 */
export function resolvingFilmcowFootstepWildlifeNextClipId(
  surfaceKind: DefiningFilmcowFootstepSurfaceKind,
  motionKind: DefiningFilmcowFootstepMotionKind,
  clipIndex: number,
  wildlifeSizeTier: DefiningFilmcowFootstepWildlifeSizeTier
): DefiningFilmcowFootstepClipId {
  const clipIds = resolvingFilmcowFootstepWildlifeClipIdsForSurfaceAndMotion(
    surfaceKind,
    motionKind,
    wildlifeSizeTier
  );

  const normalizedIndex =
    ((clipIndex % clipIds.length) + clipIds.length) % clipIds.length;

  return clipIds[normalizedIndex];
}

/**
 * Resolves the jump landing clip for one ground surface.
 */
export function resolvingFilmcowFootstepLandingClipId(
  surfaceKind: DefiningFilmcowFootstepSurfaceKind
): DefiningFilmcowFootstepClipId {
  return DEFINING_FILMCOW_FOOTSTEP_SURFACE_DEFINITIONS[surfaceKind]
    .landingClipId;
}

/**
 * Resolves playback rate when a surface reuses walk clips for running.
 */
export function resolvingFilmcowFootstepRunPlaybackRate(
  surfaceKind: DefiningFilmcowFootstepSurfaceKind
): number {
  const surfaceDefinition =
    DEFINING_FILMCOW_FOOTSTEP_SURFACE_DEFINITIONS[surfaceKind];
  const runClipIds = surfaceDefinition.runClipIds;
  const walkClipIds = surfaceDefinition.walkClipIds;

  if (runClipIds.length === 1 && runClipIds[0] === walkClipIds[0]) {
    return 1.08;
  }

  return 1;
}

/**
 * Hard playback duration cap so one-shots never bleed into the next step.
 */
export function resolvingFilmcowFootstepPlaybackDurationS(
  motionKind: DefiningFilmcowFootstepMotionKind
): number {
  return motionKind === 'run'
    ? DEFINING_FILMCOW_FOOTSTEP_MAX_RUN_PLAYBACK_DURATION_S
    : DEFINING_FILMCOW_FOOTSTEP_MAX_WALK_PLAYBACK_DURATION_S;
}

/**
 * Resolves wildlife footstep playback rate for one clip and motion kind.
 */
export function resolvingFilmcowFootstepWildlifePlaybackRate(
  surfaceKind: DefiningFilmcowFootstepSurfaceKind,
  motionKind: DefiningFilmcowFootstepMotionKind,
  clipId: DefiningFilmcowFootstepClipId,
  sizeTierPlaybackMultiplier: number
): number {
  const motionRate =
    motionKind === 'run'
      ? checkingFilmcowFootstepClipUsesShortRunPlayback(clipId)
        ? DEFINING_FILMCOW_FOOTSTEP_SHORT_RUN_PLAYBACK_RATE
        : resolvingFilmcowFootstepRunPlaybackRate(surfaceKind)
      : 1;

  return sizeTierPlaybackMultiplier * motionRate;
}
