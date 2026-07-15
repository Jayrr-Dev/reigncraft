import { DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_TILE } from '@/components/world/building/domains/definingWorldBuildingBlockHeightConstants';
import {
  DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_ANVIL,
  DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_BLOOMERY,
  resolvingWorldBuildingBlockDefinition,
} from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import {
  LABELING_WORLD_BUILDING_PLACEMENT_BLOCKED_FOOTPRINT_OCCUPIED,
  LABELING_WORLD_BUILDING_PLACEMENT_BLOCKED_FOOTPRINT_UNCLAIMED,
} from '@/components/world/building/domains/definingWorldBuildingPlacementBlockedMessageConstants';
import { creatingWorldBuildingPlot } from '@/components/world/building/domains/definingWorldBuildingPlot';
import { DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND } from '@/components/world/building/domains/definingWorldBuildingWorldLayerConstants';
import { resolvingWorldBuildingBlockPlacementBlockedMessage } from '@/components/world/building/domains/resolvingWorldBuildingBlockPlacementBlockedMessage';
import { creatingWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { describe, expect, it } from 'vitest';

function creatingOwnedOneTilePlot(
  plotId: string,
  tileX: number,
  tileY: number,
  ownerUserId: string,
  blocks: ReturnType<typeof creatingWorldBuildingPlacedBlock>[] = []
) {
  return creatingWorldBuildingPlot({
    plotId,
    ownerId: ownerUserId,
    bounds: {
      minTileX: tileX,
      minTileY: tileY,
      maxTileX: tileX,
      maxTileY: tileY,
    },
    createdAt: '2026-01-01T00:00:00.000Z',
    blocks,
  });
}

describe('resolvingWorldBuildingBlockPlacementBlockedMessage', () => {
  const ownerUserId = 'owner-1';

  it('explains occupied 2x2 footprint tiles', () => {
    const definition = resolvingWorldBuildingBlockDefinition(
      DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_BLOOMERY
    );
    expect(definition).not.toBeNull();
    if (!definition) {
      return;
    }

    const occupyingBlock = creatingWorldBuildingPlacedBlock({
      blockId: 'anvil-1',
      plotId: 'p-1-0',
      definitionId: DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_ANVIL,
      tilePosition: { tileX: 11, tileY: 20 },
      worldLayer: DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND,
      blockHeight: DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_TILE,
      ownerId: ownerUserId,
      placedAt: '2026-01-01T00:00:00.000Z',
    });

    const plots = [
      creatingOwnedOneTilePlot('p-0-0', 10, 20, ownerUserId),
      creatingOwnedOneTilePlot('p-1-0', 11, 20, ownerUserId, [occupyingBlock]),
      creatingOwnedOneTilePlot('p-0-1', 10, 21, ownerUserId),
      creatingOwnedOneTilePlot('p-1-1', 11, 21, ownerUserId),
    ];

    expect(
      resolvingWorldBuildingBlockPlacementBlockedMessage({
        plots,
        anchorTilePosition: { tileX: 10, tileY: 20 },
        actorUserId: ownerUserId,
        worldLayer: DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND,
        definition,
      })
    ).toBe(LABELING_WORLD_BUILDING_PLACEMENT_BLOCKED_FOOTPRINT_OCCUPIED);
  });

  it('explains unclaimed footprint tiles', () => {
    const definition = resolvingWorldBuildingBlockDefinition(
      DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_BLOOMERY
    );
    expect(definition).not.toBeNull();
    if (!definition) {
      return;
    }

    const plots = [
      creatingOwnedOneTilePlot('p-0-0', 10, 20, ownerUserId),
      creatingOwnedOneTilePlot('p-1-0', 11, 20, ownerUserId),
      creatingOwnedOneTilePlot('p-0-1', 10, 21, ownerUserId),
    ];

    expect(
      resolvingWorldBuildingBlockPlacementBlockedMessage({
        plots,
        anchorTilePosition: { tileX: 10, tileY: 20 },
        actorUserId: ownerUserId,
        worldLayer: DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND,
        definition,
      })
    ).toBe(LABELING_WORLD_BUILDING_PLACEMENT_BLOCKED_FOOTPRINT_UNCLAIMED);
  });
});
