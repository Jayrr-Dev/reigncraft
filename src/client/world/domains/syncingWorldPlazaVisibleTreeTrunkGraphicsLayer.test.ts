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
});
