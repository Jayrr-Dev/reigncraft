import { describe, expect, it } from 'vitest';

import {
  resolvingWorldPlazaBiomeAmbienceClipId,
  resolvingWorldPlazaBiomeAmbienceClipIdForBiomeKind,
} from '@/components/world/domains/resolvingWorldPlazaBiomeAmbienceClipId';

describe('resolvingWorldPlazaBiomeAmbienceClipIdForBiomeKind', () => {
  it('maps swamp to the swamp loop', () => {
    expect(resolvingWorldPlazaBiomeAmbienceClipIdForBiomeKind('swamp')).toBe(
      'swamp'
    );
  });

  it('maps coastal biomes to TomMusic loops', () => {
    expect(resolvingWorldPlazaBiomeAmbienceClipIdForBiomeKind('beach')).toBe(
      'beach'
    );
    expect(resolvingWorldPlazaBiomeAmbienceClipIdForBiomeKind('ocean')).toBe(
      'sea'
    );
  });

  it('maps wooded biomes to suburbs woods', () => {
    expect(resolvingWorldPlazaBiomeAmbienceClipIdForBiomeKind('forest')).toBe(
      'woods_near_suburbs'
    );
    expect(
      resolvingWorldPlazaBiomeAmbienceClipIdForBiomeKind('flower_forest')
    ).toBe('woods_near_suburbs');
    expect(resolvingWorldPlazaBiomeAmbienceClipIdForBiomeKind('plains')).toBe(
      'woods_near_suburbs'
    );
  });

  it('maps snowy plains to the winter storm loop', () => {
    expect(
      resolvingWorldPlazaBiomeAmbienceClipIdForBiomeKind('snowy_plains')
    ).toBe('winter_storm');
  });
});

describe('resolvingWorldPlazaBiomeAmbienceClipId', () => {
  it('falls back to the biome bed when no flowing water is nearby', () => {
    expect(
      resolvingWorldPlazaBiomeAmbienceClipId('desert', { x: 0, y: 0 })
    ).toBe('air_conditioner');
  });
});
