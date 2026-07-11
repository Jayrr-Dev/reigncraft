import { computingWorldPlazaSfxEffectiveVolume } from '@/components/world/audio/computingWorldPlazaSfxEffectiveVolume';
import {
  mappingWorldPlazaSfxClipEntryIds,
  resolvingWorldPlazaSfxClipEntryId,
  resolvingWorldPlazaSfxClipEntryVolume,
  resolvingWorldPlazaSfxVolumeMultiplier,
} from '@/components/world/audio/resolvingWorldPlazaSfxClipEntry';
import { resolvingWorldPlazaSfxVolumeMultiplierProduct } from '@/components/world/audio/resolvingWorldPlazaSfxVolumeMultiplierProduct';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaSfxClipEntry', () => {
  it('reads plain string entries as id with volume 1', () => {
    expect(resolvingWorldPlazaSfxClipEntryId('grass_light_01')).toBe(
      'grass_light_01'
    );
    expect(resolvingWorldPlazaSfxClipEntryVolume('grass_light_01')).toBe(1);
  });

  it('reads object entries with optional volume', () => {
    expect(
      resolvingWorldPlazaSfxClipEntryId({
        id: 'grass_light_02',
        volume: 0.5,
      })
    ).toBe('grass_light_02');
    expect(
      resolvingWorldPlazaSfxClipEntryVolume({
        id: 'grass_light_02',
        volume: 0.5,
      })
    ).toBe(0.5);
  });

  it('maps entry arrays to ids', () => {
    expect(
      mappingWorldPlazaSfxClipEntryIds([
        'grass_light_01',
        { id: 'grass_light_02', volume: 0.5 },
      ])
    ).toEqual(['grass_light_01', 'grass_light_02']);
  });

  it('stacks definition, group, and clip multipliers', () => {
    expect(
      resolvingWorldPlazaSfxVolumeMultiplier({ volume: 0.8 }, 0.5, {
        id: 'grass_light_01',
        volume: 0.5,
      })
    ).toBe(0.2);
  });
});

describe('resolvingWorldPlazaSfxVolumeMultiplierProduct', () => {
  it('treats undefined multipliers as 1', () => {
    expect(
      resolvingWorldPlazaSfxVolumeMultiplierProduct([0.5, undefined, 2])
    ).toBe(1);
  });
});

describe('computingWorldPlazaSfxEffectiveVolume', () => {
  it('multiplies base, multipliers, and slider', () => {
    expect(
      computingWorldPlazaSfxEffectiveVolume({
        baseTargetVolume: 0.5,
        multipliers: [0.8, 0.5],
        sliderVolume: 1,
      })
    ).toBe(0.2);
  });
});
