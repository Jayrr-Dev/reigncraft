import { describe, expect, it } from 'vitest';
import { applyingWorldPlazaEntityFrostbiteStack } from '@/components/world/health/domains/applyingWorldPlazaEntityFrostbiteStack';
import {
  checkingWorldPlazaEntityHealthHealIsBlocked,
  creatingWorldPlazaEntityHealthInitialState,
  healingWorldPlazaEntityHealth,
} from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { resolvingWorldPlazaEntityHealthMovementMultipliers } from '@/components/world/health/domains/resolvingWorldPlazaEntityHealthMovementMultipliers';

describe('applyingWorldPlazaEntityFrostbiteStack', () => {
  it('applies linear walk slow and stamina regen slow', () => {
    const nowMs = 1_000;
    const applied = applyingWorldPlazaEntityFrostbiteStack({
      state: creatingWorldPlazaEntityHealthInitialState(),
      stackCount: 200,
      nowMs,
    });
    const multipliers = resolvingWorldPlazaEntityHealthMovementMultipliers(
      applied.state,
      nowMs
    );

    expect(applied.state.frostbite?.activeStageId).toBe('freezing');
    expect(multipliers.speedMultiplier).toBe(1);
    expect(multipliers.walkSpeedMultiplier).toBeCloseTo(0.9);
    expect(multipliers.staminaMaxMultiplier).toBe(1);
    expect(multipliers.staminaRegenMultiplier).toBeCloseTo(0.9);
  });

  it('blocks healing at necrotic', () => {
    const nowMs = 1_000;
    let state = creatingWorldPlazaEntityHealthInitialState();
    state = { ...state, currentHealth: 100 };
    const applied = applyingWorldPlazaEntityFrostbiteStack({
      state,
      stackCount: 1000,
      nowMs,
    });

    expect(checkingWorldPlazaEntityHealthHealIsBlocked(applied.state, nowMs)).toBe(
      true
    );
    const healed = healingWorldPlazaEntityHealth(applied.state, 50, nowMs);
    expect(healed.currentHealth).toBe(100);
  });
});
