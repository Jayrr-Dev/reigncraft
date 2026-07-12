import { DEFINING_WORLD_PLAZA_GLOBAL_ATTACK_SPEED_SCALE } from '@/components/world/domains/definingWorldPlazaGlobalCombatAttackSpeedConstants';
import {
  resolvingWorldPlazaGlobalAttackSpeedScale,
  resolvingWorldPlazaScaledAttackIntervalMs,
  resolvingWorldPlazaScaledAttackSpeed,
} from '@/components/world/domains/resolvingWorldPlazaGlobalAttackSpeedScale';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaGlobalAttackSpeedScale', () => {
  it('exposes the declarative global scale', () => {
    expect(resolvingWorldPlazaGlobalAttackSpeedScale()).toBe(
      DEFINING_WORLD_PLAZA_GLOBAL_ATTACK_SPEED_SCALE
    );
  });

  it('slows attack-speed multipliers by the global scale', () => {
    expect(resolvingWorldPlazaScaledAttackSpeed(1)).toBeCloseTo(
      DEFINING_WORLD_PLAZA_GLOBAL_ATTACK_SPEED_SCALE,
      5
    );
    expect(resolvingWorldPlazaScaledAttackSpeed(2)).toBeCloseTo(
      2 * DEFINING_WORLD_PLAZA_GLOBAL_ATTACK_SPEED_SCALE,
      5
    );
  });

  it('lengthens attack intervals by the inverse of the global scale', () => {
    expect(resolvingWorldPlazaScaledAttackIntervalMs(1000)).toBeCloseTo(
      1000 / DEFINING_WORLD_PLAZA_GLOBAL_ATTACK_SPEED_SCALE,
      5
    );
  });
});
