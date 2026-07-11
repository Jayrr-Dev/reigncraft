import { describe, expect, it } from 'vitest';

import { computingWorldPlazaCampfireAmbienceEffectiveVolume } from '@/components/world/fire/domains/computingWorldPlazaCampfireAmbienceEffectiveVolume';
import { resolvingWorldPlazaCampfireAmbienceSfxUrl } from '@/components/world/fire/domains/resolvingWorldPlazaCampfireAmbienceSfxUrl';
import { resolvingWorldPlazaCampfireAmbienceStarAudioId } from '@/components/world/fire/domains/resolvingWorldPlazaCampfireAmbienceStarAudioId';
import type { WorldFireDevvitCell } from '../../../../shared/worldFireDevvit';

describe('resolvingWorldPlazaCampfireAmbienceStarAudioId', () => {
  it('prefixes bonfire clip ids', () => {
    expect(resolvingWorldPlazaCampfireAmbienceStarAudioId('bonfire')).toBe(
      'campfire-ambience.bonfire'
    );
  });
});

describe('resolvingWorldPlazaCampfireAmbienceSfxUrl', () => {
  it('builds a public URL for the bonfire loop', () => {
    expect(resolvingWorldPlazaCampfireAmbienceSfxUrl('bonfire')).toBe(
      '/fire/sfx/campfire/bonfire.ogg'
    );
  });
});

describe('computingWorldPlazaCampfireAmbienceEffectiveVolume', () => {
  const litCampfire: WorldFireDevvitCell = {
    tileX: 10,
    tileY: 10,
    worldLayer: 1,
    kind: 'campfire',
    ignitedAtMs: 0,
    fuelRemainingMs: 60_000,
    initialFuelMs: 60_000,
    intensity: 1,
  };

  it('returns zero when no lit campfires are nearby', () => {
    expect(
      computingWorldPlazaCampfireAmbienceEffectiveVolume(
        { x: 0, y: 0, layer: 1 },
        []
      )
    ).toBe(0);
  });

  it('returns zero for spreading fire cells', () => {
    expect(
      computingWorldPlazaCampfireAmbienceEffectiveVolume(
        { x: 10.5, y: 10.5, layer: 1 },
        [{ ...litCampfire, kind: 'spreading' }]
      )
    ).toBe(0);
  });

  it('returns zero when the listener is on another world layer', () => {
    expect(
      computingWorldPlazaCampfireAmbienceEffectiveVolume(
        { x: 10.5, y: 10.5, layer: 2 },
        [litCampfire]
      )
    ).toBe(0);
  });

  it('ramps volume down with distance from the campfire', () => {
    const atSource = computingWorldPlazaCampfireAmbienceEffectiveVolume(
      { x: 10.5, y: 10.5, layer: 1 },
      [litCampfire]
    );
    const fartherAway = computingWorldPlazaCampfireAmbienceEffectiveVolume(
      { x: 20.5, y: 10.5, layer: 1 },
      [litCampfire]
    );

    expect(atSource).toBeGreaterThan(0);
    expect(fartherAway).toBeGreaterThan(0);
    expect(fartherAway).toBeLessThan(atSource);
  });
});
