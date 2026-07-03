import { resolvingWorldPlazaWaterAtTileIndex } from "@/components/world/domains/resolvingWorldPlazaWaterAtTileIndex";

/**
 * Detects shore tiles that border dry land.
 *
 * @module components/world/domains/checkingWorldPlazaWaterTileIsShoreAtTileIndex
 */

/** Cardinal neighbor offsets for shore checks. */
const CHECKING_WORLD_PLAZA_WATER_SHORE_CARDINAL_OFFSETS: readonly Readonly<{
  readonly deltaX: number;
  readonly deltaY: number;
}>[] = [
  { deltaX: 0, deltaY: -1 },
  { deltaX: 1, deltaY: 0 },
  { deltaX: 0, deltaY: 1 },
  { deltaX: -1, deltaY: 0 },
];

/**
 * Returns true when any cardinal neighbor is dry land.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function checkingWorldPlazaWaterTileIsShoreAtTileIndex(
  tileX: number,
  tileY: number,
): boolean {
  for (const offset of CHECKING_WORLD_PLAZA_WATER_SHORE_CARDINAL_OFFSETS) {
    if (
      !resolvingWorldPlazaWaterAtTileIndex(
        tileX + offset.deltaX,
        tileY + offset.deltaY,
      )
    ) {
      return true;
    }
  }

  return false;
}
