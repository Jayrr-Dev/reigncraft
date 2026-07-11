/**
 * Multiplies optional volume multipliers; undefined values are treated as 1.
 *
 * @module components/world/audio/resolvingWorldPlazaSfxVolumeMultiplierProduct
 */

/**
 * Returns the product of all multipliers, skipping undefined entries.
 */
export function resolvingWorldPlazaSfxVolumeMultiplierProduct(
  multipliers: readonly (number | undefined)[]
): number {
  let product = 1;

  for (const multiplier of multipliers) {
    if (multiplier === undefined) {
      continue;
    }

    product *= multiplier;
  }

  return product;
}
