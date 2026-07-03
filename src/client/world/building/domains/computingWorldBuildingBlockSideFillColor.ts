/**
 * Darkens block top colors for extruded isometric side faces.
 *
 * @module components/world/building/domains/computingWorldBuildingBlockSideFillColor
 */

/** Multiplier applied to each RGB channel for side faces. */
const COMPUTING_WORLD_BUILDING_BLOCK_SIDE_FILL_COLOR_CHANNEL_MULTIPLIER = 0.72;

/**
 * Returns a darker fill color for vertical block faces.
 *
 * @param fillColor - Top face color in 0xRRGGBB form.
 */
export function computingWorldBuildingBlockSideFillColor(
  fillColor: number,
): number {
  const redChannel = (fillColor >> 16) & 0xff;
  const greenChannel = (fillColor >> 8) & 0xff;
  const blueChannel = fillColor & 0xff;
  const multiplier = COMPUTING_WORLD_BUILDING_BLOCK_SIDE_FILL_COLOR_CHANNEL_MULTIPLIER;

  const darkenedRed = Math.max(
    0,
    Math.min(255, Math.floor(redChannel * multiplier)),
  );
  const darkenedGreen = Math.max(
    0,
    Math.min(255, Math.floor(greenChannel * multiplier)),
  );
  const darkenedBlue = Math.max(
    0,
    Math.min(255, Math.floor(blueChannel * multiplier)),
  );

  return (darkenedRed << 16) | (darkenedGreen << 8) | darkenedBlue;
}
