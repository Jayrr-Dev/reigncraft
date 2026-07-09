import { DEFINING_WORLD_PLAZA_BIOME_REGION_TILE_SIZE } from '@/components/world/domains/definingWorldPlazaBiomeConstants';
import {
  DEFINING_WORLD_PLAZA_NAMED_REALM_MINI_MAP_BORDER_COLOR,
  DEFINING_WORLD_PLAZA_NAMED_REALM_MINI_MAP_BORDER_LINE_WIDTH_PX,
} from '@/components/world/domains/definingWorldPlazaNamedRealmConstants';
import {
  computingWorldPlazaMiniMapCanvasPointFromGridPoint,
  computingWorldPlazaMiniMapTerrainAlignedHalfExtentsPx,
} from '@/components/world/domains/computingWorldPlazaMiniMapCanvasPointFromGridPoint';
import type { ComputingWorldPlazaMiniMapLayout } from '@/components/world/domains/computingWorldPlazaMiniMapLayout';
import {
  checkingWorldPlazaMiniMapTileOffsetIsInsideSquareViewport,
} from '@/components/world/domains/computingWorldPlazaMiniMapSquareViewportMetrics';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaNamedRealmAtBiomeRegion } from '@/components/world/domains/resolvingWorldPlazaNamedRealmAtTileIndex';

/**
 * Draws thin black named-realm borders on the minimap terrain layer.
 *
 * @module components/world/domains/drawingWorldPlazaMiniMapNamedRealmBordersOnTerrainLayer
 */

/** Input for {@link drawingWorldPlazaMiniMapNamedRealmBordersOnTerrainLayer}. */
export type DrawingWorldPlazaMiniMapNamedRealmBordersOnTerrainLayerInput = {
  readonly context: CanvasRenderingContext2D;
  readonly layout: ComputingWorldPlazaMiniMapLayout;
  readonly terrainCenterPosition: DefiningWorldPlazaWorldPoint;
  readonly centerTileX: number;
  readonly centerTileY: number;
  readonly viewRadiusTiles: number;
  readonly terrainCanvasSizePx: number;
};

function resolvingWorldPlazaNamedRealmIdAtTileIndex(
  tileX: number,
  tileY: number
): string {
  const regionX = Math.floor(tileX / DEFINING_WORLD_PLAZA_BIOME_REGION_TILE_SIZE);
  const regionY = Math.floor(tileY / DEFINING_WORLD_PLAZA_BIOME_REGION_TILE_SIZE);

  return resolvingWorldPlazaNamedRealmAtBiomeRegion(regionX, regionY).realmId;
}

/**
 * Strokes shared diamond edges where adjacent tiles belong to different realms.
 */
export function drawingWorldPlazaMiniMapNamedRealmBordersOnTerrainLayer(
  input: DrawingWorldPlazaMiniMapNamedRealmBordersOnTerrainLayerInput
): void {
  const {
    context,
    layout,
    terrainCenterPosition,
    centerTileX,
    centerTileY,
    viewRadiusTiles,
    terrainCanvasSizePx,
  } = input;
  const canvasCenterPx = terrainCanvasSizePx / 2;
  const viewportHalfSizePx = canvasCenterPx;
  const { halfWidthPx, halfHeightPx } =
    computingWorldPlazaMiniMapTerrainAlignedHalfExtentsPx(layout.pixelsPerTile);

  context.strokeStyle = DEFINING_WORLD_PLAZA_NAMED_REALM_MINI_MAP_BORDER_COLOR;
  context.lineWidth = DEFINING_WORLD_PLAZA_NAMED_REALM_MINI_MAP_BORDER_LINE_WIDTH_PX;
  context.lineJoin = 'round';
  context.lineCap = 'round';
  context.beginPath();

  for (
    let tileOffsetY = -viewRadiusTiles;
    tileOffsetY <= viewRadiusTiles;
    tileOffsetY += 1
  ) {
    for (
      let tileOffsetX = -viewRadiusTiles;
      tileOffsetX <= viewRadiusTiles;
      tileOffsetX += 1
    ) {
      if (
        !checkingWorldPlazaMiniMapTileOffsetIsInsideSquareViewport(
          tileOffsetX,
          tileOffsetY,
          layout,
          viewportHalfSizePx
        )
      ) {
        continue;
      }

      const tileX = centerTileX + tileOffsetX;
      const tileY = centerTileY + tileOffsetY;
      const realmId = resolvingWorldPlazaNamedRealmIdAtTileIndex(tileX, tileY);
      const tileCenter = computingWorldPlazaMiniMapCanvasPointFromGridPoint({
        gridPoint: { x: tileX, y: tileY },
        centerPosition: terrainCenterPosition,
        layout,
        canvasCenterPx,
      });

      const rightVertex = {
        x: tileCenter.x + halfWidthPx,
        y: tileCenter.y,
      };
      const bottomVertex = {
        x: tileCenter.x,
        y: tileCenter.y + halfHeightPx,
      };
      const leftVertex = {
        x: tileCenter.x - halfWidthPx,
        y: tileCenter.y,
      };

      // East neighbor (+1, 0): shared edge is right → bottom of this diamond.
      if (
        resolvingWorldPlazaNamedRealmIdAtTileIndex(tileX + 1, tileY) !== realmId
      ) {
        context.moveTo(rightVertex.x, rightVertex.y);
        context.lineTo(bottomVertex.x, bottomVertex.y);
      }

      // South neighbor (0, +1): shared edge is left → bottom of this diamond.
      if (
        resolvingWorldPlazaNamedRealmIdAtTileIndex(tileX, tileY + 1) !== realmId
      ) {
        context.moveTo(leftVertex.x, leftVertex.y);
        context.lineTo(bottomVertex.x, bottomVertex.y);
      }
    }
  }

  context.stroke();
}
