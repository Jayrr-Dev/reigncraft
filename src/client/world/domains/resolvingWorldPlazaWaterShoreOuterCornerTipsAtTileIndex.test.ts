import { DEFINING_WORLD_PLAZA_WATER_KIND_RIVER } from '@/components/world/domains/definingWorldPlazaWaterKind';
import { resolvingWorldPlazaWaterAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaWaterAtTileIndex';
import { resolvingWorldPlazaWaterShoreOuterCornerTipsAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaWaterShoreOuterCornerTipsAtTileIndex';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock(
  '@/components/world/domains/resolvingWorldPlazaWaterAtTileIndex',
  () => ({
    resolvingWorldPlazaWaterAtTileIndex: vi.fn(),
  })
);

const mockedResolvingWorldPlazaWaterAtTileIndex = vi.mocked(
  resolvingWorldPlazaWaterAtTileIndex
);

describe('resolvingWorldPlazaWaterShoreOuterCornerTipsAtTileIndex', () => {
  beforeEach(() => {
    mockedResolvingWorldPlazaWaterAtTileIndex.mockReset();
  });

  it('returns a bottom tip when east and south neighbors are water', () => {
    mockedResolvingWorldPlazaWaterAtTileIndex.mockImplementation(
      (tileX, tileY) => {
        if (tileX === 0 && tileY === 0) {
          return null;
        }

        if ((tileX === 1 && tileY === 0) || (tileX === 0 && tileY === 1)) {
          return {
            kind: DEFINING_WORLD_PLAZA_WATER_KIND_RIVER,
            depth: 1,
          };
        }

        return null;
      }
    );

    const tips = resolvingWorldPlazaWaterShoreOuterCornerTipsAtTileIndex(0, 0);

    expect(tips).toHaveLength(1);
    expect(tips[0]).toMatchObject({
      landTileX: 0,
      landTileY: 0,
      tip: { tipVertex: 'bottom' },
      waterTileX: 1,
      waterTileY: 0,
    });
  });

  it('returns no tips on a water tile', () => {
    mockedResolvingWorldPlazaWaterAtTileIndex.mockReturnValue({
      kind: DEFINING_WORLD_PLAZA_WATER_KIND_RIVER,
      depth: 1,
    });

    expect(
      resolvingWorldPlazaWaterShoreOuterCornerTipsAtTileIndex(2, 2)
    ).toEqual([]);
  });

  it('returns no tips when only one cardinal neighbor is water', () => {
    mockedResolvingWorldPlazaWaterAtTileIndex.mockImplementation(
      (tileX, tileY) => {
        if (tileX === 1 && tileY === 0) {
          return {
            kind: DEFINING_WORLD_PLAZA_WATER_KIND_RIVER,
            depth: 1,
          };
        }

        return null;
      }
    );

    expect(
      resolvingWorldPlazaWaterShoreOuterCornerTipsAtTileIndex(0, 0)
    ).toEqual([]);
  });
});
