import { invalidatingWorldPlazaLakeBasinOccupyCache } from '@/components/world/domains/checkingWorldPlazaLakeBasinOccupiesTileAtTileIndex';
import { invalidatingWorldPlazaLavaAtTileIndexCache } from '@/components/world/domains/checkingWorldPlazaLavaAtTileIndex';
import { invalidatingWorldPlazaRiverChannelPassesNoiseCache } from '@/components/world/domains/checkingWorldPlazaRiverChannelPlacesRiverAtTileIndex';
import { invalidatingWorldPlazaWaterFrozenStateAtTileIndexCache } from '@/components/world/domains/checkingWorldPlazaWaterIsFrozenAtTileIndex';
import { invalidatingWorldPlazaBiomeCaches } from '@/components/world/domains/resolvingWorldPlazaBiomeAtTileIndex';
import { invalidatingWorldPlazaColumnRockMetadataCache } from '@/components/world/domains/resolvingWorldPlazaColumnRockMetadataAtAnchorTileIndex';
import { invalidatingWorldPlazaFirelandsPropCache } from '@/components/world/domains/resolvingWorldPlazaFirelandsPropAtTileIndex';
import { invalidatingWorldPlazaLakeShoreDepthCache } from '@/components/world/domains/resolvingWorldPlazaLakeShoreDepthAtTileIndex';
import { invalidatingWorldPlazaMiniMapTileFillColorCache } from '@/components/world/domains/resolvingWorldPlazaMiniMapTileFillColor';
import { invalidatingWorldPlazaNamedRealmCaches } from '@/components/world/domains/resolvingWorldPlazaNamedRealmAtTileIndex';
import { invalidatingWorldPlazaOceanShoreDepthCache } from '@/components/world/domains/resolvingWorldPlazaOceanShoreDepthAtTileIndex';
import { invalidatingWorldPlazaPondShoreFillColorCache } from '@/components/world/domains/resolvingWorldPlazaPondShoreFillColorAtTileIndex';
import { invalidatingWorldPlazaStoneDecorationCache } from '@/components/world/domains/resolvingWorldPlazaStoneDecorationAtTileIndex';
import { invalidatingWorldPlazaTerrainElevationAtTileIndexCache } from '@/components/world/domains/resolvingWorldPlazaTerrainElevationAtTileIndex';
import { invalidatingWorldPlazaTreeAtTileIndexCache } from '@/components/world/domains/resolvingWorldPlazaTreeAtTileIndex';
import { invalidatingWorldPlazaWaterAtTileIndexCache } from '@/components/world/domains/resolvingWorldPlazaWaterAtTileIndex';

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
  invalidatingWorldPlazaRiverChannelPassesNoiseCache();
  invalidatingWorldPlazaLakeBasinOccupyCache();
  invalidatingWorldPlazaLakeShoreDepthCache();
  invalidatingWorldPlazaOceanShoreDepthCache();
  invalidatingWorldPlazaPondShoreFillColorCache();
  invalidatingWorldPlazaTreeAtTileIndexCache();
  invalidatingWorldPlazaStoneDecorationCache();
  invalidatingWorldPlazaColumnRockMetadataCache();
  invalidatingWorldPlazaTerrainElevationAtTileIndexCache();
  invalidatingWorldPlazaMiniMapTileFillColorCache();
}
