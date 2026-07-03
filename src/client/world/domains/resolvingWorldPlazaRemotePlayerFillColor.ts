/**
 * Deterministic avatar fill color for a remote plaza player.
 *
 * @param userId - Remote auth user id.
 */
export function resolvingWorldPlazaRemotePlayerFillColor(userId: string): number {
  let hash = 0;

  for (let index = 0; index < userId.length; index += 1) {
    hash = (hash << 5) - hash + userId.charCodeAt(index);
    hash |= 0;
  }

  const hue = Math.abs(hash) % 360;
  const saturation = 65;
  const lightness = 58;

  const chroma = (1 - Math.abs((2 * lightness) / 100 - 1)) * (saturation / 100);
  const huePrime = hue / 60;
  const x = chroma * (1 - Math.abs((huePrime % 2) - 1));

  let red = 0;
  let green = 0;
  let blue = 0;

  if (huePrime >= 0 && huePrime < 1) {
    red = chroma;
    green = x;
  } else if (huePrime >= 1 && huePrime < 2) {
    red = x;
    green = chroma;
  } else if (huePrime >= 2 && huePrime < 3) {
    green = chroma;
    blue = x;
  } else if (huePrime >= 3 && huePrime < 4) {
    green = x;
    blue = chroma;
  } else if (huePrime >= 4 && huePrime < 5) {
    red = x;
    blue = chroma;
  } else {
    red = chroma;
    blue = x;
  }

  const match = lightness / 100 - chroma / 2;
  const toByte = (channel: number): number =>
    Math.round((channel + match) * 255);

  return (toByte(red) << 16) + (toByte(green) << 8) + toByte(blue);
}
