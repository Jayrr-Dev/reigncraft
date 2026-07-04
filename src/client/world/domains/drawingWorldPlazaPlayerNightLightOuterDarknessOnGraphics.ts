import {
  DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_ISOMETRIC_VERTICAL_RATIO,
  DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_OUTER_DARKNESS_ALPHA,
  DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_OUTER_DARKNESS_RADIUS_SCALE,
  DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_RADIUS_WORLD_LOCAL_PX,
} from '@/components/world/domains/definingWorldPlazaPlayerNightLightConstants';
import { FillGradient, type Graphics } from 'pixi.js';

/** Gradient texture resolution for the floor darkness ring. */
const DRAWING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_OUTER_DARKNESS_GRADIENT_TEXTURE_SIZE = 512;

let cachedOuterDarknessFillGradient: FillGradient | null = null;

function resolvingWorldPlazaPlayerNightLightOuterDarknessFillGradient(): FillGradient {
  if (cachedOuterDarknessFillGradient) {
    return cachedOuterDarknessFillGradient;
  }

  const peakAlpha =
    DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_OUTER_DARKNESS_ALPHA;

  cachedOuterDarknessFillGradient = new FillGradient({
    type: 'radial',
    center: { x: 0.5, y: 0.5 },
    innerRadius: 0,
    outerCenter: { x: 0.5, y: 0.5 },
    outerRadius: 0.5,
    scale: DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_ISOMETRIC_VERTICAL_RATIO,
    textureSpace: 'local',
    textureSize:
      DRAWING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_OUTER_DARKNESS_GRADIENT_TEXTURE_SIZE,
    colorStops: [
      { offset: 0, color: 'rgba(0, 0, 0, 0)' },
      { offset: 0.18, color: 'rgba(0, 0, 0, 0)' },
      {
        offset: 0.34,
        color: `rgba(0, 0, 0, ${(peakAlpha * 0.14).toFixed(3)})`,
      },
      { offset: 0.5, color: `rgba(0, 0, 0, ${(peakAlpha * 0.38).toFixed(3)})` },
      {
        offset: 0.66,
        color: `rgba(0, 0, 0, ${(peakAlpha * 0.66).toFixed(3)})`,
      },
      {
        offset: 0.82,
        color: `rgba(0, 0, 0, ${(peakAlpha * 0.88).toFixed(3)})`,
      },
      { offset: 1, color: `rgba(0, 0, 0, ${peakAlpha.toFixed(3)})` },
    ],
  });

  return cachedOuterDarknessFillGradient;
}

/**
 * Draws a floor-only darkness ring outside the warm torch pool.
 *
 * Painted on the floor layer so trees, blocks, and avatars on the entity layer
 * stay outside this pass.
 */
export function drawingWorldPlazaPlayerNightLightOuterDarknessOnGraphics(
  graphics: Graphics
): void {
  const radiusXPx =
    DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_RADIUS_WORLD_LOCAL_PX *
    DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_OUTER_DARKNESS_RADIUS_SCALE;
  const radiusYPx =
    radiusXPx *
    DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_ISOMETRIC_VERTICAL_RATIO;

  graphics.clear();
  graphics.ellipse(0, 0, radiusXPx, radiusYPx);
  graphics.fill({
    fill: resolvingWorldPlazaPlayerNightLightOuterDarknessFillGradient(),
    alpha: 1,
  });
}
