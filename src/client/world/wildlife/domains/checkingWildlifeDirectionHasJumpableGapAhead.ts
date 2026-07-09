/**
 * Forward scan: does this bearing hit a jumpable water or terrain gap?
 *
 * Reuses the same gap classification as the jump planner so seek and jump
 * agree on what counts as a river or cliff.
 *
 * @module components/world/wildlife/domains/checkingWildlifeDirectionHasJumpableGapAhead
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import {
  resolvingWildlifeGapSampleKind,
  type DefiningWildlifeGapKind,
} from '@/components/world/wildlife/domains/resolvingWildlifeJumpPlan';
import type { ResolvingWildlifeSteeringHazardSampling } from '@/components/world/wildlife/domains/resolvingWildlifeSteeringStep';

export type CheckingWildlifeDirectionHasJumpableGapAheadParams = {
  origin: DefiningWorldPlazaWorldPoint;
  direction: { x: number; y: number };
  species: DefiningWildlifeSpeciesDefinition;
  hazardSampling: ResolvingWildlifeSteeringHazardSampling;
  /** Furthest distance ahead to look for the start of a gap. */
  detectMaxGrid: number;
  /** Sample step along the bearing. */
  scanStepGrid: number;
};

export type CheckingWildlifeDirectionHasJumpableGapAheadResult = {
  gapKind: DefiningWildlifeGapKind;
  /** Distance from origin to the first gap sample. */
  gapStartDistanceGrid: number;
};

/**
 * Returns the nearest jumpable gap along a unit (or near-unit) direction,
 * or null when none is found within detect range.
 */
export function checkingWildlifeDirectionHasJumpableGapAhead({
  origin,
  direction,
  species,
  hazardSampling,
  detectMaxGrid,
  scanStepGrid,
}: CheckingWildlifeDirectionHasJumpableGapAheadParams): CheckingWildlifeDirectionHasJumpableGapAheadResult | null {
  const length = Math.hypot(direction.x, direction.y);

  if (length <= 0.0001 || detectMaxGrid <= 0 || scanStepGrid <= 0) {
    return null;
  }

  const unit = {
    x: direction.x / length,
    y: direction.y / length,
  };
  const originLayer = origin.layer ?? 1;

  for (
    let sampleDistance = scanStepGrid;
    sampleDistance <= detectMaxGrid + scanStepGrid;
    sampleDistance += scanStepGrid
  ) {
    const samplePoint = {
      x: origin.x + unit.x * sampleDistance,
      y: origin.y + unit.y * sampleDistance,
      layer: originLayer,
    };
    const sampleKind = resolvingWildlifeGapSampleKind(
      samplePoint,
      originLayer,
      species,
      hazardSampling
    );

    if (sampleKind === 'unjumpable') {
      return null;
    }

    if (sampleKind === 'water' || sampleKind === 'terrain') {
      if (sampleDistance > detectMaxGrid) {
        return null;
      }

      return {
        gapKind: sampleKind,
        gapStartDistanceGrid: sampleDistance,
      };
    }
  }

  return null;
}
