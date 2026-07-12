import { checkingWorldPlazaWaterIsFrozenAtTileIndex } from '@/components/world/domains/checkingWorldPlazaWaterIsFrozenAtTileIndex';
import { checkingWorldPlazaWaterTileIsShoreAtTileIndex } from '@/components/world/domains/checkingWorldPlazaWaterTileIsShoreAtTileIndex';
import { DEFINING_WORLD_PLAZA_WATER_KIND_RIVER } from '@/components/world/domains/definingWorldPlazaWaterKind';
import { resolvingWorldPlazaFlowingWaterLakeTransitionSurfaceAppearanceAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaFlowingWaterLakeTransitionSurfaceAppearanceAtTileIndex';
import { resolvingWorldPlazaWaterAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaWaterAtTileIndex';
import {
  invalidatingWorldPlazaWaterSurfaceTileDrawMetadataCache,
  resolvingWorldPlazaWaterSurfaceTileDrawMetadataAtTileIndex,
} from '@/components/world/domains/resolvingWorldPlazaWaterSurfaceTileDrawMetadataAtTileIndex';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock(
  '@/components/world/domains/checkingWorldPlazaWaterIsFrozenAtTileIndex',
  () => ({
    checkingWorldPlazaWaterIsFrozenAtTileIndex: vi.fn(() => false),
  })
);

vi.mock(
  '@/components/world/domains/checkingWorldPlazaWaterTileIsShoreAtTileIndex',
  () => ({
    checkingWorldPlazaWaterTileIsShoreAtTileIndex: vi.fn(() => true),
  })
);

vi.mock(
  '@/components/world/domains/resolvingWorldPlazaFlowingWaterLakeTransitionSurfaceAppearanceAtTileIndex',
  () => ({
    resolvingWorldPlazaFlowingWaterLakeTransitionSurfaceAppearanceAtTileIndex:
      vi.fn(() => ({ color: 0x123456, alpha: 0.5 })),
  })
);

vi.mock(
  '@/components/world/domains/resolvingWorldPlazaWaterAtTileIndex',
  () => ({
    resolvingWorldPlazaWaterAtTileIndex: vi.fn(),
  })
);

const frozenMock = vi.mocked(checkingWorldPlazaWaterIsFrozenAtTileIndex);
const shoreMock = vi.mocked(checkingWorldPlazaWaterTileIsShoreAtTileIndex);
const appearanceMock = vi.mocked(
  resolvingWorldPlazaFlowingWaterLakeTransitionSurfaceAppearanceAtTileIndex
);
const waterMock = vi.mocked(resolvingWorldPlazaWaterAtTileIndex);

describe('resolvingWorldPlazaWaterSurfaceTileDrawMetadataAtTileIndex', () => {
  beforeEach(() => {
    invalidatingWorldPlazaWaterSurfaceTileDrawMetadataCache();
    frozenMock.mockClear();
    shoreMock.mockClear();
    appearanceMock.mockClear();
    waterMock.mockReset();
    waterMock.mockImplementation((tileX, tileY) => ({
      tileX,
      tileY,
      kind: DEFINING_WORLD_PLAZA_WATER_KIND_RIVER,
    }));
  });

  it('reuses complete surface metadata for repeated tile redraws', () => {
    const first =
      resolvingWorldPlazaWaterSurfaceTileDrawMetadataAtTileIndex(4, 7, true);
    const second =
      resolvingWorldPlazaWaterSurfaceTileDrawMetadataAtTileIndex(4, 7, true);

    expect(second).toBe(first);
    expect(waterMock).toHaveBeenCalledTimes(1);
    expect(frozenMock).toHaveBeenCalledTimes(1);
    expect(shoreMock).toHaveBeenCalledTimes(1);
    expect(appearanceMock).toHaveBeenCalledTimes(1);
  });

  it('caches dry land misses', () => {
    waterMock.mockImplementation(() => null);

    expect(
      resolvingWorldPlazaWaterSurfaceTileDrawMetadataAtTileIndex(8, 9, true)
    ).toBeNull();
    expect(
      resolvingWorldPlazaWaterSurfaceTileDrawMetadataAtTileIndex(8, 9, true)
    ).toBeNull();
    expect(waterMock).toHaveBeenCalledTimes(1);
  });

  it('recomputes after invalidation', () => {
    resolvingWorldPlazaWaterSurfaceTileDrawMetadataAtTileIndex(2, 3, true);
    invalidatingWorldPlazaWaterSurfaceTileDrawMetadataCache();
    resolvingWorldPlazaWaterSurfaceTileDrawMetadataAtTileIndex(2, 3, true);

    expect(waterMock).toHaveBeenCalledTimes(2);
    expect(appearanceMock).toHaveBeenCalledTimes(2);
  });

  it('keeps separate day and night metadata entries', () => {
    resolvingWorldPlazaWaterSurfaceTileDrawMetadataAtTileIndex(1, 1, true);
    resolvingWorldPlazaWaterSurfaceTileDrawMetadataAtTileIndex(1, 1, false);

    expect(frozenMock).toHaveBeenCalledTimes(2);
  });
});
