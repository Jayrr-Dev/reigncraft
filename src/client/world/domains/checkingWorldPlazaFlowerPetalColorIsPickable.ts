/**
 * True when a flower petal color is harvestable.
 *
 * Rejects green foliage tones and dull mid-greys. White / near-white petals pass.
 *
 * @module components/world/domains/checkingWorldPlazaFlowerPetalColorIsPickable
 */

import {
  DEFINING_WORLD_PLAZA_FLOWER_PETAL_PICKABLE_GREEN_HUE_MAX_DEG,
  DEFINING_WORLD_PLAZA_FLOWER_PETAL_PICKABLE_GREEN_HUE_MIN_DEG,
  DEFINING_WORLD_PLAZA_FLOWER_PETAL_PICKABLE_MIN_SATURATION,
  DEFINING_WORLD_PLAZA_FLOWER_PETAL_PICKABLE_WHITE_MIN_VALUE,
} from '@/components/world/domains/definingWorldPlazaFlowerPetalPickableColorConstants';

type WorldPlazaFlowerPetalHsv = {
  readonly hueDeg: number;
  readonly saturation: number;
  readonly value: number;
};

function resolvingWorldPlazaFlowerPetalHsvFromRgb(
  color: number
): WorldPlazaFlowerPetalHsv {
  const red = ((color >> 16) & 0xff) / 255;
  const green = ((color >> 8) & 0xff) / 255;
  const blue = (color & 0xff) / 255;
  const maxChannel = Math.max(red, green, blue);
  const minChannel = Math.min(red, green, blue);
  const chroma = maxChannel - minChannel;

  if (chroma <= 0 || maxChannel <= 0) {
    return { hueDeg: 0, saturation: 0, value: maxChannel };
  }

  const hueSector =
    maxChannel === red
      ? ((green - blue) / chroma) % 6
      : maxChannel === green
        ? (blue - red) / chroma + 2
        : (red - green) / chroma + 4;

  const hueDeg = (((hueSector * 60) % 360) + 360) % 360;
  const saturation = chroma / maxChannel;

  return { hueDeg, saturation, value: maxChannel };
}

/**
 * True when `color` is a pickable petal (chromatic or bright white, not green/grey).
 */
export function checkingWorldPlazaFlowerPetalColorIsPickable(
  color: number
): boolean {
  const { hueDeg, saturation, value } =
    resolvingWorldPlazaFlowerPetalHsvFromRgb(color);

  if (
    hueDeg >= DEFINING_WORLD_PLAZA_FLOWER_PETAL_PICKABLE_GREEN_HUE_MIN_DEG &&
    hueDeg <= DEFINING_WORLD_PLAZA_FLOWER_PETAL_PICKABLE_GREEN_HUE_MAX_DEG
  ) {
    return false;
  }

  if (saturation >= DEFINING_WORLD_PLAZA_FLOWER_PETAL_PICKABLE_MIN_SATURATION) {
    return true;
  }

  // Bright whites / pale petals (low saturation, high value) stay pickable.
  return value >= DEFINING_WORLD_PLAZA_FLOWER_PETAL_PICKABLE_WHITE_MIN_VALUE;
}
