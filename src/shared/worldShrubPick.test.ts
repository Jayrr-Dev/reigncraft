import { describe, expect, it } from 'vitest';
import {
  checkingWorldShrubPickEligibility,
  computingWorldShrubPickMutation,
} from './worldShrubPick';
import { resolvingWorldShrubBerryLootKindAtTileIndex } from './worldShrubBerryLoot';
import {
  checkingWorldShrubBunchHasTallGrassCompanion,
  checkingWorldShrubPlacementAtTileIndex,
  checkingWorldShrubTallGrassCompanionAtTileIndex,
  listingWorldShrubBunchMemberOffsets,
  listingWorldShrubTallGrassCompanionOffsets,
  resolvingWorldShrubBunchSizeFromUnit,
  WORLD_SHRUB_BUNCH_MAX_TILE_COUNT,
  WORLD_SHRUB_BUNCH_MIN_TILE_COUNT,
  WORLD_SHRUB_TALL_GRASS_COMPANION_MAX_TILE_COUNT,
  WORLD_SHRUB_TALL_GRASS_COMPANION_MIN_TILE_COUNT,
} from './worldShrubPlacement';

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

  it('builds deterministic shrub bunches of 1 to 5 tiles', () => {
    for (let anchorIndex = 0; anchorIndex < 20; anchorIndex += 1) {
      const offsets = listingWorldShrubBunchMemberOffsets(
        anchorIndex * 6 + 3,
        anchorIndex * -6 + 3
      );

      expect(offsets.length).toBeGreaterThanOrEqual(
        WORLD_SHRUB_BUNCH_MIN_TILE_COUNT
      );
      expect(offsets.length).toBeLessThanOrEqual(
        WORLD_SHRUB_BUNCH_MAX_TILE_COUNT
      );
      expect(offsets).toContainEqual([0, 0]);
      expect(new Set(offsets.map(([x, y]) => `${x},${y}`)).size).toBe(
        offsets.length
      );
    }
  });

  it('peaks shrub bunch size at 3 on a bell curve', () => {
    const counts = new Map<number, number>();

    for (let sampleIndex = 0; sampleIndex < 1_400; sampleIndex += 1) {
      const size = resolvingWorldShrubBunchSizeFromUnit(sampleIndex / 1_400);
      counts.set(size, (counts.get(size) ?? 0) + 1);
    }

    expect(counts.get(3) ?? 0).toBeGreaterThan(counts.get(2) ?? 0);
    expect(counts.get(3) ?? 0).toBeGreaterThan(counts.get(4) ?? 0);
    expect(counts.get(2) ?? 0).toBeGreaterThan(counts.get(1) ?? 0);
    expect(counts.get(4) ?? 0).toBeGreaterThan(counts.get(5) ?? 0);
    expect(counts.get(1) ?? 0).toBeGreaterThan(0);
    expect(counts.get(5) ?? 0).toBeGreaterThan(0);
  });

  it('builds rare grass thickets of 3 to 5 tiles around berry bunches', () => {
    let companionBunchCount = 0;

    for (let anchorIndex = 0; anchorIndex < 40; anchorIndex += 1) {
      const anchorX = anchorIndex * 6 + 3;
      const anchorY = anchorIndex * -6 + 3;
      const hasCompanion = checkingWorldShrubBunchHasTallGrassCompanion(
        anchorX,
        anchorY
      );

      expect(
        checkingWorldShrubBunchHasTallGrassCompanion(anchorX, anchorY)
      ).toBe(hasCompanion);

      if (!hasCompanion) {
        continue;
      }

      companionBunchCount += 1;
      const offsets = listingWorldShrubTallGrassCompanionOffsets(
        anchorX,
        anchorY
      );

      expect(offsets.length).toBeGreaterThanOrEqual(
        WORLD_SHRUB_TALL_GRASS_COMPANION_MIN_TILE_COUNT
      );
      expect(offsets.length).toBeLessThanOrEqual(
        WORLD_SHRUB_TALL_GRASS_COMPANION_MAX_TILE_COUNT
      );
      expect(new Set(offsets.map(([x, y]) => `${x},${y}`)).size).toBe(
        offsets.length
      );
    }

    expect(companionBunchCount).toBeGreaterThan(3);
    expect(companionBunchCount).toBeLessThan(20);
  });

  it('keeps grass-companion membership deterministic for shrub bunches', () => {
    let companionTileCount = 0;

    for (let tileY = 0; tileY < 120; tileY += 1) {
      for (let tileX = 0; tileX < 120; tileX += 1) {
        const firstRoll = checkingWorldShrubTallGrassCompanionAtTileIndex(
          tileX,
          tileY,
          36
        );

        expect(
          checkingWorldShrubTallGrassCompanionAtTileIndex(tileX, tileY, 36)
        ).toBe(firstRoll);
        companionTileCount += firstRoll ? 1 : 0;
      }
    }

    expect(companionTileCount).toBeGreaterThan(5);
    expect(companionTileCount).toBeLessThan(200);
  });
});
