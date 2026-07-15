/**
 * @module components/world/fishing/domains/computingWorldPlazaFishingSfxEffectiveVolume
 */

import { computingWorldPlazaSfxEffectiveVolume } from '@/components/world/audio/computingWorldPlazaSfxEffectiveVolume';
import { gettingWorldPlazaSfxVolume } from '@/components/world/domains/managingWorldPlazaSfxVolumeStore';
import {
  DEFINING_WORLD_PLAZA_FISHING_SFX_CATCH_REWARD_TARGET_VOLUME_BY_RARITY,
  type DefiningWorldPlazaFishingSfxPlaybackProfile,
} from '@/components/world/fishing/domains/definingWorldPlazaFishingSfxConstants';
import type { DefiningWorldPlazaInventoryItemRarity } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemRarityConstants';

export function computingWorldPlazaFishingSfxEffectiveVolume(
  profile: DefiningWorldPlazaFishingSfxPlaybackProfile
): number {
  return computingWorldPlazaSfxEffectiveVolume({
    baseTargetVolume: profile.peakVolume,
    sliderVolume: gettingWorldPlazaSfxVolume(),
  });
}

export function computingWorldPlazaFishingCatchRewardSfxEffectiveVolume(
  rarity: DefiningWorldPlazaInventoryItemRarity
): number {
  return computingWorldPlazaSfxEffectiveVolume({
    baseTargetVolume:
      DEFINING_WORLD_PLAZA_FISHING_SFX_CATCH_REWARD_TARGET_VOLUME_BY_RARITY[
        rarity
      ],
    sliderVolume: gettingWorldPlazaSfxVolume(),
  });
}
