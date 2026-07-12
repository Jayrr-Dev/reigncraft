import {
  invalidatingWorldPlazaVisibleTerrainElevationTileColumnSyncState,
  syncingWorldPlazaVisibleTerrainElevationTileColumnGraphicsLayer,
} from '@/components/world/domains/syncingWorldPlazaVisibleTerrainElevationTileColumnGraphicsLayer';
import { Container, Graphics } from 'pixi.js';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock(
  '@/components/world/domains/resolvingWorldPlazaSurfaceLayerAtTileIndex',
  () => ({
    checkingWorldPlazaTerrainElevationHasRaisedSurfaceAtTileIndex: vi.fn(
      (tileX: number, tileY: number) => tileY === 0 && tileX >= 0 && tileX < 20
    ),
  })
);

vi.mock(
  '@/components/world/domains/checkingWorldPlazaTerrainElevationTileIsCliffEdgeAtTileIndex',
  () => ({
    checkingWorldPlazaTerrainElevationTileIsCliffEdgeAtTileIndex: vi.fn(
      () => true
    ),
  })
);

vi.mock('@/components/world/domains/checkingWorldPlazaLavaAtTileIndex', () => ({
  checkingWorldPlazaLavaAtTileIndex: vi.fn(() => false),
}));

vi.mock(
  '@/components/world/domains/checkingWorldPlazaTileIsWithinColumnRockFootprintAtTileIndex',
  () => ({
    checkingWorldPlazaTileIsWithinColumnRockFootprintAtTileIndex: vi.fn(
      () => false
    ),
  })
);

vi.mock(
  '@/components/world/domains/drawingWorldPlazaTerrainElevationColumnOnGraphics',
  () => ({
    drawingWorldPlazaTerrainElevationColumnOnGraphics: vi.fn(),
  })
);

vi.mock(
  '@/components/world/domains/resolvingWorldPlazaTerrainElevationColumnEntityZIndex',
  () => ({
    resolvingWorldPlazaTerrainElevationColumnRenderEntityZIndex: vi.fn(
      () => 100
    ),
  })
);

vi.mock(
  '@/components/world/domains/markingWorldPlazaPixiDisplayObjectCullable',
  () => ({
    markingWorldPlazaPixiDisplayObjectCullable: vi.fn(),
  })
);

vi.mock(
  '@/components/world/domains/measuringWorldPlazaPerformanceDiagnostics',
  () => ({
    beginningWorldPlazaPerformanceSample: vi.fn(() => vi.fn()),
  })
);

describe('syncingWorldPlazaVisibleTerrainElevationTileColumnGraphicsLayer', () => {
  beforeEach(() => {
    invalidatingWorldPlazaVisibleTerrainElevationTileColumnSyncState();
  });

  it('caps attached columns to nearest maxVisibleElevationColumns', () => {
    const parentContainer = new Container();
    const columnGraphicsByKey = new Map<string, Graphics>();
    const bounds = {
      minTileX: 0,
      maxTileX: 19,
      minTileY: 0,
      maxTileY: 0,
    };

    const firstPass =
      syncingWorldPlazaVisibleTerrainElevationTileColumnGraphicsLayer({
        parentContainer,
        bounds,
        columnGraphicsByKey,
        centerTileX: 0,
        centerTileY: 0,
        maxVisibleElevationColumns: 5,
        maxColumnBuildsPerCall: 5,
        shouldSortChildrenImmediately: false,
      });

    expect(firstPass.columnsBuilt).toBe(5);
    expect(columnGraphicsByKey.size).toBe(5);
    expect(parentContainer.children.length).toBe(5);
    expect(columnGraphicsByKey.has('0:0')).toBe(true);
    expect(columnGraphicsByKey.has('4:0')).toBe(true);
    expect(columnGraphicsByKey.has('5:0')).toBe(false);
  });

  it('spreads builds across calls then reports complete', () => {
    const parentContainer = new Container();
    const columnGraphicsByKey = new Map<string, Graphics>();
    const bounds = {
      minTileX: 0,
      maxTileX: 19,
      minTileY: 0,
      maxTileY: 0,
    };

    const firstPass =
      syncingWorldPlazaVisibleTerrainElevationTileColumnGraphicsLayer({
        parentContainer,
        bounds,
        columnGraphicsByKey,
        centerTileX: 0,
        centerTileY: 0,
        maxVisibleElevationColumns: 5,
        maxColumnBuildsPerCall: 2,
        shouldSortChildrenImmediately: false,
      });

    expect(firstPass.columnsBuilt).toBe(2);
    expect(firstPass.isComplete).toBe(false);

    const secondPass =
      syncingWorldPlazaVisibleTerrainElevationTileColumnGraphicsLayer({
        parentContainer,
        bounds,
        columnGraphicsByKey,
        centerTileX: 0,
        centerTileY: 0,
        maxVisibleElevationColumns: 5,
        maxColumnBuildsPerCall: 2,
        shouldSortChildrenImmediately: false,
      });

    expect(secondPass.columnsBuilt).toBe(2);
    expect(columnGraphicsByKey.size).toBe(4);

    const thirdPass =
      syncingWorldPlazaVisibleTerrainElevationTileColumnGraphicsLayer({
        parentContainer,
        bounds,
        columnGraphicsByKey,
        centerTileX: 0,
        centerTileY: 0,
        maxVisibleElevationColumns: 5,
        maxColumnBuildsPerCall: 2,
        shouldSortChildrenImmediately: false,
      });

    expect(thirdPass.columnsBuilt).toBe(1);
    expect(thirdPass.isComplete).toBe(true);
    expect(columnGraphicsByKey.size).toBe(5);
  });

  it('keeps only nearest columns parented when the player center moves', () => {
    const parentContainer = new Container();
    const columnGraphicsByKey = new Map<string, Graphics>();
    const bounds = {
      minTileX: 0,
      maxTileX: 19,
      minTileY: 0,
      maxTileY: 0,
    };

    syncingWorldPlazaVisibleTerrainElevationTileColumnGraphicsLayer({
      parentContainer,
      bounds,
      columnGraphicsByKey,
      centerTileX: 0,
      centerTileY: 0,
      maxVisibleElevationColumns: 3,
      maxColumnBuildsPerCall: 3,
      maxColumnPrunesPerCall: 20,
      shouldSortChildrenImmediately: false,
    });

    expect(columnGraphicsByKey.has('0:0')).toBe(true);
    expect(parentContainer.children.length).toBe(3);

    syncingWorldPlazaVisibleTerrainElevationTileColumnGraphicsLayer({
      parentContainer,
      bounds,
      columnGraphicsByKey,
      centerTileX: 10,
      centerTileY: 0,
      maxVisibleElevationColumns: 3,
      maxColumnBuildsPerCall: 3,
      maxColumnPrunesPerCall: 20,
      shouldSortChildrenImmediately: false,
    });

    expect(columnGraphicsByKey.has('10:0')).toBe(true);
    expect(parentContainer.children.length).toBe(3);

    const farColumn = columnGraphicsByKey.get('0:0');

    if (farColumn) {
      expect(farColumn.parent).toBeNull();
    }
  });
});
