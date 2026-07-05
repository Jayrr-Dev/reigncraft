import { DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CAMPFIRE } from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import { creatingWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { creatingWorldBuildingTilePosition } from '@/components/world/building/domains/definingWorldBuildingTilePosition';
import { resolvingWorldPlazaInteractablePlacedBlockFromPointerGridPoint } from '@/components/world/interaction/domains/resolvingWorldPlazaInteractablePlacedBlockFromPointerGridPoint';
import assert from 'node:assert/strict';
import { describe, it } from 'vitest';

const RESOLVING_WORLD_PLAZA_INTERACTABLE_BLOCK_CLICK_TEST_CAMPFIRE_ENABLED_IDS =
  new Set([DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CAMPFIRE]);

function creatingWorldPlazaInteractableBlockClickTestCampfireBlock(
  tileX: number,
  tileY: number
) {
  return creatingWorldBuildingPlacedBlock({
    blockId: `campfire-${tileX}-${tileY}`,
    plotId: 'plot-test',
    definitionId: DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CAMPFIRE,
    tilePosition: creatingWorldBuildingTilePosition(tileX, tileY),
    ownerId: 'owner-test',
    placedAt: '2026-01-01T00:00:00.000Z',
  });
}

describe('resolvingWorldPlazaInteractablePlacedBlockFromPointerGridPoint', () => {
  it('resolves a forgiving campfire click when the player is in range', () => {
    const campfire = creatingWorldPlazaInteractableBlockClickTestCampfireBlock(
      4,
      4
    );

    const match =
      resolvingWorldPlazaInteractablePlacedBlockFromPointerGridPoint(
        { gridPoint: { x: 4.4, y: 4.1 } },
        { x: 4.5, y: 5.2 },
        [campfire],
        null,
        RESOLVING_WORLD_PLAZA_INTERACTABLE_BLOCK_CLICK_TEST_CAMPFIRE_ENABLED_IDS
      );

    assert.ok(match);
    assert.equal(match.block.blockId, campfire.blockId);
    assert.equal(match.action.dispatch, 'popover');
  });

  it('returns null when the player is too far away', () => {
    const campfire = creatingWorldPlazaInteractableBlockClickTestCampfireBlock(
      4,
      4
    );

    const match =
      resolvingWorldPlazaInteractablePlacedBlockFromPointerGridPoint(
        { gridPoint: { x: 4.2, y: 4.2 } },
        { x: 10, y: 10 },
        [campfire],
        null,
        RESOLVING_WORLD_PLAZA_INTERACTABLE_BLOCK_CLICK_TEST_CAMPFIRE_ENABLED_IDS
      );

    assert.equal(match, null);
  });
});
