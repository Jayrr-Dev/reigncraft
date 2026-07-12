import { checkingWorldPlazaWaterShimmerTileVisibleInViewport } from '@/components/world/domains/checkingWorldPlazaWaterShimmerTileVisibleInViewport';
import { describe, expect, it } from 'vitest';

const VIEWPORT = {
  cameraOffset: { x: 400, y: 300 },
  widthPx: 800,
  heightPx: 600,
  worldZoom: 1,
} as const;

describe('checkingWorldPlazaWaterShimmerTileVisibleInViewport', () => {
  it('includes a tile centered on screen', () => {
    expect(
      checkingWorldPlazaWaterShimmerTileVisibleInViewport(0, 0, VIEWPORT)
    ).toBe(true);
  });

  it('excludes a tile fully beyond the screen edge', () => {
    expect(
      checkingWorldPlazaWaterShimmerTileVisibleInViewport(1000, 0, VIEWPORT)
    ).toBe(false);
  });

  it('includes a tile whose diamond overlaps the screen edge', () => {
    expect(
      checkingWorldPlazaWaterShimmerTileVisibleInViewport(-32, 0, {
        cameraOffset: { x: 0, y: 300 },
        widthPx: 800,
        heightPx: 600,
        worldZoom: 1,
      })
    ).toBe(true);
  });

  it('applies live camera zoom and offset', () => {
    expect(
      checkingWorldPlazaWaterShimmerTileVisibleInViewport(500, 0, {
        cameraOffset: { x: -900, y: 300 },
        widthPx: 200,
        heightPx: 600,
        worldZoom: 2,
      })
    ).toBe(true);
  });
});
