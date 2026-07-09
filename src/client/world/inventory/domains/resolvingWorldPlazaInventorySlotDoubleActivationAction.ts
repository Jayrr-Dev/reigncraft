import { checkingWorldPlazaInventoryItemIsBag } from '@/components/world/inventory/domains/checkingWorldPlazaInventoryItemIsBag';
import { checkingWorldPlazaInventoryItemIsFood } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemFood';

export type ResolvingWorldPlazaInventorySlotDoubleActivationAction =
  | 'eat'
  | 'equip'
  | 'open-detail'
  | 'toggle-bag';

export type ResolvingWorldPlazaInventorySlotDoubleActivationActionOptions = {
  readonly isEquipped?: boolean;
};

/**
 * Resolves which double-activation action a hotbar item should perform.
 *
 * Skips the item action popover for the item's primary use (eat, open bag).
 * Equipment is always equipped from the reserved weapon/tool slot, so there
 * is no separate equip toggle.
 */
export function resolvingWorldPlazaInventorySlotDoubleActivationAction(
  itemTypeId: string,
  _options: ResolvingWorldPlazaInventorySlotDoubleActivationActionOptions = {}
): ResolvingWorldPlazaInventorySlotDoubleActivationAction {
  if (checkingWorldPlazaInventoryItemIsBag(itemTypeId)) {
    return 'toggle-bag';
  }

  if (checkingWorldPlazaInventoryItemIsFood(itemTypeId)) {
    return 'eat';
  }

  return 'open-detail';
}
