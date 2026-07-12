import { DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CAMPFIRE } from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import { creatingWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { formattingWorldPlazaInteractableBlockSelectionKey } from '@/components/world/interaction/domains/formattingWorldPlazaInteractableBlockSelectionKey';
import { listingWorldPlazaInteractableSelectionKeysInPlayerProximity } from '@/components/world/interaction/domains/listingWorldPlazaInteractableSelectionKeysInPlayerProximity';
import { syncingWorldPlazaProximityInteractableBlockSelection } from '@/components/world/interaction/domains/syncingWorldPlazaProximityInteractableBlockSelection';
import { describe, expect, it } from 'vitest';

describe('listingWorldPlazaInteractableSelectionKeysInPlayerProximity', () => {
  it('includes campfires within 1 Chebyshev tile', () => {
    const campfire = creatingWorldBuildingPlacedBlock({
      blockId: 'campfire-near',
      plotId: 'plot-test',
      definitionId: DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CAMPFIRE,
      tilePosition: { tileX: 5, tileY: 5 },
      ownerId: 'player-test',
      placedAt: '2026-01-01T00:00:00.000Z',
    });
    const farCampfire = creatingWorldBuildingPlacedBlock({
      blockId: 'campfire-far',
      plotId: 'plot-test',
      definitionId: DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CAMPFIRE,
      tilePosition: { tileX: 20, tileY: 20 },
      ownerId: 'player-test',
      placedAt: '2026-01-01T00:00:00.000Z',
    });

    const keys = listingWorldPlazaInteractableSelectionKeysInPlayerProximity({
      playerPosition: { x: 5.2, y: 5.1, layer: 0 },
      placedBlocks: [campfire, farCampfire],
    });

    expect(
      keys.has(formattingWorldPlazaInteractableBlockSelectionKey(campfire))
    ).toBe(true);
    expect(
      keys.has(formattingWorldPlazaInteractableBlockSelectionKey(farCampfire))
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
