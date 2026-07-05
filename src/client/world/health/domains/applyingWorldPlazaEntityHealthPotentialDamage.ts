import type { DefiningWorldPlazaEntityHealthState } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';

let managingWorldPlazaEntityHealthPotentialDamageNextId = 0;

function creatingWorldPlazaEntityHealthPotentialDamageUniqueId(): string {
  managingWorldPlazaEntityHealthPotentialDamageNextId += 1;
  return `potential-${managingWorldPlazaEntityHealthPotentialDamageNextId}`;
}

export type ApplyingWorldPlazaEntityHealthPotentialDamageParams = {
  state: DefiningWorldPlazaEntityHealthState;
  pendingExpectedDamage: number;
  resolveDelayMs: number;
  nowMs: number;
};

/**
 * Schedules pending damage that resolves after a delay.
 * Use for any timed hit source (curses, debuffs, traps, etc.).
 */
export function applyingWorldPlazaEntityHealthPotentialDamage({
  state,
  pendingExpectedDamage,
  resolveDelayMs,
  nowMs,
}: ApplyingWorldPlazaEntityHealthPotentialDamageParams): DefiningWorldPlazaEntityHealthState {
  const expectedDamage = Math.max(0, pendingExpectedDamage);
  const delayMs = Math.max(0, resolveDelayMs);

  if (expectedDamage <= 0 || delayMs <= 0) {
    return state;
  }

  return {
    ...state,
    potentialDamageEffects: [
      ...state.potentialDamageEffects,
      {
        id: creatingWorldPlazaEntityHealthPotentialDamageUniqueId(),
        pendingExpectedDamage: expectedDamage,
        appliedAtMs: nowMs,
        resolvesAtMs: nowMs + delayMs,
      },
    ],
    lastDamageKind: 'potential_damage',
  };
}
