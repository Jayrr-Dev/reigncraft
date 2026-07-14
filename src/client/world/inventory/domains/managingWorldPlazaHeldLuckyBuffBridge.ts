/**
 * Runtime bridge for the four-leaf clover lucky charm while held.
 *
 * @module components/world/inventory/domains/managingWorldPlazaHeldLuckyBuffBridge
 */

let managingWorldPlazaHeldLuckyBuffIsActive = false;

export function registeringWorldPlazaHeldLuckyBuffBridge(
  isActive: boolean
): void {
  managingWorldPlazaHeldLuckyBuffIsActive = isActive;
}

export function checkingWorldPlazaHeldLuckyBuffIsActive(): boolean {
  return managingWorldPlazaHeldLuckyBuffIsActive;
}
