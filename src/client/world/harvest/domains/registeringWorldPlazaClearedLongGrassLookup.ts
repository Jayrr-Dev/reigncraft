import type { DefiningWorldPlazaClearedLongGrassTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalClearedLongGrass';

type CheckingWorldPlazaRuntimeLongGrassIsCleared = (
  tileX: number,
  tileY: number
) => boolean;

let runtimeLongGrassIsClearedLookup: CheckingWorldPlazaRuntimeLongGrassIsCleared | null =
  null;

/**
 * Registers runtime cleared-long-grass lookup for floor rendering.
 */
export function registeringWorldPlazaClearedLongGrassLookup(
  lookup: CheckingWorldPlazaRuntimeLongGrassIsCleared | null
): void {
  runtimeLongGrassIsClearedLookup = lookup;
}

/**
 * Returns true when a long-grass clump was cleared on this tile.
 */
export function checkingWorldPlazaRuntimeLongGrassIsCleared(
  tileX: number,
  tileY: number
): boolean {
  return runtimeLongGrassIsClearedLookup?.(tileX, tileY) ?? false;
}

export type { DefiningWorldPlazaClearedLongGrassTileState };
