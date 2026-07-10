import { describe, expect, it } from 'vitest';

import {
  DEFINING_WILDLIFE_OMEGA_WOLF_ATTACK_SFX_CLIP_IDS,
  DEFINING_WILDLIFE_OMEGA_WOLF_HOWL_SFX_CLIP_IDS,
} from '@/components/world/wildlife/domains/definingWildlifeOmegaWolfSfxConstants';
import {
  resolvingWildlifeOmegaWolfSfxClipId,
  resolvingWildlifeOmegaWolfSfxClipPoolLength,
} from '@/components/world/wildlife/domains/resolvingWildlifeOmegaWolfSfxClipId';

describe('resolvingWildlifeOmegaWolfSfxClipId', () => {
  it('maps attack combo events to fixed clips', () => {
    expect(resolvingWildlifeOmegaWolfSfxClipId('attack_bite', 0)).toBe(
      DEFINING_WILDLIFE_OMEGA_WOLF_ATTACK_SFX_CLIP_IDS.attack_bite
    );
    expect(resolvingWildlifeOmegaWolfSfxClipId('attack_snap', 0)).toBe(
      DEFINING_WILDLIFE_OMEGA_WOLF_ATTACK_SFX_CLIP_IDS.attack_snap
    );
    expect(resolvingWildlifeOmegaWolfSfxClipId('attack_lunge', 0)).toBe(
      DEFINING_WILDLIFE_OMEGA_WOLF_ATTACK_SFX_CLIP_IDS.attack_lunge
    );
  });

  it('rotates howl clips through the ShortRoar pool', () => {
    const poolLength = resolvingWildlifeOmegaWolfSfxClipPoolLength('howl');

    expect(poolLength).toBe(
      DEFINING_WILDLIFE_OMEGA_WOLF_HOWL_SFX_CLIP_IDS.length
    );

    for (let index = 0; index < poolLength; index += 1) {
      expect(resolvingWildlifeOmegaWolfSfxClipId('howl', index)).toBe(
        DEFINING_WILDLIFE_OMEGA_WOLF_HOWL_SFX_CLIP_IDS[index]
      );
    }
  });

  it('wraps rotation indices for hit reactions', () => {
    const poolLength = resolvingWildlifeOmegaWolfSfxClipPoolLength('hit_taken');

    expect(resolvingWildlifeOmegaWolfSfxClipId('hit_taken', poolLength)).toBe(
      resolvingWildlifeOmegaWolfSfxClipId('hit_taken', 0)
    );
  });
});
