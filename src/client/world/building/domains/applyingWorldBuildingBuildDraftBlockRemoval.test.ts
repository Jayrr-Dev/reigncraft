import { applyingWorldBuildingBuildDraftBlockPlacement } from '@/components/world/building/domains/applyingWorldBuildingBuildDraftBlockPlacement';
import { applyingWorldBuildingBuildDraftBlockRemoval } from '@/components/world/building/domains/applyingWorldBuildingBuildDraftBlockRemoval';
import { creatingEmptyWorldBuildingBuildDraftState } from '@/components/world/building/domains/definingWorldBuildingBuildDraft';
import { DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_TILE } from '@/components/world/building/domains/definingWorldBuildingBlockHeightConstants';
import { DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_BLOOMERY } from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import { creatingWorldBuildingPlot } from '@/components/world/building/domains/definingWorldBuildingPlot';
import { DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND } from '@/components/world/building/domains/definingWorldBuildingWorldLayerConstants';
import { listingWorldBuildingPlacedBlocksFromPlots } from '@/components/world/building/domains/listingWorldBuildingPlacedBlocksFromPlots';
import { mergingWorldBuildingViewportPlotsWithBuildDraft } from '@/components/world/building/domains/definingWorldBuildingBuildDraft';
import { describe, expect, it } from 'vitest';

function creatingOwnedOneTilePlot(
  plotId: string,
  tileX: number,
  tileY: number,
  ownerUserId: string
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
    blocks: [],
  });
}

describe('multi-tile footprint removal across 1x1 claims', () => {
  const ownerUserId = 'owner-1';

  it('removes every bloomery tile when clicking a satellite on another plot', () => {
    const plots = [
      creatingOwnedOneTilePlot('p-0-0', 10, 20, ownerUserId),
      creatingOwnedOneTilePlot('p-1-0', 11, 20, ownerUserId),
      creatingOwnedOneTilePlot('p-0-1', 10, 21, ownerUserId),
      creatingOwnedOneTilePlot('p-1-1', 11, 21, ownerUserId),
    ];

    const placementResult = applyingWorldBuildingBuildDraftBlockPlacement({
      draft: {
        ...creatingEmptyWorldBuildingBuildDraftState(),
        workingPlots: plots,
      },
      viewportPlots: plots,
      definitionId: DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_BLOOMERY,
      tilePosition: { tileX: 10, tileY: 20 },
      worldLayer: DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND,
      blockHeight: DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_TILE,
      actorUserId: ownerUserId,
      blockId: 'bloomery-anchor',
      placedAt: '2026-01-01T00:00:00.000Z',
    });

    expect('errorMessage' in placementResult).toBe(false);
    if ('errorMessage' in placementResult) {
      return;
    }

    const removalResult = applyingWorldBuildingBuildDraftBlockRemoval({
      draft: placementResult.draft,
      viewportPlots: plots,
      tilePosition: { tileX: 11, tileY: 21 },
      worldLayer: DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND,
      actorUserId: ownerUserId,
    });

    expect('errorMessage' in removalResult).toBe(false);
    if ('errorMessage' in removalResult) {
      return;
    }

    expect(removalResult.removedPrimaryBlock.blockId).toBe('bloomery-anchor');

    const remainingBlocks = listingWorldBuildingPlacedBlocksFromPlots(
      mergingWorldBuildingViewportPlotsWithBuildDraft(
        plots,
        removalResult.draft,
        ownerUserId
      )
    );

    expect(remainingBlocks).toHaveLength(0);
    expect(removalResult.draft.addedDraftBlockIds.size).toBe(0);
  });
});
