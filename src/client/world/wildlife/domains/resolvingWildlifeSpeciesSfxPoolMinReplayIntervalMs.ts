import { DEFINING_WILDLIFE_BEAST_SFX_POOL_MIN_REPLAY_INTERVAL_MS } from '@/components/world/wildlife/domains/definingWildlifeBeastSfxConstants';
import { DEFINING_WILDLIFE_FARM_ANIMAL_SFX_POOL_MIN_REPLAY_INTERVAL_MS } from '@/components/world/wildlife/domains/definingWildlifeFarmAnimalSfxConstants';
import { DEFINING_WILDLIFE_MIXKIT_WILD_SFX_POOL_MIN_REPLAY_INTERVAL_MS } from '@/components/world/wildlife/domains/definingWildlifeMixkitWildSfxConstants';
import { DEFINING_WILDLIFE_PIXABAY_WILD_SFX_POOL_MIN_REPLAY_INTERVAL_MS } from '@/components/world/wildlife/domains/definingWildlifePixabayWildSfxConstants';
import type { DefiningWildlifeSpeciesSfxPoolId } from '@/components/world/wildlife/domains/definingWildlifeSpeciesSfxClipTypes';

/**
 * Returns the minimum replay interval for a vocal pool, or null when uncapped.
 */
export function resolvingWildlifeSpeciesSfxPoolMinReplayIntervalMs(
  poolId: DefiningWildlifeSpeciesSfxPoolId
): number | null {
  if (poolId in DEFINING_WILDLIFE_FARM_ANIMAL_SFX_POOL_MIN_REPLAY_INTERVAL_MS) {
    return (
      DEFINING_WILDLIFE_FARM_ANIMAL_SFX_POOL_MIN_REPLAY_INTERVAL_MS[
        poolId as keyof typeof DEFINING_WILDLIFE_FARM_ANIMAL_SFX_POOL_MIN_REPLAY_INTERVAL_MS
      ] ?? null
    );
  }

  if (
    poolId in DEFINING_WILDLIFE_PIXABAY_WILD_SFX_POOL_MIN_REPLAY_INTERVAL_MS
  ) {
    return (
      DEFINING_WILDLIFE_PIXABAY_WILD_SFX_POOL_MIN_REPLAY_INTERVAL_MS[
        poolId as keyof typeof DEFINING_WILDLIFE_PIXABAY_WILD_SFX_POOL_MIN_REPLAY_INTERVAL_MS
      ] ?? null
    );
  }

  if (poolId in DEFINING_WILDLIFE_BEAST_SFX_POOL_MIN_REPLAY_INTERVAL_MS) {
    return (
      DEFINING_WILDLIFE_BEAST_SFX_POOL_MIN_REPLAY_INTERVAL_MS[
        poolId as keyof typeof DEFINING_WILDLIFE_BEAST_SFX_POOL_MIN_REPLAY_INTERVAL_MS
      ] ?? null
    );
  }

  if (poolId in DEFINING_WILDLIFE_MIXKIT_WILD_SFX_POOL_MIN_REPLAY_INTERVAL_MS) {
    return (
      DEFINING_WILDLIFE_MIXKIT_WILD_SFX_POOL_MIN_REPLAY_INTERVAL_MS[
        poolId as keyof typeof DEFINING_WILDLIFE_MIXKIT_WILD_SFX_POOL_MIN_REPLAY_INTERVAL_MS
      ] ?? null
    );
  }

  return null;
}
