import { applyingWorldBuildingBuildDraftBlockPlacement } from '@/components/world/building/domains/applyingWorldBuildingBuildDraftBlockPlacement';
import { DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CAMPFIRE } from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import {
  checkingWorldBuildingBuildDraftHasUnsavedChanges,
  creatingEmptyWorldBuildingBuildDraftState,
} from '@/components/world/building/domains/definingWorldBuildingBuildDraft';
import { creatingWorldBuildingPlot } from '@/components/world/building/domains/definingWorldBuildingPlot';
import { describe, expect, it } from 'vitest';

/**
 * Regression for craft campfire place: success handler flushes/exits in the same
 * synchronous turn as placement. Flush must use the post-placement draft, not
 * the prior React state snapshot (which has no campfire yet).
 */
describe('craft campfire placement draft flush race', () => {
  it('marks the post-placement draft unsaved so an immediate flush would persist', () => {
    const ownerUserId = 'user-1';
    const plot = creatingWorldBuildingPlot({
      plotId: 'plot-1',
      ownerId: ownerUserId,
      bounds: {
        minTileX: 0,
        minTileY: 0,
        maxTileX: 4,
        maxTileY: 4,
      },
      createdAt: '1970-01-01T00:00:00.000Z',
    });
    const priorDraft = {
      ...creatingEmptyWorldBuildingBuildDraftState(),
      workingPlots: [plot],
    };

    expect(checkingWorldBuildingBuildDraftHasUnsavedChanges(priorDraft)).toBe(
      false
    );

    const placementResult = applyingWorldBuildingBuildDraftBlockPlacement({
      draft: priorDraft,
      viewportPlots: [plot],
      definitionId: DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CAMPFIRE,
      tilePosition: { tileX: 2, tileY: 2 },
      worldLayer: 0,
      blockHeight: 0,
      actorUserId: ownerUserId,
      blockId: 'campfire-1',
      placedAt: '1970-01-01T00:00:00.000Z',
    });

    expect('errorMessage' in placementResult).toBe(false);
    if ('errorMessage' in placementResult) {
      return;
    }

    expect(
      checkingWorldBuildingBuildDraftHasUnsavedChanges(placementResult.draft)
    ).toBe(true);
    expect(placementResult.draft.addedDraftBlockIds.has('campfire-1')).toBe(
      true
    );
  });
});
