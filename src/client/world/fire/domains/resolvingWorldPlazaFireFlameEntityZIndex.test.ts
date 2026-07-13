import { resolvingWorldBuildingPlacedBlockColumnEntityZIndex } from '@/components/world/building/domains/resolvingWorldBuildingPlacedBlockColumnEntityZIndex';
import { DEFINING_WORLD_DEPTH_FIRE_FLAME_ENTITY_ABOVE_COLUMN_DEPTH_BIAS } from '@/components/world/depth/domains/definingWorldDepthBiasLadder';
import { computingWorldDepthSortKey } from '@/components/world/depth/domains/computingWorldDepthSortKey';
import { resolvingWorldPlazaFireFlameEntityZIndex } from '@/components/world/fire/domains/resolvingWorldPlazaFireFlameEntityZIndex';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock(
  '@/components/world/domains/resolvingWorldPlazaTerrainElevationAtTileIndex',
  () => ({
    resolvingWorldPlazaTerrainElevationSurfaceLayerAtTileIndex: vi.fn(
      () => 1
    ),
  })
);

import { resolvingWorldPlazaTerrainElevationSurfaceLayerAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaTerrainElevationAtTileIndex';

const resolvingTerrainSurfaceLayerMock = vi.mocked(
  resolvingWorldPlazaTerrainElevationSurfaceLayerAtTileIndex
);

describe('resolvingWorldPlazaFireFlameEntityZIndex', () => {
  beforeEach(() => {
    resolvingTerrainSurfaceLayerMock.mockReset();
    resolvingTerrainSurfaceLayerMock.mockReturnValue(1);
  });

  it('paints above the coplanar placed-block column on flat ground', () => {
    const tileX = 12;
    const tileY = 8;
    const worldLayer = 1;
    const columnZIndex = resolvingWorldBuildingPlacedBlockColumnEntityZIndex(
      tileX,
      tileY,
      worldLayer
    );

    expect(
      resolvingWorldPlazaFireFlameEntityZIndex(tileX, tileY, worldLayer)
    ).toBe(
      columnZIndex + DEFINING_WORLD_DEPTH_FIRE_FLAME_ENTITY_ABOVE_COLUMN_DEPTH_BIAS
    );
  });

  it('stays above terrain-cleared campfire columns on elevated pits', () => {
    const tileX = 20;
    const tileY = 20;
    const worldLayer = 5;
    resolvingTerrainSurfaceLayerMock.mockImplementation(() => worldLayer);

    const columnZIndex = resolvingWorldBuildingPlacedBlockColumnEntityZIndex(
      tileX,
      tileY,
      worldLayer
    );
    const legacyFloorBiasedFlameZIndex =
      computingWorldDepthSortKey({ x: tileX, y: tileY }) + 2;
    const flameZIndex = resolvingWorldPlazaFireFlameEntityZIndex(
      tileX,
      tileY,
      worldLayer
    );

    expect(columnZIndex).toBeGreaterThan(legacyFloorBiasedFlameZIndex);
    expect(flameZIndex).toBeGreaterThan(columnZIndex);
    expect(flameZIndex).toBe(
      columnZIndex + DEFINING_WORLD_DEPTH_FIRE_FLAME_ENTITY_ABOVE_COLUMN_DEPTH_BIAS
    );
  });
});
