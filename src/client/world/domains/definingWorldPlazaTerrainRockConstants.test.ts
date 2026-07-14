import { resolvingWorldPlazaTerrainRockColumnSurfaceWorldLayerForFootprint } from '@/components/world/domains/definingWorldPlazaTerrainRockConstants';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaTerrainRockColumnSurfaceWorldLayerForFootprint', () => {
  it('caps narrow rocks before they become needle-like', () => {
    expect(
      resolvingWorldPlazaTerrainRockColumnSurfaceWorldLayerForFootprint(
        16,
        1,
        1
      )
    ).toBe(6);
    expect(
      resolvingWorldPlazaTerrainRockColumnSurfaceWorldLayerForFootprint(
        16,
        1,
        6
      )
    ).toBe(6);
  });

  it('allows taller rocks as their narrowest footprint dimension grows', () => {
    expect(
      resolvingWorldPlazaTerrainRockColumnSurfaceWorldLayerForFootprint(
        16,
        3,
        4
      )
    ).toBe(10);
    expect(
      resolvingWorldPlazaTerrainRockColumnSurfaceWorldLayerForFootprint(
        16,
        6,
        6
      )
    ).toBe(16);
  });

  it('does not raise rocks below the footprint cap', () => {
    expect(
      resolvingWorldPlazaTerrainRockColumnSurfaceWorldLayerForFootprint(4, 1, 1)
    ).toBe(4);
  });
});
