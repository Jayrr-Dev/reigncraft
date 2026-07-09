/**
 * Reads created-by and forge-level instance metadata for item inspect UI.
 *
 * @module components/world/inventory/domains/resolvingWorldPlazaInventoryItemInstanceInspectFields
 */

import type { DefiningInventoryItem } from '@/components/inventory/domains/definingInventoryItem';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_CREATED_BY_METADATA_KEY,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_FORGE_LEVEL_METADATA_KEY,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemInstanceMetadataConstants';

/**
 * Returns the creator display name when metadata.createdBy is a non-empty string.
 */
export function resolvingWorldPlazaInventoryItemCreatedBy(
  item: DefiningInventoryItem
): string | null {
  const rawValue = item.metadata?.[DEFINING_WORLD_PLAZA_INVENTORY_ITEM_CREATED_BY_METADATA_KEY];

  if (typeof rawValue !== 'string') {
    return null;
  }

  const trimmed = rawValue.trim();
  return trimmed.length > 0 ? trimmed : null;
}

/**
 * Prefers instance forgeLevel metadata; falls back to type definition forgeLevel.
 */
export function resolvingWorldPlazaInventoryItemForgeLevel(
  item: DefiningInventoryItem,
  typeForgeLevel: number | undefined
): number | null {
  const rawValue =
    item.metadata?.[DEFINING_WORLD_PLAZA_INVENTORY_ITEM_FORGE_LEVEL_METADATA_KEY];

  if (typeof rawValue === 'number' && Number.isFinite(rawValue) && rawValue >= 0) {
    return Math.floor(rawValue);
  }

  if (typeForgeLevel !== undefined && typeForgeLevel >= 0) {
    return typeForgeLevel;
  }

  return null;
}

/**
 * Formats an equipment EV modifier for the item info dialog.
 */
export function formattingWorldPlazaInventoryItemEvModifierLabel(options: {
  readonly mode: 'additive' | 'multiplicative';
  readonly value: number;
}): string {
  if (options.mode === 'additive') {
    const sign = options.value >= 0 ? '+' : '';
    return `${sign}${options.value} additive`;
  }

  return `${options.value}x multiplicative`;
}
