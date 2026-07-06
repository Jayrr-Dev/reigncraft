import { formattingWorldPlazaInventoryStackQuantityLabel } from '@/components/world/inventory/domains/formattingWorldPlazaInventoryStackQuantityLabel';
import { DEFINING_WORLD_PLAZA_SOULCORE_STACK_QUANTITY_DISPLAY } from '@/components/world/soulcore/domains/definingWorldPlazaSoulcoreConstants';
import { describe, expect, it } from 'vitest';

describe('formattingWorldPlazaInventoryStackQuantityLabel', () => {
  const display = DEFINING_WORLD_PLAZA_SOULCORE_STACK_QUANTITY_DISPLAY;

  it('shows exact counts up to 999', () => {
    expect(formattingWorldPlazaInventoryStackQuantityLabel(1, display)).toBe(
      '1'
    );
    expect(formattingWorldPlazaInventoryStackQuantityLabel(100, display)).toBe(
      '100'
    );
    expect(formattingWorldPlazaInventoryStackQuantityLabel(999, display)).toBe(
      '999'
    );
  });

  it('abbreviates thousands with a trailing plus', () => {
    expect(formattingWorldPlazaInventoryStackQuantityLabel(1000, display)).toBe(
      '1K+'
    );
    expect(formattingWorldPlazaInventoryStackQuantityLabel(1500, display)).toBe(
      '1K+'
    );
    expect(formattingWorldPlazaInventoryStackQuantityLabel(2000, display)).toBe(
      '2K+'
    );
    expect(
      formattingWorldPlazaInventoryStackQuantityLabel(999_999, display)
    ).toBe('999K+');
  });

  it('abbreviates millions, billions, and trillions', () => {
    expect(
      formattingWorldPlazaInventoryStackQuantityLabel(1_000_000, display)
    ).toBe('1M+');
    expect(
      formattingWorldPlazaInventoryStackQuantityLabel(1_500_000, display)
    ).toBe('1M+');
    expect(
      formattingWorldPlazaInventoryStackQuantityLabel(1_000_000_000, display)
    ).toBe('1B+');
    expect(
      formattingWorldPlazaInventoryStackQuantityLabel(
        1_000_000_000_000,
        display
      )
    ).toBe('1T+');
    expect(
      formattingWorldPlazaInventoryStackQuantityLabel(
        2_500_000_000_000,
        display
      )
    ).toBe('2T+');
  });

  it('falls back to the raw number when no display rules are provided', () => {
    expect(formattingWorldPlazaInventoryStackQuantityLabel(42)).toBe('42');
  });
});
