import { computingWorldPlazaInventoryItemResolvedCost } from '@/components/world/inventory/domains/computingWorldPlazaInventoryItemResolvedCost';
import { describe, expect, it } from 'vitest';

describe('computingWorldPlazaInventoryItemResolvedCost', () => {
  it('returns base when multipliers are missing', () => {
    expect(
      computingWorldPlazaInventoryItemResolvedCost({ base: 100 })
    ).toBe(100);
  });

  it('multiplies every named multiplier', () => {
    expect(
      computingWorldPlazaInventoryItemResolvedCost({
        base: 100,
        multipliers: { market: 1.5, tax: 1.1 },
      })
    ).toBe(165);
  });
});
