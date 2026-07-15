import {
  formattingWorldPlazaProceduralChestId,
  resolvingWorldPlazaProceduralChestAtTileIndex,
} from '@/components/world/chest/domains/resolvingWorldPlazaProceduralChestAtTileIndex';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaProceduralChestAtTileIndex', () => {
  it('returns null for most tiles under the sparse modulus gate', () => {
    let matchCount = 0;

    for (let tileX = 0; tileX < 40; tileX += 1) {
      for (let tileY = 0; tileY < 40; tileY += 1) {
        if (resolvingWorldPlazaProceduralChestAtTileIndex(tileX, tileY)) {
          matchCount += 1;
        }
      }
    }

    expect(matchCount).toBeGreaterThan(0);
    expect(matchCount).toBeLessThan(40);
  });

  it('is deterministic for chest id, key source, and facing', () => {
    let resolvedTile: { tileX: number; tileY: number } | null = null;

    for (let tileX = -20; tileX < 20; tileX += 1) {
      for (let tileY = -20; tileY < 20; tileY += 1) {
        if (resolvingWorldPlazaProceduralChestAtTileIndex(tileX, tileY)) {
          resolvedTile = { tileX, tileY };
          break;
        }
      }

      if (resolvedTile) {
        break;
      }
    }

    expect(resolvedTile).not.toBeNull();

    const first = resolvingWorldPlazaProceduralChestAtTileIndex(
      resolvedTile!.tileX,
      resolvedTile!.tileY
    );
    const second = resolvingWorldPlazaProceduralChestAtTileIndex(
      resolvedTile!.tileX,
      resolvedTile!.tileY
    );

    expect(first).not.toBeNull();
    expect(second).toEqual(first);
    expect(first?.chestId).toBe(
      formattingWorldPlazaProceduralChestId(
        resolvedTile!.tileX,
        resolvedTile!.tileY
      )
    );
    expect(first?.initialState).toBe('locked');
    expect(first?.keySource).toMatch(/^(wildlife|shrub|long-grass)$/);
    expect(first?.loot).toEqual({ kind: 'pool', poolId: 'starter-forage' });
  });
});
