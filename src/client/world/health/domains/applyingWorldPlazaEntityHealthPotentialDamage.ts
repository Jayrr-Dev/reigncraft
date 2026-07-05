import type { DefiningWorldPlazaEntityHealthState } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';

let managingWorldPlazaEntityHealthPotentialDamageNextId = 0;

function creatingWorldPlazaEntityHealthPotentialDamageUniqueId(): string {
  managingWorldPlazaEntityHealthPotentialDamageNextId += 1;
  return `potential-${managingWorldPlazaEntityHealthPotentialDamageNextId}`;
}

export type ApplyingWorldPlazaEntityHealthPotentialDamageParams = {
  state: DefiningWorldPlazaEntityHealthState;
  pendingDamage: number;
  fuseDurationMs: number;
  nowMs: number;
};

/**
 * Arms delayed damage that detonates after the fuse duration elapses.
 */
export function applyingWorldPlazaEntityHealthPotentialDamage({
  state,
  pendingDamage,
  fuseDurationMs,
  nowMs,
}: ApplyingWorldPlazaEntityHealthPotentialDamageParams): DefiningWorldPlazaEntityHealthState {
  const damage = Math.max(0, pendingDamage);
  const fuseMs = Math.max(0, fuseDurationMs);

  if (damage <= 0 || fuseMs <= 0) {
    return state;
  }

  return {
    ...state,
    potentialDamageEffects: [
      ...state.potentialDamageEffects,
      {
        id: creatingWorldPlazaEntityHealthPotentialDamageUniqueId(),
        pendingDamage: damage,
        appliedAtMs: nowMs,
        detonatesAtMs: nowMs + fuseMs,
      },
    ],
    lastDamageKind: 'potential_damage',
  };
}
