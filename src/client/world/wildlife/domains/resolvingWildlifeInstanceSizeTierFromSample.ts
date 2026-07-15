/**
 * Maps a stored size bell-curve sample to a discrete σ tier label bucket.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeInstanceSizeTierFromSample
 */

import type { DefiningWildlifeSizeTier } from '@/components/world/wildlife/domains/definingWildlifeNameTagConstants';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';

/** Clamps a rounded shifted σ sample to [-2, 4]. */
export function resolvingWildlifeInstanceSizeTierFromSample(
  sizeScaleSample: number,
  species?: Pick<DefiningWildlifeSpeciesDefinition, 'sizeSpawn'>
): DefiningWildlifeSizeTier {
  const shiftedSample =
    sizeScaleSample + (species?.sizeSpawn?.bellCurveMeanShift ?? 0);
  const roundedTier = Math.round(shiftedSample);

  if (roundedTier <= -2) {
    return -2;
  }

  if (roundedTier >= 4) {
    return 4;
  }

  return roundedTier as DefiningWildlifeSizeTier;
}
