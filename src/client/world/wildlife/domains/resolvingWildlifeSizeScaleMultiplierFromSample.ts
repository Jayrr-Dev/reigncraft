/**
 * Maps a stored size bell-curve sample to gameplay and render multipliers.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeSizeScaleMultiplierFromSample
 */

import {
  DEFINING_WILDLIFE_SIZE_COMBAT_STAT_POWER_EXPONENT,
  DEFINING_WILDLIFE_SIZE_SCALE_BASE_MULTIPLIER,
  DEFINING_WILDLIFE_SIZE_SCALE_MAX_MULTIPLIER,
  DEFINING_WILDLIFE_SIZE_SCALE_MIN_MULTIPLIER,
  DEFINING_WILDLIFE_SIZE_SCALE_MULTIPLIER_PER_SIGMA,
  DEFINING_WILDLIFE_SIZE_SPEED_STAT_POWER_EXPONENT,
} from '@/components/world/wildlife/domains/definingWildlifeSizeScaleConstants';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';

/** Resolves the visual size multiplier for one wildlife instance from its spawn roll. */
export function resolvingWildlifeSizeScaleMultiplierFromSample(
  sizeScaleSample: number,
  species?: Pick<DefiningWildlifeSpeciesDefinition, 'sizeSpawn'>
): number {
  const shiftedSample =
    sizeScaleSample + (species?.sizeSpawn?.bellCurveMeanShift ?? 0);
  const rawMultiplier =
    DEFINING_WILDLIFE_SIZE_SCALE_BASE_MULTIPLIER +
    shiftedSample * DEFINING_WILDLIFE_SIZE_SCALE_MULTIPLIER_PER_SIGMA;

  return Math.min(
    DEFINING_WILDLIFE_SIZE_SCALE_MAX_MULTIPLIER,
    Math.max(DEFINING_WILDLIFE_SIZE_SCALE_MIN_MULTIPLIER, rawMultiplier)
  );
}

/**
 * Maps visual size to combat stats. Larger animals get disproportionately stronger;
 * small / young-looking animals get disproportionately weaker.
 */
export function computingWildlifeSizeCombatStatMultiplierFromVisualMultiplier(
  visualSizeMultiplier: number
): number {
  return (
    visualSizeMultiplier ** DEFINING_WILDLIFE_SIZE_COMBAT_STAT_POWER_EXPONENT
  );
}

/** Milder than combat stats: walk/run track visual size, not size squared. */
export function computingWildlifeSizeSpeedStatMultiplierFromVisualMultiplier(
  visualSizeMultiplier: number
): number {
  return (
    visualSizeMultiplier ** DEFINING_WILDLIFE_SIZE_SPEED_STAT_POWER_EXPONENT
  );
}
