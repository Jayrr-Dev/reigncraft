import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG_STYLE,
  type DefiningWorldPlazaInventoryItemDetailBadgeVariant,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemDetailConstants';
import { cn } from '@/lib/utils';

/**
 * Resolves value text classes for one item info detail row.
 */
export function resolvingWorldPlazaInventoryItemDetailInfoRowValueClassName(
  tone: DefiningWorldPlazaInventoryItemDetailBadgeVariant = 'neutral'
): string {
  return cn(
    DEFINING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG_STYLE.infoRowValue,
    tone === 'positive' &&
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG_STYLE.infoRowValuePositive,
    tone === 'warning' &&
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG_STYLE.infoRowValueWarning,
    tone === 'food' &&
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG_STYLE.infoRowValueFood,
    tone === 'tool' &&
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG_STYLE.infoRowValueTool
  );
}
