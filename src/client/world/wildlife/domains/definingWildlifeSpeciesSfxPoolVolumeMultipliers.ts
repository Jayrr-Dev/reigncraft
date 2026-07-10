import type { DefiningWildlifeSpeciesSfxPoolId } from '@/components/world/wildlife/domains/definingWildlifeSpeciesSfxClipTypes';

/**
 * Per-pool gain trim for hot source files that read louder than the event curve.
 *
 * @module components/world/wildlife/domains/definingWildlifeSpeciesSfxPoolVolumeMultipliers
 */
export const DEFINING_WILDLIFE_SPECIES_SFX_POOL_VOLUME_MULTIPLIER_BY_POOL_ID: Partial<
  Record<DefiningWildlifeSpeciesSfxPoolId, number>
> = {
  chicken_crow: 0.42,
  cow_moo: 0.9,
  dog_bark: 0.74,
  donkey_bray: 0.62,
  elephant_trumpet: 0.55,
  horse_whinny: 0.68,
  mixkit_wolf_howl: 0.72,
  pig_grunt: 0.72,
  pixabay_crocodile: 0.74,
  pixabay_hippo_grunt: 0.7,
  pixabay_hyena_laugh: 0.66,
  pixabay_prey: 0.84,
  pixabay_rhino: 0.72,
  pixabay_tiger_roar: 0.68,
  pixabay_zebra_whinny: 0.76,
  tiger_growl: 0.75,
  mixkit_lion_roar: 0.78,
  bear_growl: 0.8,
  wolf_howl: 0.72,
};
