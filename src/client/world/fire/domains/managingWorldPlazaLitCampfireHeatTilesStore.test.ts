import { buildingWorldPlazaLitCampfireTileKeysFromFireCells } from '@/components/world/fire/domains/buildingWorldPlazaLitCampfireTileKeysFromFireCells';
import {
  checkingWorldPlazaLitCampfireHeatAtTileIndex,
  clearingWorldPlazaLitCampfireHeatTilesForTest,
  gettingWorldPlazaLitCampfireHeatTilesCacheKey,
  markingWorldPlazaLitCampfireHeatTileForTest,
  resolvingWorldPlazaLitCampfireHeatCelsiusAtTileIndex,
  updatingWorldPlazaLitCampfireHeatTilesFromFireCells,
} from '@/components/world/fire/domains/managingWorldPlazaLitCampfireHeatTilesStore';
import {
  DEFINING_WORLD_PLAZA_TEMPERATURE_CAMPFIRE_CELSIUS,
  computingWorldPlazaCampfireAdjacentTemperatureCelsius,
  computingWorldPlazaCampfireTemperatureCelsiusFromFuelWoodCount,
} from '@/components/world/health/domains/definingWorldPlazaTemperatureConstants';
import { beforeEach, describe, expect, it } from 'vitest';
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

describe('managingWorldPlazaLitCampfireHeatTilesStore', () => {
  beforeEach(() => {
    clearingWorldPlazaLitCampfireHeatTilesForTest();
  });

  it('publishes lit campfire heat tiles from fire cells', () => {
    updatingWorldPlazaLitCampfireHeatTilesFromFireCells([
      creatingWorldPlazaCampfireFireCellForTest({
        tileX: 5,
        tileY: 6,
        inventoryFuelWoodCount: 3,
      }),
    ]);

    const standingCelsius =
      computingWorldPlazaCampfireTemperatureCelsiusFromFuelWoodCount(3);
    const adjacentCelsius =
      computingWorldPlazaCampfireAdjacentTemperatureCelsius(standingCelsius);

    expect(checkingWorldPlazaLitCampfireHeatAtTileIndex(5, 6)).toBe(true);
    expect(checkingWorldPlazaLitCampfireHeatAtTileIndex(6, 6)).toBe(true);
    expect(checkingWorldPlazaLitCampfireHeatAtTileIndex(5, 8)).toBe(false);
    expect(resolvingWorldPlazaLitCampfireHeatCelsiusAtTileIndex(5, 6)).toBe(
      standingCelsius
    );
    expect(resolvingWorldPlazaLitCampfireHeatCelsiusAtTileIndex(6, 6)).toBe(
      adjacentCelsius
    );
    expect(gettingWorldPlazaLitCampfireHeatTilesCacheKey()).toContain('5,6@');
  });

  it('clears heat when fire cells empty', () => {
    markingWorldPlazaLitCampfireHeatTileForTest(1, 2);
    updatingWorldPlazaLitCampfireHeatTilesFromFireCells([]);

    expect(checkingWorldPlazaLitCampfireHeatAtTileIndex(1, 2)).toBe(false);
    expect(gettingWorldPlazaLitCampfireHeatTilesCacheKey()).toBe('');
  });

  it('matches buildingWorldPlazaLitCampfireTileKeysFromFireCells output', () => {
    const fireCells = [
      creatingWorldPlazaCampfireFireCellForTest({
        tileX: 8,
        tileY: 9,
        inventoryFuelWoodCount: 2,
      }),
    ];

    updatingWorldPlazaLitCampfireHeatTilesFromFireCells(fireCells);

    expect(checkingWorldPlazaLitCampfireHeatAtTileIndex(8, 9)).toBe(
      buildingWorldPlazaLitCampfireTileKeysFromFireCells(fireCells).has('8,9')
    );
  });

  it('defaults test heat tiles to one-wood campfire temperature', () => {
    markingWorldPlazaLitCampfireHeatTileForTest(4, 5);

    expect(resolvingWorldPlazaLitCampfireHeatCelsiusAtTileIndex(4, 5)).toBe(
      DEFINING_WORLD_PLAZA_TEMPERATURE_CAMPFIRE_CELSIUS
    );
  });
});
