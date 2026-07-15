/**
 * Forward-stamp mushroom decoration candidates for a viewport (perf-critical).
 *
 * Scans each tile once as a possible habitat anchor, then fills sparse seats.
 * Avoids per-tile reverse neighborhood scans used by pick-time claim resolve.
 *
 * @module components/world/mushrooms/domains/listingWorldPlazaMushroomDecorationCandidatesInBounds
 */

import { checkingWorldPlazaTreeBlocksGridTile } from '@/components/world/domains/checkingWorldPlazaTreeBlocksGridTile';
import { computingWorldPlazaGridChebyshevDistance } from '@/components/world/domains/computingWorldPlazaGridChebyshevDistance';
import { DEFINING_WORLD_PLAZA_GENERATION_FEATURE } from '@/components/world/domains/definingWorldPlazaGenerationFeatureRegistry';
import type { DefiningWorldPlazaVisibleTileBounds } from '@/components/world/domains/definingWorldPlazaVisibleTileBounds';
import { formattingWorldPlazaDayNightDayNumber } from '@/components/world/domains/formattingWorldPlazaDayNightDayNumber';
import { listingWorldPlazaTileIndicesInBounds } from '@/components/world/domains/listingWorldPlazaTileIndicesInBounds';
import { listingWorldPlazaTreesInTileBounds } from '@/components/world/domains/listingWorldPlazaTreesInTileBounds';
import { checkingWorldPlazaGenerationFeatureEnabled } from '@/components/world/domains/managingWorldPlazaGenerationFeatureStore';
import { checkingWorldPlazaProceduralTreesAndRocksFeatureEnabled } from '@/components/world/domains/managingWorldPlazaProceduralTreesAndRocksFeatureStore';
import { resolvingWorldPlazaBiomeAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaBiomeAtTileIndex';
import { checkingWorldPlazaGrassFloorTileIsBurntAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaBurntGrassFloorTileFillColorAtTileIndex';
import { resolvingWorldPlazaDayNightCyclePhase } from '@/components/world/domains/resolvingWorldPlazaDayNightCyclePhase';
import {
  checkingWorldPlazaMushroomPastureBiomeKind,
  checkingWorldPlazaMushroomPastureHabitatSpeciesId,
  checkingWorldPlazaMushroomStumpHabitatSpeciesId,
} from '@/components/world/mushrooms/domains/checkingWorldPlazaMushroomHabitatSpawn';
import { checkingWorldPlazaMushroomSpawnBlockedByWaterAtTileIndex } from '@/components/world/mushrooms/domains/checkingWorldPlazaMushroomSpawnBlockedByWaterAtTileIndex';
import { computingWorldPlazaMushroomSeedUnitFromTileIndex } from '@/components/world/mushrooms/domains/computingWorldPlazaMushroomSeedUnitFromTileIndex';
import {
  DEFINING_WORLD_PLAZA_MUSHROOM_HABITAT_ANCHOR_SCAN_RADIUS_TILES,
  DEFINING_WORLD_PLAZA_MUSHROOM_PASTURE_HABITAT_ANCHOR_MODULUS,
  DEFINING_WORLD_PLAZA_MUSHROOM_PASTURE_HABITAT_ANCHOR_SEED_SALT,
  DEFINING_WORLD_PLAZA_MUSHROOM_SPECIES_SEED_SALT,
  DEFINING_WORLD_PLAZA_MUSHROOM_WOOD_HABITAT_ANCHOR_MODULUS,
  DEFINING_WORLD_PLAZA_MUSHROOM_WOOD_HABITAT_ANCHOR_SEED_SALT,
} from '@/components/world/mushrooms/domains/definingWorldPlazaMushroomConstants';
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
import { resolvingWorldPlazaMushroomSpeciesSheetIndex } from '@/components/world/mushrooms/domains/definingWorldPlazaMushroomSpriteSheetConstants';
import { pickingWorldPlazaMushroomCatalogEntryByRarityWeight } from '@/components/world/mushrooms/domains/pickingWorldPlazaMushroomCatalogEntryByRarityWeight';
import { checkingWorldPlazaRuntimeMushroomIsPicked } from '@/components/world/mushrooms/domains/registeringWorldPlazaPickedMushroomsLookup';
import { resolvingWorldPlazaMushroomSparseAtTileIndex } from '@/components/world/mushrooms/domains/resolvingWorldPlazaMushroomAtTileIndex';
import {
  resolvingWorldPlazaMushroomPastureHabitatLayoutSeatsAtAnchor,
  resolvingWorldPlazaMushroomWoodHabitatLayoutSeatsAtAnchor,
} from '@/components/world/mushrooms/domains/resolvingWorldPlazaMushroomHabitatLayoutSeatsAtAnchor';

export type ListingWorldPlazaMushroomDecorationCandidate = {
  readonly tileX: number;
  readonly tileY: number;
  readonly speciesIndex: number;
};

type ListingWorldPlazaMushroomHabitatSeatClaim = {
  readonly entry: DefiningWorldPlazaMushroomCatalogEntry;
  readonly priority: number;
  readonly anchorDistanceTiles: number;
  readonly tieBreakSeed: number;
};

const LISTING_WORLD_PLAZA_MUSHROOM_HABITAT_PRIORITY_WOOD = 2;
const LISTING_WORLD_PLAZA_MUSHROOM_HABITAT_PRIORITY_PASTURE = 1;

function packingWorldPlazaMushroomDecorationTileKey(
  tileX: number,
  tileY: number
): number {
  return tileX * 73856093 + tileY * 19349663;
}

function checkingWorldPlazaMushroomWoodHabitatEnabled(): boolean {
  return (
    checkingWorldPlazaProceduralTreesAndRocksFeatureEnabled() &&
    checkingWorldPlazaGenerationFeatureEnabled(
      DEFINING_WORLD_PLAZA_GENERATION_FEATURE.TREES
    )
  );
}

function checkingWorldPlazaMushroomHabitatAnchorPasses({
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
  readonly biomeKind: ReturnType<
    typeof resolvingWorldPlazaBiomeAtTileIndex
  >['kind'];
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

function listingWorldPlazaMushroomEligibleHabitatEntriesAtAnchor({
  biomeKind,
  dayNumber,
  cyclePhase,
  speciesFilter,
}: {
  readonly biomeKind: ReturnType<
    typeof resolvingWorldPlazaBiomeAtTileIndex
  >['kind'];
  readonly dayNumber: number;
  readonly cyclePhase: number;
  readonly speciesFilter: (
    speciesId: DefiningWorldPlazaMushroomSpeciesId
  ) => boolean;
}): readonly DefiningWorldPlazaMushroomCatalogEntry[] {
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

function comparingWorldPlazaMushroomHabitatSeatClaims(
  left: ListingWorldPlazaMushroomHabitatSeatClaim,
  right: ListingWorldPlazaMushroomHabitatSeatClaim
): ListingWorldPlazaMushroomHabitatSeatClaim {
  if (left.priority !== right.priority) {
    return left.priority > right.priority ? left : right;
  }

  if (left.anchorDistanceTiles !== right.anchorDistanceTiles) {
    return left.anchorDistanceTiles < right.anchorDistanceTiles ? left : right;
  }

  return left.tieBreakSeed <= right.tieBreakSeed ? left : right;
}

function stampingWorldPlazaMushroomHabitatSeatClaim(
  claimByTileKey: Map<number, ListingWorldPlazaMushroomHabitatSeatClaim>,
  seatTileX: number,
  seatTileY: number,
  claim: ListingWorldPlazaMushroomHabitatSeatClaim,
  visibleMinTileX: number,
  visibleMaxTileX: number,
  visibleMinTileY: number,
  visibleMaxTileY: number
): void {
  if (
    seatTileX < visibleMinTileX ||
    seatTileX > visibleMaxTileX ||
    seatTileY < visibleMinTileY ||
    seatTileY > visibleMaxTileY
  ) {
    return;
  }

  if (
    checkingWorldPlazaMushroomSpawnBlockedByWaterAtTileIndex({
      tileX: seatTileX,
      tileY: seatTileY,
    })
  ) {
    return;
  }

  const tileKey = packingWorldPlazaMushroomDecorationTileKey(
    seatTileX,
    seatTileY
  );
  const existing = claimByTileKey.get(tileKey);

  claimByTileKey.set(
    tileKey,
    existing
      ? comparingWorldPlazaMushroomHabitatSeatClaims(existing, claim)
      : claim
  );
}

/**
 * Lists visible mushroom decoration instances for the current day/phase.
 */
export function listingWorldPlazaMushroomDecorationCandidatesInBounds(
  bounds: DefiningWorldPlazaVisibleTileBounds,
  burntGrassTileKeys: ReadonlySet<string> | undefined,
  epochMs: number
): readonly ListingWorldPlazaMushroomDecorationCandidate[] {
  if (
    !checkingWorldPlazaGenerationFeatureEnabled(
      DEFINING_WORLD_PLAZA_GENERATION_FEATURE.MUSHROOMS
    )
  ) {
    return [];
  }

  const dayNumber = formattingWorldPlazaDayNightDayNumber(epochMs);
  const cyclePhase = resolvingWorldPlazaDayNightCyclePhase(epochMs);
  const scanRadius =
    DEFINING_WORLD_PLAZA_MUSHROOM_HABITAT_ANCHOR_SCAN_RADIUS_TILES;
  const woodHabitatEnabled = checkingWorldPlazaMushroomWoodHabitatEnabled();
  const claimByTileKey = new Map<
    number,
    ListingWorldPlazaMushroomHabitatSeatClaim
  >();

  const anchorBounds: DefiningWorldPlazaVisibleTileBounds = {
    minTileX: bounds.minTileX - scanRadius,
    maxTileX: bounds.maxTileX + scanRadius,
    minTileY: bounds.minTileY - scanRadius,
    maxTileY: bounds.maxTileY + scanRadius,
  };

  // Wood: only visit real tree tiles (spacing grid), never every floor tile.
  if (woodHabitatEnabled) {
    const trees = listingWorldPlazaTreesInTileBounds(
      anchorBounds,
      Number.POSITIVE_INFINITY
    );

    for (const tree of trees) {
      const anchorTileX = tree.tileX;
      const anchorTileY = tree.tileY;
      const woodUnit = computingWorldPlazaMushroomSeedUnitFromTileIndex(
        anchorTileX,
        anchorTileY,
        DEFINING_WORLD_PLAZA_MUSHROOM_WOOD_HABITAT_ANCHOR_SEED_SALT
      );

      if (
        Math.floor(
          woodUnit * DEFINING_WORLD_PLAZA_MUSHROOM_WOOD_HABITAT_ANCHOR_MODULUS
        ) !== 0
      ) {
        continue;
      }

      const biomeKind = resolvingWorldPlazaBiomeAtTileIndex(
        anchorTileX,
        anchorTileY
      ).kind;

      if (
        !checkingWorldPlazaMushroomHabitatAnchorPasses({
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

      const eligible = listingWorldPlazaMushroomEligibleHabitatEntriesAtAnchor({
        biomeKind,
        dayNumber,
        cyclePhase,
        speciesFilter: checkingWorldPlazaMushroomStumpHabitatSpeciesId,
      });
      const entry = pickingWorldPlazaMushroomCatalogEntryByRarityWeight(
        eligible,
        computingWorldPlazaMushroomSeedUnitFromTileIndex(
          anchorTileX,
          anchorTileY,
          DEFINING_WORLD_PLAZA_MUSHROOM_SPECIES_SEED_SALT
        )
      );

      if (!entry) {
        continue;
      }

      const seats = resolvingWorldPlazaMushroomWoodHabitatLayoutSeatsAtAnchor(
        anchorTileX,
        anchorTileY,
        entry
      );

      for (const seat of seats) {
        stampingWorldPlazaMushroomHabitatSeatClaim(
          claimByTileKey,
          seat.tileX,
          seat.tileY,
          {
            entry,
            priority: LISTING_WORLD_PLAZA_MUSHROOM_HABITAT_PRIORITY_WOOD,
            anchorDistanceTiles: computingWorldPlazaGridChebyshevDistance(
              anchorTileX,
              anchorTileY,
              seat.tileX,
              seat.tileY
            ),
            tieBreakSeed: woodUnit,
          },
          bounds.minTileX,
          bounds.maxTileX,
          bounds.minTileY,
          bounds.maxTileY
        );
      }
    }
  }

  // Pasture: cheap modulus gate first; tree/biome only on rare hits.
  for (
    let anchorTileY = anchorBounds.minTileY;
    anchorTileY <= anchorBounds.maxTileY;
    anchorTileY += 1
  ) {
    for (
      let anchorTileX = anchorBounds.minTileX;
      anchorTileX <= anchorBounds.maxTileX;
      anchorTileX += 1
    ) {
      const pastureUnit = computingWorldPlazaMushroomSeedUnitFromTileIndex(
        anchorTileX,
        anchorTileY,
        DEFINING_WORLD_PLAZA_MUSHROOM_PASTURE_HABITAT_ANCHOR_SEED_SALT
      );

      if (
        Math.floor(
          pastureUnit *
            DEFINING_WORLD_PLAZA_MUSHROOM_PASTURE_HABITAT_ANCHOR_MODULUS
        ) !== 0
      ) {
        continue;
      }

      if (checkingWorldPlazaTreeBlocksGridTile(anchorTileX, anchorTileY)) {
        continue;
      }

      if (
        checkingWorldPlazaMushroomSpawnBlockedByWaterAtTileIndex({
          tileX: anchorTileX,
          tileY: anchorTileY,
        })
      ) {
        continue;
      }

      const biomeKind = resolvingWorldPlazaBiomeAtTileIndex(
        anchorTileX,
        anchorTileY
      ).kind;

      if (!checkingWorldPlazaMushroomPastureBiomeKind(biomeKind)) {
        continue;
      }

      if (
        !checkingWorldPlazaMushroomHabitatAnchorPasses({
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

      const eligible = listingWorldPlazaMushroomEligibleHabitatEntriesAtAnchor({
        biomeKind,
        dayNumber,
        cyclePhase,
        speciesFilter: checkingWorldPlazaMushroomPastureHabitatSpeciesId,
      });
      const entry = pickingWorldPlazaMushroomCatalogEntryByRarityWeight(
        eligible,
        computingWorldPlazaMushroomSeedUnitFromTileIndex(
          anchorTileX,
          anchorTileY,
          DEFINING_WORLD_PLAZA_MUSHROOM_SPECIES_SEED_SALT
        )
      );

      if (!entry) {
        continue;
      }

      const seats =
        resolvingWorldPlazaMushroomPastureHabitatLayoutSeatsAtAnchor(
          anchorTileX,
          anchorTileY,
          entry
        );

      for (const seat of seats) {
        stampingWorldPlazaMushroomHabitatSeatClaim(
          claimByTileKey,
          seat.tileX,
          seat.tileY,
          {
            entry,
            priority: LISTING_WORLD_PLAZA_MUSHROOM_HABITAT_PRIORITY_PASTURE,
            anchorDistanceTiles: computingWorldPlazaGridChebyshevDistance(
              anchorTileX,
              anchorTileY,
              seat.tileX,
              seat.tileY
            ),
            tieBreakSeed: pastureUnit,
          },
          bounds.minTileX,
          bounds.maxTileX,
          bounds.minTileY,
          bounds.maxTileY
        );
      }
    }
  }

  const candidates: ListingWorldPlazaMushroomDecorationCandidate[] = [];

  for (const { tileX, tileY } of listingWorldPlazaTileIndicesInBounds(bounds)) {
    if (
      checkingWorldPlazaGrassFloorTileIsBurntAtTileIndex(
        tileX,
        tileY,
        burntGrassTileKeys
      )
    ) {
      continue;
    }

    if (checkingWorldPlazaRuntimeMushroomIsPicked(tileX, tileY)) {
      continue;
    }

    const habitatClaim = claimByTileKey.get(
      packingWorldPlazaMushroomDecorationTileKey(tileX, tileY)
    );

    const entry =
      habitatClaim?.entry ??
      resolvingWorldPlazaMushroomSparseAtTileIndex({
        tileX,
        tileY,
        dayNumber,
        cyclePhase,
      });

    if (!entry) {
      continue;
    }

    candidates.push({
      tileX,
      tileY,
      speciesIndex: resolvingWorldPlazaMushroomSpeciesSheetIndex(
        entry.speciesId
      ),
    });
  }

  return candidates;
}
