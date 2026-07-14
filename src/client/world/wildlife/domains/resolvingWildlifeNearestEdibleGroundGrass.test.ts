import { formattingWildlifeGroundGrassItemId } from '@/components/world/wildlife/domains/definingWildlifeGroundGrassIdConstants';
import {
  clearingWildlifeOptimisticClearedGroundGrass,
  markingWildlifeGroundGrassOptimisticCleared,
} from '@/components/world/wildlife/domains/managingWildlifeGroundGrassBridge';
import { resolvingWildlifeNearestEdibleGroundGrass } from '@/components/world/wildlife/domains/resolvingWildlifeNearestEdibleGroundGrass';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock(
  '@/components/world/domains/checkingWorldPlazaLongGrassDecorationAtTileIndex',
  () => ({
    checkingWorldPlazaLongGrassDecorationAtTileIndex: vi.fn(),
  })
);

vi.mock(
  '@/components/world/harvest/domains/registeringWorldPlazaClearedLongGrassLookup',
  () => ({
    checkingWorldPlazaRuntimeLongGrassIsCleared: vi.fn(),
  })
);

import { checkingWorldPlazaLongGrassDecorationAtTileIndex } from '@/components/world/domains/checkingWorldPlazaLongGrassDecorationAtTileIndex';
import { checkingWorldPlazaRuntimeLongGrassIsCleared } from '@/components/world/harvest/domains/registeringWorldPlazaClearedLongGrassLookup';

const grassMock = vi.mocked(checkingWorldPlazaLongGrassDecorationAtTileIndex);
const clearedMock = vi.mocked(checkingWorldPlazaRuntimeLongGrassIsCleared);

afterEach(() => {
  clearingWildlifeOptimisticClearedGroundGrass();
  grassMock.mockReset();
  clearedMock.mockReset();
});

describe('resolvingWildlifeNearestEdibleGroundGrass', () => {
  it('prefers the closer uncleared grass tile', () => {
    grassMock.mockImplementation(
      (tileX, tileY) =>
        (tileX === 3 && tileY === 1) || (tileX === 8 && tileY === 1)
    );
    clearedMock.mockReturnValue(false);

    const nearest = resolvingWildlifeNearestEdibleGroundGrass({
      x: 1.5,
      y: 1.5,
      layer: 1,
    });

    expect(nearest).toEqual({
      tileX: 3,
      tileY: 1,
      distanceGrid: Math.hypot(1.5 - 3.5, 1.5 - 1.5),
      groundItemId: formattingWildlifeGroundGrassItemId(3, 1),
    });
  });

  it('skips cleared and non-grass tiles', () => {
    grassMock.mockImplementation(
      (tileX, tileY) =>
        (tileX === 2 && tileY === 1) || (tileX === 4 && tileY === 1)
    );
    clearedMock.mockImplementation(
      (tileX, tileY) => tileX === 2 && tileY === 1
    );

    const nearest = resolvingWildlifeNearestEdibleGroundGrass({
      x: 1.5,
      y: 1.5,
      layer: 1,
    });

    expect(nearest?.tileX).toBe(4);
    expect(nearest?.tileY).toBe(1);
  });

  it('skips tiles marked optimistic-cleared mid-tick', () => {
    grassMock.mockImplementation(
      (tileX, tileY) => tileX === 2 && tileY === 1
    );
    clearedMock.mockReturnValue(false);
    markingWildlifeGroundGrassOptimisticCleared(2, 1);

    expect(
      resolvingWildlifeNearestEdibleGroundGrass({
        x: 1.5,
        y: 1.5,
        layer: 1,
      })
    ).toBeNull();
  });
});
