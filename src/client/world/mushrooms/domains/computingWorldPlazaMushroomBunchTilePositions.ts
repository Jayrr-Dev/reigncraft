/**
 * Pure 1-block mushroom bunch layout (utility only; not wired to spawn).
 *
 * Places `count` seats inside the Chebyshev-1 (3×3) footprint around an anchor.
 * Seats stay in close proximity: every tile is at most 1 block from the center.
 *
 * @module components/world/mushrooms/domains/computingWorldPlazaMushroomBunchTilePositions
 */

import { computingWorldPlazaGridChebyshevDistance } from '@/components/world/domains/computingWorldPlazaGridChebyshevDistance';
import { checkingWorldPlazaMushroomBunchSpawnCount } from '@/components/world/mushrooms/domains/checkingWorldPlazaMushroomBunchSpawn';
import {
  DEFINING_WORLD_PLAZA_MUSHROOM_BUNCH_DEFAULT_COUNT,
  DEFINING_WORLD_PLAZA_MUSHROOM_BUNCH_SEAT_OFFSETS,
} from '@/components/world/mushrooms/domains/definingWorldPlazaMushroomBunchSpawnConstants';

export type ComputingWorldPlazaMushroomBunchTilePosition = {
  readonly tileX: number;
  readonly tileY: number;
  readonly seatIndex: number;
  readonly offsetX: number;
  readonly offsetY: number;
  readonly chebyshevDistanceTiles: number;
};

export type ComputingWorldPlazaMushroomBunchTilePositionsParams = {
  readonly centerTileX: number;
  readonly centerTileY: number;
  /** How many mushrooms in the bunch. Defaults to 3. Max 9 (or 8 if center excluded). */
  readonly count?: number;
  /** When false, skip the anchor tile and only use neighbors. Default true. */
  readonly includeCenterTile?: boolean;
  /**
   * Rotate which neighbor seats fill first (0–7). Center always stays first
   * when included. Useful for deterministic variety without randomness.
   */
  readonly neighborRotationSteps?: number;
};

function normalizingWorldPlazaMushroomBunchNeighborRotationSteps(
  neighborRotationSteps: number
): number {
  if (!Number.isFinite(neighborRotationSteps)) {
    return 0;
  }

  const neighborSeatCount =
    DEFINING_WORLD_PLAZA_MUSHROOM_BUNCH_SEAT_OFFSETS.length - 1;
  const wrapped = Math.trunc(neighborRotationSteps) % neighborSeatCount;

  return wrapped < 0 ? wrapped + neighborSeatCount : wrapped;
}

function listingWorldPlazaMushroomBunchSeatOffsets(
  includeCenterTile: boolean,
  neighborRotationSteps: number
): readonly (typeof DEFINING_WORLD_PLAZA_MUSHROOM_BUNCH_SEAT_OFFSETS)[number][] {
  const [centerOffset, ...neighborOffsets] =
    DEFINING_WORLD_PLAZA_MUSHROOM_BUNCH_SEAT_OFFSETS;
  const rotation = normalizingWorldPlazaMushroomBunchNeighborRotationSteps(
    neighborRotationSteps
  );
  const rotatedNeighbors = [
    ...neighborOffsets.slice(rotation),
    ...neighborOffsets.slice(0, rotation),
  ];

  if (!includeCenterTile) {
    return rotatedNeighbors;
  }

  return [centerOffset, ...rotatedNeighbors];
}

/**
 * Returns `count` unique tiles inside the 1-block bunch footprint.
 */
export function computingWorldPlazaMushroomBunchTilePositions({
  centerTileX,
  centerTileY,
  count = DEFINING_WORLD_PLAZA_MUSHROOM_BUNCH_DEFAULT_COUNT,
  includeCenterTile = true,
  neighborRotationSteps = 0,
}: ComputingWorldPlazaMushroomBunchTilePositionsParams): readonly ComputingWorldPlazaMushroomBunchTilePosition[] {
  if (!checkingWorldPlazaMushroomBunchSpawnCount(count, includeCenterTile)) {
    throw new Error(
      `Unsupported mushroom bunch count: ${String(count)} (includeCenterTile=${String(includeCenterTile)}). Max is ${includeCenterTile ? 9 : 8}.`
    );
  }

  const seatOffsets = listingWorldPlazaMushroomBunchSeatOffsets(
    includeCenterTile,
    neighborRotationSteps
  );
  const seats: ComputingWorldPlazaMushroomBunchTilePosition[] = [];

  for (let seatIndex = 0; seatIndex < count; seatIndex += 1) {
    const offset = seatOffsets[seatIndex];

    if (!offset) {
      throw new Error(
        `Missing mushroom bunch seat offset at index ${String(seatIndex)}.`
      );
    }

    const tileX = centerTileX + offset.offsetX;
    const tileY = centerTileY + offset.offsetY;

    seats.push({
      tileX,
      tileY,
      seatIndex,
      offsetX: offset.offsetX,
      offsetY: offset.offsetY,
      chebyshevDistanceTiles: computingWorldPlazaGridChebyshevDistance(
        centerTileX,
        centerTileY,
        tileX,
        tileY
      ),
    });
  }

  return seats;
}

/**
 * Full 3×3 (or 8-neighbor) footprint around an anchor, without trimming by count.
 */
export function listingWorldPlazaMushroomBunchFootprintTilePositions({
  centerTileX,
  centerTileY,
  includeCenterTile = true,
  neighborRotationSteps = 0,
}: Omit<
  ComputingWorldPlazaMushroomBunchTilePositionsParams,
  'count'
>): readonly ComputingWorldPlazaMushroomBunchTilePosition[] {
  const maxCount = includeCenterTile
    ? DEFINING_WORLD_PLAZA_MUSHROOM_BUNCH_SEAT_OFFSETS.length
    : DEFINING_WORLD_PLAZA_MUSHROOM_BUNCH_SEAT_OFFSETS.length - 1;

  return computingWorldPlazaMushroomBunchTilePositions({
    centerTileX,
    centerTileY,
    count: maxCount,
    includeCenterTile,
    neighborRotationSteps,
  });
}
