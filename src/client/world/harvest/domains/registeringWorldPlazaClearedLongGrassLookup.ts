import type { DefiningWorldPlazaClearedLongGrassTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalClearedLongGrass';

type CheckingWorldPlazaRuntimeLongGrassIsCleared = (
  tileX: number,
  tileY: number
) => boolean;

let runtimeLongGrassIsClearedLookup: CheckingWorldPlazaRuntimeLongGrassIsCleared | null =
  null;

let runtimeLongGrassIsSearchedLookup: CheckingWorldPlazaRuntimeLongGrassIsCleared | null =
  null;

/**
 * Registers runtime eaten-long-grass lookup for floor rendering.
 */
export function registeringWorldPlazaClearedLongGrassLookup(
  lookup: CheckingWorldPlazaRuntimeLongGrassIsCleared | null
): void {
  runtimeLongGrassIsClearedLookup = lookup;
}

/**
 * Registers runtime searched-long-grass lookup for search interaction gating.
 */
export function registeringWorldPlazaSearchedLongGrassLookup(
  lookup: CheckingWorldPlazaRuntimeLongGrassIsCleared | null
): void {
  runtimeLongGrassIsSearchedLookup = lookup;
}

/**
 * Returns true when wildlife has eaten the long-grass clump on this tile.
 */
export function checkingWorldPlazaRuntimeLongGrassIsCleared(
  tileX: number,
  tileY: number
): boolean {
  return runtimeLongGrassIsClearedLookup?.(tileX, tileY) ?? false;
}

/**
 * Returns true when the player already searched this long-grass clump.
 */
export function checkingWorldPlazaRuntimeLongGrassIsSearched(
  tileX: number,
  tileY: number
): boolean {
  return runtimeLongGrassIsSearchedLookup?.(tileX, tileY) ?? false;
}

export type { DefiningWorldPlazaClearedLongGrassTileState };
