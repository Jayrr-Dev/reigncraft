import { checkingWorldPlazaInventorySlotDoubleActivation } from '@/components/world/inventory/domains/checkingWorldPlazaInventorySlotDoubleActivation';
import { describe, expect, it } from 'vitest';

describe('checkingWorldPlazaInventorySlotDoubleActivation', () => {
  it('detects mouse double-click via event detail', () => {
    expect(
      checkingWorldPlazaInventorySlotDoubleActivation({
        eventDetail: 2,
        nowMs: 1000,
        clientPoint: { clientX: 10, clientY: 20 },
        slotIndex: 1,
        previousTap: null,
      })
    ).toBe(true);
  });

  it('detects touch double-tap on the same slot within interval and distance', () => {
    expect(
      checkingWorldPlazaInventorySlotDoubleActivation({
        eventDetail: 1,
        nowMs: 1200,
        clientPoint: { clientX: 12, clientY: 22 },
        slotIndex: 2,
        previousTap: {
          atMs: 1000,
          clientPoint: { clientX: 10, clientY: 20 },
          slotIndex: 2,
        },
      })
    ).toBe(true);
  });

  it('rejects taps on different slots', () => {
    expect(
      checkingWorldPlazaInventorySlotDoubleActivation({
        eventDetail: 1,
        nowMs: 1100,
        clientPoint: { clientX: 10, clientY: 20 },
        slotIndex: 3,
        previousTap: {
          atMs: 1000,
          clientPoint: { clientX: 10, clientY: 20 },
          slotIndex: 4,
        },
      })
    ).toBe(false);
  });
});
