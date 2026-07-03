/**
 * RGB color mixing helpers for procedural water rendering.
 *
 * @module components/world/domains/mixingWorldPlazaWaterRgbColors
 */

/**
 * Linearly mixes two 24-bit RGB colors.
 *
 * @param fromColor - Start color.
 * @param toColor - End color.
 * @param mix - Blend amount in [0, 1].
 */
export function mixingWorldPlazaWaterRgbColors(
  fromColor: number,
  toColor: number,
  mix: number,
): number {
  const clampedMix = Math.max(0, Math.min(1, mix));
  const inverseMix = 1 - clampedMix;
  const fromRed = (fromColor >> 16) & 0xff;
  const fromGreen = (fromColor >> 8) & 0xff;
  const fromBlue = fromColor & 0xff;
  const toRed = (toColor >> 16) & 0xff;
  const toGreen = (toColor >> 8) & 0xff;
  const toBlue = toColor & 0xff;

  return (
    (Math.round(fromRed * inverseMix + toRed * clampedMix) << 16) |
    (Math.round(fromGreen * inverseMix + toGreen * clampedMix) << 8) |
    Math.round(fromBlue * inverseMix + toBlue * clampedMix)
  );
}

/**
 * Clamps a numeric value into the inclusive [0, 1] range.
 *
 * @param value - Input value.
 */
export function clampingWorldPlazaWaterUnitFloat(value: number): number {
  if (value <= 0) {
    return 0;
  }

  if (value >= 1) {
    return 1;
  }

  return value;
}

/**
 * Maps a unit float into an inclusive numeric range.
 *
 * @param unitFloat - Input in [0, 1].
 * @param min - Range minimum.
 * @param max - Range maximum.
 */
export function mappingWorldPlazaWaterUnitFloatToRange(
  unitFloat: number,
  min: number,
  max: number,
): number {
  return min + clampingWorldPlazaWaterUnitFloat(unitFloat) * (max - min);
}
