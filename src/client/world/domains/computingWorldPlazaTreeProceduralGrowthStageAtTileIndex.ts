import {
  DEFINING_WORLD_PLAZA_TREE_GROWTH_STAGE_TALL,
  DEFINING_WORLD_PLAZA_TREE_PROCEDURAL_GROWTH_STAGE_CUMULATIVE_WEIGHTS,
  DEFINING_WORLD_PLAZA_TREE_PROCEDURAL_GROWTH_STAGE_SEED_SALT,
} from "@/components/world/domains/definingWorldPlazaTreeLayerGrowthConstants";
import { seedingWorldPlazaGrassTileDecorationFromTileIndex } from "@/components/world/domains/seedingWorldPlazaGrassTileDecorationFromTileIndex";

/**
 * Deterministic procedural tree age (growth stage) sampling per tile.
 *
 * @module components/world/domains/computingWorldPlazaTreeProceduralGrowthStageAtTileIndex
 */

/**
 * Samples a growth stage for a procedural tree so forests read as mixed ages.
 *
 * Each tile gets a stable stage from 0 (sapling) through 4 (tall veteran).
 * The distribution favors mature trees while still scattering younger and
 * older outliers.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function computingWorldPlazaTreeProceduralGrowthStageAtTileIndex(
  tileX: number,
  tileY: number,
): number {
  const ageUnit = seedingWorldPlazaGrassTileDecorationFromTileIndex(
    tileX,
    tileY,
    DEFINING_WORLD_PLAZA_TREE_PROCEDURAL_GROWTH_STAGE_SEED_SALT,
  );

  for (
    let stageIndex = 0;
    stageIndex <
    DEFINING_WORLD_PLAZA_TREE_PROCEDURAL_GROWTH_STAGE_CUMULATIVE_WEIGHTS.length;
    stageIndex += 1
  ) {
    if (
      ageUnit <
      DEFINING_WORLD_PLAZA_TREE_PROCEDURAL_GROWTH_STAGE_CUMULATIVE_WEIGHTS[
        stageIndex
      ]
    ) {
      return stageIndex;
    }
  }

  return DEFINING_WORLD_PLAZA_TREE_GROWTH_STAGE_TALL;
}
