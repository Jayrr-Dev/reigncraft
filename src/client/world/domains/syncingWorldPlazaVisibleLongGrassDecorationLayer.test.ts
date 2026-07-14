import { syncingWorldPlazaVisibleLongGrassDecorationLayer } from '@/components/world/domains/syncingWorldPlazaVisibleLongGrassDecorationLayer';
import { Container, Sprite, Texture } from 'pixi.js';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock(
  '@/components/world/domains/checkingWorldPlazaLongGrassDecorationAtTileIndex',
  () => ({
    checkingWorldPlazaLongGrassDecorationAtTileIndex: vi.fn(
      (tileX: number, tileY: number) => tileX === 2 && tileY === 3
    ),
  })
);

vi.mock(
  '@/components/world/domains/loadingWorldPlazaLongGrassSpriteTextures',
  () => ({
    peekingWorldPlazaLongGrassSpriteTextureForUrl: vi.fn(),
  })
);

vi.mock(
  '@/components/world/harvest/domains/registeringWorldPlazaClearedLongGrassLookup',
  () => ({
    checkingWorldPlazaRuntimeLongGrassIsCleared: vi.fn(() => false),
  })
);

vi.mock(
  '@/components/world/domains/resolvingWorldPlazaBurntGrassFloorTileFillColorAtTileIndex',
  () => ({
    checkingWorldPlazaGrassFloorTileIsBurntAtTileIndex: vi.fn(() => false),
  })
);

vi.mock(
  '@/components/world/domains/computingWorldPlazaTerrainElevationScreenOffsetPxAtTileIndex',
  () => ({
    computingWorldPlazaTerrainElevationScreenOffsetPxAtTileIndex: vi.fn(
      () => 0
    ),
  })
);

vi.mock(
  '@/components/world/domains/listingWorldPlazaTileIndicesInBounds',
  () => ({
    listingWorldPlazaTileIndicesInBounds: vi.fn(() => [{ tileX: 2, tileY: 3 }]),
  })
);

import { peekingWorldPlazaLongGrassSpriteTextureForUrl } from '@/components/world/domains/loadingWorldPlazaLongGrassSpriteTextures';

const peekTextureMock = vi.mocked(
  peekingWorldPlazaLongGrassSpriteTextureForUrl
);

function creatingFakeTexture(width: number, height: number): Texture {
  return {
    width,
    height,
  } as Texture;
}

describe('syncingWorldPlazaVisibleLongGrassDecorationLayer', () => {
  beforeEach(() => {
    peekTextureMock.mockReset();
  });

  it('stays incomplete and creates no sprites when textures are missing', () => {
    peekTextureMock.mockReturnValue(null);

    const parentContainer = new Container();
    const spriteByKey = new Map<string, Sprite>();

    const result = syncingWorldPlazaVisibleLongGrassDecorationLayer({
      parentContainer,
      bounds: {
        minTileX: 0,
        maxTileX: 4,
        minTileY: 0,
        maxTileY: 4,
      },
      spriteByKey,
      centerTileX: 2,
      centerTileY: 3,
      shouldSortChildrenImmediately: false,
    });

    expect(result.isComplete).toBe(false);
    expect(result.propsBuilt).toBe(0);
    expect(spriteByKey.size).toBe(0);
    expect(parentContainer.children).toHaveLength(0);
  });

  it('builds a visible sprite once textures are ready', () => {
    peekTextureMock.mockReturnValue(creatingFakeTexture(64, 48));

    const parentContainer = new Container();
    const spriteByKey = new Map<string, Sprite>();

    const result = syncingWorldPlazaVisibleLongGrassDecorationLayer({
      parentContainer,
      bounds: {
        minTileX: 0,
        maxTileX: 4,
        minTileY: 0,
        maxTileY: 4,
      },
      spriteByKey,
      centerTileX: 2,
      centerTileY: 3,
      shouldSortChildrenImmediately: true,
    });

    expect(result.isComplete).toBe(true);
    expect(result.propsBuilt).toBe(1);
    expect(spriteByKey.size).toBe(1);

    const sprite = [...spriteByKey.values()][0];
    expect(sprite?.visible).toBe(true);
    expect(sprite?.texture.width).toBe(64);
    expect(parentContainer.children).toHaveLength(1);
  });
});
