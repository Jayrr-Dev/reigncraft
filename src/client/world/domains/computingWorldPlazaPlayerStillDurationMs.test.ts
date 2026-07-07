import { computingWorldPlazaPlayerStillDurationMs } from '@/components/world/domains/computingWorldPlazaPlayerStillDurationMs';
import { describe, expect, it } from 'vitest';

describe('computingWorldPlazaPlayerStillDurationMs', () => {
  it('accumulates still time while the player is idle', () => {
    const first = computingWorldPlazaPlayerStillDurationMs({
      sample: null,
      position: { x: 5, y: 5, layer: 1 },
      isWalking: false,
      isRunning: false,
      isJumping: false,
      nowMs: 1000,
    });

    const second = computingWorldPlazaPlayerStillDurationMs({
      sample: first.sample,
      position: { x: 5, y: 5, layer: 1 },
      isWalking: false,
      isRunning: false,
      isJumping: false,
      nowMs: 32_000,
    });

    expect(second.stillDurationMs).toBe(31_000);
  });

  it('resets still time when the player starts walking', () => {
    const idle = computingWorldPlazaPlayerStillDurationMs({
      sample: null,
      position: { x: 5, y: 5, layer: 1 },
      isWalking: false,
      isRunning: false,
      isJumping: false,
      nowMs: 1000,
    });

    const moving = computingWorldPlazaPlayerStillDurationMs({
      sample: idle.sample,
      position: { x: 5.2, y: 5, layer: 1 },
      isWalking: true,
      isRunning: false,
      isJumping: false,
      nowMs: 40_000,
    });

    expect(moving.stillDurationMs).toBe(0);
  });
});
