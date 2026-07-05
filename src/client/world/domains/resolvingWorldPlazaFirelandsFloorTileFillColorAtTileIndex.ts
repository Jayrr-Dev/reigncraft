import { blendingWorldPlazaRgbColors } from '@/components/world/domains/blendingWorldPlazaRgbColors';
import { checkingWorldPlazaTileIsFirelandsBiomeAtTileIndex } from '@/components/world/domains/checkingWorldPlazaTileIsFirelandsBiomeAtTileIndex';
import {
  DEFINING_WORLD_PLAZA_FIRELANDS_FLOOR_BORDER_BLEND,
  DEFINING_WORLD_PLAZA_FIRELANDS_FLOOR_FILL_COLORS,
  DEFINING_WORLD_PLAZA_FIRELANDS_FLOOR_NOISE_FREQUENCY,
  DEFINING_WORLD_PLAZA_FIRELANDS_FLOOR_NOISE_OCTAVES,
  DEFINING_WORLD_PLAZA_FIRELANDS_FLOOR_NOISE_SEED,
} from '@/components/world/domains/definingWorldPlazaFirelandsBiomeConstants';
import { samplingWorldPlazaFractalNoise } from '@/components/world/domains/generatingWorldPlazaValueNoise';

/**
 * Firelands biome floor fill colors with coherent, naturally drifting basalt shades.
 *
 * @module components/world/domains/resolvingWorldPlazaFirelandsFloorTileFillColorAtTileIndex
 */

/**
 * Samples a basalt shade from the ordered ramp using a coherent noise value.
 *
 * @param shadeNoise - Coherent noise value in [0, 1).
 */
function samplingWorldPlazaFirelandsFloorShadeFromNoise(
  shadeNoise: number
): number {
  const shadeCount = DEFINING_WORLD_PLAZA_FIRELANDS_FLOOR_FILL_COLORS.length;
  const rampPosition =
    Math.min(0.999999, Math.max(0, shadeNoise)) * (shadeCount - 1);
  const lowerIndex = Math.floor(rampPosition);
  const upperIndex = Math.min(shadeCount - 1, lowerIndex + 1);
  const blendRatio = rampPosition - lowerIndex;

  return blendingWorldPlazaRgbColors(
    DEFINING_WORLD_PLAZA_FIRELANDS_FLOOR_FILL_COLORS[lowerIndex],
    DEFINING_WORLD_PLAZA_FIRELANDS_FLOOR_FILL_COLORS[upperIndex],
    blendRatio
  );
}

/**
 * Returns a basalt floor shade for Firelands tiles, preserving border blending elsewhere.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param blendedBorderColor - Region-blended biome base color.
 */
export function resolvingWorldPlazaFirelandsFloorBaseFillColorAtTileIndex(
  tileX: number,
  tileY: number,
  blendedBorderColor: number
): number {
  if (!checkingWorldPlazaTileIsFirelandsBiomeAtTileIndex(tileX, tileY)) {
    return blendedBorderColor;
  }

  const shadeNoise = samplingWorldPlazaFractalNoise(
    tileX,
    tileY,
    DEFINING_WORLD_PLAZA_FIRELANDS_FLOOR_NOISE_SEED,
    {
      frequency: DEFINING_WORLD_PLAZA_FIRELANDS_FLOOR_NOISE_FREQUENCY,
      octaves: DEFINING_WORLD_PLAZA_FIRELANDS_FLOOR_NOISE_OCTAVES,
    }
  );
  const shadeColor = samplingWorldPlazaFirelandsFloorShadeFromNoise(shadeNoise);

  return blendingWorldPlazaRgbColors(
    blendedBorderColor,
    shadeColor,
    1 - DEFINING_WORLD_PLAZA_FIRELANDS_FLOOR_BORDER_BLEND
  );
}
