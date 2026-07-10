import { describe, expect, it } from 'vitest';

import { resolvingWorldPlazaBiomeAmbienceClipId } from '@/components/world/domains/resolvingWorldPlazaBiomeAmbienceClipId';

describe('resolvingWorldPlazaBiomeAmbienceClipId', () => {
  it('maps swamp to the swamp loop', () => {
    expect(resolvingWorldPlazaBiomeAmbienceClipId('swamp')).toBe('swamp');
  });

  it('maps wooded biomes to suburbs woods', () => {
    expect(resolvingWorldPlazaBiomeAmbienceClipId('forest')).toBe(
      'woods_near_suburbs'
    );
    expect(resolvingWorldPlazaBiomeAmbienceClipId('flower_forest')).toBe(
      'woods_near_suburbs'
    );
    expect(resolvingWorldPlazaBiomeAmbienceClipId('plains')).toBe(
      'woods_near_suburbs'
    );
  });

  it('returns null for biomes without a shipped loop yet', () => {
    expect(resolvingWorldPlazaBiomeAmbienceClipId('snowy_plains')).toBeNull();
  });
});
