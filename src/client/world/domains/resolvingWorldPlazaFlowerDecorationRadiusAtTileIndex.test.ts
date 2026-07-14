import {
  DEFINING_WORLD_PLAZA_BIOME_DECORATION_DOT_RADIUS_PX,
  DEFINING_WORLD_PLAZA_FLOWER_DECORATION_RADIUS_SCALE_MAX,
  DEFINING_WORLD_PLAZA_FLOWER_DECORATION_RADIUS_SCALE_MIN,
} from '@/components/world/domains/definingWorldPlazaBiomeConstants';
import { resolvingWorldPlazaFlowerDecorationRadiusAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaFlowerDecorationRadiusAtTileIndex';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaFlowerDecorationRadiusAtTileIndex', () => {
  it('returns a stable radius within configured bounds', () => {
    const first = resolvingWorldPlazaFlowerDecorationRadiusAtTileIndex(17, -9);
    const second = resolvingWorldPlazaFlowerDecorationRadiusAtTileIndex(17, -9);

    expect(second).toBe(first);
    expect(first).toBeGreaterThanOrEqual(
      DEFINING_WORLD_PLAZA_BIOME_DECORATION_DOT_RADIUS_PX *
        DEFINING_WORLD_PLAZA_FLOWER_DECORATION_RADIUS_SCALE_MIN
    );
    expect(first).toBeLessThanOrEqual(
      DEFINING_WORLD_PLAZA_BIOME_DECORATION_DOT_RADIUS_PX *
        DEFINING_WORLD_PLAZA_FLOWER_DECORATION_RADIUS_SCALE_MAX
    );
  });

  it('varies radius across tile coordinates', () => {
    const radii = new Set(
      Array.from({ length: 12 }, (_, index) =>
        resolvingWorldPlazaFlowerDecorationRadiusAtTileIndex(index, index * 3)
      )
    );

    expect(radii.size).toBeGreaterThan(1);
  });
});
