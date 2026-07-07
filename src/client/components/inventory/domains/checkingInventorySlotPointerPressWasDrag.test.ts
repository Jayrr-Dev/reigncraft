import { checkingInventorySlotPointerPressWasDrag } from '@/components/inventory/domains/checkingInventorySlotPointerPressWasDrag';
import { describe, expect, it } from 'vitest';

describe('checkingInventorySlotPointerPressWasDrag', () => {
  it('treats a stationary press as a click', () => {
    expect(
      checkingInventorySlotPointerPressWasDrag(
        { clientX: 10, clientY: 20 },
        { clientX: 11, clientY: 21 },
        8
      )
    ).toBe(false);
  });

  it('treats movement beyond the threshold as a drag', () => {
    expect(
      checkingInventorySlotPointerPressWasDrag(
        { clientX: 0, clientY: 0 },
        { clientX: 10, clientY: 0 },
        8
      )
    ).toBe(true);
  });
});
