import type { BuildingWorldPlazaVisibleTreeDrawEntry } from '@/components/world/domains/buildingWorldPlazaVisibleTreeDrawEntries';
import { syncingWorldPlazaVisibleTreeTrunkGraphicsLayer } from '@/components/world/domains/syncingWorldPlazaVisibleTreeTrunkGraphicsLayer';
import { Container, Graphics } from 'pixi.js';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock(
  '@/components/world/domains/buildingWorldPlazaVisibleTreeDrawEntries',
  () => ({
    buildingWorldPlazaVisibleTreeDrawEntries: vi.fn(),
  })
);

vi.mock('@/components/world/domains/drawingWorldPlazaTreeOnGraphics', () => ({
  drawingWorldPlazaTreeTrunkOnGraphicsAtScreenPoint: vi.fn(),
}));

import { buildingWorldPlazaVisibleTreeDrawEntries } from '@/components/world/domains/buildingWorldPlazaVisibleTreeDrawEntries';

describe('syncingWorldPlazaVisibleTreeTrunkGraphicsLayer', () => {
  beforeEach(() => {
    vi.mocked(buildingWorldPlazaVisibleTreeDrawEntries).mockReset();
  });

  it('reuses supplied draw entries without scanning tree bounds again', () => {
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

    const result = syncingWorldPlazaVisibleTreeTrunkGraphicsLayer({
      parentContainer: new Container(),
      bounds: {
        minTileX: 0,
        maxTileX: 8,
        minTileY: 0,
        maxTileY: 8,
      },
      trunkGraphicsByKey: new Map(),
      drawEntries,
      maxTreeBuildsPerCall: 1,
    });

    expect(result.treesBuilt).toBe(1);
    expect(buildingWorldPlazaVisibleTreeDrawEntries).not.toHaveBeenCalled();
  });

  it('spreads missing trunk builds across calls when budgeted', () => {
    const drawEntries = Array.from({ length: 5 }, (_, index) => ({
      tree: {
        tileX: index,
        tileY: 0,
        speciesId: 'oak',
        variantIndex: 0,
      },
      baseScreenX: index * 10,
      baseScreenY: 0,
      elevationOffsetYPx: 0,
    }));
    vi.mocked(buildingWorldPlazaVisibleTreeDrawEntries).mockReturnValue(
      drawEntries as never
    );

    const parentContainer = new Container();
    const trunkGraphicsByKey = new Map<string, Graphics>();
    const bounds = {
      minTileX: 0,
      maxTileX: 8,
      minTileY: 0,
      maxTileY: 8,
    };

    const firstPass = syncingWorldPlazaVisibleTreeTrunkGraphicsLayer({
      parentContainer,
      bounds,
      trunkGraphicsByKey,
      centerTileX: 0,
      centerTileY: 0,
      maxTreeBuildsPerCall: 2,
      shouldSortChildrenImmediately: false,
    });

    expect(firstPass.treesBuilt).toBe(2);
    expect(firstPass.isComplete).toBe(false);
    expect(trunkGraphicsByKey.size).toBe(2);

    const secondPass = syncingWorldPlazaVisibleTreeTrunkGraphicsLayer({
      parentContainer,
      bounds,
      trunkGraphicsByKey,
      centerTileX: 0,
      centerTileY: 0,
      maxTreeBuildsPerCall: 2,
      shouldSortChildrenImmediately: false,
    });

    expect(secondPass.treesBuilt).toBe(2);
    expect(secondPass.isComplete).toBe(false);
    expect(trunkGraphicsByKey.size).toBe(4);

    const thirdPass = syncingWorldPlazaVisibleTreeTrunkGraphicsLayer({
      parentContainer,
      bounds,
      trunkGraphicsByKey,
      centerTileX: 0,
      centerTileY: 0,
      maxTreeBuildsPerCall: 2,
      shouldSortChildrenImmediately: false,
    });

    expect(thirdPass.treesBuilt).toBe(1);
    expect(thirdPass.isComplete).toBe(true);
    expect(trunkGraphicsByKey.size).toBe(5);
  });

  it('prunes stale trunks before builds and defers builds on severe backlog', () => {
    const neededEntries = Array.from({ length: 2 }, (_, index) => ({
      tree: {
        tileX: index,
        tileY: 0,
        speciesId: 'oak',
        variantIndex: 0,
      },
      baseScreenX: index * 10,
      baseScreenY: 0,
      elevationOffsetYPx: 0,
    }));
    vi.mocked(buildingWorldPlazaVisibleTreeDrawEntries).mockReturnValue(
      neededEntries as never
    );

    const parentContainer = new Container();
    const trunkGraphicsByKey = new Map<string, Graphics>();
    const bounds = {
      minTileX: 0,
      maxTileX: 8,
      minTileY: 0,
      maxTileY: 8,
    };

    for (let index = 0; index < 20; index += 1) {
      const graphics = new Graphics();
      parentContainer.addChild(graphics);
      trunkGraphicsByKey.set(`stale:${index}`, graphics);
    }

    const result = syncingWorldPlazaVisibleTreeTrunkGraphicsLayer({
      parentContainer,
      bounds,
      trunkGraphicsByKey,
      centerTileX: 0,
      centerTileY: 0,
      maxTreeBuildsPerCall: 2,
      maxTreePrunesPerCall: 4,
      shouldSortChildrenImmediately: false,
    });

    expect(result.treesBuilt).toBe(0);
    expect(trunkGraphicsByKey.size).toBeLessThan(20);
    expect(
      [...trunkGraphicsByKey.keys()].every((key) => key.startsWith('stale:'))
    ).toBe(true);
  });
});
