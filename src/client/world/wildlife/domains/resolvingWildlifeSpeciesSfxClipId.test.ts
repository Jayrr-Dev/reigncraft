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

    expect(poolLength).toBe(2);
    expect(resolvingWildlifeSpeciesSfxClipId('cow', 'idle_ambient', 0)).toBe(
      'cow_moo_02'
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

  it('returns null for turtle idle but resolves hit_taken hiss', () => {
    expect(
      resolvingWildlifeSpeciesSfxClipId('turtle', 'idle_ambient', 0)
    ).toBeNull();
    expect(resolvingWildlifeSpeciesSfxClipId('turtle', 'hit_taken', 0)).toBe(
      'pixabay_reptile_hiss_01'
    );
  });

  it('resolves deer flee clips from the pixabay prey pool', () => {
    expect(resolvingWildlifeSpeciesSfxClipId('deer', 'flee_start', 0)).toBe(
      'pixabay_deer_snort_01'
    );
    expect(
      resolvingWildlifeSpeciesSfxClipPoolLength('deer', 'flee_start')
    ).toBe(3);
  });

  it('resolves hyena howl from the pixabay laugh pool', () => {
    expect(resolvingWildlifeSpeciesSfxClipId('hyena', 'howl', 0)).toBe(
      'pixabay_hyena_laugh_01'
    );
  });

  it('resolves lion attack clips from the mixkit lion pool', () => {
    expect(resolvingWildlifeSpeciesSfxClipId('lion', 'attack', 0)).toBe(
      'mixkit_lion_roar_01'
    );
  });

  it('rotates tiger attack clips across the pixabay tiger roar pool', () => {
    expect(resolvingWildlifeSpeciesSfxClipPoolLength('tiger', 'attack')).toBe(
      2
    );
    expect(resolvingWildlifeSpeciesSfxClipId('tiger', 'attack', 0)).toBe(
      'pixabay_tiger_roar_loud_01'
    );
    expect(resolvingWildlifeSpeciesSfxClipId('tiger', 'stalk', 0)).toBe(
      'pixabay_tiger_roar_light_01'
    );
    expect(resolvingWildlifeSpeciesSfxClipId('jaguar', 'warn', 1)).toBe(
      'pixabay_tiger_growl_01'
    );
  });
});

describe('resolvingWildlifeSpeciesSfxUrl', () => {
  it('builds encoded public URLs for wav and mp3 clips', () => {
    expect(resolvingWildlifeSpeciesSfxUrl('cow_moo_01')).toBe(
      '/creatures/sfx/vocals/farm-animal/cow-moo-01.ogg'
    );
    expect(resolvingWildlifeSpeciesSfxUrl('wolf_howl_01')).toBe(
      '/creatures/sfx/vocals/farm-animal/wolf-howl-01.ogg'
    );
    expect(resolvingWildlifeSpeciesSfxUrl('beast_short_bellow_01')).toBe(
      '/creatures/sfx/vocals/beast/beast-short-bellow-01.ogg'
    );
    expect(resolvingWildlifeSpeciesSfxUrl('mixkit_lion_roar_01')).toBe(
      '/creatures/sfx/vocals/mixkit-wild/lion-roar-01.ogg'
    );
    expect(resolvingWildlifeSpeciesSfxUrl('pixabay_deer_snort_01')).toBe(
      '/creatures/sfx/vocals/pixabay-wild/deer-snort-01.ogg'
    );
    expect(resolvingWildlifeSpeciesSfxUrl('pixabay_tiger_roar_loud_01')).toBe(
      '/creatures/sfx/vocals/pixabay-wild/tiger-roar-loud-01.ogg'
    );
  });
});
