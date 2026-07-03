import {
  DEFINING_WORLD_PLAZA_CLICK_ARROW_EFFECT_CIRCLE_RADIUS_PX,
  DEFINING_WORLD_PLAZA_CLICK_ARROW_EFFECT_FILL_ALPHA,
  DEFINING_WORLD_PLAZA_CLICK_ARROW_EFFECT_FILL_COLOR,
  DEFINING_WORLD_PLAZA_CLICK_ARROW_EFFECT_STROKE_COLOR,
  DEFINING_WORLD_PLAZA_CLICK_ARROW_EFFECT_STROKE_WIDTH_PX,
} from "@/components/world/domains/definingWorldPlazaClickArrowEffectConstants";
import type { Graphics } from "pixi.js";

/**
 * Draws a centered circle used as the click destination shrink marker.
 *
 * @param graphics - Pixi graphics instance to draw into.
 */
export function drawingWorldPlazaIsometricClickMarkerCircleOnGraphics(
  graphics: Graphics,
): void {
  graphics.clear();

  graphics.circle(0, 0, DEFINING_WORLD_PLAZA_CLICK_ARROW_EFFECT_CIRCLE_RADIUS_PX);
  graphics.fill({
    color: DEFINING_WORLD_PLAZA_CLICK_ARROW_EFFECT_FILL_COLOR,
    alpha: DEFINING_WORLD_PLAZA_CLICK_ARROW_EFFECT_FILL_ALPHA,
  });

  graphics.circle(0, 0, DEFINING_WORLD_PLAZA_CLICK_ARROW_EFFECT_CIRCLE_RADIUS_PX);
  graphics.stroke({
    color: DEFINING_WORLD_PLAZA_CLICK_ARROW_EFFECT_STROKE_COLOR,
    width: DEFINING_WORLD_PLAZA_CLICK_ARROW_EFFECT_STROKE_WIDTH_PX,
    join: "round",
    cap: "round",
  });
}
