import {
  DEFINING_WORLD_PLAZA_WATER_KIND_LAKE,
  DEFINING_WORLD_PLAZA_WATER_KIND_RIVER,
  DEFINING_WORLD_PLAZA_WATER_KIND_STREAM,
  type DefiningWorldPlazaWaterKind,
} from '@/components/world/domains/definingWorldPlazaWaterKind';
import { resolvingWorldPlazaWaterAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaWaterAtTileIndex';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock(
  '@/components/world/domains/resolvingWorldPlazaWaterAtTileIndex',
  () => ({
    resolvingWorldPlazaWaterAtTileIndex: vi.fn(),
  })
);

import { checkingWorldPlazaTerrainElevationIsForcedFlatAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaTerrainElevationAtTileIndex';

const resolvingWaterMock = vi.mocked(resolvingWorldPlazaWaterAtTileIndex);

function definingWaterTile(kind: DefiningWorldPlazaWaterKind) {
  return {
    tileX: 100,
    tileY: 100,
    kind,
  };
}

describe('checkingWorldPlazaTerrainElevationIsForcedFlatAtTileIndex', () => {
  beforeEach(() => {
    resolvingWaterMock.mockReset();
    resolvingWaterMock.mockReturnValue(null);
  });

  it('keeps water beds flat', () => {
    resolvingWaterMock.mockReturnValue(
      definingWaterTile(DEFINING_WORLD_PLAZA_WATER_KIND_LAKE)
    );

    expect(
      checkingWorldPlazaTerrainElevationIsForcedFlatAtTileIndex(100, 100)
    ).toBe(true);
  });

  it.each([
    [100, 99, DEFINING_WORLD_PLAZA_WATER_KIND_RIVER],
    [101, 100, DEFINING_WORLD_PLAZA_WATER_KIND_RIVER],
    [100, 101, DEFINING_WORLD_PLAZA_WATER_KIND_STREAM],
    [99, 100, DEFINING_WORLD_PLAZA_WATER_KIND_STREAM],
  ])(
    'flattens a bank beside flowing water at %i,%i',
    (waterTileX, waterTileY, waterKind) => {
      resolvingWaterMock.mockImplementation((tileX, tileY) =>
        tileX === waterTileX && tileY === waterTileY
          ? {
              tileX,
              tileY,
              kind: waterKind,
            }
          : null
      );

      expect(
        checkingWorldPlazaTerrainElevationIsForcedFlatAtTileIndex(100, 100)
      ).toBe(true);
    }
  );

  it('does not flatten diagonal or still-water shore tiles', () => {
    resolvingWaterMock.mockImplementation((tileX, tileY) => {
      if (tileX === 101 && tileY === 101) {
        return {
          tileX,
          tileY,
          kind: DEFINING_WORLD_PLAZA_WATER_KIND_RIVER,
        };
      }

      if (tileX === 99 && tileY === 100) {
        return {
          tileX,
          tileY,
          kind: DEFINING_WORLD_PLAZA_WATER_KIND_LAKE,
        };
      }

      return null;
    });

    expect(
      checkingWorldPlazaTerrainElevationIsForcedFlatAtTileIndex(100, 100)
    ).toBe(false);
  });
});
