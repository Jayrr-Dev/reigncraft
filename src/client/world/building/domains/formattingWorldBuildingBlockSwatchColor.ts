/**
 * Converts a PixiJS numeric color into a CSS hex string for palette swatches.
 *
 * @module components/world/building/domains/formattingWorldBuildingBlockSwatchColor
 */

/** Number of hex digits in an RGB color string. */
const FORMATTING_WORLD_BUILDING_SWATCH_COLOR_HEX_LENGTH = 6 as const;

/**
 * Formats a numeric block color (e.g. `0x2d6a4f`) as a CSS hex string.
 *
 * @param color - PixiJS RGB color encoded as a number.
 */
export function formattingWorldBuildingBlockSwatchColor(color: number): string {
  return `#${color
    .toString(16)
    .padStart(FORMATTING_WORLD_BUILDING_SWATCH_COLOR_HEX_LENGTH, "0")}`;
}
