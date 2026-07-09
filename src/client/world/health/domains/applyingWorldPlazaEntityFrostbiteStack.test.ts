import { describe, expect, it } from 'vitest';
import { applyingWorldPlazaEntityFrostbiteStack } from '@/components/world/health/domains/applyingWorldPlazaEntityFrostbiteStack';
import {
  checkingWorldPlazaEntityHealthHealIsBlocked,
  creatingWorldPlazaEntityHealthInitialState,
  healingWorldPlazaEntityHealth,
} from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { resolvingWorldPlazaEntityHealthMovementMultipliers } from '@/components/world/health/domains/resolvingWorldPlazaEntityHealthMovementMultipliers';

describe('applyingWorldPlazaEntityFrostbiteStack', () => {
  it('applies linear speed and inherits prior stamina penalties', () => {
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

    expect(applied.state.frostbite?.activeStageId).toBe('frostnip');
    expect(multipliers.speedMultiplier).toBeCloseTo(0.85);
    expect(multipliers.staminaMaxMultiplier).toBeCloseTo(0.8);
    expect(multipliers.staminaRegenMultiplier).toBeCloseTo(0.8);
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
