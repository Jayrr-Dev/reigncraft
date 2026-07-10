import type { DefiningWildlifeSpeciesSfxPoolId } from '@/components/world/wildlife/domains/definingWildlifeSpeciesSfxClipTypes';

/**
 * Per-pool gain trim for hot source files that read louder than the event curve.
 *
 * @module components/world/wildlife/domains/definingWildlifeSpeciesSfxPoolVolumeMultipliers
 */
export const DEFINING_WILDLIFE_SPECIES_SFX_POOL_VOLUME_MULTIPLIER_BY_POOL_ID: Partial<
  Record<DefiningWildlifeSpeciesSfxPoolId, number>
> = {
  pig_grunt: 0.72,
  pixabay_tiger_roar: 0.68,
  tiger_growl: 0.75,
  mixkit_lion_roar: 0.78,
  bear_growl: 0.8,
};
