import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import type { IndexingWorldBuildingPlacedBlocksByTile } from '@/components/world/building/domains/indexingWorldBuildingPlacedBlocksByTile';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';

/**
 * Shared context passed to depth providers during footprint scans.
 *
 * @module components/world/depth/domains/definingWorldDepthProvider
 */

/** Optional placed-block data for provider queries. */
export type DefiningWorldDepthProviderContext = {
  readonly placedBlocks?: readonly DefiningWorldBuildingPlacedBlock[];
  readonly placedBlocksByTile?: IndexingWorldBuildingPlacedBlocksByTile;
  /** Painted feet below the logical grid anchor, after avatar size scaling. */
  readonly avatarFootOffsetBelowGridAnchorPx?: number;
};

/** Identifier for a registered depth provider. */
export type DefiningWorldDepthProviderId =
  | 'terrainColumn'
  | 'placedBlockColumn'
  | 'columnRock'
  | 'treeTrunk'
  | 'treeFlatCanopy';

/**
 * Declarative depth provider for one world object category.
 *
 * Each provider answers surface height, sort key, and depth-sort foot queries
 * for a tile. Avatar standing bump and front-occlusion iterate this list
 * instead of hardcoding per-type branches.
 */
export type DefiningWorldDepthProvider = {
  readonly id: DefiningWorldDepthProviderId;
  /** Highest walkable surface layer this provider contributes at the tile. */
  readonly resolvingSurfaceLayerAtTileIndex: (
    tileX: number,
    tileY: number,
    context: DefiningWorldDepthProviderContext
  ) => number;
  /** Entity-layer sort key for graphics at the tile foot. */
  readonly resolvingSortKeyAtTileIndex: (
    tileX: number,
    tileY: number,
    context: DefiningWorldDepthProviderContext
  ) => number;
  /**
   * Grid foot used for the in-front depth test (`footX + footY > avatarX + avatarY`).
   * Defaults to tile center when omitted at call sites.
   */
  readonly resolvingDepthSortFootAtTileIndex: (
    tileX: number,
    tileY: number,
    context: DefiningWorldDepthProviderContext
  ) => DefiningWorldPlazaWorldPoint;
  /** When true, front occlusion ignores surface-layer height (tree trunks). */
  readonly alwaysTallerForFrontOcclusion: boolean;
  /** When true, provider contributes to the avatar standing bump scan. */
  readonly participatesInStandingBump: boolean;
  /** When true, standing bump only applies when surface layer is above ground. */
  readonly standingBumpRequiresRaisedSurface: boolean;
  /** When true, provider can cap avatar z-index when in front/overhead and taller. */
  readonly participatesInFrontOcclusion: boolean;
  /**
   * When true, a taller column on the avatar's standing tile can cap the body
   * behind it (walk-under roofs/slabs). Tree trunks / rocks / terrain set this
   * false so standing south on the same tile still draws in front.
   *
   * Placed blocks keep this true but gate with
   * {@link checkingAppliesSameTileOverheadOcclusionAtTileIndex} so only
   * floating slabs (air under the column) tuck — solid pine/walls do not.
   */
  readonly participatesInSameTileOverheadOcclusion: boolean;
  /**
   * Optional gate for same-tile overhead. When omitted, the boolean flag alone
   * decides. Placed blocks require a floating slab above the standing layer.
   */
  readonly checkingAppliesSameTileOverheadOcclusionAtTileIndex?: (
    tileX: number,
    tileY: number,
    standingLayer: number,
    context: DefiningWorldDepthProviderContext
  ) => boolean;
  /** When true, provider can occlude avatar ground shadows in the footprint. */
  readonly participatesInShadowOcclusion: boolean;
  /**
   * When true, silhouette height is checked before front occlusion applies.
   * Trees skip silhouette (trunk always occludes when in front).
   */
  readonly requiresSilhouetteReachForFrontOcclusion: boolean;
  /** Returns true when this provider has a renderable column at the tile. */
  readonly checkingHasColumnAtTileIndex: (
    tileX: number,
    tileY: number,
    context: DefiningWorldDepthProviderContext
  ) => boolean;
};
