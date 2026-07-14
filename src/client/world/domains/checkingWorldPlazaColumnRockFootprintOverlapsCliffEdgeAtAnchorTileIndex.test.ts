import { checkingWorldPlazaColumnRockFootprintOverlapsCliffEdgeAtAnchorTileIndex } from '@/components/world/domains/checkingWorldPlazaColumnRockFootprintOverlapsCliffEdgeAtAnchorTileIndex';
import { checkingWorldPlazaTerrainElevationTileIsCliffEdgeAtTileIndex } from '@/components/world/domains/checkingWorldPlazaTerrainElevationTileIsCliffEdgeAtTileIndex';
import { describe, expect, it, vi } from 'vitest';

vi.mock(
  '@/components/world/domains/checkingWorldPlazaTerrainElevationTileIsCliffEdgeAtTileIndex',
  () => ({
    checkingWorldPlazaTerrainElevationTileIsCliffEdgeAtTileIndex: vi.fn(),
  })
);

const cliffEdgeMock = vi.mocked(
  checkingWorldPlazaTerrainElevationTileIsCliffEdgeAtTileIndex
);

describe('checkingWorldPlazaColumnRockFootprintOverlapsCliffEdgeAtAnchorTileIndex', () => {
  it('returns false when every footprint tile is off the cliff rim', () => {
    cliffEdgeMock.mockReturnValue(false);

    expect(
      checkingWorldPlazaColumnRockFootprintOverlapsCliffEdgeAtAnchorTileIndex(
        2,
        3,
        2,
        2
      )
    ).toBe(false);
    expect(cliffEdgeMock).toHaveBeenCalledTimes(4);
  });

  it('returns true when any footprint tile is a cliff edge', () => {
    cliffEdgeMock.mockImplementation(
      (tileX, tileY) => tileX === 3 && tileY === 4
    );

    expect(
      checkingWorldPlazaColumnRockFootprintOverlapsCliffEdgeAtAnchorTileIndex(
        2,
        3,
        2,
        2
      )
    ).toBe(true);
  });
});
