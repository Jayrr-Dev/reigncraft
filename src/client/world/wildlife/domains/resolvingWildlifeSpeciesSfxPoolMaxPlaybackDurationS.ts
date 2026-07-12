import { DEFINING_WILDLIFE_BEAST_SFX_POOL_MAX_PLAYBACK_DURATION_S } from '@/components/world/wildlife/domains/definingWildlifeBeastSfxConstants';
import { DEFINING_WILDLIFE_FARM_ANIMAL_SFX_POOL_MAX_PLAYBACK_DURATION_S } from '@/components/world/wildlife/domains/definingWildlifeFarmAnimalSfxConstants';
import { DEFINING_WILDLIFE_MIXKIT_WILD_SFX_POOL_MAX_PLAYBACK_DURATION_S } from '@/components/world/wildlife/domains/definingWildlifeMixkitWildSfxConstants';
import { DEFINING_WILDLIFE_PIXABAY_WILD_SFX_POOL_MAX_PLAYBACK_DURATION_S } from '@/components/world/wildlife/domains/definingWildlifePixabayWildSfxConstants';
import type { DefiningWildlifeSpeciesSfxPoolId } from '@/components/world/wildlife/domains/definingWildlifeSpeciesSfxClipTypes';

/**
 * Optional hard stop duration (seconds) for one vocal pool, or null when uncapped.
 */
export function resolvingWildlifeSpeciesSfxPoolMaxPlaybackDurationS(
  poolId: DefiningWildlifeSpeciesSfxPoolId
): number | null {
  if (
    poolId in DEFINING_WILDLIFE_FARM_ANIMAL_SFX_POOL_MAX_PLAYBACK_DURATION_S
  ) {
    return (
      DEFINING_WILDLIFE_FARM_ANIMAL_SFX_POOL_MAX_PLAYBACK_DURATION_S[
        poolId as keyof typeof DEFINING_WILDLIFE_FARM_ANIMAL_SFX_POOL_MAX_PLAYBACK_DURATION_S
      ] ?? null
    );
  }

  if (
    poolId in DEFINING_WILDLIFE_PIXABAY_WILD_SFX_POOL_MAX_PLAYBACK_DURATION_S
  ) {
    return (
      DEFINING_WILDLIFE_PIXABAY_WILD_SFX_POOL_MAX_PLAYBACK_DURATION_S[
        poolId as keyof typeof DEFINING_WILDLIFE_PIXABAY_WILD_SFX_POOL_MAX_PLAYBACK_DURATION_S
      ] ?? null
    );
  }

  if (poolId in DEFINING_WILDLIFE_BEAST_SFX_POOL_MAX_PLAYBACK_DURATION_S) {
    return (
      DEFINING_WILDLIFE_BEAST_SFX_POOL_MAX_PLAYBACK_DURATION_S[
        poolId as keyof typeof DEFINING_WILDLIFE_BEAST_SFX_POOL_MAX_PLAYBACK_DURATION_S
      ] ?? null
    );
  }

  if (
    poolId in DEFINING_WILDLIFE_MIXKIT_WILD_SFX_POOL_MAX_PLAYBACK_DURATION_S
  ) {
    return (
      DEFINING_WILDLIFE_MIXKIT_WILD_SFX_POOL_MAX_PLAYBACK_DURATION_S[
        poolId as keyof typeof DEFINING_WILDLIFE_MIXKIT_WILD_SFX_POOL_MAX_PLAYBACK_DURATION_S
      ] ?? null
    );
  }

  return null;
}
