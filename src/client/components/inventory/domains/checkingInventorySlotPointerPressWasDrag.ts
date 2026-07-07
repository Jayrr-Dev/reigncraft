import { DEFINING_INVENTORY_DRAG_ACTIVATION_PX } from '@/components/inventory/domains/definingInventoryConstants';

/** Pointer client position when a slot press starts or ends. */
export type CheckingInventorySlotPointerPressClientPoint = {
  readonly clientX: number;
  readonly clientY: number;
};

/**
 * Returns true when pointer travel between down and up exceeded the drag threshold.
 *
 * Used with {@link DEFINING_INVENTORY_DRAG_ACTIVATION_PX} so clicks/taps that stay
 * still are not treated as drags when dnd-kit listeners cover the slot surface.
 */
export function checkingInventorySlotPointerPressWasDrag(
  pressStart: CheckingInventorySlotPointerPressClientPoint,
  pressEnd: CheckingInventorySlotPointerPressClientPoint,
  activationDistancePx: number = DEFINING_INVENTORY_DRAG_ACTIVATION_PX
): boolean {
  const deltaClientX = pressEnd.clientX - pressStart.clientX;
  const deltaClientY = pressEnd.clientY - pressStart.clientY;
  const activationDistanceSq = activationDistancePx * activationDistancePx;

  return (
    deltaClientX * deltaClientX + deltaClientY * deltaClientY >=
    activationDistanceSq
  );
}
