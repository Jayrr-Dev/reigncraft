import { DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_TILE } from '@/components/world/building/domains/definingWorldBuildingBlockHeightConstants';
import { DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_FLOOR_WOOD } from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import { creatingWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND } from '@/components/world/building/domains/definingWorldBuildingWorldLayerConstants';
import { resolvingWorldBuildingHoverPlacementWorldLayer } from '@/components/world/building/domains/resolvingWorldBuildingHoverPlacementWorldLayer';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { resolvingWorldPlazaBaseSurfaceLayerAtTileIndexMock } = vi.hoisted(
  () => ({
    resolvingWorldPlazaBaseSurfaceLayerAtTileIndexMock: vi.fn(),
  })
);

vi.mock(
  '@/components/world/domains/resolvingWorldPlazaSurfaceLayerAtTileIndex',
  () => ({
    resolvingWorldPlazaBaseSurfaceLayerAtTileIndex:
      resolvingWorldPlazaBaseSurfaceLayerAtTileIndexMock,
  })
);

describe('resolvingWorldBuildingHoverPlacementWorldLayer', () => {
  beforeEach(() => {
    resolvingWorldPlazaBaseSurfaceLayerAtTileIndexMock.mockReset();
    resolvingWorldPlazaBaseSurfaceLayerAtTileIndexMock.mockReturnValue(
      DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND
    );
  });

  it('keeps sidebar layer on empty flat ground', () => {
    expect(
      resolvingWorldBuildingHoverPlacementWorldLayer({
        tilePosition: { tileX: 3, tileY: 4 },
        selectedWorldLayer: DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND,
        selectedBlockHeight: 1,
        placedBlocks: [],
      })
    ).toBe(DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND);
  });

  it('snaps 0H campfire preview to elevated terrain surface', () => {
    resolvingWorldPlazaBaseSurfaceLayerAtTileIndexMock.mockReturnValue(5);

    expect(
      resolvingWorldBuildingHoverPlacementWorldLayer({
        tilePosition: { tileX: 10, tileY: 12 },
        selectedWorldLayer: DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND,
        selectedBlockHeight: DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_TILE,
        placedBlocks: [],
      })
    ).toBe(5);
  });

  it('anchors 1H wood flush on elevated terrain surface', () => {
    resolvingWorldPlazaBaseSurfaceLayerAtTileIndexMock.mockReturnValue(4);

    expect(
      resolvingWorldBuildingHoverPlacementWorldLayer({
        tilePosition: { tileX: 8, tileY: 9 },
        selectedWorldLayer: DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND,
        selectedBlockHeight: 1,
        placedBlocks: [],
      })
    ).toBe(4);
  });

  it('anchors taller extrusion flush from elevated terrain surface', () => {
    resolvingWorldPlazaBaseSurfaceLayerAtTileIndexMock.mockReturnValue(2);

    expect(
      resolvingWorldBuildingHoverPlacementWorldLayer({
        tilePosition: { tileX: 8, tileY: 9 },
        selectedWorldLayer: 4,
        selectedBlockHeight: 4,
        placedBlocks: [],
      })
    ).toBe(5);
  });

  it('honors a manually raised sidebar layer above terrain', () => {
    resolvingWorldPlazaBaseSurfaceLayerAtTileIndexMock.mockReturnValue(3);

    expect(
      resolvingWorldBuildingHoverPlacementWorldLayer({
        tilePosition: { tileX: 1, tileY: 2 },
        selectedWorldLayer: 8,
        selectedBlockHeight: DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_TILE,
        placedBlocks: [],
      })
    ).toBe(8);
  });

  it('stacks above an existing solid block when plaza surface includes it', () => {
    resolvingWorldPlazaBaseSurfaceLayerAtTileIndexMock.mockReturnValue(6);

    const existingBlock = creatingWorldBuildingPlacedBlock({
      blockId: 'block-1',
      plotId: 'plot-1',
      definitionId: DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_FLOOR_WOOD,
      tilePosition: { tileX: 2, tileY: 3 },
      worldLayer: 6,
      blockHeight: 1,
      ownerId: 'owner-1',
      placedAt: '1970-01-01T00:00:00.000Z',
    });

    expect(
      resolvingWorldBuildingHoverPlacementWorldLayer({
        tilePosition: { tileX: 2, tileY: 3 },
        selectedWorldLayer: DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND,
        selectedBlockHeight: 1,
        placedBlocks: [existingBlock],
      })
    ).toBe(7);
  });

  it('sits flush on a passable floor at the elevated surface', () => {
    resolvingWorldPlazaBaseSurfaceLayerAtTileIndexMock.mockReturnValue(2);

    const passableFloor = creatingWorldBuildingPlacedBlock({
      blockId: 'tile-1',
      plotId: 'plot-1',
      definitionId: DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_FLOOR_WOOD,
      tilePosition: { tileX: 4, tileY: 5 },
      worldLayer: 2,
      blockHeight: DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_TILE,
      ownerId: 'owner-1',
      placedAt: '1970-01-01T00:00:00.000Z',
    });

    expect(
      resolvingWorldBuildingHoverPlacementWorldLayer({
        tilePosition: { tileX: 4, tileY: 5 },
        selectedWorldLayer: DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND,
        selectedBlockHeight: 1,
        placedBlocks: [passableFloor],
      })
    ).toBe(2);
  });
});
