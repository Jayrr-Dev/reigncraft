/**
 * Runtime picked-mushroom lookup for world rendering.
 *
 * @module components/world/mushrooms/domains/registeringWorldPlazaPickedMushroomsLookup
 */

type CheckingWorldPlazaRuntimeMushroomIsPicked = (
  tileX: number,
  tileY: number
) => boolean;

let runtimeMushroomIsPickedLookup: CheckingWorldPlazaRuntimeMushroomIsPicked | null =
  null;

export function registeringWorldPlazaPickedMushroomsLookup(
  lookup: CheckingWorldPlazaRuntimeMushroomIsPicked | null
): void {
  runtimeMushroomIsPickedLookup = lookup;
}

export function checkingWorldPlazaRuntimeMushroomIsPicked(
  tileX: number,
  tileY: number
): boolean {
  return runtimeMushroomIsPickedLookup?.(tileX, tileY) ?? false;
}
