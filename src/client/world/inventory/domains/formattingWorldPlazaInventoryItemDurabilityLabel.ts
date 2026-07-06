import type { DefiningInventoryItem } from '@/components/inventory/domains/definingInventoryItem';
import { resolvingWorldPlazaInventoryItemDurability } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemDurability';

/**
 * Formats remaining durability for tooltips and HUD copy.
 */
export function formattingWorldPlazaInventoryItemDurabilityLabel(
  item: DefiningInventoryItem
): string | null {
  const durabilitySnapshot = resolvingWorldPlazaInventoryItemDurability(item);

  if (!durabilitySnapshot) {
    return null;
  }

  if (durabilitySnapshot.remaining <= 0) {
    return 'Worn out (may break on use)';
  }

  return `Durability ${durabilitySnapshot.remaining}/${durabilitySnapshot.max}`;
}
