import type { DefiningWorldPlazaPickedShrubTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalPickedShrubs';

type CheckingWorldPlazaRuntimeShrubIsPicked = (
  tileX: number,
  tileY: number
) => boolean;

let runtimeShrubIsPickedLookup: CheckingWorldPlazaRuntimeShrubIsPicked | null =
  null;

/**
 * Registers runtime picked-shrub lookup for floor rendering and wildlife.
 */
export function registeringWorldPlazaPickedShrubsLookup(
  lookup: CheckingWorldPlazaRuntimeShrubIsPicked | null
): void {
  runtimeShrubIsPickedLookup = lookup;
}

/**
 * Returns true when a berry shrub was picked (or eaten) on this tile.
 */
export function checkingWorldPlazaRuntimeShrubIsPicked(
  tileX: number,
  tileY: number
): boolean {
  return runtimeShrubIsPickedLookup?.(tileX, tileY) ?? false;
}

export type { DefiningWorldPlazaPickedShrubTileState };
