import {
  checkingWorldPlazaFirelandsRuinForcesLavaAtTileIndex,
  resolvingWorldPlazaFirelandsRuinBlueprintIndexAtAnchorTileIndex,
} from '@/components/world/domains/checkingWorldPlazaFirelandsRuinForcesLavaAtTileIndex';
import { checkingWorldPlazaLavaAtTileIndex } from '@/components/world/domains/checkingWorldPlazaLavaAtTileIndex';
import { checkingWorldPlazaTileIsFirelandsBiomeAtTileIndex } from '@/components/world/domains/checkingWorldPlazaTileIsFirelandsBiomeAtTileIndex';
import { computingWorldPlazaFirelandsStructureAnchorTileIndex } from '@/components/world/domains/computingWorldPlazaFirelandsStructureAnchorTileIndex';
import {
  DEFINING_WORLD_PLAZA_FIRELANDS_SCATTER_DETAIL_NOISE_FREQUENCY,
  DEFINING_WORLD_PLAZA_FIRELANDS_SCATTER_DETAIL_NOISE_MIN,
  DEFINING_WORLD_PLAZA_FIRELANDS_SCATTER_DETAIL_NOISE_SEED,
  DEFINING_WORLD_PLAZA_FIRELANDS_SCATTER_LARGE_ANCHOR_TILE,
  DEFINING_WORLD_PLAZA_FIRELANDS_SCATTER_LARGE_SPACING_CELL_TILES,
  DEFINING_WORLD_PLAZA_FIRELANDS_SCATTER_PATCH_NOISE_FREQUENCY,
  DEFINING_WORLD_PLAZA_FIRELANDS_SCATTER_PATCH_NOISE_MIN,
  DEFINING_WORLD_PLAZA_FIRELANDS_SCATTER_PATCH_NOISE_SEED,
  DEFINING_WORLD_PLAZA_FIRELANDS_SCATTER_SMALL_ANCHOR_TILE,
  DEFINING_WORLD_PLAZA_FIRELANDS_SCATTER_SMALL_SPACING_CELL_TILES,
  DEFINING_WORLD_PLAZA_FIRELANDS_STRUCTURE_SPACING_CELL_TILES,
  DEFINING_WORLD_PLAZA_FIRELANDS_VOLCANO_CENTRALITY_MIN,
  DEFINING_WORLD_PLAZA_FIRELANDS_VOLCANO_FOOTPRINT_HALF_SPAN_TILES,
} from '@/components/world/domains/definingWorldPlazaFirelandsBiomeConstants';
import type { DefiningWorldPlazaFirelandsPropKind } from '@/components/world/domains/definingWorldPlazaFirelandsRuinBlueprintConstants';
import {
  DEFINING_WORLD_PLAZA_FIRELANDS_RUIN_BLUEPRINTS,
  DEFINING_WORLD_PLAZA_FIRELANDS_RUIN_CELL_SEARCH_RADIUS_CELLS,
} from '@/components/world/domains/definingWorldPlazaFirelandsRuinBlueprintConstants';
import { samplingWorldPlazaFractalNoise } from '@/components/world/domains/generatingWorldPlazaValueNoise';
import { resolvingWorldPlazaFirelandsCentralityAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaFirelandsCentralityAtTileIndex';
import {
  mappingWorldPlazaGrassSeededUnitToFloatRange,
  seedingWorldPlazaGrassTileDecorationFromTileIndex,
} from '@/components/world/domains/seedingWorldPlazaGrassTileDecorationFromTileIndex';

/**
 * Deterministic Firelands sprite prop placement for scatter, ruins, and volcanoes.
 *
 * @module components/world/domains/resolvingWorldPlazaFirelandsPropAtTileIndex
 */

/** Hard cap on memoized prop columns before the cache is reset. */
const RESOLVING_WORLD_PLAZA_FIRELANDS_PROP_CACHE_MAX_COLUMNS = 4000;

/** Memoized prop results keyed by tile column→row. */
const resolvingWorldPlazaFirelandsPropAtTileIndexCacheByColumn = new Map<
  number,
  Map<number, DefiningWorldPlazaFirelandsPropInstance | null>
>();

/** One placed Firelands sprite prop. */
export type DefiningWorldPlazaFirelandsPropInstance = {
  readonly kind: DefiningWorldPlazaFirelandsPropKind;
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

/**
 * Clears the Firelands prop memoization cache after generation rule changes.
 */
export function invalidatingWorldPlazaFirelandsPropCache(): void {
  resolvingWorldPlazaFirelandsPropAtTileIndexCacheByColumn.clear();
}

/**
 * Returns true when a tile lies inside a volcano footprint or ruin prop tile.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function checkingWorldPlazaFirelandsReservedStructureTileAtTileIndex(
  tileX: number,
  tileY: number
): boolean {
  if (
    checkingWorldPlazaFirelandsVolcanoFootprintOccupiesTileAtTileIndex(
      tileX,
      tileY
    )
  ) {
    return true;
  }

  return resolvingWorldPlazaFirelandsRuinPropAtTileIndex(tileX, tileY) !== null;
}

/**
 * Returns true when a tile lies inside a volcano collision footprint.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function checkingWorldPlazaFirelandsVolcanoFootprintOccupiesTileAtTileIndex(
  tileX: number,
  tileY: number
): boolean {
  const volcanoAnchor = resolvingWorldPlazaFirelandsVolcanoAnchorAtTileIndex(
    tileX,
    tileY
  );

  if (!volcanoAnchor) {
    return false;
  }

  const offsetTileX = tileX - volcanoAnchor.tileX;
  const offsetTileY = tileY - volcanoAnchor.tileY;
  const halfSpan =
    DEFINING_WORLD_PLAZA_FIRELANDS_VOLCANO_FOOTPRINT_HALF_SPAN_TILES;

  return Math.abs(offsetTileX) <= halfSpan && Math.abs(offsetTileY) <= halfSpan;
}

/**
 * Resolves the volcano anchor for the structure cell containing a tile, if any.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function resolvingWorldPlazaFirelandsVolcanoAnchorAtTileIndex(
  tileX: number,
  tileY: number
): { readonly tileX: number; readonly tileY: number } | null {
  const anchorTile = computingWorldPlazaFirelandsStructureAnchorTileIndex(
    tileX,
    tileY
  );

  if (
    !checkingWorldPlazaTileIsFirelandsBiomeAtTileIndex(
      anchorTile.tileX,
      anchorTile.tileY
    )
  ) {
    return null;
  }

  const centrality = resolvingWorldPlazaFirelandsCentralityAtTileIndex(
    anchorTile.tileX,
    anchorTile.tileY
  );

  if (centrality < DEFINING_WORLD_PLAZA_FIRELANDS_VOLCANO_CENTRALITY_MIN) {
    return null;
  }

  return anchorTile;
}

/**
 * Resolves a ruin prop at a tile, if the tile hosts one.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function resolvingWorldPlazaFirelandsRuinPropAtTileIndex(
  tileX: number,
  tileY: number
): DefiningWorldPlazaFirelandsPropInstance | null {
  if (!checkingWorldPlazaTileIsFirelandsBiomeAtTileIndex(tileX, tileY)) {
    return null;
  }

  const cellSize = DEFINING_WORLD_PLAZA_FIRELANDS_STRUCTURE_SPACING_CELL_TILES;
  const baseAnchor = computingWorldPlazaFirelandsStructureAnchorTileIndex(
    tileX,
    tileY
  );

  for (
    let searchOffsetY =
      -DEFINING_WORLD_PLAZA_FIRELANDS_RUIN_CELL_SEARCH_RADIUS_CELLS;
    searchOffsetY <=
    DEFINING_WORLD_PLAZA_FIRELANDS_RUIN_CELL_SEARCH_RADIUS_CELLS;
    searchOffsetY += 1
  ) {
    for (
      let searchOffsetX =
        -DEFINING_WORLD_PLAZA_FIRELANDS_RUIN_CELL_SEARCH_RADIUS_CELLS;
      searchOffsetX <=
      DEFINING_WORLD_PLAZA_FIRELANDS_RUIN_CELL_SEARCH_RADIUS_CELLS;
      searchOffsetX += 1
    ) {
      const anchorTileX = baseAnchor.tileX + searchOffsetX * cellSize;
      const anchorTileY = baseAnchor.tileY + searchOffsetY * cellSize;
      const blueprintIndex =
        resolvingWorldPlazaFirelandsRuinBlueprintIndexAtAnchorTileIndex(
          anchorTileX,
          anchorTileY
        );

      if (blueprintIndex === null) {
        continue;
      }

      const blueprint =
        DEFINING_WORLD_PLAZA_FIRELANDS_RUIN_BLUEPRINTS[blueprintIndex];
      const offsetTileX = tileX - anchorTileX;
      const offsetTileY = tileY - anchorTileY;

      for (const blueprintProp of blueprint.props) {
        if (
          blueprintProp.offsetTileX !== offsetTileX ||
          blueprintProp.offsetTileY !== offsetTileY
        ) {
          continue;
        }

        return buildingWorldPlazaFirelandsPropInstance({
          kind: blueprintProp.propKind,
          anchorTileX: tileX,
          anchorTileY: tileY,
          variantIndex: 0,
          collisionRadiusGrid: blueprintProp.collisionRadiusGrid,
          blocksMovement: blueprintProp.blocksMovement,
          displayScale: resolvingWorldPlazaFirelandsPropDisplayScale(
            blueprintProp.propKind
          ),
        });
      }
    }
  }

  return null;
}

/**
 * Returns true when a tile is a spacing anchor within a scatter cell.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param cellSize - Spacing cell size in tiles.
 * @param anchorTile - Anchor offset within the cell.
 */
function checkingWorldPlazaFirelandsScatterSpacingAnchorAtTileIndex(
  tileX: number,
  tileY: number,
  cellSize: number,
  anchorTile: number
): boolean {
  const normalizedTileX = ((tileX % cellSize) + cellSize) % cellSize;
  const normalizedTileY = ((tileY % cellSize) + cellSize) % cellSize;

  return normalizedTileX === anchorTile && normalizedTileY === anchorTile;
}

/**
 * Resolves display scale for one prop kind.
 *
 * @param kind - Prop kind.
 */
function resolvingWorldPlazaFirelandsPropDisplayScale(
  kind: DefiningWorldPlazaFirelandsPropKind
): number {
  switch (kind) {
    case 'volcano':
      return 2;
    case 'mini_volcano':
      return 0.26;
    case 'lava_tree':
      return 0.34;
    case 'volcanic_rock':
      return 0.16;
    case 'lava_forge':
    case 'lava_portal':
      return 0.2;
    case 'lava_obelisk':
      return 0.18;
    case 'lava_totem':
      return 0.16;
    case 'lava_anvil':
      return 0.15;
    case 'lava_fence':
      return 0.13;
    case 'lava_plant':
      return 0.11;
    default:
      return 0.14;
  }
}

/**
 * Builds a prop instance with cosmetic jitter from the anchor tile.
 *
 * @param params - Prop placement parameters.
 */
function buildingWorldPlazaFirelandsPropInstance(params: {
  readonly kind: DefiningWorldPlazaFirelandsPropKind;
  readonly anchorTileX: number;
  readonly anchorTileY: number;
  readonly variantIndex: number;
  readonly collisionRadiusGrid: number;
  readonly blocksMovement: boolean;
  readonly displayScale: number;
}): DefiningWorldPlazaFirelandsPropInstance {
  const offsetXPx = mappingWorldPlazaGrassSeededUnitToFloatRange(
    seedingWorldPlazaGrassTileDecorationFromTileIndex(
      params.anchorTileX,
      params.anchorTileY,
      3011
    ),
    -6,
    6
  );
  const offsetYPx = mappingWorldPlazaGrassSeededUnitToFloatRange(
    seedingWorldPlazaGrassTileDecorationFromTileIndex(
      params.anchorTileX,
      params.anchorTileY,
      3019
    ),
    -4,
    4
  );

  return {
    kind: params.kind,
    anchorTileX: params.anchorTileX,
    anchorTileY: params.anchorTileY,
    variantIndex: params.variantIndex,
    offsetXPx,
    offsetYPx,
    collisionRadiusGrid: params.collisionRadiusGrid,
    blocksMovement: params.blocksMovement,
    displayScale: params.displayScale,
    sortTileX: params.anchorTileX,
    sortTileY: params.anchorTileY,
  };
}

/**
 * Resolves a scatter decoration prop at an anchor tile.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
function resolvingWorldPlazaFirelandsScatterPropAtAnchorTileIndex(
  tileX: number,
  tileY: number
): DefiningWorldPlazaFirelandsPropInstance | null {
  if (!checkingWorldPlazaTileIsFirelandsBiomeAtTileIndex(tileX, tileY)) {
    return null;
  }

  if (
    checkingWorldPlazaFirelandsReservedStructureTileAtTileIndex(tileX, tileY) ||
    checkingWorldPlazaLavaAtTileIndex(tileX, tileY) ||
    checkingWorldPlazaFirelandsRuinForcesLavaAtTileIndex(tileX, tileY)
  ) {
    return null;
  }

  const patchNoise = samplingWorldPlazaFractalNoise(
    tileX,
    tileY,
    DEFINING_WORLD_PLAZA_FIRELANDS_SCATTER_PATCH_NOISE_SEED,
    {
      frequency: DEFINING_WORLD_PLAZA_FIRELANDS_SCATTER_PATCH_NOISE_FREQUENCY,
      octaves: 3,
    }
  );

  if (patchNoise < DEFINING_WORLD_PLAZA_FIRELANDS_SCATTER_PATCH_NOISE_MIN) {
    return null;
  }

  const detailNoise = samplingWorldPlazaFractalNoise(
    tileX,
    tileY,
    DEFINING_WORLD_PLAZA_FIRELANDS_SCATTER_DETAIL_NOISE_SEED,
    {
      frequency: DEFINING_WORLD_PLAZA_FIRELANDS_SCATTER_DETAIL_NOISE_FREQUENCY,
      octaves: 2,
    }
  );

  if (detailNoise < DEFINING_WORLD_PLAZA_FIRELANDS_SCATTER_DETAIL_NOISE_MIN) {
    return null;
  }

  const variantIndex = Math.min(
    3,
    Math.floor(
      seedingWorldPlazaGrassTileDecorationFromTileIndex(tileX, tileY, 5531) * 4
    )
  );

  if (
    checkingWorldPlazaFirelandsScatterSpacingAnchorAtTileIndex(
      tileX,
      tileY,
      DEFINING_WORLD_PLAZA_FIRELANDS_SCATTER_LARGE_SPACING_CELL_TILES,
      DEFINING_WORLD_PLAZA_FIRELANDS_SCATTER_LARGE_ANCHOR_TILE
    )
  ) {
    // Large scatter is mini-volcanoes only (no lava trees).
    return buildingWorldPlazaFirelandsPropInstance({
      kind: 'mini_volcano',
      anchorTileX: tileX,
      anchorTileY: tileY,
      variantIndex,
      collisionRadiusGrid: 0.6,
      blocksMovement: true,
      displayScale:
        resolvingWorldPlazaFirelandsPropDisplayScale('mini_volcano'),
    });
  }

  if (
    checkingWorldPlazaFirelandsScatterSpacingAnchorAtTileIndex(
      tileX,
      tileY,
      DEFINING_WORLD_PLAZA_FIRELANDS_SCATTER_SMALL_SPACING_CELL_TILES,
      DEFINING_WORLD_PLAZA_FIRELANDS_SCATTER_SMALL_ANCHOR_TILE
    )
  ) {
    // Small scatter is lava plants only (no volcanic rocks).
    return buildingWorldPlazaFirelandsPropInstance({
      kind: 'lava_plant',
      anchorTileX: tileX,
      anchorTileY: tileY,
      variantIndex,
      collisionRadiusGrid: 0,
      blocksMovement: false,
      displayScale: resolvingWorldPlazaFirelandsPropDisplayScale('lava_plant'),
    });
  }

  return null;
}

/**
 * Resolves the Firelands sprite prop standing on a tile, if any.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function resolvingWorldPlazaFirelandsPropAtTileIndex(
  tileX: number,
  tileY: number
): DefiningWorldPlazaFirelandsPropInstance | null {
  let columnCache =
    resolvingWorldPlazaFirelandsPropAtTileIndexCacheByColumn.get(tileX);

  if (columnCache) {
    const cachedProp = columnCache.get(tileY);

    if (cachedProp !== undefined) {
      return cachedProp;
    }
  } else {
    if (
      resolvingWorldPlazaFirelandsPropAtTileIndexCacheByColumn.size >=
      RESOLVING_WORLD_PLAZA_FIRELANDS_PROP_CACHE_MAX_COLUMNS
    ) {
      resolvingWorldPlazaFirelandsPropAtTileIndexCacheByColumn.clear();
    }

    columnCache = new Map();
    resolvingWorldPlazaFirelandsPropAtTileIndexCacheByColumn.set(
      tileX,
      columnCache
    );
  }

  const computedProp = computingWorldPlazaFirelandsPropAtTileIndex(
    tileX,
    tileY
  );
  columnCache.set(tileY, computedProp);

  return computedProp;
}

/**
 * Computes the Firelands sprite prop for one tile without memoization.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
function computingWorldPlazaFirelandsPropAtTileIndex(
  tileX: number,
  tileY: number
): DefiningWorldPlazaFirelandsPropInstance | null {
  const ruinProp = resolvingWorldPlazaFirelandsRuinPropAtTileIndex(
    tileX,
    tileY
  );

  if (ruinProp) {
    return ruinProp;
  }

  const volcanoAnchor = resolvingWorldPlazaFirelandsVolcanoAnchorAtTileIndex(
    tileX,
    tileY
  );

  if (
    volcanoAnchor &&
    volcanoAnchor.tileX === tileX &&
    volcanoAnchor.tileY === tileY
  ) {
    const variantIndex = Math.min(
      3,
      Math.floor(
        seedingWorldPlazaGrassTileDecorationFromTileIndex(tileX, tileY, 6619) *
          4
      )
    );

    return buildingWorldPlazaFirelandsPropInstance({
      kind: 'volcano',
      anchorTileX: tileX,
      anchorTileY: tileY,
      variantIndex,
      collisionRadiusGrid: 0.85,
      blocksMovement: true,
      displayScale: resolvingWorldPlazaFirelandsPropDisplayScale('volcano'),
    });
  }

  return resolvingWorldPlazaFirelandsScatterPropAtAnchorTileIndex(tileX, tileY);
}

/**
 * Resolves a blocking Firelands prop for collision, including volcano footprints.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function resolvingWorldPlazaFirelandsBlockingPropAtTileIndex(
  tileX: number,
  tileY: number
): DefiningWorldPlazaFirelandsPropInstance | null {
  const prop = resolvingWorldPlazaFirelandsPropAtTileIndex(tileX, tileY);

  if (prop?.blocksMovement) {
    return prop;
  }

  const volcanoAnchor = resolvingWorldPlazaFirelandsVolcanoAnchorAtTileIndex(
    tileX,
    tileY
  );

  if (
    volcanoAnchor &&
    checkingWorldPlazaFirelandsVolcanoFootprintOccupiesTileAtTileIndex(
      tileX,
      tileY
    ) &&
    (volcanoAnchor.tileX !== tileX || volcanoAnchor.tileY !== tileY)
  ) {
    return buildingWorldPlazaFirelandsPropInstance({
      kind: 'volcano',
      anchorTileX: volcanoAnchor.tileX,
      anchorTileY: volcanoAnchor.tileY,
      variantIndex: 0,
      collisionRadiusGrid: 0.85,
      blocksMovement: true,
      displayScale: resolvingWorldPlazaFirelandsPropDisplayScale('volcano'),
    });
  }

  return null;
}
