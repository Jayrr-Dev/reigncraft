import { DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CAMPFIRE } from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import { creatingWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { checkingWorldPlazaInteractionLabelTileInPlayerProximity } from '@/components/world/interaction/domains/checkingWorldPlazaInteractionLabelTileInPlayerProximity';
import { formattingWorldPlazaInteractableBlockSelectionKey } from '@/components/world/interaction/domains/formattingWorldPlazaInteractableBlockSelectionKey';
import { listingWorldPlazaInteractableSelectionKeysInPlayerProximity } from '@/components/world/interaction/domains/listingWorldPlazaInteractableSelectionKeysInPlayerProximity';
import { syncingWorldPlazaProximityInteractableBlockSelection } from '@/components/world/interaction/domains/syncingWorldPlazaProximityInteractableBlockSelection';
import { describe, expect, it } from 'vitest';

describe('checkingWorldPlazaInteractionLabelTileInPlayerProximity', () => {
  it('counts the far edge of an adjacent tile as in range', () => {
    // Player stands on tile (5,4) at its far south edge — continuous center
    // distance to campfire tile (5,5) would be > 1, but floor tiles are adjacent.
    expect(
      checkingWorldPlazaInteractionLabelTileInPlayerProximity(
        { x: 5.9, y: 4.05, layer: 0 },
        5,
        5,
        1
      )
    ).toBe(true);
  });

  it('excludes tiles two steps away', () => {
    expect(
      checkingWorldPlazaInteractionLabelTileInPlayerProximity(
        { x: 5.2, y: 5.2, layer: 0 },
        5,
        7,
        1
      )
    ).toBe(false);
  });
});

describe('listingWorldPlazaInteractableSelectionKeysInPlayerProximity', () => {
  it('includes campfires on the adjacent tile even from the far edge', () => {
    const campfire = creatingWorldBuildingPlacedBlock({
      blockId: 'campfire-above',
      plotId: 'plot-test',
      definitionId: DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CAMPFIRE,
      tilePosition: { tileX: 5, tileY: 5 },
      ownerId: 'player-test',
      placedAt: '2026-01-01T00:00:00.000Z',
    });

    const keys = listingWorldPlazaInteractableSelectionKeysInPlayerProximity({
      playerPosition: { x: 5.8, y: 4.1, layer: 0 },
      placedBlocks: [campfire],
    });

    expect(
      keys.has(formattingWorldPlazaInteractableBlockSelectionKey(campfire))
    ).toBe(true);
  });

  it('excludes campfires outside the proximity ring', () => {
    const campfire = creatingWorldBuildingPlacedBlock({
      blockId: 'campfire-far',
      plotId: 'plot-test',
      definitionId: DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CAMPFIRE,
      tilePosition: { tileX: 20, tileY: 20 },
      ownerId: 'player-test',
      placedAt: '2026-01-01T00:00:00.000Z',
    });

    const keys = listingWorldPlazaInteractableSelectionKeysInPlayerProximity({
      playerPosition: { x: 5.2, y: 5.1, layer: 0 },
      placedBlocks: [campfire],
    });

    expect(
      keys.has(formattingWorldPlazaInteractableBlockSelectionKey(campfire))
    ).toBe(false);
  });

  it('sync helper only mutates when the key set changes', () => {
    const campfire = creatingWorldBuildingPlacedBlock({
      blockId: 'campfire-sync',
      plotId: 'plot-test',
      definitionId: DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CAMPFIRE,
      tilePosition: { tileX: 1, tileY: 1 },
      ownerId: 'player-test',
      placedAt: '2026-01-01T00:00:00.000Z',
    });
    const selectedKeys = new Set<string>();
    const params = {
      playerPosition: { x: 1.1, y: 1.2, layer: 0 },
      placedBlocks: [campfire],
    };

    expect(
      syncingWorldPlazaProximityInteractableBlockSelection(selectedKeys, params)
    ).toBe(true);
    expect(
      syncingWorldPlazaProximityInteractableBlockSelection(selectedKeys, params)
    ).toBe(false);
    expect(selectedKeys.size).toBe(1);
  });
});
