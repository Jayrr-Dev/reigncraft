import {
  DEFINING_WORLD_PLAZA_INVENTORY_ENCHANTMENT_STATE_METADATA_KEY,
  DEFINING_WORLD_PLAZA_INVENTORY_ENCHANTMENTS_METADATA_KEY,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryEnchantmentConstants';
import type { DefiningInventoryItem } from '@/components/inventory/domains/definingInventoryItem';

export type DefiningWorldPlazaInventoryEnchantmentRuntimeState = {
  readonly armed?: boolean;
  readonly cooldownEndsAtMs?: number;
};

export type DefiningWorldPlazaInventoryEnchantmentStateMap = Readonly<
  Record<string, DefiningWorldPlazaInventoryEnchantmentRuntimeState>
>;

function parsingEnchantmentIdList(metadata: DefiningInventoryItem['metadata']): string[] {
  const rawValue = metadata?.[DEFINING_WORLD_PLAZA_INVENTORY_ENCHANTMENTS_METADATA_KEY];

  if (!Array.isArray(rawValue)) {
    return [];
  }

  return rawValue.filter((entry): entry is string => typeof entry === 'string');
}

function parsingEnchantmentStateMap(
  metadata: DefiningInventoryItem['metadata']
): DefiningWorldPlazaInventoryEnchantmentStateMap {
  const rawValue =
    metadata?.[DEFINING_WORLD_PLAZA_INVENTORY_ENCHANTMENT_STATE_METADATA_KEY];

  if (!rawValue || typeof rawValue !== 'object' || Array.isArray(rawValue)) {
    return {};
  }

  const nextState: Record<string, DefiningWorldPlazaInventoryEnchantmentRuntimeState> =
    {};

  for (const [enchantmentId, runtimeState] of Object.entries(rawValue)) {
    if (!runtimeState || typeof runtimeState !== 'object' || Array.isArray(runtimeState)) {
      continue;
    }

    const armed =
      'armed' in runtimeState && typeof runtimeState.armed === 'boolean'
        ? runtimeState.armed
        : undefined;
    const cooldownEndsAtMs =
      'cooldownEndsAtMs' in runtimeState &&
      typeof runtimeState.cooldownEndsAtMs === 'number' &&
      Number.isFinite(runtimeState.cooldownEndsAtMs)
        ? runtimeState.cooldownEndsAtMs
        : undefined;

    if (armed === undefined && cooldownEndsAtMs === undefined) {
      continue;
    }

    nextState[enchantmentId] = {
      ...(armed === undefined ? {} : { armed }),
      ...(cooldownEndsAtMs === undefined ? {} : { cooldownEndsAtMs }),
    };
  }

  return nextState;
}

/**
 * Lists enchantment ids from item metadata.
 */
export function listingWorldPlazaInventoryItemEnchantmentIdsFromMetadata(
  metadata: DefiningInventoryItem['metadata']
): readonly string[] {
  return parsingEnchantmentIdList(metadata);
}

/**
 * Reads per-enchantment runtime state from item metadata.
 */
export function readingWorldPlazaInventoryItemEnchantmentStateMap(
  metadata: DefiningInventoryItem['metadata']
): DefiningWorldPlazaInventoryEnchantmentStateMap {
  return parsingEnchantmentStateMap(metadata);
}

/**
 * Merges type defaults with instance metadata enchantment ids.
 */
export function listingWorldPlazaInventoryItemEnchantmentIds(
  item: DefiningInventoryItem,
  defaultEnchantmentIds: readonly string[] = []
): readonly string[] {
  const instanceEnchantmentIds = parsingEnchantmentIdList(item.metadata);
  const mergedIds = new Set<string>([
    ...defaultEnchantmentIds,
    ...instanceEnchantmentIds,
  ]);

  return [...mergedIds];
}
