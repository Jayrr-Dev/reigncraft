import { computingWorldPlazaFrostsinkSiteCenterTileIndex } from '@/components/world/domains/computingWorldPlazaFrostsinkSiteCenterTileIndex';
import {
  DEFINING_WORLD_PLAZA_FROSTSINK_CRYOCORE_COLLISION_RADIUS_GRID,
  DEFINING_WORLD_PLAZA_FROSTSINK_CRYOCORE_DISPLAY_SCALE,
  DEFINING_WORLD_PLAZA_FROSTSINK_CRYOCORE_VISUAL_SOUTH_OFFSET_Y_PX,
} from '@/components/world/domains/definingWorldPlazaFrostsinkBiomeConstants';
import {
  checkingWorldPlazaFrostsinkCryocoreFootprintOccupiesTile,
  checkingWorldPlazaFrostsinkSiteActiveAtCenterTileIndex,
  resolvingWorldPlazaFrostsinkAtTileIndex,
} from '@/components/world/domains/resolvingWorldPlazaFrostsinkAtTileIndex';
import {
  mappingWorldPlazaGrassSeededUnitToFloatRange,
  seedingWorldPlazaGrassTileDecorationFromTileIndex,
} from '@/components/world/domains/seedingWorldPlazaGrassTileDecorationFromTileIndex';

/**
 * Frostsink Cryocore prop resolve and collision footprint.
 *
 * @module components/world/domains/resolvingWorldPlazaFrostsinkPropAtTileIndex
 */

/** Cryocore is the only Frostsink prop kind in v1. */
export type DefiningWorldPlazaFrostsinkPropKind = 'cryocore';

/** One Frostsink prop instance at a tile anchor. */
export type DefiningWorldPlazaFrostsinkPropInstance = {
  readonly kind: DefiningWorldPlazaFrostsinkPropKind;
  readonly anchorTileX: number;
  readonly anchorTileY: number;
  readonly variantIndex: number;
  readonly offsetXPx: number;
  readonly offsetYPx: number;
  readonly collisionRadiusGrid: number;
  readonly blocksMovement: boolean;
  readonly displayScale: number;
  readonly sortTileX: number;
  readonly sortTileY: number;
};

const RESOLVING_WORLD_PLAZA_FROSTSINK_PROP_CACHE_MAX_COLUMNS = 4000;

const resolvingWorldPlazaFrostsinkPropAtTileIndexCacheByColumn = new Map<
  number,
  Map<number, DefiningWorldPlazaFrostsinkPropInstance | null>
>();

/**
 * Clears the Frostsink prop memoization cache after generation rule changes.
 */
export function invalidatingWorldPlazaFrostsinkPropCache(): void {
  resolvingWorldPlazaFrostsinkPropAtTileIndexCacheByColumn.clear();
}

function buildingWorldPlazaFrostsinkCryocorePropInstance(params: {
  readonly anchorTileX: number;
  readonly anchorTileY: number;
  readonly variantIndex: number;
}): DefiningWorldPlazaFrostsinkPropInstance {
  const offsetXPx = mappingWorldPlazaGrassSeededUnitToFloatRange(
    seedingWorldPlazaGrassTileDecorationFromTileIndex(
      params.anchorTileX,
      params.anchorTileY,
      3011
    ),
    -2,
    2
  );
  const offsetYPx =
    DEFINING_WORLD_PLAZA_FROSTSINK_CRYOCORE_VISUAL_SOUTH_OFFSET_Y_PX +
    mappingWorldPlazaGrassSeededUnitToFloatRange(
      seedingWorldPlazaGrassTileDecorationFromTileIndex(
        params.anchorTileX,
        params.anchorTileY,
        3019
      ),
      -1,
      1
    );

  return {
    kind: 'cryocore',
    anchorTileX: params.anchorTileX,
    anchorTileY: params.anchorTileY,
    variantIndex: params.variantIndex,
    offsetXPx,
    offsetYPx,
    collisionRadiusGrid:
      DEFINING_WORLD_PLAZA_FROSTSINK_CRYOCORE_COLLISION_RADIUS_GRID,
    blocksMovement: true,
    displayScale: DEFINING_WORLD_PLAZA_FROSTSINK_CRYOCORE_DISPLAY_SCALE,
    sortTileX: params.anchorTileX,
    sortTileY: params.anchorTileY,
  };
}

/**
 * Resolves the Cryocore center for the spacing cell, if the site is active.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function resolvingWorldPlazaFrostsinkCryocoreAnchorAtTileIndex(
  tileX: number,
  tileY: number
): { readonly tileX: number; readonly tileY: number } | null {
  const center = computingWorldPlazaFrostsinkSiteCenterTileIndex(tileX, tileY);

  if (
    !checkingWorldPlazaFrostsinkSiteActiveAtCenterTileIndex(
      center.tileX,
      center.tileY
    )
  ) {
    return null;
  }

  return center;
}

/**
 * Returns true when a tile lies inside a Cryocore collision footprint.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function checkingWorldPlazaFrostsinkCryocoreFootprintOccupiesTileAtTileIndex(
  tileX: number,
  tileY: number
): boolean {
  const cryocoreAnchor = resolvingWorldPlazaFrostsinkCryocoreAnchorAtTileIndex(
    tileX,
    tileY
  );

  if (!cryocoreAnchor) {
    return false;
  }

  return checkingWorldPlazaFrostsinkCryocoreFootprintOccupiesTile(
    tileX,
    tileY,
    cryocoreAnchor.tileX,
    cryocoreAnchor.tileY
  );
}

/**
 * Resolves a Frostsink prop at a tile (Cryocore only at the site center).
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function resolvingWorldPlazaFrostsinkPropAtTileIndex(
  tileX: number,
  tileY: number
): DefiningWorldPlazaFrostsinkPropInstance | null {
  let columnCache =
    resolvingWorldPlazaFrostsinkPropAtTileIndexCacheByColumn.get(tileX);

  if (columnCache) {
    const cached = columnCache.get(tileY);

    if (cached !== undefined) {
      return cached;
    }
  } else {
    if (
      resolvingWorldPlazaFrostsinkPropAtTileIndexCacheByColumn.size >=
      RESOLVING_WORLD_PLAZA_FROSTSINK_PROP_CACHE_MAX_COLUMNS
    ) {
      resolvingWorldPlazaFrostsinkPropAtTileIndexCacheByColumn.clear();
    }

    columnCache = new Map();
    resolvingWorldPlazaFrostsinkPropAtTileIndexCacheByColumn.set(
      tileX,
      columnCache
    );
  }

  const frostsink = resolvingWorldPlazaFrostsinkAtTileIndex(tileX, tileY);

  if (
    !frostsink ||
    frostsink.centerTileX !== tileX ||
    frostsink.centerTileY !== tileY
  ) {
    columnCache.set(tileY, null);
    return null;
  }

  const prop = buildingWorldPlazaFrostsinkCryocorePropInstance({
    anchorTileX: tileX,
    anchorTileY: tileY,
    // Always Cryocore1 (favorite sapphire orb); variants 2–4 are identical copies.
    variantIndex: 0,
  });

  columnCache.set(tileY, prop);

  return prop;
}

/**
 * Resolves a blocking Frostsink prop for collision, including Cryocore footprints.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function resolvingWorldPlazaFrostsinkBlockingPropAtTileIndex(
  tileX: number,
  tileY: number
): DefiningWorldPlazaFrostsinkPropInstance | null {
  const prop = resolvingWorldPlazaFrostsinkPropAtTileIndex(tileX, tileY);

  if (prop?.blocksMovement) {
    return prop;
  }

  const cryocoreAnchor = resolvingWorldPlazaFrostsinkCryocoreAnchorAtTileIndex(
    tileX,
    tileY
  );

  if (
    cryocoreAnchor &&
    checkingWorldPlazaFrostsinkCryocoreFootprintOccupiesTile(
      tileX,
      tileY,
      cryocoreAnchor.tileX,
      cryocoreAnchor.tileY
    ) &&
    (cryocoreAnchor.tileX !== tileX || cryocoreAnchor.tileY !== tileY)
  ) {
    return buildingWorldPlazaFrostsinkCryocorePropInstance({
      anchorTileX: cryocoreAnchor.tileX,
      anchorTileY: cryocoreAnchor.tileY,
      variantIndex: 0,
    });
  }

  return null;
}
