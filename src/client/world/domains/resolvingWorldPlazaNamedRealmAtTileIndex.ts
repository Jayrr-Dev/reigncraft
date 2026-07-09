import { DEFINING_WORLD_PLAZA_BIOME_REGION_TILE_SIZE } from '@/components/world/domains/definingWorldPlazaBiomeConstants';
import {
  DEFINING_WORLD_PLAZA_NAMED_REALM_CENTER_SPAWN_CHANCE,
  DEFINING_WORLD_PLAZA_NAMED_REALM_JITTER_SEED_SALT,
  DEFINING_WORLD_PLAZA_NAMED_REALM_LATTICE_BIOME_REGIONS,
  DEFINING_WORLD_PLAZA_NAMED_REALM_NAME_SEED_SALT,
  DEFINING_WORLD_PLAZA_NAMED_REALM_SEARCH_LATTICE_RADIUS,
  DEFINING_WORLD_PLAZA_NAMED_REALM_SIZE_SEED_SALT,
  DEFINING_WORLD_PLAZA_NAMED_REALM_SIZE_WEIGHT_MAX,
  DEFINING_WORLD_PLAZA_NAMED_REALM_SIZE_WEIGHT_MIN,
  DEFINING_WORLD_PLAZA_NAMED_REALM_SPAWN_SEED_SALT,
  DEFINING_WORLD_PLAZA_NAMED_REALM_TITLE_SEED_SALT,
} from '@/components/world/domains/definingWorldPlazaNamedRealmConstants';
import { DEFINING_WORLD_PLAZA_NAMED_REALM_PLACE_NAMES } from '@/components/world/domains/definingWorldPlazaNamedRealmNameCatalog';
import {
  DEFINING_WORLD_PLAZA_NAMED_REALM_TITLE_REGISTRY,
  type DefiningWorldPlazaNamedRealmTitleKind,
} from '@/components/world/domains/definingWorldPlazaNamedRealmTitleRegistry';
import { hashingWorldPlazaCoordinateToUnitFloat } from '@/components/world/domains/generatingWorldPlazaValueNoise';
import { resolvingWorldPlazaIsometricTileIndexAtGridPoint } from '@/components/world/domains/resolvingWorldPlazaIsometricTileIndexAtGridPoint';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';

/**
 * Resolves variable-size named realms that span multiple biomes.
 *
 * @module components/world/domains/resolvingWorldPlazaNamedRealmAtTileIndex
 */

export type DefiningWorldPlazaNamedRealm = {
  /** Stable id for discovery storage (`latticeX:latticeY`). */
  readonly realmId: string;
  /** Place root from the village name catalog. */
  readonly placeName: string;
  /** Political / geographic title kind. */
  readonly titleKind: DefiningWorldPlazaNamedRealmTitleKind;
  /** Full HUD display name (e.g. "Kingdom of Westville"). */
  readonly displayName: string;
  /** Size weight used for weighted Voronoi (higher = larger claim). */
  readonly sizeWeight: number;
};

type DefiningWorldPlazaNamedRealmCenter = {
  readonly latticeX: number;
  readonly latticeY: number;
  readonly centerRegionX: number;
  readonly centerRegionY: number;
  readonly sizeWeight: number;
  readonly placeName: string;
  readonly titleKind: DefiningWorldPlazaNamedRealmTitleKind;
  readonly displayName: string;
  readonly realmId: string;
};

const RESOLVING_WORLD_PLAZA_NAMED_REALM_CACHE_MAX_COLUMNS = 4000;

const resolvingWorldPlazaNamedRealmAtBiomeRegionCacheByColumn = new Map<
  number,
  Map<number, DefiningWorldPlazaNamedRealm>
>();

function pickingWorldPlazaNamedRealmPoolIndex(
  latticeX: number,
  latticeY: number,
  salt: number,
  poolLength: number
): number {
  const unit = hashingWorldPlazaCoordinateToUnitFloat(latticeX, latticeY, salt);

  return Math.min(poolLength - 1, Math.floor(unit * poolLength));
}

function resolvingWorldPlazaNamedRealmCenterAtLattice(
  latticeX: number,
  latticeY: number
): DefiningWorldPlazaNamedRealmCenter | null {
  const spawnRoll = hashingWorldPlazaCoordinateToUnitFloat(
    latticeX,
    latticeY,
    DEFINING_WORLD_PLAZA_NAMED_REALM_SPAWN_SEED_SALT
  );

  if (spawnRoll >= DEFINING_WORLD_PLAZA_NAMED_REALM_CENTER_SPAWN_CHANCE) {
    return null;
  }

  const jitterX = hashingWorldPlazaCoordinateToUnitFloat(
    latticeX,
    latticeY,
    DEFINING_WORLD_PLAZA_NAMED_REALM_JITTER_SEED_SALT
  );
  const jitterY = hashingWorldPlazaCoordinateToUnitFloat(
    latticeX,
    latticeY,
    DEFINING_WORLD_PLAZA_NAMED_REALM_JITTER_SEED_SALT ^ 0x55
  );
  const sizeUnit = hashingWorldPlazaCoordinateToUnitFloat(
    latticeX,
    latticeY,
    DEFINING_WORLD_PLAZA_NAMED_REALM_SIZE_SEED_SALT
  );
  const sizeWeight =
    DEFINING_WORLD_PLAZA_NAMED_REALM_SIZE_WEIGHT_MIN +
    sizeUnit *
      (DEFINING_WORLD_PLAZA_NAMED_REALM_SIZE_WEIGHT_MAX -
        DEFINING_WORLD_PLAZA_NAMED_REALM_SIZE_WEIGHT_MIN);

  const placeNameIndex = pickingWorldPlazaNamedRealmPoolIndex(
    latticeX,
    latticeY,
    DEFINING_WORLD_PLAZA_NAMED_REALM_NAME_SEED_SALT,
    DEFINING_WORLD_PLAZA_NAMED_REALM_PLACE_NAMES.length
  );
  const titleIndex = pickingWorldPlazaNamedRealmPoolIndex(
    latticeX,
    latticeY,
    DEFINING_WORLD_PLAZA_NAMED_REALM_TITLE_SEED_SALT,
    DEFINING_WORLD_PLAZA_NAMED_REALM_TITLE_REGISTRY.length
  );

  const placeName =
    DEFINING_WORLD_PLAZA_NAMED_REALM_PLACE_NAMES[placeNameIndex] ??
    DEFINING_WORLD_PLAZA_NAMED_REALM_PLACE_NAMES[0] ??
    'Unnamed';
  const title =
    DEFINING_WORLD_PLAZA_NAMED_REALM_TITLE_REGISTRY[titleIndex] ??
    DEFINING_WORLD_PLAZA_NAMED_REALM_TITLE_REGISTRY[0];

  const centerRegionX =
    latticeX * DEFINING_WORLD_PLAZA_NAMED_REALM_LATTICE_BIOME_REGIONS +
    jitterX * DEFINING_WORLD_PLAZA_NAMED_REALM_LATTICE_BIOME_REGIONS;
  const centerRegionY =
    latticeY * DEFINING_WORLD_PLAZA_NAMED_REALM_LATTICE_BIOME_REGIONS +
    jitterY * DEFINING_WORLD_PLAZA_NAMED_REALM_LATTICE_BIOME_REGIONS;

  return {
    latticeX,
    latticeY,
    centerRegionX,
    centerRegionY,
    sizeWeight,
    placeName,
    titleKind: title.kind,
    displayName: title.formattingDisplayName(placeName),
    realmId: `${latticeX}:${latticeY}`,
  };
}

function computingWorldPlazaNamedRealmWeightedDistanceSquared(
  regionX: number,
  regionY: number,
  center: DefiningWorldPlazaNamedRealmCenter
): number {
  const dx = regionX - center.centerRegionX;
  const dy = regionY - center.centerRegionY;

  return (dx * dx + dy * dy) / (center.sizeWeight * center.sizeWeight);
}

/**
 * Clears named-realm memoization after generation rule changes.
 */
export function invalidatingWorldPlazaNamedRealmCaches(): void {
  resolvingWorldPlazaNamedRealmAtBiomeRegionCacheByColumn.clear();
}

/**
 * Resolves the named realm covering a biome-region cell.
 *
 * Independent of biome kind: one realm can span many biomes. Size varies by
 * center weight (weighted Voronoi over a sparse lattice of centers).
 */
export function resolvingWorldPlazaNamedRealmAtBiomeRegion(
  regionX: number,
  regionY: number
): DefiningWorldPlazaNamedRealm {
  let columnCache =
    resolvingWorldPlazaNamedRealmAtBiomeRegionCacheByColumn.get(regionX);

  if (columnCache) {
    const cached = columnCache.get(regionY);

    if (cached !== undefined) {
      return cached;
    }
  } else {
    if (
      resolvingWorldPlazaNamedRealmAtBiomeRegionCacheByColumn.size >=
      RESOLVING_WORLD_PLAZA_NAMED_REALM_CACHE_MAX_COLUMNS
    ) {
      resolvingWorldPlazaNamedRealmAtBiomeRegionCacheByColumn.clear();
    }

    columnCache = new Map();
    resolvingWorldPlazaNamedRealmAtBiomeRegionCacheByColumn.set(
      regionX,
      columnCache
    );
  }

  const latticeX = Math.floor(
    regionX / DEFINING_WORLD_PLAZA_NAMED_REALM_LATTICE_BIOME_REGIONS
  );
  const latticeY = Math.floor(
    regionY / DEFINING_WORLD_PLAZA_NAMED_REALM_LATTICE_BIOME_REGIONS
  );
  const searchRadius = DEFINING_WORLD_PLAZA_NAMED_REALM_SEARCH_LATTICE_RADIUS;

  let bestCenter: DefiningWorldPlazaNamedRealmCenter | null = null;
  let bestDistance = Number.POSITIVE_INFINITY;

  for (
    let offsetY = -searchRadius;
    offsetY <= searchRadius;
    offsetY += 1
  ) {
    for (
      let offsetX = -searchRadius;
      offsetX <= searchRadius;
      offsetX += 1
    ) {
      const center = resolvingWorldPlazaNamedRealmCenterAtLattice(
        latticeX + offsetX,
        latticeY + offsetY
      );

      if (!center) {
        continue;
      }

      const distance = computingWorldPlazaNamedRealmWeightedDistanceSquared(
        regionX,
        regionY,
        center
      );

      if (distance < bestDistance) {
        bestDistance = distance;
        bestCenter = center;
      }
    }
  }

  // Guaranteed fallback: force a center on the local lattice cell.
  if (!bestCenter) {
    const forcedPlaceName =
      DEFINING_WORLD_PLAZA_NAMED_REALM_PLACE_NAMES[
        pickingWorldPlazaNamedRealmPoolIndex(
          latticeX,
          latticeY,
          DEFINING_WORLD_PLAZA_NAMED_REALM_NAME_SEED_SALT,
          DEFINING_WORLD_PLAZA_NAMED_REALM_PLACE_NAMES.length
        )
      ] ?? 'Unnamed';
    const forcedTitle =
      DEFINING_WORLD_PLAZA_NAMED_REALM_TITLE_REGISTRY[
        pickingWorldPlazaNamedRealmPoolIndex(
          latticeX,
          latticeY,
          DEFINING_WORLD_PLAZA_NAMED_REALM_TITLE_SEED_SALT,
          DEFINING_WORLD_PLAZA_NAMED_REALM_TITLE_REGISTRY.length
        )
      ] ?? DEFINING_WORLD_PLAZA_NAMED_REALM_TITLE_REGISTRY[0];

    bestCenter = {
      latticeX,
      latticeY,
      centerRegionX:
        (latticeX + 0.5) * DEFINING_WORLD_PLAZA_NAMED_REALM_LATTICE_BIOME_REGIONS,
      centerRegionY:
        (latticeY + 0.5) * DEFINING_WORLD_PLAZA_NAMED_REALM_LATTICE_BIOME_REGIONS,
      sizeWeight: 1,
      placeName: forcedPlaceName,
      titleKind: forcedTitle.kind,
      displayName: forcedTitle.formattingDisplayName(forcedPlaceName),
      realmId: `${latticeX}:${latticeY}`,
    };
  }

  const realm: DefiningWorldPlazaNamedRealm = {
    realmId: bestCenter.realmId,
    placeName: bestCenter.placeName,
    titleKind: bestCenter.titleKind,
    displayName: bestCenter.displayName,
    sizeWeight: bestCenter.sizeWeight,
  };

  columnCache.set(regionY, realm);

  return realm;
}

/**
 * Resolves the named realm under a world position.
 */
export function resolvingWorldPlazaNamedRealmAtWorldPoint(
  worldPoint: DefiningWorldPlazaWorldPoint
): DefiningWorldPlazaNamedRealm {
  const { tileX, tileY } =
    resolvingWorldPlazaIsometricTileIndexAtGridPoint(worldPoint);
  const regionX = Math.floor(tileX / DEFINING_WORLD_PLAZA_BIOME_REGION_TILE_SIZE);
  const regionY = Math.floor(tileY / DEFINING_WORLD_PLAZA_BIOME_REGION_TILE_SIZE);

  return resolvingWorldPlazaNamedRealmAtBiomeRegion(regionX, regionY);
}
