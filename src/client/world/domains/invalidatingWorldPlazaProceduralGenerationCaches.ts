import { invalidatingWorldPlazaBiomeCaches } from "@/components/world/domains/resolvingWorldPlazaBiomeAtTileIndex";
import { invalidatingWorldPlazaLakeShoreDepthCache } from "@/components/world/domains/resolvingWorldPlazaLakeShoreDepthAtTileIndex";
import { invalidatingWorldPlazaMiniMapTileFillColorCache } from "@/components/world/domains/resolvingWorldPlazaMiniMapTileFillColor";
import { invalidatingWorldPlazaOceanShoreDepthCache } from "@/components/world/domains/resolvingWorldPlazaOceanShoreDepthAtTileIndex";
import { invalidatingWorldPlazaPondShoreFillColorCache } from "@/components/world/domains/resolvingWorldPlazaPondShoreFillColorAtTileIndex";
import { invalidatingWorldPlazaStoneDecorationCache } from "@/components/world/domains/resolvingWorldPlazaStoneDecorationAtTileIndex";
import { invalidatingWorldPlazaTerrainElevationAtTileIndexCache } from "@/components/world/domains/resolvingWorldPlazaTerrainElevationAtTileIndex";
import { invalidatingWorldPlazaWaterAtTileIndexCache } from "@/components/world/domains/resolvingWorldPlazaWaterAtTileIndex";

/**
 * Clears procedural terrain memoization after generation rule changes.
 *
 * @module components/world/domains/invalidatingWorldPlazaProceduralGenerationCaches
 */

/**
 * Clears biome, water, shore, and decoration caches used by procedural terrain.
 */
export function invalidatingWorldPlazaProceduralGenerationCaches(): void {
  invalidatingWorldPlazaBiomeCaches();
  invalidatingWorldPlazaWaterAtTileIndexCache();
  invalidatingWorldPlazaLakeShoreDepthCache();
  invalidatingWorldPlazaOceanShoreDepthCache();
  invalidatingWorldPlazaPondShoreFillColorCache();
  invalidatingWorldPlazaStoneDecorationCache();
  invalidatingWorldPlazaTerrainElevationAtTileIndexCache();
  invalidatingWorldPlazaMiniMapTileFillColorCache();
}
