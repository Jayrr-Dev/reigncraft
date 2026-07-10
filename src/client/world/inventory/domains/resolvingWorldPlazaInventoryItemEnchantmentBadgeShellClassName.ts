import { resolvingReigncraftTextBadgeShellClassName } from '@/components/ui/domains/resolvingReigncraftBadgeClassNames';
import type { DefiningWorldPlazaInventoryEnchantmentFamily } from '@/components/world/inventory/domains/definingWorldPlazaInventoryEnchantmentConstants';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_DETAIL_BADGE_PAINT_BY_VARIANT,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG_STYLE,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemDetailConstants';
import { cn } from '@/lib/utils';

/**
 * Resolves rainbow badge shell classes for one expandable item-mod chip.
 */
export function resolvingWorldPlazaInventoryItemEnchantmentBadgeShellClassName(
  family: DefiningWorldPlazaInventoryEnchantmentFamily,
  isExpanded: boolean
): string {
  const paintVariant =
    family === 'enhancement' ? 'enhancement' : 'enchantment';
  const preset =
    DEFINING_WORLD_PLAZA_INVENTORY_ITEM_DETAIL_BADGE_PAINT_BY_VARIANT[
      paintVariant
    ];

  return cn(
    DEFINING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG_STYLE.itemModBadgeShell,
    resolvingReigncraftTextBadgeShellClassName(preset),
    isExpanded &&
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG_STYLE.itemModBadgeShellExpanded
  );
}
