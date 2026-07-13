import {
  clearingPlazaSinglePlayerSaveSlotWriteQueuesForTests,
  queuingPlazaSinglePlayerSaveSlotWrite,
} from '@/components/home/domains/queuingPlazaSinglePlayerSaveSlotWrites';
import { beforeEach, describe, expect, it } from 'vitest';

describe('queuingPlazaSinglePlayerSaveSlotWrites', () => {
  beforeEach(() => {
    clearingPlazaSinglePlayerSaveSlotWriteQueuesForTests();
  });

  it('runs writers for one slot in start order', async () => {
    const order: number[] = [];
    let releaseFirst: (() => void) | undefined;

    const firstGate = new Promise<void>((resolve) => {
      releaseFirst = resolve;
    });

    const first = queuingPlazaSinglePlayerSaveSlotWrite(1, async () => {
      await firstGate;
      order.push(1);
    });

    const second = queuingPlazaSinglePlayerSaveSlotWrite(1, async () => {
      order.push(2);
    });

    releaseFirst?.();
    await Promise.all([first, second]);

    expect(order).toEqual([1, 2]);
  });

  it('does not let a failed write block the next write', async () => {
    const order: number[] = [];

    await expect(
      queuingPlazaSinglePlayerSaveSlotWrite(2, async () => {
        order.push(1);
        throw new Error('boom');
      })
    ).rejects.toThrow('boom');

    await queuingPlazaSinglePlayerSaveSlotWrite(2, async () => {
      order.push(2);
    });

    expect(order).toEqual([1, 2]);
  });

  it('allows different slots to run without waiting on each other', async () => {
    let releaseSlot1: (() => void) | undefined;
    const slot1Gate = new Promise<void>((resolve) => {
      releaseSlot1 = resolve;
    });
    let slot2Finished = false;

    const slot1 = queuingPlazaSinglePlayerSaveSlotWrite(1, async () => {
      await slot1Gate;
    });

    await queuingPlazaSinglePlayerSaveSlotWrite(2, async () => {
      slot2Finished = true;
    });

    expect(slot2Finished).toBe(true);
    releaseSlot1?.();
    await slot1;
  });
});
