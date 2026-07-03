import { resolvingWorldPlazaWaterAtTileIndex } from "@/components/world/domains/resolvingWorldPlazaWaterAtTileIndex";

/**
 * Counts adjacent water tiles used to estimate pool depth.
 *
 * @module components/world/domains/countingWorldPlazaWaterNeighborsAtTileIndex
 */

/** Cardinal and diagonal neighbor offsets. */
const COUNTING_WORLD_PLAZA_WATER_NEIGHBOR_OFFSETS: readonly Readonly<{
  readonly deltaX: number;
  readonly deltaY: number;
}>[] = [
  { deltaX: 0, deltaY: -1 },
  { deltaX: 1, deltaY: 0 },
  { deltaX: 0, deltaY: 1 },
  { deltaX: -1, deltaY: 0 },
  { deltaX: -1, deltaY: -1 },
  { deltaX: 1, deltaY: -1 },
  { deltaX: 1, deltaY: 1 },
  { deltaX: -1, deltaY: 1 },
];

/**
 * Returns how many of the eight surrounding tiles also contain water.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function countingWorldPlazaWaterNeighborsAtTileIndex(
  tileX: number,
  tileY: number,
): number {
  let neighborCount = 0;

  for (const offset of COUNTING_WORLD_PLAZA_WATER_NEIGHBOR_OFFSETS) {
    if (
      resolvingWorldPlazaWaterAtTileIndex(
        tileX + offset.deltaX,
        tileY + offset.deltaY,
      )
    ) {
      neighborCount += 1;
    }
  }

  return neighborCount;
}
