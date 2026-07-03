import { blendingWorldPlazaRgbColors } from "@/components/world/domains/blendingWorldPlazaRgbColors";
import { checkingWorldPlazaTileIsRockyBiomeAtTileIndex } from "@/components/world/domains/checkingWorldPlazaTileIsRockyBiomeAtTileIndex";
import {
  DEFINING_WORLD_PLAZA_ROCKY_BIOME_FLOOR_BORDER_BLEND,
  DEFINING_WORLD_PLAZA_ROCKY_BIOME_FLOOR_FILL_COLORS,
  DEFINING_WORLD_PLAZA_ROCKY_BIOME_FLOOR_NOISE_FREQUENCY,
  DEFINING_WORLD_PLAZA_ROCKY_BIOME_FLOOR_NOISE_OCTAVES,
  DEFINING_WORLD_PLAZA_ROCKY_BIOME_FLOOR_NOISE_SEED,
} from "@/components/world/domains/definingWorldPlazaRockyBiomeConstants";
import { samplingWorldPlazaFractalNoise } from "@/components/world/domains/generatingWorldPlazaValueNoise";

/**
 * Rocky biome floor fill colors with coherent, naturally drifting grey shades.
 *
 * @module components/world/domains/resolvingWorldPlazaRockyBiomeFloorTileFillColorAtTileIndex
 */

/**
 * Samples a grey shade from the ordered ramp using a coherent noise value.
 *
 * The noise value picks a position along the dark-to-light ramp and blends
 * between the two nearest shades, so neighboring tiles land on near-identical
 * colors instead of flickering between random greys.
 *
 * @param shadeNoise - Coherent noise value in [0, 1).
 */
function samplingWorldPlazaRockyBiomeFloorShadeFromNoise(
  shadeNoise: number,
): number {
  const shadeCount = DEFINING_WORLD_PLAZA_ROCKY_BIOME_FLOOR_FILL_COLORS.length;
  const rampPosition =
    Math.min(0.999999, Math.max(0, shadeNoise)) * (shadeCount - 1);
  const lowerIndex = Math.floor(rampPosition);
  const upperIndex = Math.min(shadeCount - 1, lowerIndex + 1);
  const blendRatio = rampPosition - lowerIndex;

  return blendingWorldPlazaRgbColors(
    DEFINING_WORLD_PLAZA_ROCKY_BIOME_FLOOR_FILL_COLORS[lowerIndex],
    DEFINING_WORLD_PLAZA_ROCKY_BIOME_FLOOR_FILL_COLORS[upperIndex],
    blendRatio,
  );
}

/**
 * Returns a grey floor shade for rocky tiles, preserving border blending elsewhere.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param blendedBorderColor - Region-blended biome base color.
 */
export function resolvingWorldPlazaRockyBiomeFloorBaseFillColorAtTileIndex(
  tileX: number,
  tileY: number,
  blendedBorderColor: number,
): number {
  if (!checkingWorldPlazaTileIsRockyBiomeAtTileIndex(tileX, tileY)) {
    return blendedBorderColor;
  }

  const shadeNoise = samplingWorldPlazaFractalNoise(
    tileX,
    tileY,
    DEFINING_WORLD_PLAZA_ROCKY_BIOME_FLOOR_NOISE_SEED,
    {
      frequency: DEFINING_WORLD_PLAZA_ROCKY_BIOME_FLOOR_NOISE_FREQUENCY,
      octaves: DEFINING_WORLD_PLAZA_ROCKY_BIOME_FLOOR_NOISE_OCTAVES,
    },
  );
  const shadeColor = samplingWorldPlazaRockyBiomeFloorShadeFromNoise(shadeNoise);

  return blendingWorldPlazaRgbColors(
    blendedBorderColor,
    shadeColor,
    1 - DEFINING_WORLD_PLAZA_ROCKY_BIOME_FLOOR_BORDER_BLEND,
  );
}
