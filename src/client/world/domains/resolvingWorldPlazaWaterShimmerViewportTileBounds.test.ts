import { resolvingWorldPlazaVisibleIsometricTileBounds } from '@/components/world/domains/resolvingWorldPlazaVisibleIsometricTileBounds';
import { resolvingWorldPlazaWaterShimmerViewportTileBounds } from '@/components/world/domains/resolvingWorldPlazaWaterShimmerViewportTileBounds';
import { resolvingWorldPlazaWaterViewportTileBounds } from '@/components/world/domains/resolvingWorldPlazaWaterViewportTileBounds';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaWaterShimmerViewportTileBounds', () => {
  it('returns a window no larger than the floor bounds', () => {
    const floorBounds = {
      minTileX: -60,
      maxTileX: 60,
      minTileY: -60,
      maxTileY: 60,
    };

    const shimmerBounds = resolvingWorldPlazaWaterShimmerViewportTileBounds({
      playerGridX: 0,
      playerGridY: 0,
      viewportWidthPx: 1280,
      viewportHeightPx: 720,
      worldZoom: 1,
      floorBounds,
    });

    expect(shimmerBounds.minTileX).toBeGreaterThanOrEqual(floorBounds.minTileX);
    expect(shimmerBounds.maxTileX).toBeLessThanOrEqual(floorBounds.maxTileX);
    expect(shimmerBounds.minTileY).toBeGreaterThanOrEqual(floorBounds.minTileY);
    expect(shimmerBounds.maxTileY).toBeLessThanOrEqual(floorBounds.maxTileY);
  });

  it('shrinks below floor bounds that include large prefetch rings', () => {
    const viewportBounds = resolvingWorldPlazaVisibleIsometricTileBounds(
      0,
      0,
      1280,
      720,
      0,
      1,
      1
    );
    const floorBounds = {
      minTileX: viewportBounds.minTileX - 30,
      maxTileX: viewportBounds.maxTileX + 30,
      minTileY: viewportBounds.minTileY - 30,
      maxTileY: viewportBounds.maxTileY + 30,
    };

    const shimmerBounds = resolvingWorldPlazaWaterShimmerViewportTileBounds({
      playerGridX: 0,
      playerGridY: 0,
      viewportWidthPx: 1280,
      viewportHeightPx: 720,
      worldZoom: 1,
      floorBounds,
    });

    const shimmerTileSpanX = shimmerBounds.maxTileX - shimmerBounds.minTileX;
    const floorTileSpanX = floorBounds.maxTileX - floorBounds.minTileX;

    expect(shimmerTileSpanX).toBeLessThan(floorTileSpanX);
  });

  it('never exceeds tight floor bounds around the player', () => {
    const floorBounds = {
      minTileX: -4,
      maxTileX: 4,
      minTileY: -4,
      maxTileY: 4,
    };

    const shimmerBounds = resolvingWorldPlazaWaterShimmerViewportTileBounds({
      playerGridX: 0,
      playerGridY: 0,
      viewportWidthPx: 1920,
      viewportHeightPx: 1080,
      worldZoom: 1,
      floorBounds,
    });

    expect(shimmerBounds).toEqual(floorBounds);
  });

  it('keeps surface coverage through one unsynced bounds-snap cell', () => {
    const floorBounds = {
      minTileX: -100,
      maxTileX: 100,
      minTileY: -100,
      maxTileY: 100,
    };
    const snapTiles = 12;
    const surfaceBounds = resolvingWorldPlazaWaterViewportTileBounds({
      playerGridX: 0,
      playerGridY: 0,
      viewportWidthPx: 1280,
      viewportHeightPx: 720,
      worldZoom: 1,
      viewportPaddingTiles: snapTiles + 3,
      floorBounds,
    });
    const movedViewportBounds = resolvingWorldPlazaVisibleIsometricTileBounds(
      snapTiles - 0.01,
      snapTiles - 0.01,
      1280,
      720,
      0,
      1,
      1
    );

    expect(surfaceBounds.minTileX).toBeLessThanOrEqual(
      movedViewportBounds.minTileX
    );
    expect(surfaceBounds.maxTileX).toBeGreaterThanOrEqual(
      movedViewportBounds.maxTileX
    );
    expect(surfaceBounds.minTileY).toBeLessThanOrEqual(
      movedViewportBounds.minTileY
    );
    expect(surfaceBounds.maxTileY).toBeGreaterThanOrEqual(
      movedViewportBounds.maxTileY
    );
  });
});
