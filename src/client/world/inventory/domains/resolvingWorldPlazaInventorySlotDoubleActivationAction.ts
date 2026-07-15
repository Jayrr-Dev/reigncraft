import { checkingWorldPlazaInventoryItemIsBag } from '@/components/world/inventory/domains/checkingWorldPlazaInventoryItemIsBag';
import { checkingWorldPlazaInventoryItemIsFood } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemFood';
import { checkingWorldPlazaInventoryItemIsRecipePage } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemRecipePage';
import { checkingWorldPlazaInventoryItemIsStorageExpansionPage } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemStorageExpansionPage';

export type ResolvingWorldPlazaInventorySlotDoubleActivationAction =
  | 'eat'
  | 'equip'
  | 'open-detail'
  | 'toggle-bag'
  | 'attach-recipe-page'
  | 'unlock-storage-row';

export type ResolvingWorldPlazaInventorySlotDoubleActivationActionOptions = {
  readonly isEquipped?: boolean;
};

/**
 * Resolves which double-activation action a hotbar item should perform.
 *
 * Skips the item action popover for the item's primary use (eat, open bag,
 * attach recipe page). Bags also use this path on single tap. Equipment is
 * always equipped from the reserved weapon/tool slot, so there is no separate
 * equip toggle.
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

  if (checkingWorldPlazaInventoryItemIsRecipePage(itemTypeId)) {
    return 'attach-recipe-page';
  }

  if (checkingWorldPlazaInventoryItemIsStorageExpansionPage(itemTypeId)) {
    return 'unlock-storage-row';
  }

  return 'open-detail';
}
