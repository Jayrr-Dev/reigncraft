import { drawingWorldPlazaVisibleWaterOnGraphics } from '@/components/world/domains/drawingWorldPlazaVisibleWaterOnGraphics';
import { resolvingWorldPlazaWaterSurfaceTileDrawMetadataAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaWaterSurfaceTileDrawMetadataAtTileIndex';
import { Graphics } from 'pixi.js';
import { describe, expect, it, vi } from 'vitest';

vi.mock(
  '@/components/world/domains/computingWorldPlazaDayNightSunState',
  () => ({
    computingWorldPlazaDayNightSunState: vi.fn(() => ({ isDaytime: true })),
  })
);

vi.mock(
  '@/components/world/domains/resolvingWorldPlazaWaterSurfaceTileDrawMetadataAtTileIndex',
  () => ({
    resolvingWorldPlazaWaterSurfaceTileDrawMetadataAtTileIndex: vi.fn(),
  })
);

const metadataMock = vi.mocked(
  resolvingWorldPlazaWaterSurfaceTileDrawMetadataAtTileIndex
);

describe('drawingWorldPlazaVisibleWaterOnGraphics', () => {
  it('reports total and river-only surface tile counts', () => {
    metadataMock.mockImplementation((tileX, tileY) => {
      if (tileX === 1 && tileY === 1) {
        return null;
      }

      return {
        tileX,
        tileY,
        isRiver: tileX === 0,
        surfaceAppearance: {
          batchKey: '123-0.5',
          color: 123,
          alpha: 0.5,
        },
        drawsShoreDetails: false,
      };
    });

    expect(
      drawingWorldPlazaVisibleWaterOnGraphics(new Graphics(), {
        minTileX: 0,
        maxTileX: 1,
        minTileY: 0,
        maxTileY: 1,
      })
    ).toEqual({
      waterTileCount: 3,
      riverTileCount: 2,
    });
  });
});
