import { advancingStaminaCoreTick } from '@/components/world/stamina/domains/advancingStaminaCoreTick';
import { describe, expect, it } from 'vitest';

const DEFINING_STAMINA_CORE_TEST_CONFIG = {
  drainPerSecond: 0.22,
  regenPerSecond: 0.15,
  runLockedExitRatio: 0.35,
  maxStaminaRatio: 1,
} as const;

describe('advancingStaminaCoreTick', () => {
  it('drains while running and latches run-lock at zero', () => {
    const result = advancingStaminaCoreTick({
      state: { staminaRatio: 0.1, isRunLocked: false },
      wantsToRun: true,
      deltaSeconds: 1,
      config: DEFINING_STAMINA_CORE_TEST_CONFIG,
    });

    expect(result.isRunning).toBe(true);
    expect(result.state.staminaRatio).toBe(0);
    expect(result.state.isRunLocked).toBe(true);
  });

  it('regens while run-locked and clears lock at exit ratio', () => {
    const stillLocked = advancingStaminaCoreTick({
      state: { staminaRatio: 0.34, isRunLocked: true },
      wantsToRun: true,
      deltaSeconds: 0,
      config: DEFINING_STAMINA_CORE_TEST_CONFIG,
    });

    expect(stillLocked.isRunning).toBe(false);
    expect(stillLocked.state.isRunLocked).toBe(true);

    const unlocked = advancingStaminaCoreTick({
      state: { staminaRatio: 0.35, isRunLocked: true },
      wantsToRun: true,
      deltaSeconds: 0,
      config: DEFINING_STAMINA_CORE_TEST_CONFIG,
    });

    expect(unlocked.state.isRunLocked).toBe(false);
  });

  it('clamps ratio to maxStaminaRatio above 1', () => {
    const result = advancingStaminaCoreTick({
      state: { staminaRatio: 1.2, isRunLocked: false },
      wantsToRun: false,
      deltaSeconds: 1,
      config: {
        ...DEFINING_STAMINA_CORE_TEST_CONFIG,
        maxStaminaRatio: 1.3,
      },
    });

    expect(result.state.staminaRatio).toBe(1.3);
  });
});
