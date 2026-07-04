import {
  DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_ISOMETRIC_VERTICAL_RATIO,
  DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_RADIUS_WORLD_LOCAL_PX,
  DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_WARM_CORE_ALPHA,
} from "@/components/world/domains/definingWorldPlazaPlayerNightLightConstants";
import { DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_WARM_GLOW_SOFT_LAYERS } from "@/components/world/domains/definingWorldPlazaPlayerNightLightWarmGlowConstants";
import type { Graphics } from "pixi.js";

/**
 * Draws a soft isometric warm glow pool on the ground.
 *
 * @param graphics - Pixi graphics instance to draw into.
 * @param strength - Night torch strength (0..1).
 */
export function drawingWorldPlazaPlayerNightLightWarmGlowOnGraphics(
  graphics: Graphics,
  strength: number,
): void {
  const radiusXPx = DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_RADIUS_WORLD_LOCAL_PX;
  const radiusYPx =
    radiusXPx * DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_ISOMETRIC_VERTICAL_RATIO;
  const baseAlpha = strength * DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_WARM_CORE_ALPHA;

  graphics.clear();

  for (const softLayer of DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_WARM_GLOW_SOFT_LAYERS) {
    graphics.ellipse(
      0,
      0,
      radiusXPx * softLayer.radiusScale,
      radiusYPx * softLayer.radiusScale,
    );
    graphics.fill({
      color: softLayer.color,
      alpha: baseAlpha * softLayer.alphaScale,
    });
  }
}
