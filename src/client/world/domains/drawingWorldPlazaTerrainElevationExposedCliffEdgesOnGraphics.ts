import { checkingWorldPlazaTerrainElevationCardinalNeighborSurfaceConnectsAtTileIndex } from "@/components/world/domains/checkingWorldPlazaTerrainElevationCardinalNeighborSurfaceConnectsAtTileIndex";
import {
  drawingWorldPlazaExposedIsometricCapTopEdgesOnGraphics,
  type DrawingWorldPlazaExposedIsometricCapTopEdgesParams,
} from "@/components/world/domains/drawingWorldPlazaExposedIsometricCapTopEdgesOnGraphics";

/**
 * Draws thin black outlines on terrain edges that drop to lower neighbors.
 *
 * @module components/world/domains/drawingWorldPlazaTerrainElevationExposedCliffEdgesOnGraphics
 */

/** Input for exposed cliff edge drawing. */
export interface DrawingWorldPlazaTerrainElevationExposedCliffEdgesParams {
  readonly graphics: DrawingWorldPlazaExposedIsometricCapTopEdgesParams["graphics"];
  readonly tileX: number;
  readonly tileY: number;
  readonly centerX: number;
  readonly groundCenterY: number;
  readonly surfaceLayer: number;
}

/**
 * Outlines terrain cap rims and cliff faces where neighboring tiles are lower.
 *
 * @param params - Tile indices, screen center, and surface layer.
 */
export function drawingWorldPlazaTerrainElevationExposedCliffEdgesOnGraphics(
  params: DrawingWorldPlazaTerrainElevationExposedCliffEdgesParams,
): void {
  drawingWorldPlazaExposedIsometricCapTopEdgesOnGraphics({
    ...params,
    checkingCardinalNeighborSurfaceConnectsAtTileIndex:
      checkingWorldPlazaTerrainElevationCardinalNeighborSurfaceConnectsAtTileIndex,
    drawsVerticalCornerEdges: true,
  });
}
