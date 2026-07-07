/**
 * Stable 0..1 pseudo-random fraction from a wildlife instance id.
 *
 * @module components/world/wildlife/domains/computingWildlifeInstanceSeedFraction
 */

/**
 * Returns a deterministic fraction in [0, 1) for per-instance jitter.
 */
export function computingWildlifeInstanceSeedFraction(
  instanceId: string,
  salt = 0
): number {
  let hash = salt;

  for (let index = 0; index < instanceId.length; index += 1) {
    hash = (hash * 31 + instanceId.charCodeAt(index)) | 0;
  }

  return (hash >>> 0) / 4_294_967_295;
}
