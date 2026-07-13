import { creatingWorldBuildingPlot } from '@/components/world/building/domains/definingWorldBuildingPlot';
import { mergingWorldBuildingPlotRegistryWithLocalOwnedDraftPlots } from '@/components/world/building/domains/mergingWorldBuildingPlotRegistryWithLocalOwnedDraftPlots';
import { describe, expect, it } from 'vitest';

describe('mergingWorldBuildingPlotRegistryWithLocalOwnedDraftPlots', () => {
  it('replaces local registry plots with draft ownership after an unclaim', () => {
    const localUserId = 'owner-1';
    const friendUserId = 'friend-1';
    const forestPlot = creatingWorldBuildingPlot({
      plotId: 'plot-forest',
      ownerId: localUserId,
      bounds: {
        minTileX: -135,
        minTileY: -180,
        maxTileX: -132,
        maxTileY: -178,
      },
      createdAt: '2026-01-01T00:00:00.000Z',
    });
    const plainsPlot = creatingWorldBuildingPlot({
      plotId: 'plot-plains',
      ownerId: localUserId,
      bounds: {
        minTileX: 233,
        minTileY: -12,
        maxTileX: 235,
        maxTileY: -10,
      },
      createdAt: '2026-01-02T00:00:00.000Z',
    });
    const junglePlot = creatingWorldBuildingPlot({
      plotId: 'plot-jungle',
      ownerId: localUserId,
      bounds: {
        minTileX: 10,
        minTileY: 8,
        maxTileX: 11,
        maxTileY: 9,
      },
      createdAt: '2026-01-03T00:00:00.000Z',
    });
    const friendPlot = creatingWorldBuildingPlot({
      plotId: 'plot-friend',
      ownerId: friendUserId,
      bounds: {
        minTileX: 0,
        minTileY: 0,
        maxTileX: 0,
        maxTileY: 0,
      },
      createdAt: '2026-01-04T00:00:00.000Z',
    });

    const mergedPlots = mergingWorldBuildingPlotRegistryWithLocalOwnedDraftPlots(
      [forestPlot, plainsPlot, junglePlot, friendPlot],
      [forestPlot, plainsPlot],
      localUserId
    );

    expect(mergedPlots).toEqual([friendPlot, forestPlot, plainsPlot]);
  });

  it('keeps registry rows when draft ownership is not provided', () => {
    const localUserId = 'owner-1';
    const plot = creatingWorldBuildingPlot({
      plotId: 'plot-1',
      ownerId: localUserId,
      bounds: {
        minTileX: 1,
        minTileY: 1,
        maxTileX: 1,
        maxTileY: 1,
      },
      createdAt: '2026-01-01T00:00:00.000Z',
    });

    expect(
      mergingWorldBuildingPlotRegistryWithLocalOwnedDraftPlots(
        [plot],
        null,
        localUserId
      )
    ).toEqual([plot]);
  });
});
