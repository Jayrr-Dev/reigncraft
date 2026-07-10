import type { DefiningInventoryItem } from '@/components/inventory/domains/definingInventoryItem';
import type {
  DefiningWorldPlazaInventoryEnchantmentFamily,
  DefiningWorldPlazaInventoryEnchantmentKind,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryEnchantmentConstants';
import {
  readingWorldPlazaInventoryItemEnchantmentStateMap,
  listingWorldPlazaInventoryItemEnchantmentIds,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryEnchantmentState';
import { resolvingWorldPlazaInventoryEnchantmentDefinition } from '@/components/world/inventory/domains/definingWorldPlazaInventoryEnchantmentRegistry';
import { resolvingWorldPlazaInventoryItemTypeDefinition } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemTypeDefinition';

export type ResolvingWorldPlazaInventoryItemEnchantmentRow = {
  readonly enchantmentId: string;
  readonly family: DefiningWorldPlazaInventoryEnchantmentFamily;
  readonly kind: DefiningWorldPlazaInventoryEnchantmentKind;
  readonly name: string;
  readonly description: string;
  readonly badgeLabel: string;
  readonly useButtonLabel: string | null;
  readonly isUsable: boolean;
  readonly isArmed: boolean;
  readonly cooldownRemainingMs: number | null;
  readonly statusLabel: string | null;
};

function resolvingWorldPlazaInventoryEnchantmentCooldownRemainingMs(
  cooldownEndsAtMs: number | undefined,
  nowMs: number
): number | null {
  if (cooldownEndsAtMs === undefined) {
    return null;
  }

  const remainingMs = cooldownEndsAtMs - nowMs;

  return remainingMs > 0 ? remainingMs : null;
}

function formattingWorldPlazaInventoryEnchantmentCooldownLabel(
  cooldownRemainingMs: number
): string {
  const remainingSeconds = Math.max(1, Math.ceil(cooldownRemainingMs / 1000));
  return `Recharging ${remainingSeconds}s`;
}

/**
 * Resolves passive and active enchantment rows for one inventory item instance.
 */
export function resolvingWorldPlazaInventoryItemEnchantmentRows(
  item: DefiningInventoryItem,
  nowMs: number = Date.now()
): readonly ResolvingWorldPlazaInventoryItemEnchantmentRow[] {
  const itemDefinition = resolvingWorldPlazaInventoryItemTypeDefinition(
    item.itemTypeId
  );
  const enchantmentIds = listingWorldPlazaInventoryItemEnchantmentIds(
    item,
    itemDefinition?.defaultEnchantments ?? []
  );
  const enchantmentState = readingWorldPlazaInventoryItemEnchantmentStateMap(
    item.metadata
  );

  return enchantmentIds.flatMap((enchantmentId) => {
    const definition =
      resolvingWorldPlazaInventoryEnchantmentDefinition(enchantmentId);

    if (!definition) {
      return [];
    }

    const runtimeState = enchantmentState[enchantmentId];
    const cooldownRemainingMs =
      resolvingWorldPlazaInventoryEnchantmentCooldownRemainingMs(
        runtimeState?.cooldownEndsAtMs,
        nowMs
      );
    const isArmed = runtimeState?.armed === true;
    const isUsable =
      definition.kind === 'active' &&
      !isArmed &&
      (cooldownRemainingMs === null || cooldownRemainingMs <= 0);

    let statusLabel: string | null = null;

    if (definition.kind === 'active') {
      if (isArmed) {
        statusLabel = 'Armed';
      } else if (cooldownRemainingMs !== null && cooldownRemainingMs > 0) {
        statusLabel = formattingWorldPlazaInventoryEnchantmentCooldownLabel(
          cooldownRemainingMs
        );
      }
    }

    return [
      {
        enchantmentId: definition.id,
        family: definition.family,
        kind: definition.kind,
        name: definition.name,
        description: definition.description,
        badgeLabel: definition.badgeLabel,
        useButtonLabel: definition.useButtonLabel ?? `Use ${definition.name}`,
        isUsable,
        isArmed,
        cooldownRemainingMs,
        statusLabel,
      },
    ];
  });
}

/**
 * Splits resolved item-mod rows by family and activation kind.
 */
export function partitioningWorldPlazaInventoryItemEnchantmentRows(
  rows: readonly ResolvingWorldPlazaInventoryItemEnchantmentRow[]
): {
  readonly passiveEnhancements: readonly ResolvingWorldPlazaInventoryItemEnchantmentRow[];
  readonly passiveEnchantments: readonly ResolvingWorldPlazaInventoryItemEnchantmentRow[];
  readonly activeEnhancements: readonly ResolvingWorldPlazaInventoryItemEnchantmentRow[];
  readonly activeEnchantments: readonly ResolvingWorldPlazaInventoryItemEnchantmentRow[];
} {
  return {
    passiveEnhancements: rows.filter(
      (row) => row.kind === 'passive' && row.family === 'enhancement'
    ),
    passiveEnchantments: rows.filter(
      (row) => row.kind === 'passive' && row.family === 'enchantment'
    ),
    activeEnhancements: rows.filter(
      (row) => row.kind === 'active' && row.family === 'enhancement'
    ),
    activeEnchantments: rows.filter(
      (row) => row.kind === 'active' && row.family === 'enchantment'
    ),
  };
}
