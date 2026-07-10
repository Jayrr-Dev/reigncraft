import {
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
    DEFINING_FILMCOW_FOOTSTEP_WILDLIFE_SIZE_TIER_CLIP_OVERRIDES[wildlifeSizeTier];
  const tierClipIds =
    motionKind === 'run'
      ? tierOverrides.runClipIds
      : tierOverrides.walkClipIds;

  return mergingFilmcowFootstepClipIds(surfaceClipIds, tierClipIds);
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
