import { quantizingWorldPlazaRgbColor } from "@/components/world/domains/blendingWorldPlazaRgbColors";
import { checkingWorldPlazaTreeBlocksGridTile } from "@/components/world/domains/checkingWorldPlazaTreeBlocksGridTile";

import { resolvingWorldPlazaFrozenWaterBedFillColorAtTileIndex } from "@/components/world/domains/resolvingWorldPlazaFrozenWaterBedFillColorAtTileIndex";
import { DEFINING_WORLD_PLAZA_WATER_KIND_LAKE } from "@/components/world/domains/definingWorldPlazaWaterKind";
import {
  resolvingWorldPlazaBiomeBlockTexturedTileFillColor,
  resolvingWorldPlazaBlendedBiomeBaseTileFillColor,
  resolvingWorldPlazaBlendedBiomeTileFillColor,
} from "@/components/world/domains/resolvingWorldPlazaBlendedBiomeTileFillColor";
import { checkingWorldPlazaWaterIsFrozenAtTileIndex } from "@/components/world/domains/checkingWorldPlazaWaterIsFrozenAtTileIndex";
import { resolvingWorldPlazaBiomeWaterBedFillColorAtTileIndex } from "@/components/world/domains/resolvingWorldPlazaBiomeWaterPaletteAtTileIndex";
import { resolvingWorldPlazaLakeShoreBlockFillColorAtTileIndex } from "@/components/world/domains/resolvingWorldPlazaLakeShoreBlockFillColorAtTileIndex";
import { resolvingWorldPlazaOceanShoreBlockFillColorAtTileIndex } from "@/components/world/domains/resolvingWorldPlazaOceanShoreBlockFillColorAtTileIndex";
import { resolvingWorldPlazaLakeBedFillColorAtTileIndex } from "@/components/world/domains/resolvingWorldPlazaLakeWaterDepthAtTileIndex";
import { resolvingWorldPlazaPondShoreFillColorAtTileIndex } from "@/components/world/domains/resolvingWorldPlazaPondShoreFillColorAtTileIndex";
import { resolvingWorldPlazaWaterAtTileIndex } from "@/components/world/domains/resolvingWorldPlazaWaterAtTileIndex";

/**
 * Floor tile fill colors for procedural grass diamonds.
 *
 * @module components/world/domains/resolvingWorldPlazaGrassFloorTileFillColorAtTileIndex
 */

/**
 * Resolves the grass diamond fill for one floor tile.
 *
 * Tree tiles skip coarse accent patches so the foot diamond stays green instead
 * of picking up brown dirt streaks under the trunk.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function resolvingWorldPlazaGrassFloorTileFillColorAtTileIndex(
  tileX: number,
  tileY: number,
): number {
  const waterTile = resolvingWorldPlazaWaterAtTileIndex(tileX, tileY);

  if (waterTile && checkingWorldPlazaWaterIsFrozenAtTileIndex(tileX, tileY)) {
    return resolvingWorldPlazaFrozenWaterBedFillColorAtTileIndex(tileX, tileY);
  }

  if (waterTile) {
    const biomeWaterBedFillColor =
      resolvingWorldPlazaBiomeWaterBedFillColorAtTileIndex(
        tileX,
        tileY,
        waterTile.kind,
      );

    if (biomeWaterBedFillColor !== null) {
      if (waterTile.kind === DEFINING_WORLD_PLAZA_WATER_KIND_LAKE) {
        return resolvingWorldPlazaLakeBedFillColorAtTileIndex(tileX, tileY);
      }

      return biomeWaterBedFillColor;
    }
  }

  const lakeShoreFillColor =
    resolvingWorldPlazaLakeShoreBlockFillColorAtTileIndex(tileX, tileY);

  if (lakeShoreFillColor !== null) {
    return lakeShoreFillColor;
  }

  const oceanShoreFillColor =
    resolvingWorldPlazaOceanShoreBlockFillColorAtTileIndex(tileX, tileY);

  if (oceanShoreFillColor !== null) {
    return oceanShoreFillColor;
  }

  const pondShoreFillColor = resolvingWorldPlazaPondShoreFillColorAtTileIndex(
    tileX,
    tileY,
  );

  if (pondShoreFillColor !== null) {
    return pondShoreFillColor;
  }

  if (!checkingWorldPlazaTreeBlocksGridTile(tileX, tileY)) {
    return resolvingWorldPlazaBlendedBiomeTileFillColor(tileX, tileY);
  }

  const blendedBaseColor = resolvingWorldPlazaBlendedBiomeBaseTileFillColor(
    tileX,
    tileY,
  );

  return quantizingWorldPlazaRgbColor(
    resolvingWorldPlazaBiomeBlockTexturedTileFillColor(
      tileX,
      tileY,
      blendedBaseColor,
      { skipsAccentPatches: true },
    ),
  );
}
