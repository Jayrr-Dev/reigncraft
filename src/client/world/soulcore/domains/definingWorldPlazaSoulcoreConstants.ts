/**
 * Declarative Soulcore mechanic constants.
 *
 * @module components/world/soulcore/domains/definingWorldPlazaSoulcoreConstants
 */

import type { DefiningWorldPlazaInventoryStackQuantityDisplayBehavior } from '@/components/world/inventory/domains/definingWorldPlazaInventoryStackQuantityDisplay';

/** Human-readable Soulcore item name. */
export const DEFINING_WORLD_PLAZA_SOULCORE_ITEM_NAME = 'Soulcore' as const;

/**
 * Stack quantity label rules for Soulcore.
 *
 * - 1–999: exact count
 * - 1,000+: abbreviated with K / M / B / T and a trailing "+"
 */
export const DEFINING_WORLD_PLAZA_SOULCORE_STACK_QUANTITY_DISPLAY: DefiningWorldPlazaInventoryStackQuantityDisplayBehavior =
  {
    kind: 'abbreviated-suffix-plus',
    exactDisplayMax: 999,
    abbreviationTiers: [
      { minQuantity: 1_000, suffix: 'K', scale: 1_000 },
      { minQuantity: 1_000_000, suffix: 'M', scale: 1_000_000 },
      { minQuantity: 1_000_000_000, suffix: 'B', scale: 1_000_000_000 },
      {
        minQuantity: 1_000_000_000_000,
        suffix: 'T',
        scale: 1_000_000_000_000,
      },
    ],
  } as const;
