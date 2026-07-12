import {
  DEFINING_WORLD_PLAZA_WATER_KIND_LAKE,
  DEFINING_WORLD_PLAZA_WATER_KIND_RIVER,
} from '@/components/world/domains/definingWorldPlazaWaterKind';
import { resolvingWorldPlazaWaterAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaWaterAtTileIndex';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock(
  '@/components/world/domains/resolvingWorldPlazaWaterAtTileIndex',
  () => ({
    resolvingWorldPlazaWaterAtTileIndex: vi.fn(),
  })
);

import {
  invalidatingWorldPlazaLakeWaterShallowDepthCache,
  resolvingWorldPlazaLakeWaterShallowDepthAtTileIndex,
} from '@/components/world/domains/resolvingWorldPlazaLakeWaterDepthAtTileIndex';

const resolvingWaterMock = vi.mocked(resolvingWorldPlazaWaterAtTileIndex);

function definingLakeTile(tileX: number, tileY: number) {
  return {
    tileX,
    tileY,
    kind: DEFINING_WORLD_PLAZA_WATER_KIND_LAKE,
  };
}

describe('resolvingWorldPlazaLakeWaterShallowDepthAtTileIndex', () => {
  beforeEach(() => {
    resolvingWaterMock.mockReset();
    invalidatingWorldPlazaLakeWaterShallowDepthCache();
  });

  it('resolves first and second shallow shore bands', () => {
    resolvingWaterMock.mockImplementation((tileX, tileY) => {
      if (tileX === 2 && tileY === 0) {
        return {
          tileX,
          tileY,
          kind: DEFINING_WORLD_PLAZA_WATER_KIND_RIVER,
        };
      }

      return definingLakeTile(tileX, tileY);
    });

    expect(resolvingWorldPlazaLakeWaterShallowDepthAtTileIndex(1, 0)).toBe(1);
    expect(resolvingWorldPlazaLakeWaterShallowDepthAtTileIndex(0, 0)).toBe(2);
  });

  it('caps deep-ocean work at the visible shallow band', () => {
    resolvingWaterMock.mockImplementation(definingLakeTile);

    expect(
      resolvingWorldPlazaLakeWaterShallowDepthAtTileIndex(0, 0)
    ).toBeNull();
    expect(resolvingWaterMock).toHaveBeenCalledTimes(25);
  });

  it('reuses cached deep-ocean results across redraws', () => {
    resolvingWaterMock.mockImplementation(definingLakeTile);

    resolvingWorldPlazaLakeWaterShallowDepthAtTileIndex(40, 50);
    const callsAfterFirstResolve = resolvingWaterMock.mock.calls.length;
    resolvingWorldPlazaLakeWaterShallowDepthAtTileIndex(40, 50);

    expect(resolvingWaterMock).toHaveBeenCalledTimes(callsAfterFirstResolve);
  });
});
