import { checkingWorldPlazaInventoryFoodEatShouldContinue } from '@/components/world/inventory/domains/checkingWorldPlazaInventoryFoodEatShouldContinue';
import { describe, expect, it } from 'vitest';

describe('checkingWorldPlazaInventoryFoodEatShouldContinue', () => {
  it('continues when idle and undamaged', () => {
    expect(
      checkingWorldPlazaInventoryFoodEatShouldContinue({
        damageBaselineMs: 100,
        lastDamagedAtMs: 100,
        keyboardDirection: { x: 0, y: 0 },
        walkTarget: null,
        jumpRequested: false,
        rollRequested: false,
      })
    ).toBe(true);
  });

  it('cancels on new damage after channel start', () => {
    expect(
      checkingWorldPlazaInventoryFoodEatShouldContinue({
        damageBaselineMs: 100,
        lastDamagedAtMs: 200,
        keyboardDirection: { x: 0, y: 0 },
        walkTarget: null,
        jumpRequested: false,
        rollRequested: false,
      })
    ).toBe(false);
  });

  it('cancels on keyboard walk intent', () => {
    expect(
      checkingWorldPlazaInventoryFoodEatShouldContinue({
        damageBaselineMs: null,
        lastDamagedAtMs: null,
        keyboardDirection: { x: 1, y: 0 },
        walkTarget: null,
        jumpRequested: false,
        rollRequested: false,
      })
    ).toBe(false);
  });

  it('cancels on click walk target', () => {
    expect(
      checkingWorldPlazaInventoryFoodEatShouldContinue({
        damageBaselineMs: null,
        lastDamagedAtMs: null,
        keyboardDirection: { x: 0, y: 0 },
        walkTarget: { x: 3, y: 4, layer: 1 },
        jumpRequested: false,
        rollRequested: false,
      })
    ).toBe(false);
  });

  it('cancels on jump or roll request', () => {
    expect(
      checkingWorldPlazaInventoryFoodEatShouldContinue({
        damageBaselineMs: null,
        lastDamagedAtMs: null,
        keyboardDirection: { x: 0, y: 0 },
        walkTarget: null,
        jumpRequested: true,
        rollRequested: false,
      })
    ).toBe(false);

    expect(
      checkingWorldPlazaInventoryFoodEatShouldContinue({
        damageBaselineMs: null,
        lastDamagedAtMs: null,
        keyboardDirection: { x: 0, y: 0 },
        walkTarget: null,
        jumpRequested: false,
        rollRequested: true,
      })
    ).toBe(false);
  });
});
