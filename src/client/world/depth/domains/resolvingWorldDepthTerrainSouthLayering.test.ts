import { resolvingWorldDepthAvatarBodySortKey } from '@/components/world/depth/domains/resolvingWorldDepthAvatarBodySortKey';
import { resolvingWorldPlazaTerrainElevationSurfaceLayerAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaTerrainElevationAtTileIndex';
import { resolvingWorldPlazaTerrainElevationColumnEntityZIndex } from '@/components/world/domains/resolvingWorldPlazaTerrainElevationColumnEntityZIndex';
import { describe, expect, it, vi } from 'vitest';

vi.mock(
  '@/components/world/domains/resolvingWorldPlazaTerrainElevationAtTileIndex',
  () => {
    function resolvingMockTerrainSurfaceLayerAtTileIndex(
      tileX: number,
      tileY: number
    ): number {
      // Plateau: tiles with x+y <= 20 are raised; south of that is ground.
      if (tileX + tileY <= 20) {
        return 6;
      }

      return 1;
    }

    return {
      resolvingWorldPlazaTerrainElevationAtTileIndex: (
        tileX: number,
        tileY: number
      ) => {
        const surfaceLayer = resolvingMockTerrainSurfaceLayerAtTileIndex(
          tileX,
          tileY
        );
        return {
          surfaceLayer,
          tier: surfaceLayer > 1 ? 'hill' : 'flat',
        };
      },
      resolvingWorldPlazaTerrainElevationSurfaceLayerAtTileIndex:
        resolvingMockTerrainSurfaceLayerAtTileIndex,
    };
  }
);

describe('terrain elevation south layering', () => {
  it('keeps avatar above a northern raised plateau when standing on low ground south of it', () => {
    expect(
      resolvingWorldPlazaTerrainElevationSurfaceLayerAtTileIndex(10, 10)
    ).toBe(6);
    expect(
      resolvingWorldPlazaTerrainElevationSurfaceLayerAtTileIndex(10, 11)
    ).toBe(1);

    const plateauZ = resolvingWorldPlazaTerrainElevationColumnEntityZIndex(
      10,
      10
    );
    const bodyZ = resolvingWorldDepthAvatarBodySortKey({
      x: 10.35,
      y: 11.2,
      layer: 1,
    });

    expect(bodyZ).toBeGreaterThan(plateauZ);
  });

  it('keeps avatar above plateau when tucked in a zigzag notch south of the rim', () => {
    const rimA = resolvingWorldPlazaTerrainElevationColumnEntityZIndex(10, 10);
    const rimB = resolvingWorldPlazaTerrainElevationColumnEntityZIndex(11, 9);
    const bodyZ = resolvingWorldDepthAvatarBodySortKey({
      x: 11.15,
      y: 10.35,
      layer: 1,
    });

    expect(bodyZ).toBeGreaterThan(rimA);
    expect(bodyZ).toBeGreaterThan(rimB);
  });

  it('keeps avatar above northern plateau tops even when a SE raised spur is in front', () => {
    // Concave notch: low tile at (11,11), raised spur SE at (12,11) and rim NW.
    const northernRim = resolvingWorldPlazaTerrainElevationColumnEntityZIndex(
      10,
      10
    );
    const bodyZ = resolvingWorldDepthAvatarBodySortKey({
      x: 11.2,
      y: 10.9,
      layer: 1,
    });

    expect(bodyZ).toBeGreaterThan(northernRim);
  });

  it('does not tuck behind same-tile raised terrain at the plateau rim', () => {
    const rimZ = resolvingWorldPlazaTerrainElevationColumnEntityZIndex(10, 10);
    // Foot still on the raised tile near its south edge (common at cliff rims).
    const bodyZ = resolvingWorldDepthAvatarBodySortKey({
      x: 10.4,
      y: 10.85,
      layer: 1,
    });

    expect(bodyZ).toBeGreaterThan(rimZ);
  });

  it('keeps avatar above SW rim cliff face while standing on the plateau', () => {
    // Plateau underfoot layer 6; SW-ish rim at (10, 10) also layer 6 (x+y=20).
    // Declared layer left stale at 1 (pre-sync) — occlusion must still use terrain.
    const rimZ = resolvingWorldPlazaTerrainElevationColumnEntityZIndex(10, 10);
    const bodyZ = resolvingWorldDepthAvatarBodySortKey({
      x: 9.55,
      y: 9.4,
      layer: 1,
    });

    expect(
      resolvingWorldPlazaTerrainElevationSurfaceLayerAtTileIndex(9, 9)
    ).toBe(6);
    expect(
      resolvingWorldPlazaTerrainElevationSurfaceLayerAtTileIndex(10, 10)
    ).toBe(6);
    expect(bodyZ).toBeGreaterThan(rimZ);
  });
});
