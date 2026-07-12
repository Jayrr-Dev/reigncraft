import { applyingWorldBuildingBuildDraftPlotUnclaim } from '@/components/world/building/domains/applyingWorldBuildingBuildDraftPlotUnclaim';
import {
  creatingEmptyWorldBuildingBuildDraftState,
  creatingWorldBuildingBuildDraftTilePlot,
  initializingWorldBuildingBuildDraftFromServerPlots,
  mergingWorldBuildingViewportPlotsWithBuildDraft,
} from '@/components/world/building/domains/definingWorldBuildingBuildDraft';
import { creatingWorldBuildingPlot } from '@/components/world/building/domains/definingWorldBuildingPlot';
import { creatingWorldBuildingTilePosition } from '@/components/world/building/domains/definingWorldBuildingTilePosition';
import { describe, expect, it } from 'vitest';

describe('mergingWorldBuildingViewportPlotsWithBuildDraft', () => {
  it('keeps an unclaimed last owned tile cleared instead of resurrecting the server plot', () => {
    const ownerUserId = 'owner-1';
    const tilePosition = creatingWorldBuildingTilePosition(4, 7);
    const persistedPlot = creatingWorldBuildingPlot({
      plotId: 'plot-persisted-1',
      ownerId: ownerUserId,
      bounds: {
        minTileX: tilePosition.tileX,
        minTileY: tilePosition.tileY,
        maxTileX: tilePosition.tileX,
        maxTileY: tilePosition.tileY,
      },
      createdAt: '2026-01-01T00:00:00.000Z',
    });
    const draft = initializingWorldBuildingBuildDraftFromServerPlots(
      [persistedPlot],
      [persistedPlot],
      ownerUserId
    );

    const unclaimResult = applyingWorldBuildingBuildDraftPlotUnclaim({
      draft,
      viewportPlots: [persistedPlot],
      tilePosition,
      actorUserId: ownerUserId,
    });

    expect('errorMessage' in unclaimResult).toBe(false);
    if ('errorMessage' in unclaimResult) {
      return;
    }

    const mergedPlots = mergingWorldBuildingViewportPlotsWithBuildDraft(
      [persistedPlot],
      unclaimResult.draft,
      ownerUserId
    );

    expect(mergedPlots).toEqual([]);
    expect(unclaimResult.draft.removedPersistedPlotIds).toEqual([
      'plot-persisted-1',
    ]);
  });

  it('still shows draft-only claims before save', () => {
    const ownerUserId = 'owner-1';
    const draftPlot = creatingWorldBuildingBuildDraftTilePlot(
      ownerUserId,
      creatingWorldBuildingTilePosition(1, 2)
    );
    const draft = {
      ...creatingEmptyWorldBuildingBuildDraftState(),
      workingPlots: [draftPlot],
    };

    const mergedPlots = mergingWorldBuildingViewportPlotsWithBuildDraft(
      [],
      draft,
      ownerUserId
    );

    expect(mergedPlots).toEqual([draftPlot]);
  });
});
