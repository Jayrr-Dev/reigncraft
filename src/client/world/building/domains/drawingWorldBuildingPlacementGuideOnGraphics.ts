import { computingWorldBuildingWorldLayerScreenOffsetPx } from "@/components/world/building/domains/computingWorldBuildingWorldLayerScreenOffsetPx";
import { DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND } from "@/components/world/building/domains/definingWorldBuildingWorldLayerConstants";
import { convertingWorldPlazaGridPointToIsometricScreenPoint } from "@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint";
import {
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX,
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX,
} from "@/components/world/domains/definingWorldPlazaIsometricConstants";
import type { Graphics } from "pixi.js";

/**
 * Draws a dashed vertical "drop edge" from an elevated placement preview down to
 * the floor so the player can read which ground tile a block sits above.
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
 * Draws dashed drop edges from an elevated preview's top corners to the floor,
 * plus a faint floor footprint diamond. No-op for ground-level placements.
 *
 * @param params - Preview tile indices and target world layer.
 */
export function drawingWorldBuildingPlacementGuideToFloorOnGraphics(
  params: DrawingWorldBuildingPlacementGuideToFloorParams,
): void {
  if (params.worldLayer <= DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND) {
    return;
  }

  const center = convertingWorldPlazaGridPointToIsometricScreenPoint({
    x: params.tileX,
    y: params.tileY,
  });
  const topCenterY =
    center.y + computingWorldBuildingWorldLayerScreenOffsetPx(params.worldLayer);
  const groundCenterY = center.y;

  if (topCenterY >= groundCenterY) {
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
    groundCenterY,
  );
  appendingWorldBuildingDashedLinePath(
    params.graphics,
    eastX,
    topCenterY,
    eastX,
    groundCenterY,
  );
  appendingWorldBuildingDashedLinePath(
    params.graphics,
    southX,
    topCenterY + halfHeight,
    southX,
    groundCenterY + halfHeight,
  );

  params.graphics.stroke({
    color: DRAWING_WORLD_BUILDING_PLACEMENT_GUIDE_LINE_COLOR,
    width: DRAWING_WORLD_BUILDING_PLACEMENT_GUIDE_LINE_WIDTH_PX,
    alpha: DRAWING_WORLD_BUILDING_PLACEMENT_GUIDE_LINE_ALPHA,
  });

  appendingWorldBuildingDashedLinePath(
    params.graphics,
    southX,
    groundCenterY - halfHeight,
    eastX,
    groundCenterY,
  );
  appendingWorldBuildingDashedLinePath(
    params.graphics,
    eastX,
    groundCenterY,
    southX,
    groundCenterY + halfHeight,
  );
  appendingWorldBuildingDashedLinePath(
    params.graphics,
    southX,
    groundCenterY + halfHeight,
    westX,
    groundCenterY,
  );
  appendingWorldBuildingDashedLinePath(
    params.graphics,
    westX,
    groundCenterY,
    southX,
    groundCenterY - halfHeight,
  );

  params.graphics.stroke({
    color: DRAWING_WORLD_BUILDING_PLACEMENT_GUIDE_LINE_COLOR,
    width: DRAWING_WORLD_BUILDING_PLACEMENT_GUIDE_LINE_WIDTH_PX,
    alpha: DRAWING_WORLD_BUILDING_PLACEMENT_GUIDE_FLOOR_ALPHA,
  });
}
