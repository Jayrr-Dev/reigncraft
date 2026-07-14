import {
  DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_BLOOMERY,
  DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CLAY_STOVE,
} from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import { creatingWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import {
  DEFINING_WORLD_BUILDING_FOOTPRINT_GROUP_ID_METADATA_KEY,
  DEFINING_WORLD_BUILDING_FOOTPRINT_ROLE_ANCHOR,
  DEFINING_WORLD_BUILDING_FOOTPRINT_ROLE_METADATA_KEY,
  DEFINING_WORLD_BUILDING_FOOTPRINT_ROLE_SATELLITE,
} from '@/components/world/building/domains/definingWorldBuildingPlacementFootprint';
import { listingWorldPlazaOreSmeltingStationsInInteractionRange } from '@/components/world/crafting/domains/listingWorldPlazaOreSmeltingStationsInInteractionRange';
import {
  resolvingWorldPlazaOreSmeltingStationAnchorBlock,
} from '@/components/world/crafting/domains/resolvingWorldPlazaOreSmeltingStationAnchorBlock';
import { formattingWorldPlazaInteractableBlockSelectionKey } from '@/components/world/interaction/domains/formattingWorldPlazaInteractableBlockSelectionKey';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaOreSmeltingStationAnchorBlock', () => {
  it('returns the anchor when a footprint satellite is clicked', () => {
    const anchor = creatingWorldBuildingPlacedBlock({
      blockId: 'bloomery-anchor',
      definitionId: DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_BLOOMERY,
      tilePosition: { tileX: 4, tileY: 6 },
      worldLayer: 1,
      blockHeight: 1,
      metadata: {
        [DEFINING_WORLD_BUILDING_FOOTPRINT_ROLE_METADATA_KEY]:
          DEFINING_WORLD_BUILDING_FOOTPRINT_ROLE_ANCHOR,
        [DEFINING_WORLD_BUILDING_FOOTPRINT_GROUP_ID_METADATA_KEY]:
          'bloomery-anchor',
      },
    });
    const satellite = creatingWorldBuildingPlacedBlock({
      blockId: 'bloomery-sat',
      definitionId: DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_BLOOMERY,
      tilePosition: { tileX: 5, tileY: 6 },
      worldLayer: 1,
      blockHeight: 1,
      metadata: {
        [DEFINING_WORLD_BUILDING_FOOTPRINT_ROLE_METADATA_KEY]:
          DEFINING_WORLD_BUILDING_FOOTPRINT_ROLE_SATELLITE,
        [DEFINING_WORLD_BUILDING_FOOTPRINT_GROUP_ID_METADATA_KEY]:
          'bloomery-anchor',
      },
    });

    expect(
      resolvingWorldPlazaOreSmeltingStationAnchorBlock(
        [anchor, satellite],
        satellite
      ).blockId
    ).toBe('bloomery-anchor');
  });
});

describe('listingWorldPlazaOreSmeltingStationsInInteractionRange', () => {
  it('lists a 1x1 stove when its selection key is active', () => {
    const stove = creatingWorldBuildingPlacedBlock({
      blockId: 'stove-1',
      definitionId: DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CLAY_STOVE,
      tilePosition: { tileX: 2, tileY: 3 },
      worldLayer: 1,
      blockHeight: 1,
    });

    const entries = listingWorldPlazaOreSmeltingStationsInInteractionRange(
      [stove],
      new Set([formattingWorldPlazaInteractableBlockSelectionKey(stove)])
    );

    expect(entries).toHaveLength(1);
    expect(entries[0]?.block.blockId).toBe('stove-1');
  });

  it('lists the bloomery anchor when a satellite tile key is selected', () => {
    const anchor = creatingWorldBuildingPlacedBlock({
      blockId: 'bloomery-anchor',
      definitionId: DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_BLOOMERY,
      tilePosition: { tileX: 4, tileY: 6 },
      worldLayer: 1,
      blockHeight: 1,
      metadata: {
        [DEFINING_WORLD_BUILDING_FOOTPRINT_ROLE_METADATA_KEY]:
          DEFINING_WORLD_BUILDING_FOOTPRINT_ROLE_ANCHOR,
        [DEFINING_WORLD_BUILDING_FOOTPRINT_GROUP_ID_METADATA_KEY]:
          'bloomery-anchor',
      },
    });
    const satellite = creatingWorldBuildingPlacedBlock({
      blockId: 'bloomery-sat',
      definitionId: DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_BLOOMERY,
      tilePosition: { tileX: 5, tileY: 7 },
      worldLayer: 1,
      blockHeight: 1,
      metadata: {
        [DEFINING_WORLD_BUILDING_FOOTPRINT_ROLE_METADATA_KEY]:
          DEFINING_WORLD_BUILDING_FOOTPRINT_ROLE_SATELLITE,
        [DEFINING_WORLD_BUILDING_FOOTPRINT_GROUP_ID_METADATA_KEY]:
          'bloomery-anchor',
      },
    });

    const entries = listingWorldPlazaOreSmeltingStationsInInteractionRange(
      [anchor, satellite],
      new Set([formattingWorldPlazaInteractableBlockSelectionKey(satellite)])
    );

    expect(entries).toHaveLength(1);
    expect(entries[0]?.block.blockId).toBe('bloomery-anchor');
  });
});
