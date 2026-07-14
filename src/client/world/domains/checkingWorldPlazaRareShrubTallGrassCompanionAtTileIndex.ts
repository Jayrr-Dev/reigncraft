import { DEFINING_WORLD_PLAZA_GENERATION_FEATURE } from '@/components/world/domains/definingWorldPlazaGenerationFeatureRegistry';
import { checkingWorldPlazaGenerationFeatureEnabled } from '@/components/world/domains/managingWorldPlazaGenerationFeatureStore';
import { resolvingWorldPlazaBiomeAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaBiomeAtTileIndex';
import {
  checkingWorldShrubTallGrassCompanionAtTileIndex,
  resolvingWorldShrubTallGrassCompanionSizeVariantAtTileIndex,
} from '../../../shared/worldShrubPlacement';

/**
 * True when a tile belongs to a rare grass thicket nestled with berry shrubs.
 */
export function checkingWorldPlazaRareShrubTallGrassCompanionAtTileIndex(
  tileX: number,
  tileY: number
): boolean {
  if (
    !checkingWorldPlazaGenerationFeatureEnabled(
      DEFINING_WORLD_PLAZA_GENERATION_FEATURE.SHRUBS
    )
  ) {
    return false;
  }

  const biome = resolvingWorldPlazaBiomeAtTileIndex(tileX, tileY);

  if (biome.shrubTileModulus === null) {
    return false;
  }

  return checkingWorldShrubTallGrassCompanionAtTileIndex(
    tileX,
    tileY,
    biome.shrubTileModulus
  );
}

/**
 * Grass size for shrub companion patches: one tall accent, shorter neighbors.
 */
export function resolvingWorldPlazaRareShrubTallGrassCompanionSizeVariantAtTileIndex(
  tileX: number,
  tileY: number
): 'b1' | 'b5' {
  return resolvingWorldShrubTallGrassCompanionSizeVariantAtTileIndex(
    tileX,
    tileY
  );
}
