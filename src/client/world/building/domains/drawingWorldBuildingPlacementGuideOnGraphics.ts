import { computingWorldBuildingWorldLayerScreenOffsetPx } from "@/components/world/building/domains/computingWorldBuildingWorldLayerScreenOffsetPx";
import { convertingWorldPlazaGridPointToIsometricScreenPoint } from "@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint";
import {
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX,
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX,
} from "@/components/world/domains/definingWorldPlazaIsometricConstants";
import { resolvingWorldPlazaTerrainElevationSurfaceLayerAtTileIndex } from "@/components/world/domains/resolvingWorldPlazaTerrainElevationAtTileIndex";
import type { Graphics } from "pixi.js";

/**
 * Draws a dashed vertical "drop edge" from an elevated placement preview down to
 * the tile surface so the player can read height above the plateau.
 *
 * @module components/world/building/domains/drawingWorldBuildingPlacementGuideOnGraphics
 */

/** Guide line color (faded blue). */
const DRAWING_WORLD_BUILDING_PLACEMENT_GUIDE_LINE_COLOR = 0x4dabf7;

/** Guide drop-edge line alpha. */
const DRAWING_WORLD_BUILDING_PLACEMENT_GUIDE_LINE_ALPHA = 0.55;

/** Guide floor footprint outline alpha. */
const DRAWING_WORLD_BUILDING_PLACEMENT_GUIDE_FLOOR_ALPHA = 0.4;

/** Guide line width in pixels. */
const DRAWING_WORLD_BUILDING_PLACEMENT_GUIDE_LINE_WIDTH_PX = 1;

/** Guide dash length in pixels. */
const DRAWING_WORLD_BUILDING_PLACEMENT_GUIDE_DASH_LENGTH_PX = 4;

/** Guide gap length in pixels. */
const DRAWING_WORLD_BUILDING_PLACEMENT_GUIDE_GAP_LENGTH_PX = 4;

/**
 * Appends a dashed straight-line path between two screen points.
 *
 * @param graphics - Target graphics instance.
 * @param startX - Segment start X.
 * @param startY - Segment start Y.
 * @param endX - Segment end X.
 * @param endY - Segment end Y.
 */
function appendingWorldBuildingDashedLinePath(
  graphics: Graphics,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
): void {
  const deltaX = endX - startX;
  const deltaY = endY - startY;
  const distance = Math.hypot(deltaX, deltaY);

  if (distance === 0) {
    return;
  }

  const stepX = deltaX / distance;
  const stepY = deltaY / distance;
  const dashStride =
    DRAWING_WORLD_BUILDING_PLACEMENT_GUIDE_DASH_LENGTH_PX +
    DRAWING_WORLD_BUILDING_PLACEMENT_GUIDE_GAP_LENGTH_PX;

  for (let traveled = 0; traveled < distance; traveled += dashStride) {
    const dashEnd = Math.min(
      traveled + DRAWING_WORLD_BUILDING_PLACEMENT_GUIDE_DASH_LENGTH_PX,
      distance,
    );

    graphics.moveTo(startX + stepX * traveled, startY + stepY * traveled);
    graphics.lineTo(startX + stepX * dashEnd, startY + stepY * dashEnd);
  }
}

export interface DrawingWorldBuildingPlacementGuideToFloorParams {
  readonly graphics: Graphics;
  readonly tileX: number;
  readonly tileY: number;
  readonly worldLayer: number;
}

/**
 * Draws dashed drop edges from an elevated preview down to the tile surface,
 * plus a faint surface footprint diamond. No-op when preview is flush with the
 * procedural terrain plateau (or lower).
 *
 * @param params - Preview tile indices and target world layer.
 */
export function drawingWorldBuildingPlacementGuideToFloorOnGraphics(
  params: DrawingWorldBuildingPlacementGuideToFloorParams,
): void {
  const floorWorldLayer =
    resolvingWorldPlazaTerrainElevationSurfaceLayerAtTileIndex(
      params.tileX,
      params.tileY,
    );

  if (params.worldLayer <= floorWorldLayer) {
    return;
  }

  const center = convertingWorldPlazaGridPointToIsometricScreenPoint({
    x: params.tileX,
    y: params.tileY,
  });
  const topCenterY =
    center.y + computingWorldBuildingWorldLayerScreenOffsetPx(params.worldLayer);
  const floorCenterY =
    center.y + computingWorldBuildingWorldLayerScreenOffsetPx(floorWorldLayer);

  if (topCenterY >= floorCenterY) {
    return;
  }

  const halfWidth = DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX;
  const halfHeight = DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX;

  const westX = center.x - halfWidth;
  const eastX = center.x + halfWidth;
  const southX = center.x;

  appendingWorldBuildingDashedLinePath(
    params.graphics,
    westX,
    topCenterY,
    westX,
    floorCenterY,
  );
  appendingWorldBuildingDashedLinePath(
    params.graphics,
    eastX,
    topCenterY,
    eastX,
    floorCenterY,
  );
  appendingWorldBuildingDashedLinePath(
    params.graphics,
    southX,
    topCenterY + halfHeight,
    southX,
    floorCenterY + halfHeight,
  );

  params.graphics.stroke({
    color: DRAWING_WORLD_BUILDING_PLACEMENT_GUIDE_LINE_COLOR,
    width: DRAWING_WORLD_BUILDING_PLACEMENT_GUIDE_LINE_WIDTH_PX,
    alpha: DRAWING_WORLD_BUILDING_PLACEMENT_GUIDE_LINE_ALPHA,
  });

  appendingWorldBuildingDashedLinePath(
    params.graphics,
    southX,
    floorCenterY - halfHeight,
    eastX,
    floorCenterY,
  );
  appendingWorldBuildingDashedLinePath(
    params.graphics,
    eastX,
    floorCenterY,
    southX,
    floorCenterY + halfHeight,
  );
  appendingWorldBuildingDashedLinePath(
    params.graphics,
    southX,
    floorCenterY + halfHeight,
    westX,
    floorCenterY,
  );
  appendingWorldBuildingDashedLinePath(
    params.graphics,
    westX,
    floorCenterY,
    southX,
    floorCenterY - halfHeight,
  );

  params.graphics.stroke({
    color: DRAWING_WORLD_BUILDING_PLACEMENT_GUIDE_LINE_COLOR,
    width: DRAWING_WORLD_BUILDING_PLACEMENT_GUIDE_LINE_WIDTH_PX,
    alpha: DRAWING_WORLD_BUILDING_PLACEMENT_GUIDE_FLOOR_ALPHA,
  });
}
