import type { DefiningWildlifeSpeciesSfxClipId } from '@/components/world/wildlife/domains/definingWildlifeSpeciesSfxClipTypes';

/**
 * Per-clip gain trim when one pool mixes quiet and hot source files.
 *
 * @module components/world/wildlife/domains/definingWildlifeSpeciesSfxClipVolumeMultipliers
 */
export const DEFINING_WILDLIFE_SPECIES_SFX_CLIP_VOLUME_MULTIPLIER_BY_CLIP_ID: Partial<
  Record<DefiningWildlifeSpeciesSfxClipId, number>
> = {
  pixabay_tiger_roar_loud_01: 0.82,
  pixabay_hyena_laugh_hd_01: 0.72,
  pixabay_stag_call_01: 0.75,
  pixabay_hippo_grunt_02: 0.85,
  cow_moo_03: 0.88,
  cow_moo_05: 0.86,
};
