import { DEFINING_WORLD_PLAZA_WATER_SHIMMER_MAX_ANIMATED_TILES } from '@/components/world/domains/definingWorldPlazaWaterConstants';
import { DEFINING_WORLD_PLAZA_WATER_KIND_RIVER } from '@/components/world/domains/definingWorldPlazaWaterKind';
import {
  drawingWorldPlazaWaterShimmerOnGraphics,
  invalidatingWorldPlazaWaterShimmerTileEntryCache,
} from '@/components/world/domains/drawingWorldPlazaWaterShimmerOnGraphics';
import { resolvingWorldPlazaWaterAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaWaterAtTileIndex';
import { Graphics } from 'pixi.js';
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

const resolvingWaterMock = vi.mocked(resolvingWorldPlazaWaterAtTileIndex);
const TEST_VIEWPORT = {
  cameraOffset: { x: 5000, y: 5000 },
  widthPx: 10000,
  heightPx: 10000,
  worldZoom: 1,
} as const;

/** Makes every tile a river so entry collection depends only on seeds. */
function mockingRiverEverywhere(): void {
  resolvingWaterMock.mockImplementation((tileX, tileY) => ({
    tileX,
    tileY,
    kind: DEFINING_WORLD_PLAZA_WATER_KIND_RIVER,
  }));
}

describe('drawingWorldPlazaWaterShimmerOnGraphics', () => {
  beforeEach(() => {
    invalidatingWorldPlazaWaterShimmerTileEntryCache();
    resolvingWaterMock.mockReset();
  });

  it('caps animated tiles at the shimmer budget on dense water', () => {
    mockingRiverEverywhere();

    const { animatedRiverTileCount, animatedTileCount } =
      drawingWorldPlazaWaterShimmerOnGraphics(
        new Graphics(),
        { minTileX: 0, maxTileX: 59, minTileY: 0, maxTileY: 59 },
        1000,
        TEST_VIEWPORT
      );

    expect(animatedTileCount).toBeGreaterThan(0);
    expect(animatedRiverTileCount).toBe(animatedTileCount);
    expect(animatedTileCount).toBeLessThanOrEqual(
      DEFINING_WORLD_PLAZA_WATER_SHIMMER_MAX_ANIMATED_TILES
    );
  });

  it('honors a smaller performance-tier shimmer budget', () => {
    mockingRiverEverywhere();

    const stats = drawingWorldPlazaWaterShimmerOnGraphics(
      new Graphics(),
      { minTileX: 0, maxTileX: 59, minTileY: 0, maxTileY: 59 },
      1000,
      TEST_VIEWPORT,
      40
    );

    expect(stats.animatedTileCount).toBeGreaterThan(0);
    expect(stats.animatedTileCount).toBeLessThanOrEqual(40);
  });

  it('reuses the cached tile scan for repeated redraws of the same bounds', () => {
    mockingRiverEverywhere();

    const bounds = { minTileX: 0, maxTileX: 9, minTileY: 0, maxTileY: 9 };
    const firstCount = drawingWorldPlazaWaterShimmerOnGraphics(
      new Graphics(),
      bounds,
      1000,
      TEST_VIEWPORT
    );
    const resolveCallsAfterFirstDraw = resolvingWaterMock.mock.calls.length;
    const secondCount = drawingWorldPlazaWaterShimmerOnGraphics(
      new Graphics(),
      bounds,
      2000,
      TEST_VIEWPORT
    );

    expect(secondCount).toEqual(firstCount);
    expect(resolvingWaterMock.mock.calls.length).toBe(
      resolveCallsAfterFirstDraw
    );
  });

  it('rescans after the tile entry cache is invalidated', () => {
    mockingRiverEverywhere();

    const bounds = { minTileX: 0, maxTileX: 9, minTileY: 0, maxTileY: 9 };
    const initialCount = drawingWorldPlazaWaterShimmerOnGraphics(
      new Graphics(),
      bounds,
      1000,
      TEST_VIEWPORT
    );

    expect(initialCount.animatedTileCount).toBeGreaterThan(0);

    invalidatingWorldPlazaWaterShimmerTileEntryCache();
    resolvingWaterMock.mockImplementation(() => null);

    const countAfterWaterRemoved = drawingWorldPlazaWaterShimmerOnGraphics(
      new Graphics(),
      bounds,
      2000,
      TEST_VIEWPORT
    );

    expect(countAfterWaterRemoved).toEqual({
      animatedTileCount: 0,
      animatedRiverTileCount: 0,
    });
  });

  it('does not animate cached water tiles outside the live camera screen', () => {
    mockingRiverEverywhere();

    const stats = drawingWorldPlazaWaterShimmerOnGraphics(
      new Graphics(),
      { minTileX: 0, maxTileX: 9, minTileY: 0, maxTileY: 9 },
      1000,
      {
        cameraOffset: { x: -10000, y: -10000 },
        widthPx: 800,
        heightPx: 600,
        worldZoom: 1,
      }
    );

    expect(stats).toEqual({
      animatedTileCount: 0,
      animatedRiverTileCount: 0,
    });
  });
});
