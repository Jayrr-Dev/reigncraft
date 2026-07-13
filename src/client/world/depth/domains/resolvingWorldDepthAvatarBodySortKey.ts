import {
  checkingWorldDepthColumnFootIsInFrontOfAvatarFoot,
  checkingWorldDepthColumnFootIsOnAvatarStandingTile,
  checkingWorldDepthColumnIsAtOrBelowAvatarStandingLayer,
  checkingWorldDepthColumnIsRaisedAtOrBelowAvatarStandingLayer,
  checkingWorldDepthColumnIsTallerThanAvatarStandingLayer,
  checkingWorldDepthColumnSilhouetteReachesAvatarFootOnScreen,
} from '@/components/world/depth/domains/checkingWorldDepthColumnSilhouetteReachesAvatarFootOnScreen';
import { computingWorldDepthSortKey } from '@/components/world/depth/domains/computingWorldDepthSortKey';
import {
  DEFINING_WORLD_DEPTH_AVATAR_BODY_FRONT_OCCLUDER_STANDING_Z_INDEX_MARGIN,
  DEFINING_WORLD_DEPTH_AVATAR_BODY_SORT_FOOTPRINT_TILE_RADIUS,
  DEFINING_WORLD_DEPTH_ENTITY_ON_BLOCK_DEPTH_BIAS,
  DEFINING_WORLD_DEPTH_TERRAIN_ROCK_COLUMN_AVATAR_STANDING_DEPTH_BIAS,
} from '@/components/world/depth/domains/definingWorldDepthBiasLadder';
import type { DefiningWorldDepthProviderContext } from '@/components/world/depth/domains/definingWorldDepthProvider';
import { DEFINING_WORLD_DEPTH_AVATAR_OCCLUSION_PROVIDERS } from '@/components/world/depth/domains/definingWorldDepthProviderRegistry';
import { checkingWorldPlazaTileHasColumnRockAtTileIndex } from '@/components/world/domains/checkingWorldPlazaTileFloorIsOccludedByColumnRockAtTileIndex';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaPlayerWorldLayer } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaColumnRockMetadataAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaColumnRockMetadataAtTileIndex';
import { resolvingWorldPlazaTerrainRockColumnEntityZIndex } from '@/components/world/domains/resolvingWorldPlazaTerrainRockColumnEntityZIndex';
import { resolvingWorldPlazaTerrainRockColumnSurfaceLayerAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaTerrainRockColumnSurfaceLayerAtTileIndex';

/**
 * Avatar body entity-layer sort key via declarative provider scans.
 *
 * @module components/world/depth/domains/resolvingWorldDepthAvatarBodySortKey
 */

type ResolvingWorldDepthAvatarBodyFootprintScan = {
  maxStandingBumpSortKey: number;
  maxBehindColumnSortKey: number;
  minFrontOccluderCap: number;
  maxHardFloorSortKey: number;
};

function computingWorldDepthAvatarBodyStandingZIndexCapBehindOccluder(
  occluderSortKey: number
): number {
  return (
    occluderSortKey -
    DEFINING_WORLD_DEPTH_AVATAR_BODY_FRONT_OCCLUDER_STANDING_Z_INDEX_MARGIN
  );
}

function scanningWorldDepthAvatarBodyFootprint(
  gridPoint: DefiningWorldPlazaWorldPoint,
  centerTileX: number,
  centerTileY: number,
  standingLayer: number,
  context: DefiningWorldDepthProviderContext
): ResolvingWorldDepthAvatarBodyFootprintScan {
  let maxStandingBumpSortKey = Number.NEGATIVE_INFINITY;
  let maxBehindColumnSortKey = Number.NEGATIVE_INFINITY;
  let minFrontOccluderCap = Number.POSITIVE_INFINITY;
  let maxHardFloorSortKey = Number.NEGATIVE_INFINITY;
  const avatarFootSum = gridPoint.x + gridPoint.y;

  for (
    let tileOffsetY =
      -DEFINING_WORLD_DEPTH_AVATAR_BODY_SORT_FOOTPRINT_TILE_RADIUS;
    tileOffsetY <= DEFINING_WORLD_DEPTH_AVATAR_BODY_SORT_FOOTPRINT_TILE_RADIUS;
    tileOffsetY += 1
  ) {
    for (
      let tileOffsetX =
        -DEFINING_WORLD_DEPTH_AVATAR_BODY_SORT_FOOTPRINT_TILE_RADIUS;
      tileOffsetX <=
      DEFINING_WORLD_DEPTH_AVATAR_BODY_SORT_FOOTPRINT_TILE_RADIUS;
      tileOffsetX += 1
    ) {
      const tileX = centerTileX + tileOffsetX;
      const tileY = centerTileY + tileOffsetY;

      for (const provider of DEFINING_WORLD_DEPTH_AVATAR_OCCLUSION_PROVIDERS) {
        if (!provider.checkingHasColumnAtTileIndex(tileX, tileY, context)) {
          continue;
        }

        const surfaceLayer = provider.resolvingSurfaceLayerAtTileIndex(
          tileX,
          tileY,
          context
        );
        const sortKey = provider.resolvingSortKeyAtTileIndex(
          tileX,
          tileY,
          context
        );
        const depthSortFoot = provider.resolvingDepthSortFootAtTileIndex(
          tileX,
          tileY,
          context
        );
        const isOverheadOnStandingTile =
          checkingWorldDepthColumnFootIsOnAvatarStandingTile(
            gridPoint,
            depthSortFoot.x,
            depthSortFoot.y
          );
        const appliesSameTileOverhead =
          provider.participatesInSameTileOverheadOcclusion &&
          isOverheadOnStandingTile;

        if (
          provider.participatesInStandingBump &&
          (provider.standingBumpRequiresRaisedSurface
            ? checkingWorldDepthColumnIsRaisedAtOrBelowAvatarStandingLayer(
                surfaceLayer,
                standingLayer
              )
            : checkingWorldDepthColumnIsAtOrBelowAvatarStandingLayer(
                surfaceLayer,
                standingLayer
              ))
        ) {
          maxStandingBumpSortKey = Math.max(maxStandingBumpSortKey, sortKey);
        }

        // Northern/behind columns (lower foot sum) must stay under a southern
        // avatar even when height bias inflates their sort key.
        if (
          depthSortFoot.x + depthSortFoot.y < avatarFootSum &&
          !appliesSameTileOverhead
        ) {
          maxBehindColumnSortKey = Math.max(maxBehindColumnSortKey, sortKey);
        }

        if (provider.participatesInFrontOcclusion) {
          const isTaller =
            provider.alwaysTallerForFrontOcclusion ||
            checkingWorldDepthColumnIsTallerThanAvatarStandingLayer(
              surfaceLayer,
              standingLayer
            );
          const isInFront = checkingWorldDepthColumnFootIsInFrontOfAvatarFoot(
            gridPoint,
            depthSortFoot.x,
            depthSortFoot.y
          );
          const silhouetteOk =
            !provider.requiresSilhouetteReachForFrontOcclusion ||
            checkingWorldDepthColumnSilhouetteReachesAvatarFootOnScreen(
              gridPoint,
              standingLayer,
              depthSortFoot.x,
              depthSortFoot.y,
              surfaceLayer
            );

          if (
            isTaller &&
            (isInFront || appliesSameTileOverhead) &&
            silhouetteOk
          ) {
            minFrontOccluderCap = Math.min(
              minFrontOccluderCap,
              computingWorldDepthAvatarBodyStandingZIndexCapBehindOccluder(
                sortKey
              )
            );
          }
        }

        if (
          Math.abs(tileOffsetX) <= 1 &&
          Math.abs(tileOffsetY) <= 1 &&
          provider.participatesInStandingBump &&
          checkingWorldDepthColumnIsRaisedAtOrBelowAvatarStandingLayer(
            surfaceLayer,
            standingLayer
          ) &&
          checkingWorldDepthColumnSilhouetteReachesAvatarFootOnScreen(
            gridPoint,
            standingLayer,
            tileX,
            tileY,
            surfaceLayer
          )
        ) {
          maxHardFloorSortKey = Math.max(maxHardFloorSortKey, sortKey);
        }
      }
    }
  }

  return {
    maxStandingBumpSortKey,
    maxBehindColumnSortKey,
    minFrontOccluderCap,
    maxHardFloorSortKey,
  };
}

/**
 * Returns the avatar body entity-layer z-index for the given grid foot.
 */
export function resolvingWorldDepthAvatarBodySortKey(
  gridPoint: DefiningWorldPlazaWorldPoint,
  context: DefiningWorldDepthProviderContext = {}
): number {
  const footSortKey =
    computingWorldDepthSortKey(gridPoint) +
    DEFINING_WORLD_DEPTH_ENTITY_ON_BLOCK_DEPTH_BIAS;
  const centerTileX = Math.floor(gridPoint.x);
  const centerTileY = Math.floor(gridPoint.y);
  const standingLayer = resolvingWorldPlazaPlayerWorldLayer(gridPoint);
  const scan = scanningWorldDepthAvatarBodyFootprint(
    gridPoint,
    centerTileX,
    centerTileY,
    standingLayer,
    context
  );

  let standingBodySortKey = Math.max(
    footSortKey,
    scan.maxStandingBumpSortKey +
      DEFINING_WORLD_DEPTH_ENTITY_ON_BLOCK_DEPTH_BIAS
  );

  if (Number.isFinite(scan.maxBehindColumnSortKey)) {
    standingBodySortKey = Math.max(
      standingBodySortKey,
      scan.maxBehindColumnSortKey + 1
    );
  }

  if (
    checkingWorldPlazaTileHasColumnRockAtTileIndex(centerTileX, centerTileY)
  ) {
    const rockSurfaceLayer =
      resolvingWorldPlazaTerrainRockColumnSurfaceLayerAtTileIndex(
        centerTileX,
        centerTileY
      );
    const columnRockMetadata = resolvingWorldPlazaColumnRockMetadataAtTileIndex(
      centerTileX,
      centerTileY
    );

    if (standingLayer >= rockSurfaceLayer && columnRockMetadata) {
      const rockSortKey = resolvingWorldPlazaTerrainRockColumnEntityZIndex(
        columnRockMetadata.anchorTileX,
        columnRockMetadata.anchorTileY,
        columnRockMetadata
      );

      standingBodySortKey = Math.max(
        standingBodySortKey,
        rockSortKey +
          DEFINING_WORLD_DEPTH_TERRAIN_ROCK_COLUMN_AVATAR_STANDING_DEPTH_BIAS
      );
    }
  }

  if (scan.minFrontOccluderCap !== Number.POSITIVE_INFINITY) {
    standingBodySortKey = Math.min(
      standingBodySortKey,
      scan.minFrontOccluderCap
    );

    if (Number.isFinite(scan.maxHardFloorSortKey)) {
      const occluderHardCeilingSortKey =
        scan.minFrontOccluderCap +
        DEFINING_WORLD_DEPTH_AVATAR_BODY_FRONT_OCCLUDER_STANDING_Z_INDEX_MARGIN -
        1;

      standingBodySortKey = Math.min(
        Math.max(standingBodySortKey, scan.maxHardFloorSortKey + 1),
        occluderHardCeilingSortKey
      );
    }

    // Front-occluder clamp must not pull the avatar under northern columns
    // whose tops/cliff faces still overlap on screen.
    if (Number.isFinite(scan.maxBehindColumnSortKey)) {
      standingBodySortKey = Math.max(
        standingBodySortKey,
        Math.min(scan.maxBehindColumnSortKey + 1, scan.minFrontOccluderCap)
      );
    }
  }

  return standingBodySortKey;
}

/**
 * Highest sort key among foot-reaching floor columns (hard floor raise).
 */
export function resolvingWorldDepthAvatarBodyHardFloorSortKeyFromFootReachingColumns(
  gridPoint: DefiningWorldPlazaWorldPoint,
  centerTileX: number,
  centerTileY: number,
  standingLayer: number,
  context: DefiningWorldDepthProviderContext = {}
): number {
  const scan = scanningWorldDepthAvatarBodyFootprint(
    gridPoint,
    centerTileX,
    centerTileY,
    standingLayer,
    context
  );

  return scan.maxHardFloorSortKey;
}

/**
 * Strictest front-occluder cap from provider scan.
 */
export function resolvingWorldDepthAvatarBodyMinStandingSortKeyCapFromFrontOccluders(
  gridPoint: DefiningWorldPlazaWorldPoint,
  centerTileX: number,
  centerTileY: number,
  standingLayer: number,
  context: DefiningWorldDepthProviderContext = {}
): number {
  const scan = scanningWorldDepthAvatarBodyFootprint(
    gridPoint,
    centerTileX,
    centerTileY,
    standingLayer,
    context
  );

  return scan.minFrontOccluderCap;
}
