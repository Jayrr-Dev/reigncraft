import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  buildingWorldFireSimulationPlacedBlocksByTile,
  computingWorldFireSimulationTick,
  creatingWorldFireDevvitCell,
} from './computingWorldFireSimulationTick';
import { seedingWorldFireSpreadRoll } from './seedingWorldFireSpreadRoll';

describe('computingWorldFireSimulationTick', () => {
  it('is deterministic for the same tick input', () => {
    const cells = new Map([
      ['0,0,0', creatingWorldFireDevvitCell('spreading', 0, 0, 0, 10_000)],
    ]);
    const placedBlocksByTile = buildingWorldFireSimulationPlacedBlocksByTile([
      {
        id: 'block-a',
        plot_id: 'plot-a',
        definition_id: 'basic:floor:wood',
        tile_x: 1,
        tile_y: 0,
        world_layer: 0,
        owner_id: 'user-a',
        metadata: null,
        placed_at: '2026-01-01T00:00:00.000Z',
      },
    ]);

    const firstResult = computingWorldFireSimulationTick({
      roomScope: 'room-test',
      tickIndex: 42,
      cells,
      placedBlocksByTile,
    });
    const secondResult = computingWorldFireSimulationTick({
      roomScope: 'room-test',
      tickIndex: 42,
      cells,
      placedBlocksByTile,
    });

    assert.deepEqual(
      Array.from(firstResult.nextCells.entries()),
      Array.from(secondResult.nextCells.entries())
    );
    assert.deepEqual(firstResult.burnedBlockIds, secondResult.burnedBlockIds);
  });

  it('burns spreading fire blocks when fuel expires', () => {
    const cells = new Map([
      ['2,2,0', creatingWorldFireDevvitCell('spreading', 2, 2, 0, 1_000)],
    ]);
    const placedBlocksByTile = buildingWorldFireSimulationPlacedBlocksByTile([
      {
        id: 'burn-me',
        plot_id: 'plot-a',
        definition_id: 'basic:floor:wood',
        tile_x: 2,
        tile_y: 2,
        world_layer: 0,
        owner_id: 'user-a',
        metadata: null,
        placed_at: '2026-01-01T00:00:00.000Z',
      },
    ]);

    const result = computingWorldFireSimulationTick({
      roomScope: 'room-test',
      tickIndex: 1,
      cells,
      placedBlocksByTile,
    });

    assert.equal(result.nextCells.size, 0);
    assert.deepEqual(result.burnedBlockIds, ['burn-me']);
  });

  it('does not burn campfires when fuel expires', () => {
    const cells = new Map([
      ['4,4,0', creatingWorldFireDevvitCell('campfire', 4, 4, 0, 1_000)],
    ]);

    const result = computingWorldFireSimulationTick({
      roomScope: 'room-test',
      tickIndex: 1,
      cells,
      placedBlocksByTile: new Map(),
    });

    assert.equal(result.nextCells.size, 0);
    assert.deepEqual(result.burnedBlockIds, []);
  });

  it('does not spread from campfires', () => {
    const cells = new Map([
      ['0,0,0', creatingWorldFireDevvitCell('campfire', 0, 0, 0, 60_000)],
    ]);
    const placedBlocksByTile = buildingWorldFireSimulationPlacedBlocksByTile([
      {
        id: 'neighbor-wood',
        plot_id: 'plot-a',
        definition_id: 'basic:floor:wood',
        tile_x: 1,
        tile_y: 0,
        world_layer: 0,
        owner_id: 'user-a',
        metadata: null,
        placed_at: '2026-01-01T00:00:00.000Z',
      },
    ]);

    const result = computingWorldFireSimulationTick({
      roomScope: 'room-test',
      tickIndex: 99,
      cells,
      placedBlocksByTile,
    });

    assert.equal(result.nextCells.size, 1);
    assert.equal(result.nextCells.has('1,0,0'), false);
  });
});

describe('seedingWorldFireSpreadRoll', () => {
  it('returns stable values between 0 and 1', () => {
    const first = seedingWorldFireSpreadRoll('room-a', 5, 0, 0, 1, 0, 0);
    const second = seedingWorldFireSpreadRoll('room-a', 5, 0, 0, 1, 0, 0);
    const different = seedingWorldFireSpreadRoll('room-b', 5, 0, 0, 1, 0, 0);

    assert.equal(first, second);
    assert.notEqual(first, different);
    assert.ok(first >= 0 && first <= 1);
  });
});
