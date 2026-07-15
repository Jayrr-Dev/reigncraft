import { checkingWorldPlazaMushroomHabitatSpeciesId } from '@/components/world/mushrooms/domains/checkingWorldPlazaMushroomHabitatSpawn';
import { computingWorldPlazaMushroomSeedUnitFromTileIndex } from '@/components/world/mushrooms/domains/computingWorldPlazaMushroomSeedUnitFromTileIndex';
import {
  DEFINING_WORLD_PLAZA_MUSHROOM_PASTURE_HABITAT_ANCHOR_MODULUS,
  DEFINING_WORLD_PLAZA_MUSHROOM_PASTURE_HABITAT_ANCHOR_SEED_SALT,
  DEFINING_WORLD_PLAZA_MUSHROOM_WOOD_HABITAT_ANCHOR_MODULUS,
  DEFINING_WORLD_PLAZA_MUSHROOM_WOOD_HABITAT_ANCHOR_SEED_SALT,
} from '@/components/world/mushrooms/domains/definingWorldPlazaMushroomConstants';
import { resolvingWorldPlazaMushroomSparseAtTileIndex } from '@/components/world/mushrooms/domains/resolvingWorldPlazaMushroomAtTileIndex';
import { resolvingWorldPlazaMushroomHabitatClaimAtTileIndex } from '@/components/world/mushrooms/domains/resolvingWorldPlazaMushroomHabitatClaimAtTileIndex';
import { describe, expect, it } from 'vitest';

function checkingWorldPlazaMushroomHabitatAnchorGate(
  anchorTileX: number,
  anchorTileY: number,
  modulus: number,
  salt: number
): boolean {
  const anchorUnit = computingWorldPlazaMushroomSeedUnitFromTileIndex(
    anchorTileX,
    anchorTileY,
    salt
  );

  return Math.floor(anchorUnit * modulus) === 0;
}

function findingWorldPlazaWoodHabitatAnchorTile(
  startTileX: number,
  startTileY: number,
  searchRadius: number = 32
): { readonly tileX: number; readonly tileY: number } | null {
  for (
    let tileY = startTileY - searchRadius;
    tileY <= startTileY + searchRadius;
    tileY += 1
  ) {
    for (
      let tileX = startTileX - searchRadius;
      tileX <= startTileX + searchRadius;
      tileX += 1
    ) {
      if (
        checkingWorldPlazaMushroomHabitatAnchorGate(
          tileX,
          tileY,
          DEFINING_WORLD_PLAZA_MUSHROOM_WOOD_HABITAT_ANCHOR_MODULUS,
          DEFINING_WORLD_PLAZA_MUSHROOM_WOOD_HABITAT_ANCHOR_SEED_SALT
        )
      ) {
        return { tileX, tileY };
      }
    }
  }

  return null;
}

function findingWorldPlazaPastureHabitatAnchorTile(
  startTileX: number,
  startTileY: number,
  searchRadius: number = 96
): { readonly tileX: number; readonly tileY: number } | null {
  for (
    let tileY = startTileY - searchRadius;
    tileY <= startTileY + searchRadius;
    tileY += 1
  ) {
    for (
      let tileX = startTileX - searchRadius;
      tileX <= startTileX + searchRadius;
      tileX += 1
    ) {
      const anchorUnit = computingWorldPlazaMushroomSeedUnitFromTileIndex(
        tileX,
        tileY,
        DEFINING_WORLD_PLAZA_MUSHROOM_PASTURE_HABITAT_ANCHOR_SEED_SALT
      );
      const baseModulus =
        DEFINING_WORLD_PLAZA_MUSHROOM_PASTURE_HABITAT_ANCHOR_MODULUS;

      if (Math.floor(anchorUnit * baseModulus) !== 0) {
        continue;
      }

      // Match plains density thinning used by habitat claim.
      const plainsDensity = 0.28;
      const effectiveModulus = Math.max(
        1,
        Math.round(baseModulus / plainsDensity)
      );

      if (Math.floor(anchorUnit * effectiveModulus) !== 0) {
        continue;
      }

      return { tileX, tileY };
    }
  }

  return null;
}

describe('resolvingWorldPlazaMushroomHabitatClaimAtTileIndex', () => {
  it('claims a wood bunch seat beside a tree anchor', () => {
    const anchor = findingWorldPlazaWoodHabitatAnchorTile(100, 200);

    expect(anchor).not.toBeNull();

    if (!anchor) {
      return;
    }

    let claim = null;

    for (let offsetY = -2; offsetY <= 2; offsetY += 1) {
      for (let offsetX = -2; offsetX <= 2; offsetX += 1) {
        if (offsetX === 0 && offsetY === 0) {
          continue;
        }

        const candidate = resolvingWorldPlazaMushroomHabitatClaimAtTileIndex({
          tileX: anchor.tileX + offsetX,
          tileY: anchor.tileY + offsetY,
          dayNumber: 1,
          cyclePhase: 0.5,
          woodHabitatEnabled: true,
          checkingTreeAtTile: (tileX, tileY) =>
            tileX === anchor.tileX && tileY === anchor.tileY,
          resolveBiomeKindAtTile: () => 'forest',
          checkingWaterAtTile: () => false,
        });

        if (candidate) {
          claim = candidate;
          break;
        }
      }

      if (claim) {
        break;
      }
    }

    expect(claim).not.toBeNull();
    expect(claim?.speciesId).toMatch(
      /^(false-lantern|cluster-honey|funeral-bell|shelf-oyster|ghost-wing)$/
    );
  });

  it('claims a pasture ring seat from a pasture anchor', () => {
    const anchor = findingWorldPlazaPastureHabitatAnchorTile(300, 400);

    expect(anchor).not.toBeNull();

    if (!anchor) {
      return;
    }

    let claim = null;

    for (let offsetY = -4; offsetY <= 4; offsetY += 1) {
      for (let offsetX = -4; offsetX <= 4; offsetX += 1) {
        const candidate = resolvingWorldPlazaMushroomHabitatClaimAtTileIndex({
          tileX: anchor.tileX + offsetX,
          tileY: anchor.tileY + offsetY,
          dayNumber: 2,
          cyclePhase: 0.5,
          checkingTreeAtTile: () => false,
          resolveBiomeKindAtTile: () => 'plains',
          checkingWaterAtTile: () => false,
        });

        if (candidate) {
          claim = candidate;
          break;
        }
      }

      if (claim) {
        break;
      }
    }

    expect(claim).not.toBeNull();
    expect(claim?.speciesId).toMatch(
      /^(cloud-puff|white-parasol|green-vomiter|field-agaric|yellow-stain)$/
    );
  });

  it('returns null when anchor biome excludes wood habitat species', () => {
    const anchor = findingWorldPlazaWoodHabitatAnchorTile(500, 600);

    expect(anchor).not.toBeNull();

    if (!anchor) {
      return;
    }

    const claim = resolvingWorldPlazaMushroomHabitatClaimAtTileIndex({
      tileX: anchor.tileX + 1,
      tileY: anchor.tileY,
      dayNumber: 2,
      cyclePhase: 0.5,
      woodHabitatEnabled: true,
      checkingTreeAtTile: (tileX, tileY) =>
        tileX === anchor.tileX && tileY === anchor.tileY,
      resolveBiomeKindAtTile: () => 'plains',
      checkingWaterAtTile: () => false,
    });

    expect(claim).toBeNull();
  });
});

describe('resolvingWorldPlazaMushroomSparseAtTileIndex', () => {
  it('never returns habitat species from the sparse path', () => {
    for (let tileX = -20; tileX <= 20; tileX += 1) {
      for (let tileY = -20; tileY <= 20; tileY += 1) {
        const entry = resolvingWorldPlazaMushroomSparseAtTileIndex({
          tileX,
          tileY,
          dayNumber: 1,
          cyclePhase: 0.5,
        });

        if (!entry) {
          continue;
        }

        expect(
          checkingWorldPlazaMushroomHabitatSpeciesId(entry.speciesId)
        ).toBe(false);
      }
    }
  });
});
