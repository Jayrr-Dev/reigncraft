import type { DefiningWorldPlazaEntityBleedSeverity } from '@/components/world/health/domains/definingWorldPlazaEntityBleedSeverityRegistry';
import {
  mappingWorldPlazaEntityBleedSeverityToDamageKind,
  resolvingWorldPlazaEntityBleedSeverityDescriptor,
} from '@/components/world/health/domains/definingWorldPlazaEntityBleedSeverityRegistry';
import {
  DEFINING_WORLD_PLAZA_ENTITY_BLEED_STACK_ESCALATION_BLEEDING_COUNT,
  DEFINING_WORLD_PLAZA_ENTITY_BLEED_STACK_ESCALATION_HEMORRHAGING_COUNT,
} from '@/components/world/health/domains/definingWorldPlazaEntityBleedStackConstants';
import { DEFINING_WORLD_PLAZA_ENTITY_HEALTH_DOT_TICK_INTERVAL_MS } from '@/components/world/health/domains/definingWorldPlazaEntityHealthConstants';
import type {
  DefiningWorldPlazaEntityHealthBleedEffect,
  DefiningWorldPlazaEntityHealthState,
} from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';

let managingWorldPlazaEntityHealthBleedStackingNextId = 0;

function creatingWorldPlazaEntityHealthBleedUniqueId(): string {
  managingWorldPlazaEntityHealthBleedStackingNextId += 1;
  return `bleed-${managingWorldPlazaEntityHealthBleedStackingNextId}`;
}

function findingWorldPlazaEntityHealthBleedEffectBySeverity(
  state: DefiningWorldPlazaEntityHealthState,
  severity: DefiningWorldPlazaEntityBleedSeverity
): DefiningWorldPlazaEntityHealthBleedEffect | null {
  return (
    state.bleedEffects.find((effect) => effect.severity === severity) ?? null
  );
}

function stackingWorldPlazaEntityHealthBleedOnSeverity({
  state,
  severity,
  bleedDamage,
  nowMs,
  tickIntervalMs,
  durationMsOverride,
}: {
  state: DefiningWorldPlazaEntityHealthState;
  severity: DefiningWorldPlazaEntityBleedSeverity;
  bleedDamage: number;
  nowMs: number;
  tickIntervalMs: number;
  durationMsOverride?: number;
}): DefiningWorldPlazaEntityHealthState {
  const descriptor = resolvingWorldPlazaEntityBleedSeverityDescriptor(severity);
  const damageKind = mappingWorldPlazaEntityBleedSeverityToDamageKind(severity);
  const bleedDurationMs = durationMsOverride ?? descriptor.durationMs;
  const existingEffect = findingWorldPlazaEntityHealthBleedEffectBySeverity(
    state,
    severity
  );

  if (existingEffect) {
    return {
      ...state,
      bleedEffects: state.bleedEffects.map((effect) =>
        effect.id === existingEffect.id
          ? {
              ...effect,
              remainingBleedDamage: effect.remainingBleedDamage + bleedDamage,
              totalBleedDamage: effect.totalBleedDamage + bleedDamage,
              stackCount: effect.stackCount + 1,
              expiresAtMs: nowMs + bleedDurationMs,
              lastTickAtMs: nowMs,
            }
          : effect
      ),
      lastDamageKind: damageKind,
    };
  }

  return {
    ...state,
    bleedEffects: [
      ...state.bleedEffects,
      {
        id: creatingWorldPlazaEntityHealthBleedUniqueId(),
        severity,
        remainingBleedDamage: bleedDamage,
        totalBleedDamage: bleedDamage,
        stackCount: 1,
        startedAtMs: nowMs,
        expiresAtMs: nowMs + bleedDurationMs,
        tickIntervalMs,
        lastTickAtMs: nowMs,
      },
    ],
    lastDamageKind: damageKind,
  };
}

function escalatingWorldPlazaEntityHealthBleedSeverity({
  state,
  fromSeverity,
  toSeverity,
  nowMs,
  tickIntervalMs,
}: {
  state: DefiningWorldPlazaEntityHealthState;
  fromSeverity: DefiningWorldPlazaEntityBleedSeverity;
  toSeverity: DefiningWorldPlazaEntityBleedSeverity;
  nowMs: number;
  tickIntervalMs: number;
}): DefiningWorldPlazaEntityHealthState {
  const fromEffect = findingWorldPlazaEntityHealthBleedEffectBySeverity(
    state,
    fromSeverity
  );

  if (!fromEffect) {
    return state;
  }

  const withoutFromSeverity: DefiningWorldPlazaEntityHealthState = {
    ...state,
    bleedEffects: state.bleedEffects.filter(
      (effect) => effect.severity !== fromSeverity
    ),
  };

  return stackingWorldPlazaEntityHealthBleedOnSeverity({
    state: withoutFromSeverity,
    severity: toSeverity,
    bleedDamage: fromEffect.remainingBleedDamage,
    nowMs,
    tickIntervalMs,
  });
}

function resolvingWorldPlazaEntityHealthBleedEscalations(
  state: DefiningWorldPlazaEntityHealthState,
  nowMs: number,
  tickIntervalMs: number
): DefiningWorldPlazaEntityHealthState {
  let nextState = state;

  while (true) {
    const bleedingEffect = findingWorldPlazaEntityHealthBleedEffectBySeverity(
      nextState,
      'bleeding'
    );

    if (
      bleedingEffect &&
      bleedingEffect.stackCount >=
        DEFINING_WORLD_PLAZA_ENTITY_BLEED_STACK_ESCALATION_BLEEDING_COUNT
    ) {
      nextState = escalatingWorldPlazaEntityHealthBleedSeverity({
        state: nextState,
        fromSeverity: 'bleeding',
        toSeverity: 'hemorrhaging',
        nowMs,
        tickIntervalMs,
      });
      continue;
    }

    const hemorrhagingEffect =
      findingWorldPlazaEntityHealthBleedEffectBySeverity(
        nextState,
        'hemorrhaging'
      );

    if (
      hemorrhagingEffect &&
      hemorrhagingEffect.stackCount >=
        DEFINING_WORLD_PLAZA_ENTITY_BLEED_STACK_ESCALATION_HEMORRHAGING_COUNT
    ) {
      nextState = escalatingWorldPlazaEntityHealthBleedSeverity({
        state: nextState,
        fromSeverity: 'hemorrhaging',
        toSeverity: 'exsanguinating',
        nowMs,
        tickIntervalMs,
      });
      continue;
    }

    return nextState;
  }
}

/**
 * Stacks bleed damage on a severity tier and escalates at stack thresholds.
 */
export function applyingWorldPlazaEntityHealthBleedStack(
  state: DefiningWorldPlazaEntityHealthState,
  severity: DefiningWorldPlazaEntityBleedSeverity,
  totalBleedDamage: number,
  nowMs: number,
  tickIntervalMs: number = DEFINING_WORLD_PLAZA_ENTITY_HEALTH_DOT_TICK_INTERVAL_MS,
  durationMsOverride?: number
): DefiningWorldPlazaEntityHealthState {
  const bleedDamage = Math.max(0, totalBleedDamage);

  if (bleedDamage <= 0) {
    return state;
  }

  const stackedState = stackingWorldPlazaEntityHealthBleedOnSeverity({
    state,
    severity,
    bleedDamage,
    nowMs,
    tickIntervalMs,
    durationMsOverride,
  });

  return resolvingWorldPlazaEntityHealthBleedEscalations(
    stackedState,
    nowMs,
    tickIntervalMs
  );
}
