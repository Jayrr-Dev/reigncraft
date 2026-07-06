import {
  DEFINING_WORLD_PLAZA_INVENTORY_SLOT_DOUBLE_ACTIVATION_MAX_DISTANCE_PX,
  DEFINING_WORLD_PLAZA_INVENTORY_SLOT_DOUBLE_ACTIVATION_MAX_INTERVAL_MS,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryConstants';

/** Pointer client position in viewport pixels. */
export type CheckingWorldPlazaInventorySlotDoubleActivationClientPoint = {
  readonly clientX: number;
  readonly clientY: number;
};

/** Previous primary tap used for double-activation matching. */
export type CheckingWorldPlazaInventorySlotDoubleActivationPreviousTap = {
  readonly atMs: number;
  readonly clientPoint: CheckingWorldPlazaInventorySlotDoubleActivationClientPoint;
  readonly slotIndex: number;
};

/** Input for {@link checkingWorldPlazaInventorySlotDoubleActivation}. */
export type CheckingWorldPlazaInventorySlotDoubleActivationInput = {
  readonly eventDetail: number;
  readonly nowMs: number;
  readonly clientPoint: CheckingWorldPlazaInventorySlotDoubleActivationClientPoint;
  readonly slotIndex: number;
  readonly previousTap: CheckingWorldPlazaInventorySlotDoubleActivationPreviousTap | null;
};

const CHECKING_WORLD_PLAZA_INVENTORY_SLOT_DOUBLE_ACTIVATION_MAX_DISTANCE_SQ =
  DEFINING_WORLD_PLAZA_INVENTORY_SLOT_DOUBLE_ACTIVATION_MAX_DISTANCE_PX *
  DEFINING_WORLD_PLAZA_INVENTORY_SLOT_DOUBLE_ACTIVATION_MAX_DISTANCE_PX;

/**
 * Returns true when a pointer press should run the hotbar slot double action.
 *
 * Supports mouse double-click (`event.detail >= 2`) and touch double-tap on
 * the same slot within the configured interval and distance.
 */
export function checkingWorldPlazaInventorySlotDoubleActivation(
  input: CheckingWorldPlazaInventorySlotDoubleActivationInput
): boolean {
  if (input.eventDetail >= 2) {
    return true;
  }

  if (!input.previousTap) {
    return false;
  }

  const isSameSlot = input.previousTap.slotIndex === input.slotIndex;
  const elapsedMs = input.nowMs - input.previousTap.atMs;
  const deltaClientX =
    input.clientPoint.clientX - input.previousTap.clientPoint.clientX;
  const deltaClientY =
    input.clientPoint.clientY - input.previousTap.clientPoint.clientY;
  const distanceSq = deltaClientX * deltaClientX + deltaClientY * deltaClientY;

  return (
    isSameSlot &&
    elapsedMs <=
      DEFINING_WORLD_PLAZA_INVENTORY_SLOT_DOUBLE_ACTIVATION_MAX_INTERVAL_MS &&
    distanceSq <=
      CHECKING_WORLD_PLAZA_INVENTORY_SLOT_DOUBLE_ACTIVATION_MAX_DISTANCE_SQ
  );
}
