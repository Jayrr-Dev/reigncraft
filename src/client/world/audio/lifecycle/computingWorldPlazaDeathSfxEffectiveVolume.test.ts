import { computingWorldPlazaDeathSfxEffectiveVolume } from '@/components/world/audio/lifecycle/computingWorldPlazaDeathSfxEffectiveVolume';
import { describe, expect, it } from 'vitest';

describe('computingWorldPlazaDeathSfxEffectiveVolume', () => {
  it('scales the death boom base volume by the SFX slider', () => {
    expect(computingWorldPlazaDeathSfxEffectiveVolume()).toBe(0.82);
  });
});
