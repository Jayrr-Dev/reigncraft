/**
 * Per-tree color jitter so same-biome foliage reads as individual trees.
 *
 * A whole-canopy brightness shift plus small independent per-channel noise keeps
 * the biome palette recognizable while giving each crown its own tint.
 *
 * @module components/world/domains/jitteringWorldPlazaTreeColor
 */

/** Maximum value of a single 8-bit color channel. */
const JITTERING_WORLD_PLAZA_TREE_COLOR_CHANNEL_MAX = 255;

/** Clamps and rounds a channel into the valid 0-255 integer range. */
function clampingWorldPlazaTreeColorChannel(value: number): number {
  if (value <= 0) {
    return 0;
  }

  if (value >= JITTERING_WORLD_PLAZA_TREE_COLOR_CHANNEL_MAX) {
    return JITTERING_WORLD_PLAZA_TREE_COLOR_CHANNEL_MAX;
  }

  return Math.round(value);
}

/** Converts a unit float to a signed multiplier centered on one. */
function resolvingWorldPlazaTreeColorSignedFactor(
  unitFloat: number,
  amount: number,
): number {
  return 1 + (unitFloat * 2 - 1) * amount;
}

/**
 * Shifts an RGB color by a seeded brightness factor and per-channel noise.
 *
 * Consumes four values from {@link random} in a fixed order (brightness, red,
 * green, blue) so callers keep deterministic draw sequences.
 *
 * @param color - Source 24-bit RGB color.
 * @param random - Seeded generator returning floats in [0, 1).
 * @param brightnessJitter - Maximum +/- whole-color brightness fraction.
 * @param channelJitter - Maximum +/- independent per-channel fraction.
 */
export function jitteringWorldPlazaTreeColor(
  color: number,
  random: () => number,
  brightnessJitter: number,
  channelJitter: number,
): number {
  const brightness = resolvingWorldPlazaTreeColorSignedFactor(
    random(),
    brightnessJitter,
  );

  const sourceRed = (color >> 16) & 0xff;
  const sourceGreen = (color >> 8) & 0xff;
  const sourceBlue = color & 0xff;

  const red = clampingWorldPlazaTreeColorChannel(
    sourceRed *
      brightness *
      resolvingWorldPlazaTreeColorSignedFactor(random(), channelJitter),
  );
  const green = clampingWorldPlazaTreeColorChannel(
    sourceGreen *
      brightness *
      resolvingWorldPlazaTreeColorSignedFactor(random(), channelJitter),
  );
  const blue = clampingWorldPlazaTreeColorChannel(
    sourceBlue *
      brightness *
      resolvingWorldPlazaTreeColorSignedFactor(random(), channelJitter),
  );

  return (red << 16) | (green << 8) | blue;
}

/**
 * Scales an RGB color's brightness by a fixed factor (deterministic, no seed).
 *
 * Used for the lit and shadowed faces of a cylindrical trunk.
 *
 * @param color - Source 24-bit RGB color.
 * @param factor - Brightness multiplier (>1 lightens, <1 darkens).
 */
export function scalingWorldPlazaTreeColorBrightness(
  color: number,
  factor: number,
): number {
  const red = clampingWorldPlazaTreeColorChannel(((color >> 16) & 0xff) * factor);
  const green = clampingWorldPlazaTreeColorChannel(((color >> 8) & 0xff) * factor);
  const blue = clampingWorldPlazaTreeColorChannel((color & 0xff) * factor);

  return (red << 16) | (green << 8) | blue;
}
