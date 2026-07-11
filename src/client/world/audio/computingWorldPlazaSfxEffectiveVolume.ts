import { resolvingWorldPlazaSfxVolumeMultiplierProduct } from '@/components/world/audio/resolvingWorldPlazaSfxVolumeMultiplierProduct';

export type ComputingWorldPlazaSfxEffectiveVolumeInput = {
  /** Base target loudness before multipliers and slider (0–1). */
  baseTargetVolume: number;
  /** Optional family, group, clip, distance, etc. multipliers. */
  multipliers?: readonly (number | undefined)[];
  /** Master or SFX or ambience slider (0–1). */
  sliderVolume: number;
};

/**
 * Resolves final play volume: base × product(multipliers) × slider.
 */
export function computingWorldPlazaSfxEffectiveVolume({
  baseTargetVolume,
  multipliers = [],
  sliderVolume,
}: ComputingWorldPlazaSfxEffectiveVolumeInput): number {
  return (
    baseTargetVolume *
    resolvingWorldPlazaSfxVolumeMultiplierProduct(multipliers) *
    sliderVolume
  );
}
