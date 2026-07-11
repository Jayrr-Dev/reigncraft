import { buildingWorldPlazaTerrainIdleHeavySyncKey } from '@/components/world/engine/computingWorldPlazaTerrainDependencySnapshot';
import { describe, expect, it } from 'vitest';

describe('buildingWorldPlazaTerrainIdleHeavySyncKey', () => {
  it('keys off snapped floor bounds instead of every player tile', () => {
    const sharedOptions = {
      floorBoundsKey: '0:24:0:24',
      worldZoom: 1,
      viewportWidth: 800,
      viewportHeight: 600,
      placedTreeBlocksKey: '',
      thawVisualSyncKey: '0|',
      pickedPebblesCacheKey: '',
    };

    expect(buildingWorldPlazaTerrainIdleHeavySyncKey(sharedOptions)).toBe(
      buildingWorldPlazaTerrainIdleHeavySyncKey(sharedOptions)
    );
    expect(
      buildingWorldPlazaTerrainIdleHeavySyncKey({
        ...sharedOptions,
        floorBoundsKey: '12:36:0:24',
      })
    ).not.toBe(buildingWorldPlazaTerrainIdleHeavySyncKey(sharedOptions));
  });
});
