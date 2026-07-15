/**
 * Reverse-lookup habitat mushroom claims from nearby tree or pasture anchors.
 *
 * Hot-path tuned: gate checks before biome/tree work, trees-off skips wood,
 * and claim/layout results are memoized for viewport rescans.
 *
 * @module components/world/mushrooms/domains/resolvingWorldPlazaMushroomHabitatClaimAtTileIndex
 */

import { checkingWorldPlazaTreeBlocksGridTile } from '@/components/world/domains/checkingWorldPlazaTreeBlocksGridTile';
import { computingWorldPlazaGridChebyshevDistance } from '@/components/world/domains/computingWorldPlazaGridChebyshevDistance';
import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';
import { DEFINING_WORLD_PLAZA_GENERATION_FEATURE } from '@/components/world/domains/definingWorldPlazaGenerationFeatureRegistry';
import { checkingWorldPlazaGenerationFeatureEnabled } from '@/components/world/domains/managingWorldPlazaGenerationFeatureStore';
import { checkingWorldPlazaProceduralTreesAndRocksFeatureEnabled } from '@/components/world/domains/managingWorldPlazaProceduralTreesAndRocksFeatureStore';
import { resolvingWorldPlazaBiomeAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaBiomeAtTileIndex';
import { resolvingWorldPlazaWaterAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaWaterAtTileIndex';
import {
  checkingWorldPlazaMushroomPastureBiomeKind,
  checkingWorldPlazaMushroomPastureHabitatSpeciesId,
  checkingWorldPlazaMushroomStumpHabitatSpeciesId,
} from '@/components/world/mushrooms/domains/checkingWorldPlazaMushroomHabitatSpawn';
import { checkingWorldPlazaMushroomSpawnBlockedByWaterAtTileIndex } from '@/components/world/mushrooms/domains/checkingWorldPlazaMushroomSpawnBlockedByWaterAtTileIndex';
import { computingWorldPlazaMushroomBunchTilePositions } from '@/components/world/mushrooms/domains/computingWorldPlazaMushroomBunchTilePositions';
import { computingWorldPlazaMushroomRingTilePositions } from '@/components/world/mushrooms/domains/computingWorldPlazaMushroomRingTilePositions';
import { computingWorldPlazaMushroomSeedUnitFromTileIndex } from '@/components/world/mushrooms/domains/computingWorldPlazaMushroomSeedUnitFromTileIndex';
import {
  DEFINING_WORLD_PLAZA_MUSHROOM_CLUSTER_HONEY_RING_MODE_THRESHOLD,
  DEFINING_WORLD_PLAZA_MUSHROOM_HABITAT_ANCHOR_SCAN_RADIUS_TILES,
  DEFINING_WORLD_PLAZA_MUSHROOM_NEAR_TREE_COUNT_SEED_SALT,
  DEFINING_WORLD_PLAZA_MUSHROOM_PASTURE_HABITAT_ANCHOR_MODULUS,
  DEFINING_WORLD_PLAZA_MUSHROOM_PASTURE_HABITAT_ANCHOR_SEED_SALT,
  DEFINING_WORLD_PLAZA_MUSHROOM_RING_ANGLE_SEED_SALT,
  DEFINING_WORLD_PLAZA_MUSHROOM_RING_COUNT_SEED_SALT,
  DEFINING_WORLD_PLAZA_MUSHROOM_SPECIES_SEED_SALT,
  DEFINING_WORLD_PLAZA_MUSHROOM_WOOD_BUNCH_COUNT_SEED_SALT,
  DEFINING_WORLD_PLAZA_MUSHROOM_WOOD_HABITAT_ANCHOR_MODULUS,
  DEFINING_WORLD_PLAZA_MUSHROOM_WOOD_HABITAT_ANCHOR_SEED_SALT,
  DEFINING_WORLD_PLAZA_MUSHROOM_WOOD_LAYOUT_MODE_SEED_SALT,
} from '@/components/world/mushrooms/domains/definingWorldPlazaMushroomConstants';
import {
  resolvingWorldPlazaMushroomNearTreeCountFromUnit,
  resolvingWorldPlazaMushroomRingCountFromUnit,
  resolvingWorldPlazaMushroomWoodBunchCountFromUnit,
  type DefiningWorldPlazaMushroomHabitatLayoutKind,
} from '@/components/world/mushrooms/domains/definingWorldPlazaMushroomHabitatLayoutRegistry';
import {
  checkingWorldPlazaMushroomDayScheduleMatches,
  checkingWorldPlazaMushroomPhaseWindowMatches,
  DEFINING_WORLD_PLAZA_MUSHROOM_CATALOG,
  type DefiningWorldPlazaMushroomCatalogEntry,
} from '@/components/world/mushrooms/domains/definingWorldPlazaMushroomRegistry';
import {
  checkingWorldPlazaMushroomTimeOfDayMatches,
  resolvingWorldPlazaMushroomEffectiveSpawnModulus,
} from '@/components/world/mushrooms/domains/definingWorldPlazaMushroomSpawnBalanceConstants';
import type { DefiningWorldPlazaMushroomSpeciesId } from '@/components/world/mushrooms/domains/definingWorldPlazaMushroomSpeciesIds';
import { listingWorldPlazaMushroomCandidateTilePositionsNearStump } from '@/components/world/mushrooms/domains/listingWorldPlazaMushroomCandidateTilePositionsNearStump';
import { pickingWorldPlazaMushroomCatalogEntryByRarityWeight } from '@/components/world/mushrooms/domains/pickingWorldPlazaMushroomCatalogEntryByRarityWeight';

type DefiningWorldPlazaMushroomHabitatSeat = {
  readonly tileX: number;
  readonly tileY: number;
};

type DefiningWorldPlazaMushroomResolvedHabitatLayout = {
  readonly speciesId: DefiningWorldPlazaMushroomSpeciesId;
  readonly layoutKind: DefiningWorldPlazaMushroomHabitatLayoutKind;
  readonly seats: readonly DefiningWorldPlazaMushroomHabitatSeat[];
  readonly seatKeySet: ReadonlySet<number>;
};

type DefiningWorldPlazaMushroomHabitatClaimCandidate = {
  readonly entry: DefiningWorldPlazaMushroomCatalogEntry;
  readonly anchorDistanceTiles: number;
  readonly tieBreakSeed: number;
};

export type ResolvingWorldPlazaMushroomHabitatClaimAtTileIndexParams = {
  readonly tileX: number;
  readonly tileY: number;
  readonly dayNumber: number;
  readonly cyclePhase: number;
  readonly checkingTreeAtTile?: (tileX: number, tileY: number) => boolean;
  readonly resolveBiomeKindAtTile?: (
    tileX: number,
    tileY: number
  ) => DefiningWorldPlazaBiomeKind;
  readonly checkingWaterAtTile?: (tileX: number, tileY: number) => boolean;
  /** When false, skip wood habitat. Defaults from generation feature flags. */
  readonly woodHabitatEnabled?: boolean;
};

const RESOLVING_WORLD_PLAZA_MUSHROOM_HABITAT_CLAIM_CACHE_MAX_ENTRIES = 12_000;
const RESOLVING_WORLD_PLAZA_MUSHROOM_HABITAT_LAYOUT_CACHE_MAX_ENTRIES = 2_048;
const RESOLVING_WORLD_PLAZA_MUSHROOM_HABITAT_PHASE_BUCKET_COUNT = 32;

const resolvingWorldPlazaMushroomHabitatClaimCache = new Map<
  string,
  DefiningWorldPlazaMushroomCatalogEntry | null
>();

const resolvingWorldPlazaMushroomHabitatLayoutCache = new Map<
  string,
  DefiningWorldPlazaMushroomResolvedHabitatLayout | null
>();

function packingWorldPlazaMushroomHabitatTileKey(
  tileX: number,
  tileY: number
): number {
  return tileX * 73856093 + tileY * 19349663;
}

function formattingWorldPlazaMushroomHabitatPhaseBucket(
  cyclePhase: number
): number {
  return (
    Math.floor(
      ((cyclePhase % 1) + 1) *
        RESOLVING_WORLD_PLAZA_MUSHROOM_HABITAT_PHASE_BUCKET_COUNT
    ) % RESOLVING_WORLD_PLAZA_MUSHROOM_HABITAT_PHASE_BUCKET_COUNT
  );
}

function formattingWorldPlazaMushroomHabitatClaimCacheKey(
  tileX: number,
  tileY: number,
  dayNumber: number,
  cyclePhase: number
): string {
  return `${tileX},${tileY},${dayNumber},${formattingWorldPlazaMushroomHabitatPhaseBucket(cyclePhase)}`;
}

function formattingWorldPlazaMushroomHabitatLayoutCacheKey(
  habitatKind: 'wood' | 'pasture',
  anchorTileX: number,
  anchorTileY: number,
  speciesId: DefiningWorldPlazaMushroomSpeciesId,
  dayNumber: number,
  cyclePhase: number
): string {
  return `${habitatKind}:${anchorTileX},${anchorTileY},${speciesId},${dayNumber},${formattingWorldPlazaMushroomHabitatPhaseBucket(cyclePhase)}`;
}

function rememberingWorldPlazaMushroomHabitatClaimCacheEntry(
  cacheKey: string,
  entry: DefiningWorldPlazaMushroomCatalogEntry | null
): DefiningWorldPlazaMushroomCatalogEntry | null {
  if (
    resolvingWorldPlazaMushroomHabitatClaimCache.size >=
    RESOLVING_WORLD_PLAZA_MUSHROOM_HABITAT_CLAIM_CACHE_MAX_ENTRIES
  ) {
    resolvingWorldPlazaMushroomHabitatClaimCache.clear();
  }

  resolvingWorldPlazaMushroomHabitatClaimCache.set(cacheKey, entry);
  return entry;
}

function rememberingWorldPlazaMushroomHabitatLayoutCacheEntry(
  cacheKey: string,
  layout: DefiningWorldPlazaMushroomResolvedHabitatLayout | null
): DefiningWorldPlazaMushroomResolvedHabitatLayout | null {
  if (
    resolvingWorldPlazaMushroomHabitatLayoutCache.size >=
    RESOLVING_WORLD_PLAZA_MUSHROOM_HABITAT_LAYOUT_CACHE_MAX_ENTRIES
  ) {
    resolvingWorldPlazaMushroomHabitatLayoutCache.clear();
  }

  resolvingWorldPlazaMushroomHabitatLayoutCache.set(cacheKey, layout);
  return layout;
}

/** Clears habitat claim/layout memoization (tests / generation rule changes). */
export function invalidatingWorldPlazaMushroomHabitatClaimCaches(): void {
  resolvingWorldPlazaMushroomHabitatClaimCache.clear();
  resolvingWorldPlazaMushroomHabitatLayoutCache.clear();
}

function checkingWorldPlazaMushroomHabitatAnchorGate(
  anchorTileX: number,
  anchorTileY: number,
  modulus: number,
  salt: number
): boolean {
  if (!Number.isFinite(modulus) || !(modulus > 0)) {
    return false;
  }

  const anchorUnit = computingWorldPlazaMushroomSeedUnitFromTileIndex(
    anchorTileX,
    anchorTileY,
    salt
  );

  return Math.floor(anchorUnit * modulus) === 0;
}

function checkingWorldPlazaMushroomHabitatAnchorGateWithBiomeDensity({
  anchorTileX,
  anchorTileY,
  baseModulus,
  salt,
  biomeKind,
}: {
  readonly anchorTileX: number;
  readonly anchorTileY: number;
  readonly baseModulus: number;
  readonly salt: number;
  readonly biomeKind: DefiningWorldPlazaBiomeKind;
}): boolean {
  const anchorUnit = computingWorldPlazaMushroomSeedUnitFromTileIndex(
    anchorTileX,
    anchorTileY,
    salt
  );

  if (Math.floor(anchorUnit * baseModulus) !== 0) {
    return false;
  }

  const effectiveModulus = resolvingWorldPlazaMushroomEffectiveSpawnModulus(
    baseModulus,
    biomeKind
  );

  if (!Number.isFinite(effectiveModulus) || !(effectiveModulus > 0)) {
    return false;
  }

  return Math.floor(anchorUnit * effectiveModulus) === 0;
}

function checkingWorldPlazaMushroomWoodHabitatEnabledByDefault(): boolean {
  return (
    checkingWorldPlazaProceduralTreesAndRocksFeatureEnabled() &&
    checkingWorldPlazaGenerationFeatureEnabled(
      DEFINING_WORLD_PLAZA_GENERATION_FEATURE.TREES
    )
  );
}

function buildingWorldPlazaMushroomHabitatSeatKeySet(
  seats: readonly DefiningWorldPlazaMushroomHabitatSeat[]
): ReadonlySet<number> {
  const seatKeySet = new Set<number>();

  for (const seat of seats) {
    seatKeySet.add(
      packingWorldPlazaMushroomHabitatTileKey(seat.tileX, seat.tileY)
    );
  }

  return seatKeySet;
}

function listingWorldPlazaMushroomEligibleCatalogEntriesAtAnchor({
  anchorTileX,
  anchorTileY,
  dayNumber,
  cyclePhase,
  resolveBiomeKindAtTile,
  speciesFilter,
  biomeKind: biomeKindOverride,
}: {
  readonly anchorTileX: number;
  readonly anchorTileY: number;
  readonly dayNumber: number;
  readonly cyclePhase: number;
  readonly resolveBiomeKindAtTile: (
    tileX: number,
    tileY: number
  ) => DefiningWorldPlazaBiomeKind;
  readonly speciesFilter: (
    speciesId: DefiningWorldPlazaMushroomSpeciesId
  ) => boolean;
  readonly biomeKind?: DefiningWorldPlazaBiomeKind;
}): readonly DefiningWorldPlazaMushroomCatalogEntry[] {
  const biomeKind =
    biomeKindOverride ?? resolveBiomeKindAtTile(anchorTileX, anchorTileY);

  return DEFINING_WORLD_PLAZA_MUSHROOM_CATALOG.filter((entry) => {
    if (!speciesFilter(entry.speciesId)) {
      return false;
    }

    if (!entry.biomeKinds.includes(biomeKind)) {
      return false;
    }

    if (!checkingWorldPlazaMushroomDayScheduleMatches(entry, dayNumber)) {
      return false;
    }

    if (
      !checkingWorldPlazaMushroomTimeOfDayMatches(entry.timeOfDay, cyclePhase)
    ) {
      return false;
    }

    if (
      !checkingWorldPlazaMushroomPhaseWindowMatches(
        entry.phaseWindow,
        cyclePhase
      )
    ) {
      return false;
    }

    return true;
  });
}

function pickingWorldPlazaMushroomEligibleCatalogEntryAtAnchor(
  anchorTileX: number,
  anchorTileY: number,
  eligible: readonly DefiningWorldPlazaMushroomCatalogEntry[]
): DefiningWorldPlazaMushroomCatalogEntry | null {
  const speciesUnit = computingWorldPlazaMushroomSeedUnitFromTileIndex(
    anchorTileX,
    anchorTileY,
    DEFINING_WORLD_PLAZA_MUSHROOM_SPECIES_SEED_SALT
  );

  return pickingWorldPlazaMushroomCatalogEntryByRarityWeight(
    eligible,
    speciesUnit
  );
}

function resolvingWorldPlazaMushroomWoodHabitatLayoutAtAnchor(
  anchorTileX: number,
  anchorTileY: number,
  entry: DefiningWorldPlazaMushroomCatalogEntry
): DefiningWorldPlazaMushroomResolvedHabitatLayout | null {
  const speciesId = entry.speciesId;
  let seats: readonly DefiningWorldPlazaMushroomHabitatSeat[];
  let layoutKind: DefiningWorldPlazaMushroomHabitatLayoutKind;

  if (speciesId === 'ghost-wing') {
    const seatCount = resolvingWorldPlazaMushroomNearTreeCountFromUnit(
      computingWorldPlazaMushroomSeedUnitFromTileIndex(
        anchorTileX,
        anchorTileY,
        DEFINING_WORLD_PLAZA_MUSHROOM_NEAR_TREE_COUNT_SEED_SALT
      )
    );
    seats = listingWorldPlazaMushroomCandidateTilePositionsNearStump({
      stumpTileX: anchorTileX,
      stumpTileY: anchorTileY,
    }).slice(0, seatCount);
    layoutKind = 'nearTree';
  } else if (speciesId === 'cluster-honey') {
    const layoutModeUnit = computingWorldPlazaMushroomSeedUnitFromTileIndex(
      anchorTileX,
      anchorTileY,
      DEFINING_WORLD_PLAZA_MUSHROOM_WOOD_LAYOUT_MODE_SEED_SALT
    );

    if (
      layoutModeUnit <
      DEFINING_WORLD_PLAZA_MUSHROOM_CLUSTER_HONEY_RING_MODE_THRESHOLD
    ) {
      const ringCount = resolvingWorldPlazaMushroomRingCountFromUnit(
        computingWorldPlazaMushroomSeedUnitFromTileIndex(
          anchorTileX,
          anchorTileY,
          DEFINING_WORLD_PLAZA_MUSHROOM_RING_COUNT_SEED_SALT
        )
      );
      const startAngleRadians =
        computingWorldPlazaMushroomSeedUnitFromTileIndex(
          anchorTileX,
          anchorTileY,
          DEFINING_WORLD_PLAZA_MUSHROOM_RING_ANGLE_SEED_SALT
        ) *
        Math.PI *
        2;

      seats = computingWorldPlazaMushroomRingTilePositions({
        centerTileX: anchorTileX,
        centerTileY: anchorTileY,
        count: ringCount,
        startAngleRadians,
      });
      layoutKind = 'ring';
    } else {
      const bunchCount = resolvingWorldPlazaMushroomWoodBunchCountFromUnit(
        computingWorldPlazaMushroomSeedUnitFromTileIndex(
          anchorTileX,
          anchorTileY,
          DEFINING_WORLD_PLAZA_MUSHROOM_WOOD_BUNCH_COUNT_SEED_SALT
        )
      );
      const neighborRotationSteps = Math.floor(
        computingWorldPlazaMushroomSeedUnitFromTileIndex(
          anchorTileX,
          anchorTileY,
          DEFINING_WORLD_PLAZA_MUSHROOM_RING_ANGLE_SEED_SALT
        ) * 8
      );

      seats = computingWorldPlazaMushroomBunchTilePositions({
        centerTileX: anchorTileX,
        centerTileY: anchorTileY,
        count: bunchCount,
        includeCenterTile: false,
        neighborRotationSteps,
      });
      layoutKind = 'bunch';
    }
  } else {
    const bunchCount = resolvingWorldPlazaMushroomWoodBunchCountFromUnit(
      computingWorldPlazaMushroomSeedUnitFromTileIndex(
        anchorTileX,
        anchorTileY,
        DEFINING_WORLD_PLAZA_MUSHROOM_WOOD_BUNCH_COUNT_SEED_SALT
      )
    );
    const neighborRotationSteps = Math.floor(
      computingWorldPlazaMushroomSeedUnitFromTileIndex(
        anchorTileX,
        anchorTileY,
        DEFINING_WORLD_PLAZA_MUSHROOM_RING_ANGLE_SEED_SALT
      ) * 8
    );

    seats = computingWorldPlazaMushroomBunchTilePositions({
      centerTileX: anchorTileX,
      centerTileY: anchorTileY,
      count: bunchCount,
      includeCenterTile: false,
      neighborRotationSteps,
    });
    layoutKind = 'bunch';
  }

  return {
    speciesId,
    layoutKind,
    seats,
    seatKeySet: buildingWorldPlazaMushroomHabitatSeatKeySet(seats),
  };
}

function resolvingWorldPlazaMushroomPastureHabitatLayoutAtAnchor(
  anchorTileX: number,
  anchorTileY: number,
  entry: DefiningWorldPlazaMushroomCatalogEntry
): DefiningWorldPlazaMushroomResolvedHabitatLayout {
  const ringCount = resolvingWorldPlazaMushroomRingCountFromUnit(
    computingWorldPlazaMushroomSeedUnitFromTileIndex(
      anchorTileX,
      anchorTileY,
      DEFINING_WORLD_PLAZA_MUSHROOM_RING_COUNT_SEED_SALT
    )
  );
  const startAngleRadians =
    computingWorldPlazaMushroomSeedUnitFromTileIndex(
      anchorTileX,
      anchorTileY,
      DEFINING_WORLD_PLAZA_MUSHROOM_RING_ANGLE_SEED_SALT
    ) *
    Math.PI *
    2;

  const seats = computingWorldPlazaMushroomRingTilePositions({
    centerTileX: anchorTileX,
    centerTileY: anchorTileY,
    count: ringCount,
    startAngleRadians,
  });

  return {
    speciesId: entry.speciesId,
    layoutKind: 'ring',
    seats,
    seatKeySet: buildingWorldPlazaMushroomHabitatSeatKeySet(seats),
  };
}

function resolvingWorldPlazaMushroomCachedWoodHabitatLayoutAtAnchor(
  anchorTileX: number,
  anchorTileY: number,
  entry: DefiningWorldPlazaMushroomCatalogEntry,
  dayNumber: number,
  cyclePhase: number
): DefiningWorldPlazaMushroomResolvedHabitatLayout | null {
  const cacheKey = formattingWorldPlazaMushroomHabitatLayoutCacheKey(
    'wood',
    anchorTileX,
    anchorTileY,
    entry.speciesId,
    dayNumber,
    cyclePhase
  );
  const cachedLayout =
    resolvingWorldPlazaMushroomHabitatLayoutCache.get(cacheKey);

  if (cachedLayout !== undefined) {
    return cachedLayout;
  }

  return rememberingWorldPlazaMushroomHabitatLayoutCacheEntry(
    cacheKey,
    resolvingWorldPlazaMushroomWoodHabitatLayoutAtAnchor(
      anchorTileX,
      anchorTileY,
      entry
    )
  );
}

function resolvingWorldPlazaMushroomCachedPastureHabitatLayoutAtAnchor(
  anchorTileX: number,
  anchorTileY: number,
  entry: DefiningWorldPlazaMushroomCatalogEntry,
  dayNumber: number,
  cyclePhase: number
): DefiningWorldPlazaMushroomResolvedHabitatLayout {
  const cacheKey = formattingWorldPlazaMushroomHabitatLayoutCacheKey(
    'pasture',
    anchorTileX,
    anchorTileY,
    entry.speciesId,
    dayNumber,
    cyclePhase
  );
  const cachedLayout =
    resolvingWorldPlazaMushroomHabitatLayoutCache.get(cacheKey);

  if (cachedLayout) {
    return cachedLayout;
  }

  return (
    rememberingWorldPlazaMushroomHabitatLayoutCacheEntry(
      cacheKey,
      resolvingWorldPlazaMushroomPastureHabitatLayoutAtAnchor(
        anchorTileX,
        anchorTileY,
        entry
      )
    ) ??
    resolvingWorldPlazaMushroomPastureHabitatLayoutAtAnchor(
      anchorTileX,
      anchorTileY,
      entry
    )
  );
}

function comparingWorldPlazaMushroomHabitatClaimCandidates(
  left: DefiningWorldPlazaMushroomHabitatClaimCandidate,
  right: DefiningWorldPlazaMushroomHabitatClaimCandidate
): DefiningWorldPlazaMushroomHabitatClaimCandidate {
  if (left.anchorDistanceTiles !== right.anchorDistanceTiles) {
    return left.anchorDistanceTiles < right.anchorDistanceTiles ? left : right;
  }

  return left.tieBreakSeed <= right.tieBreakSeed ? left : right;
}

function resolvingWorldPlazaMushroomWoodHabitatClaimAtTileIndex(
  params: ResolvingWorldPlazaMushroomHabitatClaimAtTileIndexParams & {
    readonly checkingTreeAtTile: (tileX: number, tileY: number) => boolean;
    readonly resolveBiomeKindAtTile: (
      tileX: number,
      tileY: number
    ) => DefiningWorldPlazaBiomeKind;
  }
): DefiningWorldPlazaMushroomCatalogEntry | null {
  const {
    tileX,
    tileY,
    dayNumber,
    cyclePhase,
    checkingTreeAtTile,
    resolveBiomeKindAtTile,
  } = params;
  const scanRadius =
    DEFINING_WORLD_PLAZA_MUSHROOM_HABITAT_ANCHOR_SCAN_RADIUS_TILES;
  const querySeatKey = packingWorldPlazaMushroomHabitatTileKey(tileX, tileY);

  let bestClaim: DefiningWorldPlazaMushroomHabitatClaimCandidate | null = null;

  for (
    let anchorTileY = tileY - scanRadius;
    anchorTileY <= tileY + scanRadius;
    anchorTileY += 1
  ) {
    for (
      let anchorTileX = tileX - scanRadius;
      anchorTileX <= tileX + scanRadius;
      anchorTileX += 1
    ) {
      // Gate first: ~1/180 neighbors continue; skip tree lookup for the rest.
      if (
        !checkingWorldPlazaMushroomHabitatAnchorGate(
          anchorTileX,
          anchorTileY,
          DEFINING_WORLD_PLAZA_MUSHROOM_WOOD_HABITAT_ANCHOR_MODULUS,
          DEFINING_WORLD_PLAZA_MUSHROOM_WOOD_HABITAT_ANCHOR_SEED_SALT
        )
      ) {
        continue;
      }

      if (!checkingTreeAtTile(anchorTileX, anchorTileY)) {
        continue;
      }

      const biomeKind = resolveBiomeKindAtTile(anchorTileX, anchorTileY);

      if (
        !checkingWorldPlazaMushroomHabitatAnchorGateWithBiomeDensity({
          anchorTileX,
          anchorTileY,
          baseModulus:
            DEFINING_WORLD_PLAZA_MUSHROOM_WOOD_HABITAT_ANCHOR_MODULUS,
          salt: DEFINING_WORLD_PLAZA_MUSHROOM_WOOD_HABITAT_ANCHOR_SEED_SALT,
          biomeKind,
        })
      ) {
        continue;
      }

      const eligible = listingWorldPlazaMushroomEligibleCatalogEntriesAtAnchor({
        anchorTileX,
        anchorTileY,
        dayNumber,
        cyclePhase,
        resolveBiomeKindAtTile,
        biomeKind,
        speciesFilter: checkingWorldPlazaMushroomStumpHabitatSpeciesId,
      });
      const entry = pickingWorldPlazaMushroomEligibleCatalogEntryAtAnchor(
        anchorTileX,
        anchorTileY,
        eligible
      );

      if (!entry) {
        continue;
      }

      const layout = resolvingWorldPlazaMushroomCachedWoodHabitatLayoutAtAnchor(
        anchorTileX,
        anchorTileY,
        entry,
        dayNumber,
        cyclePhase
      );

      if (!layout || !layout.seatKeySet.has(querySeatKey)) {
        continue;
      }

      const candidate: DefiningWorldPlazaMushroomHabitatClaimCandidate = {
        entry,
        anchorDistanceTiles: computingWorldPlazaGridChebyshevDistance(
          anchorTileX,
          anchorTileY,
          tileX,
          tileY
        ),
        tieBreakSeed: computingWorldPlazaMushroomSeedUnitFromTileIndex(
          anchorTileX,
          anchorTileY,
          DEFINING_WORLD_PLAZA_MUSHROOM_WOOD_HABITAT_ANCHOR_SEED_SALT
        ),
      };

      bestClaim =
        bestClaim === null
          ? candidate
          : comparingWorldPlazaMushroomHabitatClaimCandidates(
              bestClaim,
              candidate
            );
    }
  }

  return bestClaim?.entry ?? null;
}

function resolvingWorldPlazaMushroomPastureHabitatClaimAtTileIndex(
  params: ResolvingWorldPlazaMushroomHabitatClaimAtTileIndexParams & {
    readonly checkingTreeAtTile: (tileX: number, tileY: number) => boolean;
    readonly resolveBiomeKindAtTile: (
      tileX: number,
      tileY: number
    ) => DefiningWorldPlazaBiomeKind;
  }
): DefiningWorldPlazaMushroomCatalogEntry | null {
  const {
    tileX,
    tileY,
    dayNumber,
    cyclePhase,
    checkingTreeAtTile,
    resolveBiomeKindAtTile,
  } = params;
  const scanRadius =
    DEFINING_WORLD_PLAZA_MUSHROOM_HABITAT_ANCHOR_SCAN_RADIUS_TILES;
  const querySeatKey = packingWorldPlazaMushroomHabitatTileKey(tileX, tileY);

  let bestClaim: DefiningWorldPlazaMushroomHabitatClaimCandidate | null = null;

  for (
    let anchorTileY = tileY - scanRadius;
    anchorTileY <= tileY + scanRadius;
    anchorTileY += 1
  ) {
    for (
      let anchorTileX = tileX - scanRadius;
      anchorTileX <= tileX + scanRadius;
      anchorTileX += 1
    ) {
      // Gate first: ~1/260 neighbors continue; biome/tree only for those.
      if (
        !checkingWorldPlazaMushroomHabitatAnchorGate(
          anchorTileX,
          anchorTileY,
          DEFINING_WORLD_PLAZA_MUSHROOM_PASTURE_HABITAT_ANCHOR_MODULUS,
          DEFINING_WORLD_PLAZA_MUSHROOM_PASTURE_HABITAT_ANCHOR_SEED_SALT
        )
      ) {
        continue;
      }

      if (checkingTreeAtTile(anchorTileX, anchorTileY)) {
        continue;
      }

      const biomeKind = resolveBiomeKindAtTile(anchorTileX, anchorTileY);

      if (!checkingWorldPlazaMushroomPastureBiomeKind(biomeKind)) {
        continue;
      }

      if (
        !checkingWorldPlazaMushroomHabitatAnchorGateWithBiomeDensity({
          anchorTileX,
          anchorTileY,
          baseModulus:
            DEFINING_WORLD_PLAZA_MUSHROOM_PASTURE_HABITAT_ANCHOR_MODULUS,
          salt: DEFINING_WORLD_PLAZA_MUSHROOM_PASTURE_HABITAT_ANCHOR_SEED_SALT,
          biomeKind,
        })
      ) {
        continue;
      }

      const eligible = listingWorldPlazaMushroomEligibleCatalogEntriesAtAnchor({
        anchorTileX,
        anchorTileY,
        dayNumber,
        cyclePhase,
        resolveBiomeKindAtTile,
        biomeKind,
        speciesFilter: checkingWorldPlazaMushroomPastureHabitatSpeciesId,
      });
      const entry = pickingWorldPlazaMushroomEligibleCatalogEntryAtAnchor(
        anchorTileX,
        anchorTileY,
        eligible
      );

      if (!entry) {
        continue;
      }

      const layout =
        resolvingWorldPlazaMushroomCachedPastureHabitatLayoutAtAnchor(
          anchorTileX,
          anchorTileY,
          entry,
          dayNumber,
          cyclePhase
        );

      if (!layout.seatKeySet.has(querySeatKey)) {
        continue;
      }

      const candidate: DefiningWorldPlazaMushroomHabitatClaimCandidate = {
        entry,
        anchorDistanceTiles: computingWorldPlazaGridChebyshevDistance(
          anchorTileX,
          anchorTileY,
          tileX,
          tileY
        ),
        tieBreakSeed: computingWorldPlazaMushroomSeedUnitFromTileIndex(
          anchorTileX,
          anchorTileY,
          DEFINING_WORLD_PLAZA_MUSHROOM_PASTURE_HABITAT_ANCHOR_SEED_SALT
        ),
      };

      bestClaim =
        bestClaim === null
          ? candidate
          : comparingWorldPlazaMushroomHabitatClaimCandidates(
              bestClaim,
              candidate
            );
    }
  }

  return bestClaim?.entry ?? null;
}

/**
 * Returns a catalog entry when a nearby wood or pasture habitat anchor claims
 * this tile, or null when no habitat layout includes the tile.
 */
export function resolvingWorldPlazaMushroomHabitatClaimAtTileIndex(
  params: ResolvingWorldPlazaMushroomHabitatClaimAtTileIndexParams
): DefiningWorldPlazaMushroomCatalogEntry | null {
  const checkingTreeAtTile =
    params.checkingTreeAtTile ?? checkingWorldPlazaTreeBlocksGridTile;
  const resolveBiomeKindAtTile =
    params.resolveBiomeKindAtTile ??
    ((tileX, tileY) => resolvingWorldPlazaBiomeAtTileIndex(tileX, tileY).kind);
  const checkingWaterAtTile =
    params.checkingWaterAtTile ??
    ((tileX, tileY) =>
      resolvingWorldPlazaWaterAtTileIndex(tileX, tileY) != null);
  const woodHabitatEnabled =
    params.woodHabitatEnabled ??
    checkingWorldPlazaMushroomWoodHabitatEnabledByDefault();

  if (
    checkingWorldPlazaMushroomSpawnBlockedByWaterAtTileIndex({
      tileX: params.tileX,
      tileY: params.tileY,
      checkingWaterAtTile,
    })
  ) {
    return null;
  }

  const usingInjectedResolvers =
    params.checkingTreeAtTile !== undefined ||
    params.resolveBiomeKindAtTile !== undefined ||
    params.checkingWaterAtTile !== undefined ||
    params.woodHabitatEnabled !== undefined;

  const claimCacheKey = usingInjectedResolvers
    ? null
    : formattingWorldPlazaMushroomHabitatClaimCacheKey(
        params.tileX,
        params.tileY,
        params.dayNumber,
        params.cyclePhase
      );

  if (claimCacheKey) {
    const cachedClaim =
      resolvingWorldPlazaMushroomHabitatClaimCache.get(claimCacheKey);

    if (cachedClaim !== undefined) {
      return cachedClaim;
    }
  }

  const resolvedParams = {
    ...params,
    checkingTreeAtTile,
    resolveBiomeKindAtTile,
  };

  const woodClaim = woodHabitatEnabled
    ? resolvingWorldPlazaMushroomWoodHabitatClaimAtTileIndex(resolvedParams)
    : null;

  const claim =
    woodClaim ??
    resolvingWorldPlazaMushroomPastureHabitatClaimAtTileIndex(resolvedParams);

  if (claimCacheKey) {
    return rememberingWorldPlazaMushroomHabitatClaimCacheEntry(
      claimCacheKey,
      claim
    );
  }

  return claim;
}
