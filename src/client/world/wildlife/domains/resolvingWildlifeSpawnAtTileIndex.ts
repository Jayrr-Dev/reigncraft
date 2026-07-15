/**
 * Deterministic wildlife spawn anchor resolution per tile.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeSpawnAtTileIndex
 */

import { checkingWorldPlazaLavaAtTileIndex } from '@/components/world/domains/checkingWorldPlazaLavaAtTileIndex';
import { resolvingWorldPlazaBiomeAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaBiomeAtTileIndex';
import {
  checkingWorldPlazaFrostsinkWildlifeAllowedAtRadiusTiles,
  resolvingWorldPlazaFrostsinkAtTileIndex,
} from '@/components/world/domains/resolvingWorldPlazaFrostsinkAtTileIndex';
import { resolvingWorldPlazaWaterAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaWaterAtTileIndex';
import {
  mappingWorldPlazaGrassSeededUnitToFloatRange,
  seedingWorldPlazaGrassTileDecorationFromTileIndex,
} from '@/components/world/domains/seedingWorldPlazaGrassTileDecorationFromTileIndex';
import { checkingWildlifeIsNightCyclePhase } from '@/components/world/wildlife/domains/checkingWildlifeIsNightCyclePhase';
import {
  DEFINING_WILDLIFE_BIOME_SPAWN_TABLE,
  DEFINING_WILDLIFE_PACK_OFFSET_SALT,
  DEFINING_WILDLIFE_PACK_SIZE_SALT,
  DEFINING_WILDLIFE_PATCH_NOISE_SALT,
  DEFINING_WILDLIFE_SPAWN_CLEARING_RADIUS_SQUARED,
  DEFINING_WILDLIFE_SPAWN_SPACING_MODULUS,
  DEFINING_WILDLIFE_SPECIES_PICK_SALT,
  type DefiningWildlifeBiomeSpawnEntry,
} from '@/components/world/wildlife/domains/definingWildlifeBiomeSpawnTable';
import type { DefiningWildlifeSpawnAnchor } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import {
  resolvingWildlifeSpawnEffectiveDensityThreshold,
  resolvingWildlifeSpawnEntriesForDifficulty,
} from '@/components/world/wildlife/domains/resolvingWildlifeSpawnEntriesForDifficulty';

function checkingWildlifeSpawnSpacingAnchorAtTile(
  tileX: number,
  tileY: number
): boolean {
  const normalizedX =
    ((tileX % DEFINING_WILDLIFE_SPAWN_SPACING_MODULUS) +
      DEFINING_WILDLIFE_SPAWN_SPACING_MODULUS) %
    DEFINING_WILDLIFE_SPAWN_SPACING_MODULUS;
  const normalizedY =
    ((tileY % DEFINING_WILDLIFE_SPAWN_SPACING_MODULUS) +
      DEFINING_WILDLIFE_SPAWN_SPACING_MODULUS) %
    DEFINING_WILDLIFE_SPAWN_SPACING_MODULUS;

  return normalizedX === 0 && normalizedY === 0;
}

function pickingWildlifeSpeciesByWeight(
  entries: readonly DefiningWildlifeBiomeSpawnEntry[],
  roll: number
): DefiningWildlifeBiomeSpawnEntry {
  const totalWeight = entries.reduce((sum, entry) => sum + entry.weight, 0);
  let cursor = roll * totalWeight;

  for (const entry of entries) {
    cursor -= entry.weight;

    if (cursor <= 0) {
      return entry;
    }
  }

  return entries[entries.length - 1];
}

function buildingWildlifeAnchorId(
  tileX: number,
  tileY: number,
  packIndex: number
): string {
  return `wildlife:${tileX}:${tileY}:${packIndex}`;
}

/**
 * Flattens a pack composition into a per-slot species id array.
 * Index 0 is slot 0 (the Omega), slots 1-4 are grey wolves.
 */
function flatteningWildlifePackCompositionSpeciesIds(
  packComposition: readonly { speciesId: string; count: number }[]
): readonly string[] {
  const ids: string[] = [];

  for (const { speciesId, count } of packComposition) {
    for (let i = 0; i < count; i += 1) {
      ids.push(speciesId);
    }
  }

  return ids;
}

/**
 * Resolves a wildlife spawn anchor at a tile, or null when no spawn occurs.
 *
 * @param cyclePhase Optional day/night cycle phase (0–1). When provided and it
 *   is daytime, `nightOnly` entries are excluded from the spawn pool.
 */
export function resolvingWildlifeSpawnAtTileIndex(
  tileX: number,
  tileY: number,
  packIndex = 0,
  cyclePhase?: number
): DefiningWildlifeSpawnAnchor | null {
  if (
    tileX * tileX + tileY * tileY <
    DEFINING_WILDLIFE_SPAWN_CLEARING_RADIUS_SQUARED
  ) {
    return null;
  }

  if (!checkingWildlifeSpawnSpacingAnchorAtTile(tileX, tileY)) {
    return null;
  }

  if (resolvingWorldPlazaWaterAtTileIndex(tileX, tileY)) {
    return null;
  }

  if (checkingWorldPlazaLavaAtTileIndex(tileX, tileY)) {
    return null;
  }

  const frostsink = resolvingWorldPlazaFrostsinkAtTileIndex(tileX, tileY);

  if (
    frostsink &&
    !checkingWorldPlazaFrostsinkWildlifeAllowedAtRadiusTiles(
      frostsink.radiusTiles
    )
  ) {
    return null;
  }

  const biome = resolvingWorldPlazaBiomeAtTileIndex(tileX, tileY);
  const config = DEFINING_WILDLIFE_BIOME_SPAWN_TABLE[biome.kind];

  if (!config || config.entries.length === 0) {
    return null;
  }

  const isNight =
    cyclePhase === undefined || checkingWildlifeIsNightCyclePhase(cyclePhase);
  const filteredEntries = isNight
    ? config.entries
    : config.entries.filter((entry) => !entry.nightOnly);
  const spawnEntries =
    resolvingWildlifeSpawnEntriesForDifficulty(filteredEntries);

  if (spawnEntries.length === 0) {
    return null;
  }

  const patchNoise = seedingWorldPlazaGrassTileDecorationFromTileIndex(
    tileX,
    tileY,
    DEFINING_WILDLIFE_PATCH_NOISE_SALT
  );

  if (
    patchNoise <
    resolvingWildlifeSpawnEffectiveDensityThreshold(config.densityThreshold)
  ) {
    return null;
  }

  const speciesRoll = seedingWorldPlazaGrassTileDecorationFromTileIndex(
    tileX,
    tileY,
    DEFINING_WILDLIFE_SPECIES_PICK_SALT
  );
  const pickedEntry = pickingWildlifeSpeciesByWeight(spawnEntries, speciesRoll);

  const compositionIds = pickedEntry.packComposition
    ? flatteningWildlifePackCompositionSpeciesIds(pickedEntry.packComposition)
    : null;
  const packSizeRoll = seedingWorldPlazaGrassTileDecorationFromTileIndex(
    tileX,
    tileY,
    DEFINING_WILDLIFE_PACK_SIZE_SALT
  );
  const packSize = compositionIds
    ? compositionIds.length
    : Math.round(
        mappingWorldPlazaGrassSeededUnitToFloatRange(
          packSizeRoll,
          pickedEntry.packSizeRange[0],
          pickedEntry.packSizeRange[1]
        )
      );

  if (packIndex >= packSize) {
    return null;
  }

  const seed = seedingWorldPlazaGrassTileDecorationFromTileIndex(
    tileX,
    tileY,
    DEFINING_WILDLIFE_PACK_OFFSET_SALT + packIndex
  );

  const resolvedSpeciesId =
    compositionIds?.[packIndex] ?? pickedEntry.speciesId;

  return {
    anchorId: buildingWildlifeAnchorId(tileX, tileY, packIndex),
    tileX,
    tileY,
    speciesId: resolvedSpeciesId,
    packIndex,
    packSize,
    seed,
  };
}

/** Resolves the grid position for one pack member from its anchor. */
export function resolvingWildlifeSpawnPositionFromAnchor(
  anchor: DefiningWildlifeSpawnAnchor
): { x: number; y: number } {
  if (anchor.packIndex === 0) {
    return { x: anchor.tileX + 0.5, y: anchor.tileY + 0.5 };
  }

  const offsetX = mappingWorldPlazaGrassSeededUnitToFloatRange(
    seedingWorldPlazaGrassTileDecorationFromTileIndex(
      anchor.tileX,
      anchor.tileY,
      DEFINING_WILDLIFE_PACK_OFFSET_SALT + anchor.packIndex * 2
    ),
    -1.2,
    1.2
  );
  const offsetY = mappingWorldPlazaGrassSeededUnitToFloatRange(
    seedingWorldPlazaGrassTileDecorationFromTileIndex(
      anchor.tileX,
      anchor.tileY,
      DEFINING_WILDLIFE_PACK_OFFSET_SALT + anchor.packIndex * 2 + 1
    ),
    -1.2,
    1.2
  );

  return {
    x: anchor.tileX + 0.5 + offsetX,
    y: anchor.tileY + 0.5 + offsetY,
  };
}
