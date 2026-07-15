import { computingWildlifeStudySfxEffectiveVolume } from '@/components/world/wildlife/domains/computingWildlifeStudySfxEffectiveVolume';
import { describe, expect, it } from 'vitest';

describe('computingWildlifeStudySfxEffectiveVolume', () => {
  it('scales each reward section base volume by the SFX slider', () => {
    expect(computingWildlifeStudySfxEffectiveVolume('study')).toBe(0.62);
    expect(computingWildlifeStudySfxEffectiveVolume('codex')).toBe(0.74);
    expect(computingWildlifeStudySfxEffectiveVolume('chest')).toBe(0.5);
    expect(computingWildlifeStudySfxEffectiveVolume('key')).toBe(0.38);
  });
});
