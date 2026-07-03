/**
 * Blends two 24-bit RGB hex colors.
 *
 * @param fromColor - Start color.
 * @param toColor - End color.
 * @param mixRatio - Blend weight for `toColor` in [0, 1].
 */
export function blendingWorldPlazaRgbColors(
  fromColor: number,
  toColor: number,
  mixRatio: number,
): number {
  const clampedMixRatio = Math.min(1, Math.max(0, mixRatio));
  const inverseMixRatio = 1 - clampedMixRatio;
  const fromRed = (fromColor >> 16) & 0xff;
  const fromGreen = (fromColor >> 8) & 0xff;
  const fromBlue = fromColor & 0xff;
  const toRed = (toColor >> 16) & 0xff;
  const toGreen = (toColor >> 8) & 0xff;
  const toBlue = toColor & 0xff;
  const red = Math.round(fromRed * inverseMixRatio + toRed * clampedMixRatio);
  const green = Math.round(
    fromGreen * inverseMixRatio + toGreen * clampedMixRatio,
  );
  const blue = Math.round(
    fromBlue * inverseMixRatio + toBlue * clampedMixRatio,
  );

  return (red << 16) | (green << 8) | blue;
}

/**
 * Bilinear blend of four corner colors.
 *
 * @param topLeftColor - Northwest sample.
 * @param topRightColor - Northeast sample.
 * @param bottomLeftColor - Southwest sample.
 * @param bottomRightColor - Southeast sample.
 * @param mixX - Horizontal blend in [0, 1].
 * @param mixY - Vertical blend in [0, 1].
 */
export function blendingWorldPlazaRgbColorsBilinear(
  topLeftColor: number,
  topRightColor: number,
  bottomLeftColor: number,
  bottomRightColor: number,
  mixX: number,
  mixY: number,
): number {
  const topEdgeColor = blendingWorldPlazaRgbColors(
    topLeftColor,
    topRightColor,
    mixX,
  );
  const bottomEdgeColor = blendingWorldPlazaRgbColors(
    bottomLeftColor,
    bottomRightColor,
    mixX,
  );

  return blendingWorldPlazaRgbColors(topEdgeColor, bottomEdgeColor, mixY);
}

/**
 * Lightens or darkens a hex color by a signed amount in [0, 1].
 *
 * @param color - Base color.
 * @param amount - Positive lightens, negative darkens.
 */
export function adjustingWorldPlazaRgbColorBrightness(
  color: number,
  amount: number,
): number {
  const red = (color >> 16) & 0xff;
  const green = (color >> 8) & 0xff;
  const blue = color & 0xff;
  const adjustChannel = (channel: number): number =>
    Math.min(255, Math.max(0, Math.round(channel + amount * 255)));

  return (
    (adjustChannel(red) << 16) |
    (adjustChannel(green) << 8) |
    adjustChannel(blue)
  );
}

/** Default quantization steps for batched floor tile colors. */
export const DEFINING_WORLD_PLAZA_RGB_COLOR_DEFAULT_QUANTIZE_STEPS = 14;

/**
 * Snaps a color to a limited palette so batched floor draws stay fast.
 *
 * @param color - Input color.
 * @param steps - Number of levels per channel (minimum 2).
 */
export function quantizingWorldPlazaRgbColor(
  color: number,
  steps: number = DEFINING_WORLD_PLAZA_RGB_COLOR_DEFAULT_QUANTIZE_STEPS,
): number {
  const clampedSteps = Math.max(2, steps);
  const quantizeChannel = (channel: number): number => {
    const normalized = channel / 255;
    const snapped =
      Math.round(normalized * (clampedSteps - 1)) / (clampedSteps - 1);

    return Math.round(snapped * 255);
  };
  const red = quantizeChannel((color >> 16) & 0xff);
  const green = quantizeChannel((color >> 8) & 0xff);
  const blue = quantizeChannel(color & 0xff);

  return (red << 16) | (green << 8) | blue;
}
