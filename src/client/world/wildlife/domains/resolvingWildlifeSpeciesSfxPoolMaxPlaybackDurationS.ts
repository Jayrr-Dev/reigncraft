import { DEFINING_WILDLIFE_FARM_ANIMAL_SFX_POOL_MAX_PLAYBACK_DURATION_S } from '@/components/world/wildlife/domains/definingWildlifeFarmAnimalSfxConstants';
import type { DefiningWildlifeSpeciesSfxPoolId } from '@/components/world/wildlife/domains/definingWildlifeSpeciesSfxClipTypes';

/**
 * Optional hard stop duration (seconds) for one vocal pool, or null when uncapped.
 */
export function resolvingWildlifeSpeciesSfxPoolMaxPlaybackDurationS(
  poolId: DefiningWildlifeSpeciesSfxPoolId
): number | null {
  return (
    DEFINING_WILDLIFE_FARM_ANIMAL_SFX_POOL_MAX_PLAYBACK_DURATION_S[
      poolId as keyof typeof DEFINING_WILDLIFE_FARM_ANIMAL_SFX_POOL_MAX_PLAYBACK_DURATION_S
    ] ?? null
  );
}
