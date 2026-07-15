import { invalidatingWorldPlazaLakeBasinOccupyCache } from '@/components/world/domains/checkingWorldPlazaLakeBasinOccupiesTileAtTileIndex';
import { invalidatingWorldPlazaLavaAtTileIndexCache } from '@/components/world/domains/checkingWorldPlazaLavaAtTileIndex';
import { invalidatingWorldPlazaRiverChannelPassesNoiseCache } from '@/components/world/domains/checkingWorldPlazaRiverChannelPlacesRiverAtTileIndex';
import { invalidatingWorldPlazaStreamChannelPassesNoiseCache } from '@/components/world/domains/checkingWorldPlazaStreamChannelPlacesStreamAtTileIndex';
import { invalidatingWorldPlazaWaterFrozenStateAtTileIndexCache } from '@/components/world/domains/checkingWorldPlazaWaterIsFrozenAtTileIndex';
import { invalidatingWorldPlazaWaterShimmerTileEntryCache } from '@/components/world/domains/drawingWorldPlazaWaterShimmerOnGraphics';
import { invalidatingWorldPlazaBiomeCaches } from '@/components/world/domains/resolvingWorldPlazaBiomeAtTileIndex';
import { invalidatingWorldPlazaColumnRockMetadataCache } from '@/components/world/domains/resolvingWorldPlazaColumnRockMetadataAtAnchorTileIndex';
import { invalidatingWorldPlazaFirelandsPropCache } from '@/components/world/domains/resolvingWorldPlazaFirelandsPropAtTileIndex';
import { invalidatingWorldPlazaLakeShoreDepthCache } from '@/components/world/domains/resolvingWorldPlazaLakeShoreDepthAtTileIndex';
import { invalidatingWorldPlazaLakeWaterShallowDepthCache } from '@/components/world/domains/resolvingWorldPlazaLakeWaterDepthAtTileIndex';
import { invalidatingWorldPlazaMiniMapTileFillColorCache } from '@/components/world/domains/resolvingWorldPlazaMiniMapTileFillColor';
import { invalidatingWorldPlazaNamedRealmCaches } from '@/components/world/domains/resolvingWorldPlazaNamedRealmAtTileIndex';
import { invalidatingWorldPlazaOceanShoreDepthCache } from '@/components/world/domains/resolvingWorldPlazaOceanShoreDepthAtTileIndex';
import { invalidatingWorldPlazaPondShoreFillColorCache } from '@/components/world/domains/resolvingWorldPlazaPondShoreFillColorAtTileIndex';
import { invalidatingWorldPlazaStoneDecorationCache } from '@/components/world/domains/resolvingWorldPlazaStoneDecorationAtTileIndex';
import { invalidatingWorldPlazaTerrainElevationAtTileIndexCache } from '@/components/world/domains/resolvingWorldPlazaTerrainElevationAtTileIndex';
import { invalidatingWorldPlazaTreeAtTileIndexCache } from '@/components/world/domains/resolvingWorldPlazaTreeAtTileIndex';
import { invalidatingWorldPlazaWaterAtTileIndexCache } from '@/components/world/domains/resolvingWorldPlazaWaterAtTileIndex';
import { invalidatingWorldPlazaWaterSurfaceTileDrawMetadataCache } from '@/components/world/domains/resolvingWorldPlazaWaterSurfaceTileDrawMetadataAtTileIndex';
import { invalidatingWorldPlazaMushroomHabitatClaimCaches } from '@/components/world/mushrooms/domains/resolvingWorldPlazaMushroomHabitatClaimAtTileIndex';

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
  invalidatingWorldPlazaLavaAtTileIndexCache();
  invalidatingWorldPlazaWaterFrozenStateAtTileIndexCache();
  invalidatingWorldPlazaNamedRealmCaches();
  invalidatingWorldPlazaFirelandsPropCache();
  invalidatingWorldPlazaWaterAtTileIndexCache();
  invalidatingWorldPlazaWaterShimmerTileEntryCache();
  invalidatingWorldPlazaWaterSurfaceTileDrawMetadataCache();
  invalidatingWorldPlazaRiverChannelPassesNoiseCache();
  invalidatingWorldPlazaStreamChannelPassesNoiseCache();
  invalidatingWorldPlazaLakeBasinOccupyCache();
  invalidatingWorldPlazaLakeShoreDepthCache();
  invalidatingWorldPlazaLakeWaterShallowDepthCache();
  invalidatingWorldPlazaOceanShoreDepthCache();
  invalidatingWorldPlazaPondShoreFillColorCache();
  invalidatingWorldPlazaTreeAtTileIndexCache();
  invalidatingWorldPlazaMushroomHabitatClaimCaches();
  invalidatingWorldPlazaStoneDecorationCache();
  invalidatingWorldPlazaColumnRockMetadataCache();
  invalidatingWorldPlazaTerrainElevationAtTileIndexCache();
  invalidatingWorldPlazaMiniMapTileFillColorCache();
}
