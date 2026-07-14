/**
 * True when a flower petal color is vibrant enough to be harvested.
 *
 * Rejects green foliage tones and low-saturation grey / white dots.
 *
 * @module components/world/domains/checkingWorldPlazaFlowerPetalColorIsPickable
 */

import {
  DEFINING_WORLD_PLAZA_FLOWER_PETAL_PICKABLE_GREEN_HUE_MAX_DEG,
  DEFINING_WORLD_PLAZA_FLOWER_PETAL_PICKABLE_GREEN_HUE_MIN_DEG,
  DEFINING_WORLD_PLAZA_FLOWER_PETAL_PICKABLE_MIN_SATURATION,
} from '@/components/world/domains/definingWorldPlazaFlowerPetalPickableColorConstants';

type WorldPlazaFlowerPetalHsv = {
  readonly hueDeg: number;
  readonly saturation: number;
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
    return { hueDeg: 0, saturation: 0 };
  }

  let hueSector = 0;

  if (maxChannel === red) {
    hueSector = ((green - blue) / chroma) % 6;
  } else if (maxChannel === green) {
    hueSector = (blue - red) / chroma + 2;
  } else {
    hueSector = (red - green) / chroma + 4;
  }

  const hueDeg = (((hueSector * 60) % 360) + 360) % 360;
  const saturation = chroma / maxChannel;

  return { hueDeg, saturation };
}

/**
 * True when `color` is a pickable petal (chromatic, not green/grey/white).
 */
export function checkingWorldPlazaFlowerPetalColorIsPickable(
  color: number
): boolean {
  const { hueDeg, saturation } =
    resolvingWorldPlazaFlowerPetalHsvFromRgb(color);

  if (saturation < DEFINING_WORLD_PLAZA_FLOWER_PETAL_PICKABLE_MIN_SATURATION) {
    return false;
  }

  if (
    hueDeg >= DEFINING_WORLD_PLAZA_FLOWER_PETAL_PICKABLE_GREEN_HUE_MIN_DEG &&
    hueDeg <= DEFINING_WORLD_PLAZA_FLOWER_PETAL_PICKABLE_GREEN_HUE_MAX_DEG
  ) {
    return false;
  }

  return true;
}
