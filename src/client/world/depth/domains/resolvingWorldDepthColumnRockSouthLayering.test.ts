import { resolvingWorldDepthAvatarBodySortKey } from '@/components/world/depth/domains/resolvingWorldDepthAvatarBodySortKey';
import type { DefiningWorldPlazaColumnRockMetadata } from '@/components/world/domains/resolvingWorldPlazaColumnRockMetadataAtAnchorTileIndex';
import { resolvingWorldPlazaTerrainRockColumnEntityZIndex } from '@/components/world/domains/resolvingWorldPlazaTerrainRockColumnEntityZIndex';
import { describe, expect, it, vi } from 'vitest';

const MOCK_FIELD_BOULDER: DefiningWorldPlazaColumnRockMetadata = {
  anchorTileX: 20,
  anchorTileY: 20,
  footprintTileWidth: 1,
  footprintTileHeight: 1,
  sizeTierIndex: 3,
  surfaceWorldLayer: 4,
  shapeVariantIndex: 0,
  bodyHalfWidthPx: 18,
  bodyHalfHeightPx: 22,
  bodyColor: 0x6b5b4a,
  highlightColor: 0x8a7a68,
};

vi.mock(
  '@/components/world/domains/resolvingWorldPlazaColumnRockMetadataAtTileIndex',
  () => ({
    resolvingWorldPlazaColumnRockMetadataAtTileIndex: (
      tileX: number,
      tileY: number
    ) => {
      if (tileX === 20 && tileY === 20) {
        return MOCK_FIELD_BOULDER;
      }

      return null;
    },
  })
);

vi.mock(
  '@/components/world/domains/definingWorldPlazaTerrainRockConstants',
  async (importOriginal) => {
    const actual =
      await importOriginal<
        typeof import('@/components/world/domains/definingWorldPlazaTerrainRockConstants')
      >();

    return {
      ...actual,
      checkingWorldPlazaStoneDecorationUsesColumnRockRendering: () => true,
    };
  }
);

describe('column rock south layering', () => {
  it('draws avatar in front of a 1-tile boulder when standing south on the same tile', () => {
    const rockZ = resolvingWorldPlazaTerrainRockColumnEntityZIndex(
      20,
      20,
      MOCK_FIELD_BOULDER
    );
    const bodyZ = resolvingWorldDepthAvatarBodySortKey({
      x: 20.35,
      y: 20.4,
      layer: 1,
    });

    expect(bodyZ).toBeGreaterThan(rockZ);
  });

  it('still tucks avatar behind a boulder when standing north of its sort foot', () => {
    const rockZ = resolvingWorldPlazaTerrainRockColumnEntityZIndex(
      20,
      20,
      MOCK_FIELD_BOULDER
    );
    const bodyZ = resolvingWorldDepthAvatarBodySortKey({
      x: 19.4,
      y: 19.4,
      layer: 1,
    });

    expect(bodyZ).toBeLessThan(rockZ);
  });
});
