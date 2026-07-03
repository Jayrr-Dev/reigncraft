/**
 * Converts a Pixi-style 0xRRGGBB color to a CSS hex string.
 *
 * @param pixiColor - Packed RGB color (e.g. 0x7cba3d).
 */
export function formattingWorldPlazaPixiColorToCssHex(pixiColor: number): string {
  const red = (pixiColor >> 16) & 0xff;
  const green = (pixiColor >> 8) & 0xff;
  const blue = pixiColor & 0xff;

  return `#${red.toString(16).padStart(2, "0")}${green.toString(16).padStart(2, "0")}${blue.toString(16).padStart(2, "0")}`;
}
