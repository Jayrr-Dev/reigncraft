import { describe, expect, it } from 'vitest';
import {
  checkingWorldShrubPickEligibility,
  computingWorldShrubPickMutation,
} from './worldShrubPick';
import { resolvingWorldShrubBerryLootKindAtTileIndex } from './worldShrubBerryLoot';
import { checkingWorldShrubPlacementAtTileIndex } from './worldShrubPlacement';

describe('worldShrubPick', () => {
  it('marks eligible unpicked shrub as picked', () => {
    const result = computingWorldShrubPickMutation({
      tileX: 10,
      tileY: 12,
      playerX: 10.5,
      playerY: 12.5,
    });

    expect(result.outcome).toBe('picked');
    if (result.outcome === 'picked') {
      expect(result.nextTileState).toEqual({ isPicked: true });
    }
  });

  it('rejects already-picked shrubs', () => {
    const result = checkingWorldShrubPickEligibility({
      tileX: 10,
      tileY: 12,
      playerX: 10.5,
      playerY: 12.5,
      existingTileState: { isPicked: true },
    });

    expect(result.outcome).toBe('already-picked');
  });

  it('rolls deterministic berry loot per tile', () => {
    expect(resolvingWorldShrubBerryLootKindAtTileIndex(3, 7)).toBe(
      resolvingWorldShrubBerryLootKindAtTileIndex(3, 7)
    );
  });

  it('respects shrub density modulus', () => {
    let hits = 0;
    for (let y = 0; y < 40; y++) {
      for (let x = 0; x < 40; x++) {
        if (checkingWorldShrubPlacementAtTileIndex(x, y, 48)) {
          hits += 1;
        }
      }
    }

    expect(hits).toBeGreaterThan(10);
    expect(hits).toBeLessThan(80);
  });
});
