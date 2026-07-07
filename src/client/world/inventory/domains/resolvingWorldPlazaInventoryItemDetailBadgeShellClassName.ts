import { resolvingReigncraftTextBadgeShellClassName } from '@/components/ui/domains/resolvingReigncraftBadgeClassNames';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_DETAIL_BADGE_CHIP_CLASS_NAME,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_DETAIL_BADGE_PAINT_BY_VARIANT,
  type DefiningWorldPlazaInventoryItemDetailBadgeVariant,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemDetailConstants';

/**
 * Resolves compact rainbow badge shell classes for one item detail chip.
 */
export function resolvingWorldPlazaInventoryItemDetailBadgeShellClassName(
  variant: DefiningWorldPlazaInventoryItemDetailBadgeVariant
): string {
  const preset =
    DEFINING_WORLD_PLAZA_INVENTORY_ITEM_DETAIL_BADGE_PAINT_BY_VARIANT[variant];

  return [
    DEFINING_WORLD_PLAZA_INVENTORY_ITEM_DETAIL_BADGE_CHIP_CLASS_NAME,
    resolvingReigncraftTextBadgeShellClassName(preset),
  ].join(' ');
}
