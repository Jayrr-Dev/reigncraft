import { applyingWorldBuildingBuildDraftBlockPlacement } from '@/components/world/building/domains/applyingWorldBuildingBuildDraftBlockPlacement';
import { DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CAMPFIRE } from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import {
  checkingWorldBuildingBuildDraftHasUnsavedChanges,
  creatingEmptyWorldBuildingBuildDraftState,
} from '@/components/world/building/domains/definingWorldBuildingBuildDraft';
import { checkingWorldBuildingPlacedBlockIsSession } from '@/components/world/building/domains/checkingWorldBuildingPlacedBlockIsSession';
import { creatingWorldBuildingPlot } from '@/components/world/building/domains/definingWorldBuildingPlot';
import { describe, expect, it } from 'vitest';

describe('applyingWorldBuildingBuildDraftBlockPlacement session builds', () => {
  it('places campfire outside claims as a session block without draft save state', () => {
    const ownerUserId = 'user-1';
    const ownedPlot = creatingWorldBuildingPlot({
      plotId: 'plot-1',
      ownerId: ownerUserId,
      bounds: {
        minTileX: 0,
        minTileY: 0,
        maxTileX: 2,
        maxTileY: 2,
      },
      createdAt: '1970-01-01T00:00:00.000Z',
    });
    const priorDraft = creatingEmptyWorldBuildingBuildDraftState();

    const placementResult = applyingWorldBuildingBuildDraftBlockPlacement({
      draft: priorDraft,
      viewportPlots: [ownedPlot],
      definitionId: DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CAMPFIRE,
      tilePosition: { tileX: 8, tileY: 8 },
      worldLayer: 0,
      blockHeight: 0,
      actorUserId: ownerUserId,
      blockId: 'campfire-session-1',
      placedAt: '1970-01-01T00:00:00.000Z',
    });

    expect('errorMessage' in placementResult).toBe(false);
    if ('errorMessage' in placementResult) {
      return;
    }

    expect(placementResult.isSessionPlacement).toBe(true);
    // Not unsaved: craft exit flush will not save these. Persist must complete
    // before edit mode clears the draft, or the campfire disappears instantly.
    expect(
      checkingWorldBuildingBuildDraftHasUnsavedChanges(placementResult.draft),
    ).toBe(false);
    expect(placementResult.draft.sessionBlocks).toHaveLength(1);
    expect(
      checkingWorldBuildingPlacedBlockIsSession(
        placementResult.draft.sessionBlocks[0]!,
      ),
    ).toBe(true);
  });

  it('still persists in-claim campfire through the permanent draft path', () => {
    const ownerUserId = 'user-1';
    const ownedPlot = creatingWorldBuildingPlot({
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
      workingPlots: [ownedPlot],
    };

    const placementResult = applyingWorldBuildingBuildDraftBlockPlacement({
      draft: priorDraft,
      viewportPlots: [ownedPlot],
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

    expect(placementResult.isSessionPlacement).toBe(false);
    expect(
      checkingWorldBuildingBuildDraftHasUnsavedChanges(placementResult.draft),
    ).toBe(true);
    expect(placementResult.draft.addedDraftBlockIds.has('campfire-1')).toBe(
      true,
    );
  });
});
