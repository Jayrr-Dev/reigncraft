import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import type { IndexingWorldBuildingPlacedBlocksByTile } from '@/components/world/building/domains/indexingWorldBuildingPlacedBlocksByTile';
import type { CheckingWorldPlazaTerrainElevationColumnCollisionContext } from '@/components/world/domains/checkingWorldPlazaTerrainElevationColumnBlocksPlayerAtTileIndex';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';

/**
 * Per-frame collision context passed through the provider registry.
 *
 * @module components/world/collision/domains/definingWorldCollisionContext
 */

/** Options for collision resolution and spatial queries. */
export type DefiningWorldCollisionContext = {
  readonly isJumping?: boolean;
  readonly jumpProgress?: number;
  readonly fallbackPosition?: DefiningWorldPlazaWorldPoint;
  readonly placedBlocks?: readonly DefiningWorldBuildingPlacedBlock[];
  readonly placedBlocksByTile?: IndexingWorldBuildingPlacedBlocksByTile;
  readonly playerLayer?: number;
  readonly playerCenter?: DefiningWorldPlazaWorldPoint;
  readonly movementDelta?: DefiningWorldPlazaWorldPoint;
  readonly playerRadiusGrid?: number;
  readonly terrainColumnCollisionContext?: CheckingWorldPlazaTerrainElevationColumnCollisionContext;
};
