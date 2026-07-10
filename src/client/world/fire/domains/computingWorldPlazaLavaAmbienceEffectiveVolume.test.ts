import { describe, expect, it } from 'vitest';

import { computingWorldPlazaLavaAmbienceEffectiveVolume } from '@/components/world/fire/domains/computingWorldPlazaLavaAmbienceEffectiveVolume';
import { computingWorldPlazaLavaAmbienceDistanceAttenuation } from '@/components/world/fire/domains/resolvingWorldPlazaLavaAmbienceNearPlayer';
import { resolvingWorldPlazaLavaAmbienceSfxUrl } from '@/components/world/fire/domains/resolvingWorldPlazaLavaAmbienceSfxUrl';
import { resolvingWorldPlazaLavaAmbienceStarAudioId } from '@/components/world/fire/domains/resolvingWorldPlazaLavaAmbienceStarAudioId';

describe('resolvingWorldPlazaLavaAmbienceStarAudioId', () => {
  it('builds a stable manifest key', () => {
    expect(resolvingWorldPlazaLavaAmbienceStarAudioId('crackle')).toBe(
      'lava-ambience.crackle'
    );
  });
});

describe('resolvingWorldPlazaLavaAmbienceSfxUrl', () => {
  it('points at the shipped bonfire loop', () => {
    expect(resolvingWorldPlazaLavaAmbienceSfxUrl('crackle')).toBe(
      '/sfx/campfire/bonfire.wav'
    );
  });
});

describe('computingWorldPlazaLavaAmbienceDistanceAttenuation', () => {
  it('is full volume on the lava tile center', () => {
    expect(
      computingWorldPlazaLavaAmbienceDistanceAttenuation(
        { x: 4.5, y: 8.5 },
        4,
        8
      )
    ).toBe(1);
  });

  it('falls off to zero beyond the max audible distance', () => {
    expect(
      computingWorldPlazaLavaAmbienceDistanceAttenuation(
        { x: 20, y: 8.5 },
        4,
        8
      )
    ).toBe(0);
  });
});

describe('computingWorldPlazaLavaAmbienceEffectiveVolume', () => {
  it('is silent when the player is far from lava', () => {
    expect(computingWorldPlazaLavaAmbienceEffectiveVolume({ x: 0, y: 0 })).toBe(
      0
    );
  });
});
