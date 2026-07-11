import {
  listingWorldPlazaPlacedTreeBlocksInTileBounds,
  resolvingWorldPlazaTreeAtTileIndexWithPlacedBlocks,
} from '@/components/world/domains/listingWorldPlazaPlacedTreeBlocksInTileBounds';
import { listingWorldPlazaTreesInTileBounds } from '@/components/world/domains/listingWorldPlazaTreesInTileBounds';
import type { DefiningWorldPlazaTreeInstance } from '@/components/world/domains/resolvingWorldPlazaTreeAtTileIndex';
import { checkingWorldPlazaVegetationTreeSpacingAnchorAtTile } from '@/components/world/domains/samplingWorldPlazaVegetationDensityAtTile';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock(
  '@/components/world/domains/listingWorldPlazaPlacedTreeBlocksInTileBounds',
  () => ({
    listingWorldPlazaPlacedTreeBlocksInTileBounds: vi.fn(),
    resolvingWorldPlazaTreeAtTileIndexWithPlacedBlocks: vi.fn(),
  })
);

function creatingTreeAtTile(
  tileX: number,
  tileY: number
): DefiningWorldPlazaTreeInstance {
  return {
    tileX,
    tileY,
    variant: 'oak',
    trunkColor: 0x5b3a29,
    canopyColors: [0x2f6b3b, 0x24552f, 0x4b8a4c],
    scale: 1,
    collisionRadiusGrid: 0.4,
    offsetXPx: 0,
    offsetYPx: 0,
    seed: tileX * 100 + tileY,
  };
}

describe('listingWorldPlazaTreesInTileBounds', () => {
  beforeEach(() => {
    vi.mocked(listingWorldPlazaPlacedTreeBlocksInTileBounds).mockReset();
    vi.mocked(resolvingWorldPlazaTreeAtTileIndexWithPlacedBlocks).mockReset();
    vi.mocked(listingWorldPlazaPlacedTreeBlocksInTileBounds).mockReturnValue(
      []
    );
  });

  it('resolves only procedural spacing anchors, including negative tiles', () => {
    vi.mocked(
      resolvingWorldPlazaTreeAtTileIndexWithPlacedBlocks
    ).mockImplementation((tileX, tileY) => creatingTreeAtTile(tileX, tileY));

    const trees = listingWorldPlazaTreesInTileBounds({
      minTileX: -4,
      maxTileX: 4,
      minTileY: -4,
      maxTileY: 4,
    });

    expect(trees).toHaveLength(9);
    expect(
      resolvingWorldPlazaTreeAtTileIndexWithPlacedBlocks
    ).toHaveBeenCalledTimes(9);

    for (const tree of trees) {
      expect(
        checkingWorldPlazaVegetationTreeSpacingAnchorAtTile(
          tree.tileX,
          tree.tileY
        )
      ).toBe(true);
    }
  });
});
