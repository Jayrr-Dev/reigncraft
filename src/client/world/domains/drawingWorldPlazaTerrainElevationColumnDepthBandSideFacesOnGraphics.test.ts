import { DEFINING_WORLD_BUILDING_WORLD_LAYER_HEIGHT_PX } from '@/components/world/building/domains/definingWorldBuildingWorldLayerConstants';
import { DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX } from '@/components/world/domains/definingWorldPlazaIsometricConstants';
import { drawingWorldPlazaTerrainElevationColumnDepthBandSideFacesOnGraphics } from '@/components/world/domains/drawingWorldPlazaTerrainElevationColumnDepthBandSideFacesOnGraphics';
import { Graphics } from 'pixi.js';
import { describe, expect, it } from 'vitest';

describe('drawingWorldPlazaTerrainElevationColumnDepthBandSideFacesOnGraphics', () => {
  it('omits faces hidden by neighbors at the same elevation', () => {
    const graphics = new Graphics();

    drawingWorldPlazaTerrainElevationColumnDepthBandSideFacesOnGraphics({
      graphics,
      centerX: 0,
      groundCenterY: 0,
      surfaceLayer: 8,
      baseSideFillColor: 0x808080,
      leftFaceNeighborSurfaceLayer: 8,
      rightFaceNeighborSurfaceLayer: 8,
    });

    expect(graphics.context.instructions).toHaveLength(0);
  });

  it('ends an exposed face at the neighboring surface', () => {
    const graphics = new Graphics();
    const surfaceLayer = 8;
    const neighborSurfaceLayer = 5;

    drawingWorldPlazaTerrainElevationColumnDepthBandSideFacesOnGraphics({
      graphics,
      centerX: 0,
      groundCenterY: 0,
      surfaceLayer,
      baseSideFillColor: 0x808080,
      leftFaceNeighborSurfaceLayer: neighborSurfaceLayer,
      rightFaceNeighborSurfaceLayer: surfaceLayer,
    });

    expect(graphics.context.instructions).toHaveLength(1);
    expect(graphics.context.bounds.maxY).toBe(
      -(neighborSurfaceLayer - 1) *
        DEFINING_WORLD_BUILDING_WORLD_LAYER_HEIGHT_PX +
        DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX
    );
  });
});
