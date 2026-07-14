import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock(
  '@/components/world/domains/checkingWorldPlazaTerrainElevationTileIsCliffEdgeAtTileIndex',
  () => ({
    checkingWorldPlazaTerrainElevationTileIsCliffEdgeAtTileIndex: vi.fn(),
  })
);

import { checkingWorldPlazaLandNearCliffEdgeAtTileIndex } from '@/components/world/domains/checkingWorldPlazaLandNearCliffEdgeAtTileIndex';
import { checkingWorldPlazaTerrainElevationTileIsCliffEdgeAtTileIndex } from '@/components/world/domains/checkingWorldPlazaTerrainElevationTileIsCliffEdgeAtTileIndex';

describe('checkingWorldPlazaLandNearCliffEdgeAtTileIndex', () => {
  beforeEach(() => {
    vi.mocked(
      checkingWorldPlazaTerrainElevationTileIsCliffEdgeAtTileIndex
    ).mockReset();
    vi.mocked(
      checkingWorldPlazaTerrainElevationTileIsCliffEdgeAtTileIndex
    ).mockReturnValue(false);
  });

  it('returns false when no cliff edge is in range', () => {
    expect(checkingWorldPlazaLandNearCliffEdgeAtTileIndex(10, 20, 2)).toBe(
      false
    );
  });

  it('returns true when the center tile is a cliff edge', () => {
    vi.mocked(
      checkingWorldPlazaTerrainElevationTileIsCliffEdgeAtTileIndex
    ).mockImplementation((tileX, tileY) => tileX === 10 && tileY === 20);

    expect(checkingWorldPlazaLandNearCliffEdgeAtTileIndex(10, 20, 2)).toBe(
      true
    );
  });

  it('returns true when a cliff edge sits within the clearance radius', () => {
    vi.mocked(
      checkingWorldPlazaTerrainElevationTileIsCliffEdgeAtTileIndex
    ).mockImplementation((tileX, tileY) => tileX === 12 && tileY === 20);

    expect(checkingWorldPlazaLandNearCliffEdgeAtTileIndex(10, 20, 2)).toBe(
      true
    );
  });

  it('returns false when a cliff edge sits outside the clearance radius', () => {
    vi.mocked(
      checkingWorldPlazaTerrainElevationTileIsCliffEdgeAtTileIndex
    ).mockImplementation((tileX, tileY) => tileX === 13 && tileY === 20);

    expect(checkingWorldPlazaLandNearCliffEdgeAtTileIndex(10, 20, 2)).toBe(
      false
    );
  });
});
