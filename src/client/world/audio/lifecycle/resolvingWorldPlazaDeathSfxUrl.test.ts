import { describe, expect, it } from 'vitest';

import { resolvingWorldPlazaDeathSfxUrl } from '@/components/world/audio/lifecycle/resolvingWorldPlazaDeathSfxUrl';

describe('resolvingWorldPlazaDeathSfxUrl', () => {
  it('builds the public URL for the impact boom clip', () => {
    expect(resolvingWorldPlazaDeathSfxUrl('impact_boom')).toBe(
      '/health/sfx/boolean-transitions/impact-boom-008.ogg'
    );
  });
});
