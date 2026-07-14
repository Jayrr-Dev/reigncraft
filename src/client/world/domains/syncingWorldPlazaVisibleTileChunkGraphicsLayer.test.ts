import type { CreatingWorldPlazaGrassFloorChunkDrawPassContext } from '@/components/world/domains/creatingWorldPlazaGrassFloorChunkDrawPassContext';
import { drawingWorldPlazaGrassFloorChunkTilesOnGraphics } from '@/components/world/domains/drawingWorldPlazaGrassFloorChunkOnGraphics';
import { syncingWorldPlazaVisibleTileChunkGraphicsLayer } from '@/components/world/domains/syncingWorldPlazaVisibleTileChunkGraphicsLayer';
import { Container, Graphics } from 'pixi.js';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { FAKE_DRAW_PASS_CONTEXT } = vi.hoisted(() => {
  const plainsBiome = {
    kind: 'plains' as const,
    displayName: 'Plains',
    temperature: 0.52,
    altitudeFactor: 0.12,
    tileFillColor: 0x7cba3d,
    blockAccentColor: 0x8b6914,
    blockHighlightColor: 0x91c848,
    speckColor: null,
    speckTileModulus: null,
    flowerColors: [0xffd966, 0xff8fab, 0xffffff],
    flowerTileModulus: 23,
    longGrassTileModulus: null,
    skyBackdropClassName:
      'bg-gradient-to-b from-sky-400 via-sky-200 to-[#7cba3d]',
  };

  const FAKE_DRAW_PASS_CONTEXT: CreatingWorldPlazaGrassFloorChunkDrawPassContext =
    {
      isDaytime: true,
      drawsEnvironmentalHazardFloorTint: false,
      checkingWaterIsFrozenAtTileIndex: () => false,
      resolvingEnvironmentalHazardFloorTintAtTileIndex: () => null,
      resolvingGrassFloorTileFillColorAtTileIndex: () => 0x7cba3d,
      resolvingWaterAtTileIndex: () => null,
      resolvingBiomeAtTileIndex: () => plainsBiome,
      checkingLakeShoreBlockAtTileIndex: () => false,
      checkingOceanShoreBlockAtTileIndex: () => false,
      checkingPondShoreBlockAtTileIndex: () => false,
    };

  return { FAKE_DRAW_PASS_CONTEXT };
});

vi.mock(
  '@/components/world/domains/drawingWorldPlazaGrassFloorChunkOnGraphics',
  () => ({
    drawingWorldPlazaGrassFloorChunkOnGraphics: vi.fn(),
    drawingWorldPlazaGrassFloorChunkTilesOnGraphics: vi.fn(
      ({ startTileOffset = 0, maxTiles = 64, chunkSizeTiles = 8 }) => {
        const tileCount = chunkSizeTiles * chunkSizeTiles;
        const nextTileOffset = Math.min(
          tileCount,
          startTileOffset + Math.max(1, maxTiles)
        );

        return {
          nextTileOffset,
          isComplete: nextTileOffset >= tileCount,
          drawPassContext: FAKE_DRAW_PASS_CONTEXT,
        };
      }
    ),
  })
);

vi.mock(
  '@/components/world/domains/markingWorldPlazaPixiDisplayObjectCullable',
  () => ({
    markingWorldPlazaPixiDisplayObjectCullable: vi.fn(),
  })
);

describe('syncingWorldPlazaVisibleTileChunkGraphicsLayer', () => {
  const bounds = {
    minTileX: 0,
    maxTileX: 15,
    minTileY: 0,
    maxTileY: 15,
  };

  beforeEach(() => {
    vi.mocked(
      drawingWorldPlazaGrassFloorChunkTilesOnGraphics
    ).mockImplementation(
      ({ startTileOffset = 0, maxTiles = 64, chunkSizeTiles = 8 }) => {
        const tileCount = chunkSizeTiles * chunkSizeTiles;
        const nextTileOffset = Math.min(
          tileCount,
          startTileOffset + Math.max(1, maxTiles)
        );

        return {
          nextTileOffset,
          isComplete: nextTileOffset >= tileCount,
          drawPassContext: FAKE_DRAW_PASS_CONTEXT,
        };
      }
    );
  });

  it('keeps pending floor chunks visible while baking', () => {
    const parentContainer = new Container();
    const chunkGraphicsByKey = new Map<string, Graphics>();
    const pendingChunkBuilds = new Map();
    const terrainFrameWorkBudget = {
      startedAtMs: performance.now(),
      deadlineMs: 10_000,
      didExpire: false,
    };

    vi.mocked(
      drawingWorldPlazaGrassFloorChunkTilesOnGraphics
    ).mockImplementation(({ startTileOffset = 0, maxTiles = 4 }) => {
      const nextTileOffset = startTileOffset + Math.max(1, maxTiles);

      if (nextTileOffset >= 16) {
        terrainFrameWorkBudget.didExpire = true;
      }

      return {
        nextTileOffset,
        isComplete: false,
        drawPassContext: FAKE_DRAW_PASS_CONTEXT,
      };
    });

    syncingWorldPlazaVisibleTileChunkGraphicsLayer({
      parentContainer,
      bounds,
      chunkSizeTiles: 8,
      chunkGraphicsByKey,
      pendingChunkBuilds,
      drawOptions: {},
      centerTileX: 4,
      centerTileY: 4,
      maxChunkBuildsPerCall: 1,
      maxChunkPrunesPerCall: 4,
      shouldDeferBuildsOnStaleBacklog: false,
      terrainFrameWorkBudget,
    });

    expect(pendingChunkBuilds.size).toBe(1);
    const pending = [...pendingChunkBuilds.values()][0];
    expect(pending.graphics.visible).toBe(true);
    expect(pending.graphics.parent).toBe(parentContainer);
  });

  it('still builds needed chunks when stale backlog would defer', () => {
    const parentContainer = new Container();
    const chunkGraphicsByKey = new Map<string, Graphics>();
    const pendingChunkBuilds = new Map();

    for (let index = 0; index < 20; index += 1) {
      const farGraphics = new Graphics();
      parentContainer.addChild(farGraphics);
      chunkGraphicsByKey.set(`${100 + index * 8}:100`, farGraphics);
    }

    const result = syncingWorldPlazaVisibleTileChunkGraphicsLayer({
      parentContainer,
      bounds,
      chunkSizeTiles: 8,
      chunkGraphicsByKey,
      pendingChunkBuilds,
      drawOptions: {},
      centerTileX: 4,
      centerTileY: 4,
      maxChunkBuildsPerCall: 2,
      maxChunkPrunesPerCall: 4,
      shouldDeferBuildsOnStaleBacklog: false,
    });

    expect(result.chunksPruned).toBeGreaterThan(0);
    expect(
      [...pendingChunkBuilds.keys()].some((key) => key.startsWith('0:')) ||
        [...chunkGraphicsByKey.keys()].some((key) => key.startsWith('0:'))
    ).toBe(true);
  });

  it('retains chunks just outside the visible bounds instead of pruning them', () => {
    const parentContainer = new Container();
    const chunkGraphicsByKey = new Map<string, Graphics>();
    const retainedGraphics = new Graphics();
    parentContainer.addChild(retainedGraphics);
    chunkGraphicsByKey.set('16:0', retainedGraphics);

    syncingWorldPlazaVisibleTileChunkGraphicsLayer({
      parentContainer,
      bounds,
      chunkSizeTiles: 8,
      chunkGraphicsByKey,
      pendingChunkBuilds: new Map(),
      drawOptions: {},
      centerTileX: 4,
      centerTileY: 4,
      maxChunkBuildsPerCall: 1,
      maxChunkPrunesPerCall: 8,
      shouldDeferBuildsOnStaleBacklog: false,
    });

    expect(chunkGraphicsByKey.has('16:0')).toBe(true);
  });
});
