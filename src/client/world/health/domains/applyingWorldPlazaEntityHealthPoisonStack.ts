import { DEFINING_WORLD_PLAZA_ENTITY_HEALTH_DOT_TICK_INTERVAL_MS } from '@/components/world/health/domains/definingWorldPlazaEntityHealthConstants';
import type {
  DefiningWorldPlazaEntityHealthPoisonEffect,
  DefiningWorldPlazaEntityHealthState,
} from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import type { DefiningWorldPlazaEntityPoisonPotency } from '@/components/world/health/domains/definingWorldPlazaEntityPoisonPotencyRegistry';
import {
  mappingWorldPlazaEntityPoisonPotencyToDamageKind,
  resolvingWorldPlazaEntityPoisonPotencyDescriptor,
} from '@/components/world/health/domains/definingWorldPlazaEntityPoisonPotencyRegistry';
import { DEFINING_WORLD_PLAZA_ENTITY_POISON_MIN_DAMAGE_AMOUNT } from '@/components/world/health/domains/definingWorldPlazaEntityPoisonRampConstants';

let managingWorldPlazaEntityHealthPoisonStackingNextId = 0;

function creatingWorldPlazaEntityHealthPoisonUniqueId(): string {
  managingWorldPlazaEntityHealthPoisonStackingNextId += 1;
  return `poison-${managingWorldPlazaEntityHealthPoisonStackingNextId}`;
}

function findingWorldPlazaEntityHealthPoisonEffectByPotency(
  state: DefiningWorldPlazaEntityHealthState,
  potency: DefiningWorldPlazaEntityPoisonPotency
): DefiningWorldPlazaEntityHealthPoisonEffect | null {
  return (
    state.poisonEffects.find((effect) => effect.potency === potency) ?? null
  );
}

/**
 * Adds poison pool damage on a potency tier. Repeat hits stack additively.
 */
export function applyingWorldPlazaEntityHealthPoisonStack(
  state: DefiningWorldPlazaEntityHealthState,
  potency: DefiningWorldPlazaEntityPoisonPotency,
  totalPoisonDamage: number,
  nowMs: number,
  tickIntervalMs: number = DEFINING_WORLD_PLAZA_ENTITY_HEALTH_DOT_TICK_INTERVAL_MS
): DefiningWorldPlazaEntityHealthState {
  if (totalPoisonDamage <= 0) {
    return state;
  }

  const poisonDamage = Math.max(
    DEFINING_WORLD_PLAZA_ENTITY_POISON_MIN_DAMAGE_AMOUNT,
    totalPoisonDamage
  );

  const descriptor = resolvingWorldPlazaEntityPoisonPotencyDescriptor(potency);
  const damageKind = mappingWorldPlazaEntityPoisonPotencyToDamageKind(potency);
  const existingEffect = findingWorldPlazaEntityHealthPoisonEffectByPotency(
    state,
    potency
  );

  if (existingEffect) {
    return {
      ...state,
      poisonEffects: state.poisonEffects.map((effect) =>
        effect.id === existingEffect.id
          ? {
              ...effect,
              remainingPoisonDamage:
                effect.remainingPoisonDamage + poisonDamage,
              totalPoisonDamage: effect.totalPoisonDamage + poisonDamage,
              stackCount: effect.stackCount + 1,
              expiresAtMs: nowMs + descriptor.durationMs,
              lastTickAtMs: nowMs,
            }
          : effect
      ),
      lastDamageKind: damageKind,
    };
  }

  return {
    ...state,
    poisonEffects: [
      ...state.poisonEffects,
      {
        id: creatingWorldPlazaEntityHealthPoisonUniqueId(),
        potency,
        remainingPoisonDamage: poisonDamage,
        totalPoisonDamage: poisonDamage,
        stackCount: 1,
        startedAtMs: nowMs,
        expiresAtMs: nowMs + descriptor.durationMs,
        tickIntervalMs,
        lastTickAtMs: nowMs,
      },
    ],
    lastDamageKind: damageKind,
  };
}
