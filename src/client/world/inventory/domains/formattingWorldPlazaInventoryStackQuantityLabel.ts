/**
 * Formats inventory stack counts using declarative per-item display rules.
 *
 * @module components/world/inventory/domains/formattingWorldPlazaInventoryStackQuantityLabel
 */

import type { DefiningWorldPlazaInventoryStackQuantityDisplayBehavior } from '@/components/world/inventory/domains/definingWorldPlazaInventoryStackQuantityDisplay';

/**
 * Resolves the active abbreviation tier for a quantity.
 *
 * @param quantity - Stack count
 * @param tiers - Ascending abbreviation tiers from item config
 */
function resolvingWorldPlazaInventoryStackQuantityAbbreviatedTier(
  quantity: number,
  tiers: DefiningWorldPlazaInventoryStackQuantityDisplayBehavior['abbreviationTiers']
): DefiningWorldPlazaInventoryStackQuantityDisplayBehavior['abbreviationTiers'][number] {
  let activeTier = tiers[0];

  if (!activeTier) {
    throw new Error(
      'abbreviationTiers must contain at least one tier when abbreviated display is used'
    );
  }

  for (const tier of tiers) {
    if (quantity >= tier.minQuantity) {
      activeTier = tier;
    }
  }

  return activeTier;
}

/**
 * Formats a stack quantity for HUD display.
 *
 * @param quantity - Stack count
 * @param display - Optional per-item display rules
 */
export function formattingWorldPlazaInventoryStackQuantityLabel(
  quantity: number,
  display?: DefiningWorldPlazaInventoryStackQuantityDisplayBehavior
): string {
  if (!display) {
    return String(quantity);
  }

  if (display.kind !== 'abbreviated-suffix-plus') {
    return String(quantity);
  }

  if (quantity <= display.exactDisplayMax) {
    return String(quantity);
  }

  const tier = resolvingWorldPlazaInventoryStackQuantityAbbreviatedTier(
    quantity,
    display.abbreviationTiers
  );

  return `${Math.floor(quantity / tier.scale)}${tier.suffix}+`;
}
