import { drawingWorldPlazaGrassFloorChunkOnGraphics } from '@/components/world/domains/drawingWorldPlazaGrassFloorChunkOnGraphics';
import { formattingWorldPlazaTileChunkCacheKey } from '@/components/world/domains/formattingWorldPlazaTileChunkCacheKey';
import { refreshingWorldPlazaFloorChunkGraphicsForTileIndices } from '@/components/world/domains/refreshingWorldPlazaFloorChunkGraphicsForTileIndices';
import type { SyncingWorldPlazaVisibleTileChunkPendingBuild } from '@/components/world/domains/syncingWorldPlazaVisibleTileChunkGraphicsLayer';
import { Container, Graphics } from 'pixi.js';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock(
  '@/components/world/domains/drawingWorldPlazaGrassFloorChunkOnGraphics',
  () => ({
    drawingWorldPlazaGrassFloorChunkOnGraphics: vi.fn(),
  })
);

vi.mock(
  '@/components/world/domains/markingWorldPlazaPixiDisplayObjectCullable',
  () => ({
    markingWorldPlazaPixiDisplayObjectCullable: vi.fn(),
  })
);

describe('refreshingWorldPlazaFloorChunkGraphicsForTileIndices', () => {
  const drawOptions = {
    drawsGrassDecorations: true,
    drawsStoneDecorations: true,
  };

  beforeEach(() => {
    vi.mocked(drawingWorldPlazaGrassFloorChunkOnGraphics).mockClear();
  });

  it('promotes a pending chunk bake and redraws instead of wiping the floor', () => {
    const parentContainer = new Container();
    const chunkGraphicsByKey = new Map<string, Graphics>();
    const pendingChunkBuilds = new Map<
      string,
      SyncingWorldPlazaVisibleTileChunkPendingBuild
    >();
    const pendingGraphics = new Graphics();
    parentContainer.addChild(pendingGraphics);

    const cacheKey = formattingWorldPlazaTileChunkCacheKey(0, 0);
    pendingChunkBuilds.set(cacheKey, {
      graphics: pendingGraphics,
      chunkOriginTileX: 0,
      chunkOriginTileY: 0,
      nextTileOffset: 8,
      drawPhase: 'fill',
      drawPassContext: null,
    });

    const refreshedChunkCount =
      refreshingWorldPlazaFloorChunkGraphicsForTileIndices({
        parentContainer,
        chunkSizeTiles: 8,
        chunkGraphicsByKey,
        pendingChunkBuilds,
        tileIndices: [{ tileX: 3, tileY: 4 }],
        drawOptions,
      });

    expect(refreshedChunkCount).toBe(1);
    expect(pendingChunkBuilds.has(cacheKey)).toBe(false);
    expect(chunkGraphicsByKey.get(cacheKey)).toBe(pendingGraphics);
    expect(parentContainer.children).toContain(pendingGraphics);
    expect(drawingWorldPlazaGrassFloorChunkOnGraphics).toHaveBeenCalledTimes(1);
    expect(drawingWorldPlazaGrassFloorChunkOnGraphics).toHaveBeenCalledWith(
      expect.objectContaining({
        graphics: pendingGraphics,
        chunkOriginTileX: 0,
        chunkOriginTileY: 0,
        chunkSizeTiles: 8,
        drawOptions,
      })
    );
  });

  it('creates and draws a missing finished chunk when neither cache has it', () => {
    const parentContainer = new Container();
    const chunkGraphicsByKey = new Map<string, Graphics>();

    const refreshedChunkCount =
      refreshingWorldPlazaFloorChunkGraphicsForTileIndices({
        parentContainer,
        chunkSizeTiles: 8,
        chunkGraphicsByKey,
        tileIndices: [{ tileX: 1, tileY: 1 }],
        drawOptions,
      });

    const cacheKey = formattingWorldPlazaTileChunkCacheKey(0, 0);
    const createdGraphics = chunkGraphicsByKey.get(cacheKey);

    expect(refreshedChunkCount).toBe(1);
    expect(createdGraphics).toBeInstanceOf(Graphics);
    expect(parentContainer.children).toContain(createdGraphics);
    expect(drawingWorldPlazaGrassFloorChunkOnGraphics).toHaveBeenCalledTimes(1);
  });

  it('redraws an existing finished chunk in place', () => {
    const parentContainer = new Container();
    const chunkGraphicsByKey = new Map<string, Graphics>();
    const existingGraphics = new Graphics();
    parentContainer.addChild(existingGraphics);

    const cacheKey = formattingWorldPlazaTileChunkCacheKey(0, 0);
    chunkGraphicsByKey.set(cacheKey, existingGraphics);

    const refreshedChunkCount =
      refreshingWorldPlazaFloorChunkGraphicsForTileIndices({
        parentContainer,
        chunkSizeTiles: 8,
        chunkGraphicsByKey,
        tileIndices: [{ tileX: 0, tileY: 0 }],
        drawOptions,
      });

    expect(refreshedChunkCount).toBe(1);
    expect(chunkGraphicsByKey.get(cacheKey)).toBe(existingGraphics);
    expect(drawingWorldPlazaGrassFloorChunkOnGraphics).toHaveBeenCalledWith(
      expect.objectContaining({ graphics: existingGraphics })
    );
  });
});
