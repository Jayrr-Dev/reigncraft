import type { DefiningWorldPlazaPickedFlowerTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalPickedFlowers';

type CheckingWorldPlazaRuntimeFlowerIsPicked = (
  tileX: number,
  tileY: number
) => boolean;

let runtimeFlowerIsPickedLookup: CheckingWorldPlazaRuntimeFlowerIsPicked | null =
  null;

/**
 * Registers runtime picked-flower lookup for floor rendering.
 */
export function registeringWorldPlazaPickedFlowersLookup(
  lookup: CheckingWorldPlazaRuntimeFlowerIsPicked | null
): void {
  runtimeFlowerIsPickedLookup = lookup;
}

/**
 * Returns true when a biome flower dot was picked on this tile.
 */
export function checkingWorldPlazaRuntimeFlowerIsPicked(
  tileX: number,
  tileY: number
): boolean {
  return runtimeFlowerIsPickedLookup?.(tileX, tileY) ?? false;
}

export type { DefiningWorldPlazaPickedFlowerTileState };
