import { applyingWorldPlazaEntityBuff } from '@/components/world/health/domains/applyingWorldPlazaEntityBuff';
import { checkingWorldPlazaEntityActionLocked } from '@/components/world/health/domains/checkingWorldPlazaEntityActionLocked';
import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { describe, expect, it } from 'vitest';

describe('checkingWorldPlazaEntityActionLocked', () => {
  const nowMs = 1_000_000;

  it('locks sprint when muscle-lock disease buff is active', () => {
    const state = applyingWorldPlazaEntityBuff(
      creatingWorldPlazaEntityHealthInitialState(),
      'disease-muscle-lock-debuff',
      nowMs
    );

    expect(checkingWorldPlazaEntityActionLocked(state, 'sprint', nowMs)).toBe(
      true
    );
    expect(checkingWorldPlazaEntityActionLocked(state, 'jump', nowMs)).toBe(
      true
    );
    expect(checkingWorldPlazaEntityActionLocked(state, 'roll', nowMs)).toBe(
      false
    );
  });

  it('locks roll when joint-lock disease buff is active', () => {
    const state = applyingWorldPlazaEntityBuff(
      creatingWorldPlazaEntityHealthInitialState(),
      'disease-joint-lock-debuff',
      nowMs
    );

    expect(checkingWorldPlazaEntityActionLocked(state, 'roll', nowMs)).toBe(
      true
    );
    expect(checkingWorldPlazaEntityActionLocked(state, 'jump', nowMs)).toBe(
      true
    );
  });
});
