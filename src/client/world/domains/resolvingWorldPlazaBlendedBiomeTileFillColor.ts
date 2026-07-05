import {
  adjustingWorldPlazaRgbColorBrightness,
  blendingWorldPlazaRgbColors,
  blendingWorldPlazaRgbColorsBilinear,
  quantizingWorldPlazaRgbColor,
} from '@/components/world/domains/blendingWorldPlazaRgbColors';
import { DEFINING_WORLD_PLAZA_BIOME_REGION_TILE_SIZE } from '@/components/world/domains/definingWorldPlazaBiomeConstants';
import { samplingWorldPlazaFractalNoise } from '@/components/world/domains/generatingWorldPlazaValueNoise';
import {
  resolvingWorldPlazaBiomeAtTileIndex,
  resolvingWorldPlazaBiomeDefinitionAtRegion,
} from '@/components/world/domains/resolvingWorldPlazaBiomeAtTileIndex';
import { resolvingWorldPlazaFirelandsFloorBaseFillColorAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaFirelandsFloorTileFillColorAtTileIndex';
import { resolvingWorldPlazaRockyBiomeFloorBaseFillColorAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaRockyBiomeFloorTileFillColorAtTileIndex';

/** Frequency for gentle within-biome brightness mottling. */
const DEFINING_WORLD_PLAZA_BIOME_MOTTLE_FREQUENCY = 1 / 5;

/** Seed for the mottle field. */
const DEFINING_WORLD_PLAZA_BIOME_MOTTLE_SEED = 4421;

/** Peak brightness swing for mottling (kept subtle to avoid TV static). */
const DEFINING_WORLD_PLAZA_BIOME_MOTTLE_BRIGHTNESS = 0.045;

/** Frequency for clustered accent patches (dirt, coarse sand, terracotta). */
const DEFINING_WORLD_PLAZA_BIOME_ACCENT_PATCH_FREQUENCY = 1 / 9;

/** Seed for the accent patch field. */
const DEFINING_WORLD_PLAZA_BIOME_ACCENT_PATCH_SEED = 8101;

/** Noise threshold above which accent patches appear. */
const DEFINING_WORLD_PLAZA_BIOME_ACCENT_PATCH_THRESHOLD = 0.74;

/** Maximum blend toward the accent color at a patch core. */
const DEFINING_WORLD_PLAZA_BIOME_ACCENT_PATCH_MAX_BLEND = 0.5;

/**
 * Gradually blends biome ground colors across region borders.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function resolvingWorldPlazaBlendedBiomeBaseTileFillColor(
  tileX: number,
  tileY: number
): number {
  const fractionalRegionX = tileX / DEFINING_WORLD_PLAZA_BIOME_REGION_TILE_SIZE;
  const fractionalRegionY = tileY / DEFINING_WORLD_PLAZA_BIOME_REGION_TILE_SIZE;
  const regionX0 = Math.floor(fractionalRegionX);
  const regionY0 = Math.floor(fractionalRegionY);
  const mixX = fractionalRegionX - regionX0;
  const mixY = fractionalRegionY - regionY0;

  return resolvingWorldPlazaFirelandsFloorBaseFillColorAtTileIndex(
    tileX,
    tileY,
    resolvingWorldPlazaRockyBiomeFloorBaseFillColorAtTileIndex(
      tileX,
      tileY,
      blendingWorldPlazaRgbColorsBilinear(
        resolvingWorldPlazaBiomeDefinitionAtRegion(regionX0, regionY0)
          .tileFillColor,
        resolvingWorldPlazaBiomeDefinitionAtRegion(regionX0 + 1, regionY0)
          .tileFillColor,
        resolvingWorldPlazaBiomeDefinitionAtRegion(regionX0, regionY0 + 1)
          .tileFillColor,
        resolvingWorldPlazaBiomeDefinitionAtRegion(regionX0 + 1, regionY0 + 1)
          .tileFillColor,
        mixX,
        mixY
      )
    )
  );
}

/**
 * Applies smooth, natural ground texture on top of a blended biome color.
 *
 * Brightness mottling and accent patches both come from low-frequency noise,
 * so variation reads as terrain rather than per-tile static.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param blendedBaseColor - Border-blended biome color.
 * @param options - Optional toggles for tile-specific fill rules.
 */
export function resolvingWorldPlazaBiomeBlockTexturedTileFillColor(
  tileX: number,
  tileY: number,
  blendedBaseColor: number,
  options: { readonly skipsAccentPatches?: boolean } = {}
): number {
  const mottle = samplingWorldPlazaFractalNoise(
    tileX,
    tileY,
    DEFINING_WORLD_PLAZA_BIOME_MOTTLE_SEED,
    { frequency: DEFINING_WORLD_PLAZA_BIOME_MOTTLE_FREQUENCY, octaves: 3 }
  );
  const mottledColor = adjustingWorldPlazaRgbColorBrightness(
    blendedBaseColor,
    (mottle - 0.5) * 2 * DEFINING_WORLD_PLAZA_BIOME_MOTTLE_BRIGHTNESS
  );

  const biome = resolvingWorldPlazaBiomeAtTileIndex(tileX, tileY);

  if (options.skipsAccentPatches || biome.blockAccentColor === null) {
    return mottledColor;
  }

  const accentPatch = samplingWorldPlazaFractalNoise(
    tileX,
    tileY,
    DEFINING_WORLD_PLAZA_BIOME_ACCENT_PATCH_SEED,
    { frequency: DEFINING_WORLD_PLAZA_BIOME_ACCENT_PATCH_FREQUENCY, octaves: 3 }
  );

  if (accentPatch <= DEFINING_WORLD_PLAZA_BIOME_ACCENT_PATCH_THRESHOLD) {
    return mottledColor;
  }

  const patchDepth =
    (accentPatch - DEFINING_WORLD_PLAZA_BIOME_ACCENT_PATCH_THRESHOLD) /
    (1 - DEFINING_WORLD_PLAZA_BIOME_ACCENT_PATCH_THRESHOLD);

  return blendingWorldPlazaRgbColors(
    mottledColor,
    biome.blockAccentColor,
    patchDepth * DEFINING_WORLD_PLAZA_BIOME_ACCENT_PATCH_MAX_BLEND
  );
}

/**
 * Resolves the final textured tile color with gradual biome blending.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function resolvingWorldPlazaBlendedBiomeTileFillColor(
  tileX: number,
  tileY: number
): number {
  const blendedBaseColor = resolvingWorldPlazaBlendedBiomeBaseTileFillColor(
    tileX,
    tileY
  );

  return quantizingWorldPlazaRgbColor(
    resolvingWorldPlazaBiomeBlockTexturedTileFillColor(
      tileX,
      tileY,
      blendedBaseColor
    )
  );
}
