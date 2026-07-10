/**
 * Resolves item economy cost from a base value and optional multipliers.
 *
 * @module components/world/inventory/domains/computingWorldPlazaInventoryItemResolvedCost
 */

export type DefiningWorldPlazaInventoryItemCost = {
  readonly base: number;
  readonly multipliers?: Readonly<Record<string, number>>;
};

/**
 * Multiplies base cost by every multiplier value (identity when none).
 */
export function computingWorldPlazaInventoryItemResolvedCost(
  cost: DefiningWorldPlazaInventoryItemCost
): number {
  let resolved = cost.base;

  if (!cost.multipliers) {
    return resolved;
  }

  for (const multiplier of Object.values(cost.multipliers)) {
    resolved *= multiplier;
  }

  return resolved;
}
