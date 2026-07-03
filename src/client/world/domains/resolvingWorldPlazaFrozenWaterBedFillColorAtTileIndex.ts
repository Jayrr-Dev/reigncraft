import { quantizingWorldPlazaRgbColor } from "@/components/world/domains/blendingWorldPlazaRgbColors";
import {
  DEFINING_WORLD_PLAZA_WATER_FROZEN_BED_MOTTLE_FREQUENCY,
  DEFINING_WORLD_PLAZA_WATER_FROZEN_BED_MOTTLE_MAX_BLEND,
  DEFINING_WORLD_PLAZA_WATER_FROZEN_BED_MOTTLE_SEED,
  DEFINING_WORLD_PLAZA_WATER_FROZEN_FILL_COLOR,
  DEFINING_WORLD_PLAZA_WATER_FROZEN_FILL_DARK_COLOR,
  DEFINING_WORLD_PLAZA_WATER_FROZEN_FILL_LIGHT_COLOR,
} from "@/components/world/domains/definingWorldPlazaWaterConstants";
import { samplingWorldPlazaFractalNoise } from "@/components/world/domains/generatingWorldPlazaValueNoise";
import { mixingWorldPlazaWaterRgbColors } from "@/components/world/domains/mixingWorldPlazaWaterRgbColors";

/**
 * Procedural frozen lake bed colors with low-frequency ice slab variation.
 *
 * @module components/world/domains/resolvingWorldPlazaFrozenWaterBedFillColorAtTileIndex
 */

/**
 * Resolves the floor diamond fill for one frozen water tile.
 *
 * Low-frequency noise blends the base ice tone toward darker and lighter slab
 * colors so open water reads as fractured ice rather than flat pastel fill.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function resolvingWorldPlazaFrozenWaterBedFillColorAtTileIndex(
  tileX: number,
  tileY: number,
): number {
  const slabNoise = samplingWorldPlazaFractalNoise(
    tileX,
    tileY,
    DEFINING_WORLD_PLAZA_WATER_FROZEN_BED_MOTTLE_SEED,
    {
      frequency: DEFINING_WORLD_PLAZA_WATER_FROZEN_BED_MOTTLE_FREQUENCY,
      octaves: 2,
    },
  );

  if (slabNoise < 0.5) {
    const darkMix =
      ((0.5 - slabNoise) / 0.5) *
      DEFINING_WORLD_PLAZA_WATER_FROZEN_BED_MOTTLE_MAX_BLEND;

    return quantizingWorldPlazaRgbColor(
      mixingWorldPlazaWaterRgbColors(
        DEFINING_WORLD_PLAZA_WATER_FROZEN_FILL_COLOR,
        DEFINING_WORLD_PLAZA_WATER_FROZEN_FILL_DARK_COLOR,
        darkMix,
      ),
    );
  }

  const lightMix =
    ((slabNoise - 0.5) / 0.5) *
    DEFINING_WORLD_PLAZA_WATER_FROZEN_BED_MOTTLE_MAX_BLEND;

  return quantizingWorldPlazaRgbColor(
    mixingWorldPlazaWaterRgbColors(
      DEFINING_WORLD_PLAZA_WATER_FROZEN_FILL_COLOR,
      DEFINING_WORLD_PLAZA_WATER_FROZEN_FILL_LIGHT_COLOR,
      lightMix,
    ),
  );
}
