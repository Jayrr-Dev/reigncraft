import { DEFINING_WORLD_PLAZA_BIOME_ALLOWED_WATER_KINDS } from "@/components/world/domains/definingWorldPlazaBiomeWaterPlacementConstants";
import type { DefiningWorldPlazaBiomeKind } from "@/components/world/domains/definingWorldPlazaBiomeKind";
import {
  DEFINING_WORLD_PLAZA_WATER_LAKE_REGION_MASK_MIN,
  DEFINING_WORLD_PLAZA_WATER_LAKE_REGION_MASK_NOISE_FREQUENCY,
  DEFINING_WORLD_PLAZA_WATER_LAKE_REGION_MASK_NOISE_OCTAVES,
  DEFINING_WORLD_PLAZA_WATER_LAKE_REGION_MASK_NOISE_SEED,
  DEFINING_WORLD_PLAZA_WATER_POND_REGION_MASK_MIN,
  DEFINING_WORLD_PLAZA_WATER_POND_REGION_MASK_NOISE_FREQUENCY,
  DEFINING_WORLD_PLAZA_WATER_POND_REGION_MASK_NOISE_OCTAVES,
  DEFINING_WORLD_PLAZA_WATER_POND_REGION_MASK_NOISE_SEED,
  DEFINING_WORLD_PLAZA_WATER_SWAMP_POND_REGION_MASK_MIN,
  DEFINING_WORLD_PLAZA_WATER_SWAMP_POND_REGION_MASK_NOISE_FREQUENCY,
  DEFINING_WORLD_PLAZA_WATER_SWAMP_POND_REGION_MASK_NOISE_OCTAVES,
  DEFINING_WORLD_PLAZA_WATER_SWAMP_POND_REGION_MASK_NOISE_SEED,
} from "@/components/world/domains/definingWorldPlazaWaterConstants";
import {
  DEFINING_WORLD_PLAZA_WATER_KIND_LAKE,
  DEFINING_WORLD_PLAZA_WATER_KIND_POND,
  DEFINING_WORLD_PLAZA_WATER_KIND_SWAMP_POND,
  type DefiningWorldPlazaWaterKind,
} from "@/components/world/domains/definingWorldPlazaWaterKind";
import { samplingWorldPlazaFractalNoise } from "@/components/world/domains/generatingWorldPlazaValueNoise";
import { resolvingWorldPlazaBiomeAtTileIndex } from "@/components/world/domains/resolvingWorldPlazaBiomeAtTileIndex";

/**
 * Resolves which still-water region (lake, pond, or swamp pool) owns a tile.
 *
 * Each still body uses a separate low-frequency region mask so lakes, ponds,
 * and swamp pools do not overlap in the same area.
 *
 * @module components/world/domains/resolvingWorldPlazaStillWaterRegionKindAtTileIndex
 */

/** Still surface water kinds that compete for region ownership. */
const RESOLVING_WORLD_PLAZA_STILL_WATER_REGION_KINDS = [
  DEFINING_WORLD_PLAZA_WATER_KIND_LAKE,
  DEFINING_WORLD_PLAZA_WATER_KIND_POND,
  DEFINING_WORLD_PLAZA_WATER_KIND_SWAMP_POND,
] as const satisfies readonly DefiningWorldPlazaWaterKind[];

type ResolvingWorldPlazaStillWaterRegionKind =
  (typeof RESOLVING_WORLD_PLAZA_STILL_WATER_REGION_KINDS)[number];

/** Region mask sample and minimum threshold for one still water kind. */
interface ResolvingWorldPlazaStillWaterRegionCandidate {
  kind: ResolvingWorldPlazaStillWaterRegionKind;
  regionMask: number;
  regionMaskMin: number;
}

/**
 * Samples the lake region mask for a tile.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
function samplingWorldPlazaLakeRegionMaskNoiseAtTile(
  tileX: number,
  tileY: number,
): number {
  return samplingWorldPlazaFractalNoise(
    tileX,
    tileY,
    DEFINING_WORLD_PLAZA_WATER_LAKE_REGION_MASK_NOISE_SEED,
    {
      frequency: DEFINING_WORLD_PLAZA_WATER_LAKE_REGION_MASK_NOISE_FREQUENCY,
      octaves: DEFINING_WORLD_PLAZA_WATER_LAKE_REGION_MASK_NOISE_OCTAVES,
    },
  );
}

/**
 * Samples the pond region mask for a tile.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
function samplingWorldPlazaPondRegionMaskNoiseAtTile(
  tileX: number,
  tileY: number,
): number {
  return samplingWorldPlazaFractalNoise(
    tileX,
    tileY,
    DEFINING_WORLD_PLAZA_WATER_POND_REGION_MASK_NOISE_SEED,
    {
      frequency: DEFINING_WORLD_PLAZA_WATER_POND_REGION_MASK_NOISE_FREQUENCY,
      octaves: DEFINING_WORLD_PLAZA_WATER_POND_REGION_MASK_NOISE_OCTAVES,
    },
  );
}

/**
 * Samples the swamp pond region mask for a tile.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
function samplingWorldPlazaSwampPondRegionMaskNoiseAtTile(
  tileX: number,
  tileY: number,
): number {
  return samplingWorldPlazaFractalNoise(
    tileX,
    tileY,
    DEFINING_WORLD_PLAZA_WATER_SWAMP_POND_REGION_MASK_NOISE_SEED,
    {
      frequency:
        DEFINING_WORLD_PLAZA_WATER_SWAMP_POND_REGION_MASK_NOISE_FREQUENCY,
      octaves:
        DEFINING_WORLD_PLAZA_WATER_SWAMP_POND_REGION_MASK_NOISE_OCTAVES,
    },
  );
}

/**
 * Returns region mask candidates allowed by the tile biome.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
function listingWorldPlazaStillWaterRegionCandidatesAtTileIndex(
  tileX: number,
  tileY: number,
): ResolvingWorldPlazaStillWaterRegionCandidate[] {
  const biomeKind = resolvingWorldPlazaBiomeAtTileIndex(tileX, tileY).kind;
  const allowedWaterKinds =
    DEFINING_WORLD_PLAZA_BIOME_ALLOWED_WATER_KINDS[biomeKind];
  const candidates: ResolvingWorldPlazaStillWaterRegionCandidate[] = [];

  if (allowedWaterKinds.includes(DEFINING_WORLD_PLAZA_WATER_KIND_LAKE)) {
    candidates.push({
      kind: DEFINING_WORLD_PLAZA_WATER_KIND_LAKE,
      regionMask: samplingWorldPlazaLakeRegionMaskNoiseAtTile(tileX, tileY),
      regionMaskMin: DEFINING_WORLD_PLAZA_WATER_LAKE_REGION_MASK_MIN,
    });
  }

  if (allowedWaterKinds.includes(DEFINING_WORLD_PLAZA_WATER_KIND_POND)) {
    candidates.push({
      kind: DEFINING_WORLD_PLAZA_WATER_KIND_POND,
      regionMask: samplingWorldPlazaPondRegionMaskNoiseAtTile(tileX, tileY),
      regionMaskMin: DEFINING_WORLD_PLAZA_WATER_POND_REGION_MASK_MIN,
    });
  }

  if (allowedWaterKinds.includes(DEFINING_WORLD_PLAZA_WATER_KIND_SWAMP_POND)) {
    candidates.push({
      kind: DEFINING_WORLD_PLAZA_WATER_KIND_SWAMP_POND,
      regionMask: samplingWorldPlazaSwampPondRegionMaskNoiseAtTile(
        tileX,
        tileY,
      ),
      regionMaskMin: DEFINING_WORLD_PLAZA_WATER_SWAMP_POND_REGION_MASK_MIN,
    });
  }

  return candidates;
}

/**
 * Returns the winning still-water region for a tile, or null when no region
 * mask clears its minimum inside the current biome.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function resolvingWorldPlazaStillWaterRegionKindAtTileIndex(
  tileX: number,
  tileY: number,
): ResolvingWorldPlazaStillWaterRegionKind | null {
  const candidates = listingWorldPlazaStillWaterRegionCandidatesAtTileIndex(
    tileX,
    tileY,
  );
  let winningCandidate: ResolvingWorldPlazaStillWaterRegionCandidate | null =
    null;

  for (const candidate of candidates) {
    if (candidate.regionMask < candidate.regionMaskMin) {
      continue;
    }

    if (
      winningCandidate === null ||
      candidate.regionMask > winningCandidate.regionMask
    ) {
      winningCandidate = candidate;
    }
  }

  return winningCandidate?.kind ?? null;
}

/**
 * Returns true when the biome allows the given still water kind.
 *
 * @param biomeKind - Biome id for the tile.
 * @param waterKind - Lake, pond, or swamp pond variant.
 */
export function checkingWorldPlazaBiomeAllowsStillWaterKind(
  biomeKind: DefiningWorldPlazaBiomeKind,
  waterKind: ResolvingWorldPlazaStillWaterRegionKind,
): boolean {
  return DEFINING_WORLD_PLAZA_BIOME_ALLOWED_WATER_KINDS[biomeKind].includes(
    waterKind,
  );
}
