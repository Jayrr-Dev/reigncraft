import type { DefiningWildlifeSpeciesSfxPoolId } from '@/components/world/wildlife/domains/definingWildlifeSpeciesSfxClipTypes';
import { DEFINING_WILDLIFE_SPECIES_SFX_POOL_VOLUME_MULTIPLIER_BY_POOL_ID } from '@/components/world/wildlife/domains/definingWildlifeSpeciesSfxPoolVolumeMultipliers';

/**
 * Resolves optional per-pool gain trim for one species vocal pool.
 */
export function resolvingWildlifeSpeciesSfxPoolVolumeMultiplier(
  poolId: DefiningWildlifeSpeciesSfxPoolId
): number {
  return (
    DEFINING_WILDLIFE_SPECIES_SFX_POOL_VOLUME_MULTIPLIER_BY_POOL_ID[poolId] ?? 1
  );
}
