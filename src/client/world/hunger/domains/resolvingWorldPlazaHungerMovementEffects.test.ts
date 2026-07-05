import { resolvingWorldPlazaHungerMovementEffects } from '@/components/world/hunger/domains/resolvingWorldPlazaHungerMovementEffects';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaHungerMovementEffects', () => {
  it('grants a stamina regen bonus while well fed', () => {
    const effects = resolvingWorldPlazaHungerMovementEffects(0.9);

    expect(effects.staminaRegenMultiplier).toBeGreaterThan(1);
    expect(effects.speedMultiplier).toBe(1);
    expect(effects.isSprintDisabled).toBe(false);
    expect(effects.isJumpDisabled).toBe(false);
    expect(effects.isHealthDraining).toBe(false);
  });

  it('applies no modifiers in the neutral content band', () => {
    const effects = resolvingWorldPlazaHungerMovementEffects(0.5);

    expect(effects).toEqual({
      speedMultiplier: 1,
      staminaDrainMultiplier: 1,
      staminaRegenMultiplier: 1,
      jumpCostMultiplier: 1,
      isSprintDisabled: false,
      isJumpDisabled: false,
      isHealthDraining: false,
    });
  });

  it('drains stamina faster and raises jump cost while peckish', () => {
    const effects = resolvingWorldPlazaHungerMovementEffects(0.3);

    expect(effects.staminaDrainMultiplier).toBeGreaterThan(1);
    expect(effects.jumpCostMultiplier).toBeGreaterThan(1);
    expect(effects.isSprintDisabled).toBe(false);
  });

  it('disables sprint and slows walking while hungry', () => {
    const effects = resolvingWorldPlazaHungerMovementEffects(0.1);

    expect(effects.isSprintDisabled).toBe(true);
    expect(effects.isJumpDisabled).toBe(false);
    expect(effects.speedMultiplier).toBeLessThan(1);
    expect(effects.jumpCostMultiplier).toBeGreaterThan(1);
  });

  it('disables jumping, slows walking further, and drains health while starving', () => {
    const effects = resolvingWorldPlazaHungerMovementEffects(0.02);

    expect(effects.isJumpDisabled).toBe(true);
    expect(effects.isSprintDisabled).toBe(true);
    expect(effects.isHealthDraining).toBe(true);
    expect(effects.speedMultiplier).toBeLessThan(1);
  });

  it('treats a hunger ratio of exactly zero as starving', () => {
    const effects = resolvingWorldPlazaHungerMovementEffects(0);

    expect(effects.isHealthDraining).toBe(true);
  });
});
