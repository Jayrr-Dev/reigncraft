import { buildingWorldPlazaLitCampfireTileKeysFromFireCells } from '@/components/world/fire/domains/buildingWorldPlazaLitCampfireTileKeysFromFireCells';
import { formattingWorldPlazaLitCampfireHeatTileKey } from '@/components/world/fire/domains/managingWorldPlazaLitCampfireHeatTilesStore';
import {
  computingWorldPlazaCampfireAdjacentTemperatureCelsius,
  computingWorldPlazaCampfireTemperatureCelsiusFromFuelWoodCount,
} from '@/components/world/health/domains/definingWorldPlazaTemperatureConstants';
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
  it('paints standing heat plus one Chebyshev ring around lit campfires', () => {
    const heatCelsiusByTile =
      buildingWorldPlazaLitCampfireTileKeysFromFireCells([
        creatingWorldPlazaCampfireFireCellForTest({
          tileX: 3,
          tileY: 4,
          inventoryFuelWoodCount: 2,
        }),
      ]);
    const standingCelsius =
      computingWorldPlazaCampfireTemperatureCelsiusFromFuelWoodCount(2);
    const adjacentCelsius =
      computingWorldPlazaCampfireAdjacentTemperatureCelsius(standingCelsius);

    expect(
      heatCelsiusByTile.get(formattingWorldPlazaLitCampfireHeatTileKey(3, 4))
    ).toBe(standingCelsius);
    expect(
      heatCelsiusByTile.get(formattingWorldPlazaLitCampfireHeatTileKey(4, 4))
    ).toBe(adjacentCelsius);
    expect(
      heatCelsiusByTile.get(formattingWorldPlazaLitCampfireHeatTileKey(2, 3))
    ).toBe(adjacentCelsius);
    expect(
      heatCelsiusByTile.has(formattingWorldPlazaLitCampfireHeatTileKey(5, 4))
    ).toBe(false);
  });

  it('keeps the hotter temperature when layers share a tile', () => {
    const heatCelsiusByTile =
      buildingWorldPlazaLitCampfireTileKeysFromFireCells([
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
      heatCelsiusByTile.get(formattingWorldPlazaLitCampfireHeatTileKey(3, 4))
    ).toBe(computingWorldPlazaCampfireTemperatureCelsiusFromFuelWoodCount(4));
  });

  it('excludes spreading fire and empty-fuel campfires', () => {
    const heatCelsiusByTile =
      buildingWorldPlazaLitCampfireTileKeysFromFireCells([
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

    expect(heatCelsiusByTile.size).toBe(0);
  });
});
