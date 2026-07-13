import { buildingWorldPlazaLitCampfireTileKeysFromFireCells } from '@/components/world/fire/domains/buildingWorldPlazaLitCampfireTileKeysFromFireCells';
import { formattingWorldPlazaLitCampfireHeatTileKey } from '@/components/world/fire/domains/managingWorldPlazaLitCampfireHeatTilesStore';
import { describe, expect, it } from 'vitest';
import type { WorldFireDevvitCell } from '../../../../shared/worldFireDevvit';

function creatingWorldPlazaCampfireFireCellForTest(
  overrides: Partial<WorldFireDevvitCell> &
    Pick<WorldFireDevvitCell, 'tileX' | 'tileY'>
): WorldFireDevvitCell {
  return {
    worldLayer: 1,
    kind: 'campfire',
    ignitedAtMs: 0,
    fuelRemainingMs: 60_000,
    initialFuelMs: 60_000,
    intensity: 1,
    ...overrides,
  };
}

describe('buildingWorldPlazaLitCampfireTileKeysFromFireCells', () => {
  it('includes campfire cells with remaining fuel as 2D tile keys', () => {
    const fuelWoodByTile = buildingWorldPlazaLitCampfireTileKeysFromFireCells([
      creatingWorldPlazaCampfireFireCellForTest({
        tileX: 3,
        tileY: 4,
        inventoryFuelWoodCount: 2,
      }),
    ]);

    expect(
      fuelWoodByTile.get(formattingWorldPlazaLitCampfireHeatTileKey(3, 4))
    ).toBe(2);
  });

  it('keeps the higher wood count when layers share a tile', () => {
    const fuelWoodByTile = buildingWorldPlazaLitCampfireTileKeysFromFireCells([
      creatingWorldPlazaCampfireFireCellForTest({
        tileX: 3,
        tileY: 4,
        worldLayer: 0,
        inventoryFuelWoodCount: 1,
      }),
      creatingWorldPlazaCampfireFireCellForTest({
        tileX: 3,
        tileY: 4,
        worldLayer: 1,
        inventoryFuelWoodCount: 4,
      }),
    ]);

    expect(
      fuelWoodByTile.get(formattingWorldPlazaLitCampfireHeatTileKey(3, 4))
    ).toBe(4);
  });

  it('excludes spreading fire and empty-fuel campfires', () => {
    const fuelWoodByTile = buildingWorldPlazaLitCampfireTileKeysFromFireCells([
      creatingWorldPlazaCampfireFireCellForTest({
        tileX: 1,
        tileY: 1,
        kind: 'spreading',
      }),
      creatingWorldPlazaCampfireFireCellForTest({
        tileX: 2,
        tileY: 2,
        fuelRemainingMs: 0,
      }),
    ]);

    expect(fuelWoodByTile.size).toBe(0);
  });
});
