import { describe, expect, it } from 'vitest';

import {
  resolvingWildlifeSpeciesSfxClipId,
  resolvingWildlifeSpeciesSfxClipPoolLength,
} from '@/components/world/wildlife/domains/resolvingWildlifeSpeciesSfxClipId';
import { resolvingWildlifeSpeciesSfxUrl } from '@/components/world/wildlife/domains/resolvingWildlifeSpeciesSfxUrl';

describe('resolvingWildlifeSpeciesSfxClipId', () => {
  it('resolves cow idle clips from the cow pool', () => {
    const poolLength = resolvingWildlifeSpeciesSfxClipPoolLength(
      'cow',
      'idle_ambient'
    );

    expect(poolLength).toBe(6);
    expect(resolvingWildlifeSpeciesSfxClipId('cow', 'idle_ambient', 0)).toBe(
      'cow_moo_01'
    );
    expect(
      resolvingWildlifeSpeciesSfxClipId('cow', 'idle_ambient', poolLength)
    ).toBe(resolvingWildlifeSpeciesSfxClipId('cow', 'idle_ambient', 0));
  });

  it('alternates chicken cluck and rooster crow on idle ambient', () => {
    expect(
      resolvingWildlifeSpeciesSfxClipId('chicken', 'idle_ambient', 0)
    ).toBe('chicken_cluck_01');
    expect(
      resolvingWildlifeSpeciesSfxClipId(
        'chicken',
        'idle_ambient',
        1
      )?.startsWith('rooster_crow_')
    ).toBe(true);
  });

  it('returns null for unmapped species', () => {
    expect(
      resolvingWildlifeSpeciesSfxClipId('turtle', 'idle_ambient', 0)
    ).toBeNull();
  });

  it('resolves lion attack clips from the mixkit lion pool', () => {
    expect(resolvingWildlifeSpeciesSfxClipId('lion', 'attack', 0)).toBe(
      'mixkit_lion_roar_01'
    );
  });
});

describe('resolvingWildlifeSpeciesSfxUrl', () => {
  it('builds encoded public URLs for wav and mp3 clips', () => {
    expect(resolvingWildlifeSpeciesSfxUrl('cow_moo_01')).toBe(
      '/sfx/farm-animal/cow-moo-01.wav'
    );
    expect(resolvingWildlifeSpeciesSfxUrl('wolf_howl_01')).toBe(
      '/sfx/farm-animal/wolf-howl-01.mp3'
    );
    expect(resolvingWildlifeSpeciesSfxUrl('beast_short_bellow_01')).toBe(
      '/sfx/beast/beast-short-bellow-01.wav'
    );
    expect(resolvingWildlifeSpeciesSfxUrl('mixkit_lion_roar_01')).toBe(
      '/sfx/mixkit-wild/lion-roar-01.wav'
    );
  });
});
