import { DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CAMPFIRE } from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import { creatingWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { creatingWorldBuildingTilePosition } from '@/components/world/building/domains/definingWorldBuildingTilePosition';
import { checkingWorldPlazaInteractablePointerHoverTarget } from '@/components/world/interaction/domains/checkingWorldPlazaInteractablePointerHoverTarget';
import { creatingWildlifeTestInstance } from '@/components/world/wildlife/domains/creatingWildlifeTestFixtures';
import {
  creatingWildlifeInstanceStore,
  replacingWildlifeInstance,
} from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import { describe, expect, it } from 'vitest';

function creatingTestCampfire(tileX: number, tileY: number) {
  return creatingWorldBuildingPlacedBlock({
    blockId: `campfire-${tileX}-${tileY}`,
    plotId: 'plot-test',
    definitionId: DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CAMPFIRE,
    tilePosition: creatingWorldBuildingTilePosition(tileX, tileY),
    ownerId: 'owner-test',
    placedAt: '2026-01-01T00:00:00.000Z',
  });
}

describe('checkingWorldPlazaInteractablePointerHoverTarget', () => {
  it('returns true over an unstudied wildlife corpse', () => {
    const store = creatingWildlifeInstanceStore();
    replacingWildlifeInstance(
      store,
      creatingWildlifeTestInstance({
        speciesId: 'turtle',
        position: { x: 4.5, y: 4.5, layer: 1 },
        isDead: true,
        diedAtMs: 1_000,
        hasBeenStudied: false,
      })
    );

    const isHoverTarget = checkingWorldPlazaInteractablePointerHoverTarget({
      pointerContext: { gridPoint: { x: 4.5, y: 4.5 } },
      playerPosition: { x: 4.5, y: 5.5 },
      placedBlocks: [],
      actorUserId: null,
      chopPersistenceOwnerId: null,
      wildlifeStore: store,
      resolveWildlifeCollisionRadiusGrid: () => 0.4,
    });

    expect(isHoverTarget).toBe(true);
  });

  it('returns true over a campfire in player range', () => {
    const store = creatingWildlifeInstanceStore();
    const campfire = creatingTestCampfire(4, 4);

    const isHoverTarget = checkingWorldPlazaInteractablePointerHoverTarget({
      pointerContext: { gridPoint: { x: 4.4, y: 4.1 } },
      playerPosition: { x: 4.5, y: 5.2 },
      placedBlocks: [campfire],
      actorUserId: null,
      chopPersistenceOwnerId: null,
      wildlifeStore: store,
      resolveWildlifeCollisionRadiusGrid: () => 0.4,
    });

    expect(isHoverTarget).toBe(true);
  });

  it('returns false when nothing interactable is under the pointer', () => {
    const store = creatingWildlifeInstanceStore();

    const isHoverTarget = checkingWorldPlazaInteractablePointerHoverTarget({
      pointerContext: { gridPoint: { x: 1, y: 1 } },
      playerPosition: { x: 1, y: 1 },
      placedBlocks: [],
      actorUserId: null,
      chopPersistenceOwnerId: null,
      wildlifeStore: store,
      resolveWildlifeCollisionRadiusGrid: () => 0.4,
    });

    expect(isHoverTarget).toBe(false);
  });
});
