/**
 * Fishing catch reward volume unit tests.
 *
 * @module components/world/fishing/domains/computingWorldPlazaFishingSfxEffectiveVolume.test
 */

import { computingWorldPlazaFishingCatchRewardSfxEffectiveVolume } from '@/components/world/fishing/domains/computingWorldPlazaFishingSfxEffectiveVolume';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/components/world/domains/managingWorldPlazaSfxVolumeStore', () => ({
  gettingWorldPlazaSfxVolume: () => 1,
}));

describe('computingWorldPlazaFishingCatchRewardSfxEffectiveVolume', () => {
  it('scales louder for higher rarity catches', () => {
    const commonVolume = computingWorldPlazaFishingCatchRewardSfxEffectiveVolume(
      'common'
    );
    const legendaryVolume =
      computingWorldPlazaFishingCatchRewardSfxEffectiveVolume('legendary');

    expect(legendaryVolume).toBeGreaterThan(commonVolume);
  });
});
