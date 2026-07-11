import type { BuildingWorldPlazaVisibleTreeDrawEntry } from '@/components/world/domains/buildingWorldPlazaVisibleTreeDrawEntries';
import { syncingWorldPlazaVisibleTreeGroundShadowGraphicsLayer } from '@/components/world/domains/syncingWorldPlazaVisibleTreeGroundShadowGraphicsLayer';
import { Container, Graphics } from 'pixi.js';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/components/world/domains/drawingWorldPlazaTreeOnGraphics', () => ({
  drawingWorldPlazaTreeGroundShadowOnGraphicsAtScreenPoint: vi.fn(),
}));

describe('syncingWorldPlazaVisibleTreeGroundShadowGraphicsLayer', () => {
  it('spreads severe stale-shadow pruning across calls', () => {
    const parentContainer = new Container();
    const shadowGraphicsByKey = new Map<string, Graphics>();

    for (let index = 0; index < 60; index += 1) {
      const graphics = new Graphics();
      parentContainer.addChild(graphics);
      shadowGraphicsByKey.set(`stale:${index}`, graphics);
    }

    const drawEntries = [
      {
        tree: {
          tileX: 0,
          tileY: 0,
          variant: 'oak',
          trunkColor: 0x5b3a29,
          canopyColors: [0x2f6b3b, 0x24552f, 0x4b8a4c],
          scale: 1,
          collisionRadiusGrid: 0.4,
          offsetXPx: 0,
          offsetYPx: 0,
          seed: 1,
        },
        baseScreenX: 0,
        baseScreenY: 0,
        elevationOffsetYPx: 0,
      },
    ] satisfies readonly BuildingWorldPlazaVisibleTreeDrawEntry[];

    const result = syncingWorldPlazaVisibleTreeGroundShadowGraphicsLayer({
      parentContainer,
      bounds: {
        minTileX: 0,
        maxTileX: 8,
        minTileY: 0,
        maxTileY: 8,
      },
      shadowGraphicsByKey,
      drawEntries,
      centerTileX: 0,
      centerTileY: 0,
      maxTreeBuildsPerCall: 2,
      maxTreePrunesPerCall: 2,
      shouldSortChildrenImmediately: false,
    });

    expect(result.isComplete).toBe(false);
    expect(result.treesBuilt).toBe(0);
    expect(shadowGraphicsByKey.size).toBeGreaterThan(0);
    expect(shadowGraphicsByKey.size).toBeLessThan(60);
  });
});
