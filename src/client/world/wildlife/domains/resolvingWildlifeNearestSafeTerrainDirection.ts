/**
 * Picks the nearest jumpable gap heading for Safe-terrain seeking.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeNearestSafeTerrainDirection
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { checkingWildlifeDirectionHasJumpableGapAhead } from '@/components/world/wildlife/domains/checkingWildlifeDirectionHasJumpableGapAhead';
import { checkingWildlifeSpeciesCanSeekSafeTerrain } from '@/components/world/wildlife/domains/checkingWildlifeSpeciesUsesSafeTerrainSeeking';
import {
  DEFINING_WILDLIFE_SAFE_TERRAIN_SEEK_DIRECTION_COUNT,
  DEFINING_WILDLIFE_SAFE_TERRAIN_SEEK_SCAN_RADIUS_GRID,
  DEFINING_WILDLIFE_SAFE_TERRAIN_SEEK_SCAN_STEP_GRID,
  DEFINING_WILDLIFE_SAFE_TERRAIN_SEEK_THREAT_ALIGNMENT_MIN,
} from '@/components/world/wildlife/domains/definingWildlifeSafeTerrainSeekingConstants';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeGapKind } from '@/components/world/wildlife/domains/resolvingWildlifeJumpPlan';
import type { ResolvingWildlifeSteeringHazardSampling } from '@/components/world/wildlife/domains/resolvingWildlifeSteeringStep';

export type ResolvingWildlifeNearestSafeTerrainDirectionParams = {
  position: DefiningWorldPlazaWorldPoint;
  species: DefiningWildlifeSpeciesDefinition;
  hazardSampling: ResolvingWildlifeSteeringHazardSampling;
  /**
   * Preferred heading (usually away from threat). Gaps must align with this
   * above {@link DEFINING_WILDLIFE_SAFE_TERRAIN_SEEK_THREAT_ALIGNMENT_MIN}.
   */
  preferredDirection: { x: number; y: number };
};

export type ResolvingWildlifeNearestSafeTerrainDirectionResult = {
  direction: { x: number; y: number };
  gapKind: DefiningWildlifeGapKind;
  gapStartDistanceGrid: number;
};

function resolvingWildlifeNormalizedDirection(direction: {
  x: number;
  y: number;
}): { x: number; y: number } | null {
  const length = Math.hypot(direction.x, direction.y);

  if (length <= 0.0001) {
    return null;
  }

  return {
    x: direction.x / length,
    y: direction.y / length,
  };
}

/**
 * Returns the best nearby jumpable gap heading, or null when none qualifies.
 *
 * Prefers closer gaps that still roughly align with `preferredDirection`
 * (so prey do not run toward the hunter to reach a river).
 */
export function resolvingWildlifeNearestSafeTerrainDirection({
  position,
  species,
  hazardSampling,
  preferredDirection,
}: ResolvingWildlifeNearestSafeTerrainDirectionParams): ResolvingWildlifeNearestSafeTerrainDirectionResult | null {
  if (!checkingWildlifeSpeciesCanSeekSafeTerrain(species)) {
    return null;
  }

  const preferred = resolvingWildlifeNormalizedDirection(preferredDirection);

  if (!preferred) {
    return null;
  }

  const detectMax = Math.min(
    DEFINING_WILDLIFE_SAFE_TERRAIN_SEEK_SCAN_RADIUS_GRID,
    Math.max(species.jump.maxJumpDistanceGrid, 2.5)
  );

  let best: ResolvingWildlifeNearestSafeTerrainDirectionResult | null = null;
  let bestScore = Number.NEGATIVE_INFINITY;

  for (
    let index = 0;
    index < DEFINING_WILDLIFE_SAFE_TERRAIN_SEEK_DIRECTION_COUNT;
    index += 1
  ) {
    const angle =
      (index / DEFINING_WILDLIFE_SAFE_TERRAIN_SEEK_DIRECTION_COUNT) *
      Math.PI *
      2;
    const direction = {
      x: Math.cos(angle),
      y: Math.sin(angle),
    };
    const alignment =
      direction.x * preferred.x + direction.y * preferred.y;

    if (alignment < DEFINING_WILDLIFE_SAFE_TERRAIN_SEEK_THREAT_ALIGNMENT_MIN) {
      continue;
    }

    const gap = checkingWildlifeDirectionHasJumpableGapAhead({
      origin: position,
      direction,
      species,
      hazardSampling,
      detectMaxGrid: detectMax,
      scanStepGrid: DEFINING_WILDLIFE_SAFE_TERRAIN_SEEK_SCAN_STEP_GRID,
    });

    if (!gap) {
      continue;
    }

    // Closer gaps score higher; alignment breaks ties.
    const score =
      alignment * 2 - gap.gapStartDistanceGrid / Math.max(detectMax, 0.1);

    if (score > bestScore) {
      bestScore = score;
      best = {
        direction,
        gapKind: gap.gapKind,
        gapStartDistanceGrid: gap.gapStartDistanceGrid,
      };
    }
  }

  return best;
}
