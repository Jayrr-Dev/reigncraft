import { checkingWorldPlazaInventoryItemIsBag } from '@/components/world/inventory/domains/checkingWorldPlazaInventoryItemIsBag';
import { checkingWorldPlazaInventoryItemIsFood } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemFood';

export type ResolvingWorldPlazaInventorySlotDoubleActivationAction =
  | 'eat'
  | 'open-detail'
  | 'toggle-bag';

/**
 * Resolves which double-activation action a hotbar item should perform.
 */
export function resolvingWorldPlazaInventorySlotDoubleActivationAction(
  itemTypeId: string
): ResolvingWorldPlazaInventorySlotDoubleActivationAction | null {
  if (checkingWorldPlazaInventoryItemIsBag(itemTypeId)) {
    return 'toggle-bag';
  }

  if (checkingWorldPlazaInventoryItemIsFood(itemTypeId)) {
    return 'eat';
  }

  return 'open-detail';
}
