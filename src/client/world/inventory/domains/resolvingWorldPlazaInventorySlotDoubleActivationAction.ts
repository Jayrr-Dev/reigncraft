import { checkingWorldPlazaInventoryItemIsBag } from '@/components/world/inventory/domains/checkingWorldPlazaInventoryItemIsBag';
import { checkingWorldPlazaInventoryItemIsFood } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemFood';
import { resolvingWorldPlazaInventoryItemTypeDefinition } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemTypeDefinition';

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
 * Skips the item action popover for the item's primary use (eat, equip, open bag).
 */
export function resolvingWorldPlazaInventorySlotDoubleActivationAction(
  itemTypeId: string,
  options: ResolvingWorldPlazaInventorySlotDoubleActivationActionOptions = {}
): ResolvingWorldPlazaInventorySlotDoubleActivationAction {
  if (checkingWorldPlazaInventoryItemIsBag(itemTypeId)) {
    return 'toggle-bag';
  }

  if (checkingWorldPlazaInventoryItemIsFood(itemTypeId)) {
    return 'eat';
  }

  const definition = resolvingWorldPlazaInventoryItemTypeDefinition(itemTypeId);

  if (definition?.equipment && !options.isEquipped) {
    return 'equip';
  }

  return 'open-detail';
}
