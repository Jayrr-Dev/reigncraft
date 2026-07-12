import { checkingWorldPlazaTerrainElevationTileIsCliffEdgeAtTileIndex } from '@/components/world/domains/checkingWorldPlazaTerrainElevationTileIsCliffEdgeAtTileIndex';
import { resolvingWorldPlazaTerrainElevationSurfaceLayerAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaTerrainElevationAtTileIndex';
import { describe, expect, it, vi } from 'vitest';

vi.mock(
  '@/components/world/domains/resolvingWorldPlazaTerrainElevationAtTileIndex',
  () => ({
    resolvingWorldPlazaTerrainElevationSurfaceLayerAtTileIndex: vi.fn(),
  })
);

const mockedSurfaceLayer = vi.mocked(
  resolvingWorldPlazaTerrainElevationSurfaceLayerAtTileIndex
);

/** Builds a surface-layer lookup from a `x:y` keyed map with a default. */
function stubbingSurfaceLayers(
  layersByTileKey: Record<string, number>,
  defaultLayer: number
): void {
  mockedSurfaceLayer.mockImplementation(
    (tileX: number, tileY: number) =>
      layersByTileKey[`${tileX}:${tileY}`] ?? defaultLayer
  );
}

describe('checkingWorldPlazaTerrainElevationTileIsCliffEdgeAtTileIndex', () => {
  it('returns false for plateau interior tiles surrounded by equal surfaces', () => {
    stubbingSurfaceLayers({}, 5);

    expect(
      checkingWorldPlazaTerrainElevationTileIsCliffEdgeAtTileIndex(0, 0)
    ).toBe(false);
  });

  it('returns true when any cardinal neighbor drops lower', () => {
    stubbingSurfaceLayers({ '0:0': 5, '1:0': 3 }, 5);

    expect(
      checkingWorldPlazaTerrainElevationTileIsCliffEdgeAtTileIndex(0, 0)
    ).toBe(true);
  });

  it('returns false at the base of a taller neighbor', () => {
    stubbingSurfaceLayers({ '0:0': 3, '0:-1': 6 }, 3);

    expect(
      checkingWorldPlazaTerrainElevationTileIsCliffEdgeAtTileIndex(0, 0)
    ).toBe(false);
  });
});
