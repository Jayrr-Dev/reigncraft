import { resolvingReigncraftTextBadgeShellClassName } from '@/components/ui/domains/resolvingReigncraftBadgeClassNames';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_DETAIL_BADGE_PAINT_BY_VARIANT,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG_STYLE,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemDetailConstants';
import { cn } from '@/lib/utils';

/**
 * Resolves rainbow badge shell classes for one expandable enchantment chip.
 */
export function resolvingWorldPlazaInventoryItemEnchantmentBadgeShellClassName(
  isExpanded: boolean
): string {
  const preset =
    DEFINING_WORLD_PLAZA_INVENTORY_ITEM_DETAIL_BADGE_PAINT_BY_VARIANT.enchantment;

  return cn(
    DEFINING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG_STYLE.enchantmentBadgeShell,
    resolvingReigncraftTextBadgeShellClassName(preset),
    isExpanded &&
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG_STYLE.enchantmentBadgeShellExpanded
  );
}
