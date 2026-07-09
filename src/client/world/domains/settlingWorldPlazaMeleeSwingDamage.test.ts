import { describe, expect, it, vi } from 'vitest';

import type { DefiningWorldPlazaAvatarMeleePresentationState } from '@/components/world/domains/definingWorldPlazaAvatarCombatPresentationTypes';
import { settlingWorldPlazaMeleeSwingDamage } from '@/components/world/domains/settlingWorldPlazaMeleeSwingDamage';

function creatingSwingState(
  overrides: Partial<DefiningWorldPlazaAvatarMeleePresentationState> = {}
): DefiningWorldPlazaAvatarMeleePresentationState {
  return {
    direction: 'Down',
    startedAtMs: 1000,
    targetGridX: 4,
    targetGridY: 5,
    targetInstanceId: 'deer-1',
    damageAmount: 12,
    durationMs: 400,
    animationFps: 12,
    damageRegistered: false,
    ...overrides,
  };
}

describe('settlingWorldPlazaMeleeSwingDamage', () => {
  it('does nothing for a null swing', () => {
    const applyDamage = vi.fn();

    const result = settlingWorldPlazaMeleeSwingDamage(null, 5000, applyDamage);

    expect(result).toEqual({ isComplete: false, didRegisterDamage: false });
    expect(applyDamage).not.toHaveBeenCalled();
  });

  it('does not register damage while the swing is still animating', () => {
    const applyDamage = vi.fn();
    const swing = creatingSwingState();

    const result = settlingWorldPlazaMeleeSwingDamage(
      swing,
      swing.startedAtMs + swing.durationMs - 1,
      applyDamage
    );

    expect(result).toEqual({ isComplete: false, didRegisterDamage: false });
    expect(applyDamage).not.toHaveBeenCalled();
    expect(swing.damageRegistered).toBe(false);
  });

  it('registers damage exactly once when the swing completes', () => {
    const applyDamage = vi.fn();
    const swing = creatingSwingState();
    const completedAtMs = swing.startedAtMs + swing.durationMs;

    const first = settlingWorldPlazaMeleeSwingDamage(
      swing,
      completedAtMs,
      applyDamage
    );
    const second = settlingWorldPlazaMeleeSwingDamage(
      swing,
      completedAtMs + 16,
      applyDamage
    );

    expect(first).toEqual({ isComplete: true, didRegisterDamage: true });
    expect(second).toEqual({ isComplete: true, didRegisterDamage: false });
    expect(applyDamage).toHaveBeenCalledTimes(1);
    expect(applyDamage).toHaveBeenCalledWith(swing);
    expect(swing.damageRegistered).toBe(true);
  });

  it('is safe when two frame loops race on the same completed swing', () => {
    const applyDamage = vi.fn();
    const swing = creatingSwingState();
    const completedAtMs = swing.startedAtMs + swing.durationMs + 5;

    // Simulates combat-lock loop and avatar Pixi tick both observing completion.
    settlingWorldPlazaMeleeSwingDamage(swing, completedAtMs, applyDamage);
    settlingWorldPlazaMeleeSwingDamage(swing, completedAtMs, applyDamage);

    expect(applyDamage).toHaveBeenCalledTimes(1);
  });
});
