import { applyingWorldBuildingBuildDraftBlockPlacement } from '@/components/world/building/domains/applyingWorldBuildingBuildDraftBlockPlacement';
import { checkingWorldBuildingPlotCanPlaceBlockFootprintAtAnchor } from '@/components/world/building/domains/checkingWorldBuildingPlotCanPlaceBlockFootprintAtAnchor';
import { creatingEmptyWorldBuildingBuildDraftState } from '@/components/world/building/domains/definingWorldBuildingBuildDraft';
import { DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_TILE } from '@/components/world/building/domains/definingWorldBuildingBlockHeightConstants';
import {
  DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_BLOOMERY,
  resolvingWorldBuildingBlockDefinition,
} from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import { creatingWorldBuildingPlot } from '@/components/world/building/domains/definingWorldBuildingPlot';
import { DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND } from '@/components/world/building/domains/definingWorldBuildingWorldLayerConstants';
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

describe('multi-tile footprint across adjacent 1x1 claims', () => {
  const ownerUserId = 'owner-1';

  it('allows a 2x2 bloomery when four adjacent owned tiles are free', () => {
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
      creatingOwnedOneTilePlot('p-1-1', 11, 21, ownerUserId),
    ];

    expect(
      checkingWorldBuildingPlotCanPlaceBlockFootprintAtAnchor(
        plots,
        { tileX: 10, tileY: 20 },
        ownerUserId,
        DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND,
        DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_TILE,
        definition
      )
    ).toBe(true);
  });

  it('rejects a 2x2 bloomery when one footprint tile is unclaimed', () => {
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
      checkingWorldBuildingPlotCanPlaceBlockFootprintAtAnchor(
        plots,
        { tileX: 10, tileY: 20 },
        ownerUserId,
        DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND,
        DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_TILE,
        definition
      )
    ).toBe(false);
  });

  it('places bloomery tiles onto each owned 1x1 plot in the draft', () => {
    const draft = creatingEmptyWorldBuildingBuildDraftState();
    const plots = [
      creatingOwnedOneTilePlot('p-0-0', 10, 20, ownerUserId),
      creatingOwnedOneTilePlot('p-1-0', 11, 20, ownerUserId),
      creatingOwnedOneTilePlot('p-0-1', 10, 21, ownerUserId),
      creatingOwnedOneTilePlot('p-1-1', 11, 21, ownerUserId),
    ];

    const result = applyingWorldBuildingBuildDraftBlockPlacement({
      draft: {
        ...draft,
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

    expect('errorMessage' in result).toBe(false);
    if ('errorMessage' in result) {
      return;
    }

    expect(result.placedBlocks).toHaveLength(4);
    expect(
      new Set(result.placedBlocks.map((block) => block.plotId))
    ).toEqual(new Set(['p-0-0', 'p-1-0', 'p-0-1', 'p-1-1']));
    expect(result.draft.addedDraftBlockIds.size).toBe(4);
    expect(result.draft.addedDraftBlockIds.has('bloomery-anchor')).toBe(true);
    expect(
      result.draft.addedDraftBlockIds.has('bloomery-anchor_fp_11_20')
    ).toBe(true);
  });
});
