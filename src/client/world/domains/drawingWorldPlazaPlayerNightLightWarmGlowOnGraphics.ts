import {
  DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_ISOMETRIC_VERTICAL_RATIO,
  DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_RADIUS_WORLD_LOCAL_PX,
  DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_WARM_CORE_ALPHA,
} from "@/components/world/domains/definingWorldPlazaPlayerNightLightConstants";
import { FillGradient, type Graphics } from "pixi.js";

/** Gradient texture resolution; higher values reduce visible banding. */
const DRAWING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_WARM_GLOW_GRADIENT_TEXTURE_SIZE = 512;

let cachedWarmGlowFillGradient: FillGradient | null = null;

/**
 * Shared radial fill for the torch pool. Brightness is applied via fill alpha.
 */
function resolvingWorldPlazaPlayerNightLightWarmGlowFillGradient(): FillGradient {
  if (cachedWarmGlowFillGradient) {
    return cachedWarmGlowFillGradient;
  }

  cachedWarmGlowFillGradient = new FillGradient({
    type: "radial",
    center: { x: 0.5, y: 0.5 },
    innerRadius: 0,
    outerCenter: { x: 0.5, y: 0.5 },
    outerRadius: 0.5,
    scale: DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_ISOMETRIC_VERTICAL_RATIO,
    textureSpace: "local",
    textureSize: DRAWING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_WARM_GLOW_GRADIENT_TEXTURE_SIZE,
    colorStops: [
      { offset: 0, color: "rgba(255, 252, 244, 0.92)" },
      { offset: 0.12, color: "rgba(255, 242, 214, 0.68)" },
      { offset: 0.28, color: "rgba(255, 224, 176, 0.38)" },
      { offset: 0.48, color: "rgba(255, 198, 132, 0.16)" },
      { offset: 0.68, color: "rgba(255, 172, 98, 0.05)" },
      { offset: 0.86, color: "rgba(255, 148, 72, 0.012)" },
      { offset: 1, color: "rgba(255, 128, 56, 0)" },
    ],
  });

  return cachedWarmGlowFillGradient;
}

/**
 * Draws a smooth isometric warm glow pool on the ground.
 *
 * @param graphics - Pixi graphics instance to draw into.
 * @param glowBrightness - Torch glow brightness from the night cycle (0..1).
 */
export function drawingWorldPlazaPlayerNightLightWarmGlowOnGraphics(
  graphics: Graphics,
  glowBrightness: number,
): void {
  const radiusXPx =
    DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_RADIUS_WORLD_LOCAL_PX * 1.08;
  const radiusYPx =
    radiusXPx * DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_ISOMETRIC_VERTICAL_RATIO;

  graphics.clear();
  graphics.ellipse(0, 0, radiusXPx, radiusYPx);
  graphics.fill({
    fill: resolvingWorldPlazaPlayerNightLightWarmGlowFillGradient(),
    alpha: glowBrightness * DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_WARM_CORE_ALPHA,
  });
}
