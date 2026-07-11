import {
  DEFINING_WORLD_PLAZA_DEV_QA_BIOME_CELL_TILE_SIZE,
  DEFINING_WORLD_PLAZA_DEV_QA_BIOME_GRID_KINDS,
} from '@/components/world/domains/definingWorldPlazaDevQaLoadConstants';
import { resolvingWorldPlazaDevQaBiomeKindAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaDevQaBiomeKindAtTileIndex';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaDevQaBiomeKindAtTileIndex', () => {
  it('places plains at world origin for the QA spawn', () => {
    expect(resolvingWorldPlazaDevQaBiomeKindAtTileIndex(0, 0)).toBe('plains');
  });

  it('walks east into the next biome cell', () => {
    const eastNeighborTileX = DEFINING_WORLD_PLAZA_DEV_QA_BIOME_CELL_TILE_SIZE;
    expect(
      resolvingWorldPlazaDevQaBiomeKindAtTileIndex(eastNeighborTileX, 0)
    ).toBe(DEFINING_WORLD_PLAZA_DEV_QA_BIOME_GRID_KINDS[1]);
  });

  it('returns plains outside the showcase grid', () => {
    expect(resolvingWorldPlazaDevQaBiomeKindAtTileIndex(10_000, 10_000)).toBe(
      'plains'
    );
  });
});
