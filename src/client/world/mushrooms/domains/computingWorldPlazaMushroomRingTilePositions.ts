/**
 * Pure fairy-ring tile layout for mushrooms (utility only; not wired to spawn).
 *
 * Places `count` seats evenly on a circle around a center tile, then rounds to
 * integer tiles. On collision after rounding, nudges that seat outward.
 *
 * @module components/world/mushrooms/domains/computingWorldPlazaMushroomRingTilePositions
 */

import { checkingWorldPlazaMushroomRingSpawnCount } from '@/components/world/mushrooms/domains/checkingWorldPlazaMushroomRingSpawnCount';
import {
  DEFINING_WORLD_PLAZA_MUSHROOM_RING_SPAWN_COLLISION_MAX_ATTEMPTS,
  DEFINING_WORLD_PLAZA_MUSHROOM_RING_SPAWN_COLLISION_RADIUS_STEP_TILES,
  DEFINING_WORLD_PLAZA_MUSHROOM_RING_SPAWN_DEFAULT_RADIUS_TILES_BY_COUNT,
  type DefiningWorldPlazaMushroomRingSpawnCount,
} from '@/components/world/mushrooms/domains/definingWorldPlazaMushroomRingSpawnConstants';

export type ComputingWorldPlazaMushroomRingTilePosition = {
  readonly tileX: number;
  readonly tileY: number;
  readonly seatIndex: number;
  readonly angleRadians: number;
};

export type ComputingWorldPlazaMushroomRingTilePositionsParams = {
  readonly centerTileX: number;
  readonly centerTileY: number;
  readonly count: DefiningWorldPlazaMushroomRingSpawnCount;
  /** Defaults from `DEFINING_WORLD_PLAZA_MUSHROOM_RING_SPAWN_DEFAULT_RADIUS_TILES_BY_COUNT`. */
  readonly radiusTiles?: number;
  /** Radians; 0 = east (+X). */
  readonly startAngleRadians?: number;
  /** When true, skip the exact center tile even if rounding lands there. */
  readonly excludeCenterTile?: boolean;
};

function formattingWorldPlazaMushroomRingTileKey(
  tileX: number,
  tileY: number
): string {
  return `${tileX},${tileY}`;
}

/**
 * Returns one tile per ring seat for counts 4, 5, 7, or 11.
 * Throws if `count` is not a supported ring size.
 */
export function computingWorldPlazaMushroomRingTilePositions({
  centerTileX,
  centerTileY,
  count,
  radiusTiles,
  startAngleRadians = 0,
  excludeCenterTile = true,
}: ComputingWorldPlazaMushroomRingTilePositionsParams): readonly ComputingWorldPlazaMushroomRingTilePosition[] {
  if (!checkingWorldPlazaMushroomRingSpawnCount(count)) {
    throw new Error(
      `Unsupported mushroom ring spawn count: ${String(count)}. Use 4, 5, 7, or 11.`
    );
  }

  const resolvedRadiusTiles =
    radiusTiles ??
    DEFINING_WORLD_PLAZA_MUSHROOM_RING_SPAWN_DEFAULT_RADIUS_TILES_BY_COUNT[
      count
    ];

  if (!(resolvedRadiusTiles > 0)) {
    throw new Error(
      `Mushroom ring radiusTiles must be > 0 (got ${String(resolvedRadiusTiles)}).`
    );
  }

  const occupied = new Set<string>();
  if (excludeCenterTile) {
    occupied.add(
      formattingWorldPlazaMushroomRingTileKey(centerTileX, centerTileY)
    );
  }

  const seats: ComputingWorldPlazaMushroomRingTilePosition[] = [];

  for (let seatIndex = 0; seatIndex < count; seatIndex += 1) {
    const angleRadians =
      startAngleRadians + (seatIndex / count) * Math.PI * 2;
    const cosAngle = Math.cos(angleRadians);
    const sinAngle = Math.sin(angleRadians);

    let placed: ComputingWorldPlazaMushroomRingTilePosition | null = null;

    for (
      let attempt = 0;
      attempt < DEFINING_WORLD_PLAZA_MUSHROOM_RING_SPAWN_COLLISION_MAX_ATTEMPTS;
      attempt += 1
    ) {
      const attemptRadiusTiles =
        resolvedRadiusTiles +
        attempt *
          DEFINING_WORLD_PLAZA_MUSHROOM_RING_SPAWN_COLLISION_RADIUS_STEP_TILES;
      const tileX = Math.round(centerTileX + cosAngle * attemptRadiusTiles);
      const tileY = Math.round(centerTileY + sinAngle * attemptRadiusTiles);
      const tileKey = formattingWorldPlazaMushroomRingTileKey(tileX, tileY);

      if (occupied.has(tileKey)) {
        continue;
      }

      occupied.add(tileKey);
      placed = {
        tileX,
        tileY,
        seatIndex,
        angleRadians,
      };
      break;
    }

    if (placed === null) {
      throw new Error(
        `Could not place mushroom ring seat ${String(seatIndex)} of ${String(count)} around (${String(centerTileX)}, ${String(centerTileY)}) with radius ${String(resolvedRadiusTiles)}.`
      );
    }

    seats.push(placed);
  }

  return seats;
}
