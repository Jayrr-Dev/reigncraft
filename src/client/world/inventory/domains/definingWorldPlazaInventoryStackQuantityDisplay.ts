/**
 * Declarative stack-quantity label rules for world plaza inventory items.
 *
 * @module components/world/inventory/domains/definingWorldPlazaInventoryStackQuantityDisplay
 */

/** One abbreviated tier: quantities at or above `minQuantity` use `suffix` after floor division by `scale`. */
export type DefiningWorldPlazaInventoryStackQuantityAbbreviatedTier = {
  readonly minQuantity: number;
  readonly suffix: string;
  readonly scale: number;
};

/** Abbreviated stack labels with a trailing "+" (e.g. 1K+, 2M+). */
export type DefiningWorldPlazaInventoryStackQuantityAbbreviatedSuffixPlusDisplay =
  {
    readonly kind: 'abbreviated-suffix-plus';
    /** Show the raw integer up to and including this value (e.g. 1–999). */
    readonly exactDisplayMax: number;
    /** Ordered ascending by `minQuantity`; the highest matching tier wins. */
    readonly abbreviationTiers: readonly DefiningWorldPlazaInventoryStackQuantityAbbreviatedTier[];
  };

/** Optional per-item stack label formatting behavior. */
export type DefiningWorldPlazaInventoryStackQuantityDisplayBehavior =
  DefiningWorldPlazaInventoryStackQuantityAbbreviatedSuffixPlusDisplay;
