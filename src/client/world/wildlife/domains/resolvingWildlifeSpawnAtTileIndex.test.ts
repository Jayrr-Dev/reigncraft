import { resolvingWildlifeSpawnAtTileIndex } from '@/components/world/wildlife/domains/resolvingWildlifeSpawnAtTileIndex';
import { describe, expect, it } from 'vitest';

describe('resolvingWildlifeSpawnAtTileIndex', () => {
  it('returns deterministic anchors for the same tile', () => {
    const first = resolvingWildlifeSpawnAtTileIndex(14, 21, 0);
    const second = resolvingWildlifeSpawnAtTileIndex(14, 21, 0);

    expect(first).toEqual(second);
  });

  it('returns null on origin spawn clearing', () => {
    expect(resolvingWildlifeSpawnAtTileIndex(0, 0, 0)).toBeNull();
  });
});
