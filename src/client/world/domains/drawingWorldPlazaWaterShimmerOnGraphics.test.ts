import { DEFINING_WORLD_PLAZA_WATER_SHIMMER_MAX_ANIMATED_TILES } from '@/components/world/domains/definingWorldPlazaWaterConstants';
import { DEFINING_WORLD_PLAZA_WATER_KIND_RIVER } from '@/components/world/domains/definingWorldPlazaWaterKind';
import {
  drawingWorldPlazaWaterShimmerOnGraphics,
  invalidatingWorldPlazaWaterShimmerTileEntryCache,
} from '@/components/world/domains/drawingWorldPlazaWaterShimmerOnGraphics';
import { resolvingWorldPlazaWaterAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaWaterAtTileIndex';
import type { Graphics } from 'pixi.js';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock(
  '@/components/world/domains/resolvingWorldPlazaWaterAtTileIndex',
  () => ({
    resolvingWorldPlazaWaterAtTileIndex: vi.fn(),
  })
);

vi.mock(
  '@/components/world/domains/checkingWorldPlazaWaterIsFrozenAtTileIndex',
  () => ({
    checkingWorldPlazaWaterIsFrozenAtTileIndex: vi.fn(() => false),
  })
);

vi.mock(
  '@/components/world/domains/computingWorldPlazaDayNightSunState',
  () => ({
    computingWorldPlazaDayNightSunState: vi.fn(() => ({ isDaytime: true })),
  })
);

/** Chainable stub standing in for a Pixi Graphics instance. */
function buildingStubShimmerGraphics(): Graphics {
  const stub = {
    moveTo: vi.fn(() => stub),
    lineTo: vi.fn(() => stub),
    stroke: vi.fn(() => stub),
    ellipse: vi.fn(() => stub),
    fill: vi.fn(() => stub),
  };

  return stub as unknown as Graphics;
}

const resolvingWaterMock = vi.mocked(resolvingWorldPlazaWaterAtTileIndex);

describe('drawingWorldPlazaWaterShimmerOnGraphics', () => {
  beforeEach(() => {
    invalidatingWorldPlazaWaterShimmerTileEntryCache();
    resolvingWaterMock.mockReset();
  });

  it('caps animated tiles at the shimmer budget on dense water', () => {
    resolvingWaterMock.mockReturnValue({
      kind: DEFINING_WORLD_PLAZA_WATER_KIND_RIVER,
    } as ReturnType<typeof resolvingWorldPlazaWaterAtTileIndex>);

    const animatedTileCount = drawingWorldPlazaWaterShimmerOnGraphics(
      buildingStubShimmerGraphics(),
      { minTileX: 0, maxTileX: 59, minTileY: 0, maxTileY: 59 },
      1000
    );

    expect(animatedTileCount).toBeGreaterThan(0);
    expect(animatedTileCount).toBeLessThanOrEqual(
      DEFINING_WORLD_PLAZA_WATER_SHIMMER_MAX_ANIMATED_TILES
    );
  });

  it('reuses the cached tile scan for repeated redraws of the same bounds', () => {
    resolvingWaterMock.mockReturnValue({
      kind: DEFINING_WORLD_PLAZA_WATER_KIND_RIVER,
    } as ReturnType<typeof resolvingWorldPlazaWaterAtTileIndex>);

    const bounds = { minTileX: 0, maxTileX: 9, minTileY: 0, maxTileY: 9 };
    const firstCount = drawingWorldPlazaWaterShimmerOnGraphics(
      buildingStubShimmerGraphics(),
      bounds,
      1000
    );
    const resolveCallsAfterFirstDraw = resolvingWaterMock.mock.calls.length;
    const secondCount = drawingWorldPlazaWaterShimmerOnGraphics(
      buildingStubShimmerGraphics(),
      bounds,
      2000
    );

    expect(secondCount).toBe(firstCount);
    expect(resolvingWaterMock.mock.calls.length).toBe(
      resolveCallsAfterFirstDraw
    );
  });

  it('rescans after the tile entry cache is invalidated', () => {
    resolvingWaterMock.mockReturnValue({
      kind: DEFINING_WORLD_PLAZA_WATER_KIND_RIVER,
    } as ReturnType<typeof resolvingWorldPlazaWaterAtTileIndex>);

    const bounds = { minTileX: 0, maxTileX: 9, minTileY: 0, maxTileY: 9 };

    const initialCount = drawingWorldPlazaWaterShimmerOnGraphics(
      buildingStubShimmerGraphics(),
      bounds,
      1000
    );

    expect(initialCount).toBeGreaterThan(0);

    invalidatingWorldPlazaWaterShimmerTileEntryCache();
    resolvingWaterMock.mockReturnValue(null);

    const countAfterWaterRemoved = drawingWorldPlazaWaterShimmerOnGraphics(
      buildingStubShimmerGraphics(),
      bounds,
      2000
    );

    expect(countAfterWaterRemoved).toBe(0);
  });
});
