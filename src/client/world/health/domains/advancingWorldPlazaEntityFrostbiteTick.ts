/**
 * Advances frostbite warm decay and hypothermia sleep spells.
 *
 * @module components/world/health/domains/advancingWorldPlazaEntityFrostbiteTick
 */

import { applyingWorldPlazaEntityFrostbiteStack } from '@/components/world/health/domains/applyingWorldPlazaEntityFrostbiteStack';
import { computingWorldPlazaFrostbiteStacksLostFromWarmSurplus } from '@/components/world/health/domains/computingWorldPlazaFrostbiteStacksLostFromWarmSurplus';
import { DEFINING_WORLD_PLAZA_ENTITY_HEALTH_ENVIRONMENTAL_TEMPERATURE_TICK_INTERVAL_MS } from '@/components/world/health/domains/definingWorldPlazaEntityHealthFloatTextConstants';
import {
  DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_EFFECT_ID_PREFIX,
  DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_SLEEP_SPELL_DURATION_MAX_MS,
  DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_SLEEP_SPELL_DURATION_MIN_MS,
  DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_SLEEP_SPELL_STACK_INTERVAL,
  DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_SLEEP_SPELL_WAKE_BONUS_DAMAGE,
} from '@/components/world/health/domains/definingWorldPlazaEntityFrostbiteConstants';
import { resolvingWorldPlazaEntityFrostbiteStageDescriptor } from '@/components/world/health/domains/definingWorldPlazaEntityFrostbiteStageRegistry';
import type {
  DefiningWorldPlazaEntityHealthDamageRollModifier,
  DefiningWorldPlazaEntityHealthState,
} from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import { resolvingWorldPlazaEntityFrostbiteStage } from '@/components/world/health/domains/resolvingWorldPlazaEntityFrostbiteStage';
import { addingWorldPlazaEntityHealthSleepEffect } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { resolvingWorldPlazaEntityTemperatureComfortBand } from '@/components/world/health/domains/resolvingWorldPlazaEntityTemperatureComfortBand';

const FROSTBITE_SLEEP_SPELL_EFFECT_ID = `${DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_EFFECT_ID_PREFIX}sleep-spell`;
const FROSTBITE_HYPOTHERMIA_SLEEP_START_STACKS =
  resolvingWorldPlazaEntityFrostbiteStageDescriptor('hypothermia').minStacks;

function resolvingWorldPlazaEntityFrostbiteNextSleepSpellThreshold(
  stackCount: number,
  lastSleepSpellAtStacks: number | null
): number | null {
  const stage = resolvingWorldPlazaEntityFrostbiteStage(stackCount);

  if (stage === null || !stage.appliesSleepSpells) {
    return null;
  }

  let threshold = FROSTBITE_HYPOTHERMIA_SLEEP_START_STACKS;

  while (threshold <= stackCount) {
    if (lastSleepSpellAtStacks === null || threshold > lastSleepSpellAtStacks) {
      return threshold;
    }

    threshold += DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_SLEEP_SPELL_STACK_INTERVAL;
  }

  return null;
}

function rollingWorldPlazaEntityFrostbiteSleepSpellDurationMs(
  random: () => number
): number {
  const span =
    DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_SLEEP_SPELL_DURATION_MAX_MS -
    DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_SLEEP_SPELL_DURATION_MIN_MS;

  return Math.round(
    DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_SLEEP_SPELL_DURATION_MIN_MS +
      random() * span
  );
}

export type AdvancingWorldPlazaEntityFrostbiteTickResult = {
  state: DefiningWorldPlazaEntityHealthState;
  attackerDamageRollModifiers: DefiningWorldPlazaEntityHealthDamageRollModifier[];
};

/**
 * Decays stacks when warm; fires hypothermia sleep spells on stack thresholds.
 */
export function advancingWorldPlazaEntityFrostbiteTick({
  state,
  nowMs,
  deltaMs,
  localTemperatureCelsius,
  attackerDamageRollModifiers = [],
  random = Math.random,
}: {
  state: DefiningWorldPlazaEntityHealthState;
  nowMs: number;
  deltaMs: number;
  localTemperatureCelsius: number | null;
  attackerDamageRollModifiers?: readonly DefiningWorldPlazaEntityHealthDamageRollModifier[];
  random?: () => number;
}): AdvancingWorldPlazaEntityFrostbiteTickResult {
  let nextState = state;
  let nextAttackerModifiers = [...attackerDamageRollModifiers];
  const frostbite = nextState.frostbite;

  if (frostbite !== null && frostbite.stackCount > 0 && deltaMs > 0) {
    const comfortBand = resolvingWorldPlazaEntityTemperatureComfortBand(
      nextState.temperatureResistance
    );
    const warmthAboveComfort =
      localTemperatureCelsius === null
        ? 0
        : localTemperatureCelsius - comfortBand.comfortLowCelsius;

    if (warmthAboveComfort > 0 && localTemperatureCelsius !== null) {
      const tickIntervalMs =
        DEFINING_WORLD_PLAZA_ENTITY_HEALTH_ENVIRONMENTAL_TEMPERATURE_TICK_INTERVAL_MS;
      const lastDecayAtMs = frostbite.lastDecayAtMs ?? nowMs;
      const elapsedMs = nowMs - lastDecayAtMs;

      if (elapsedMs >= tickIntervalMs) {
        const warmTicks = Math.floor(elapsedMs / tickIntervalMs);
        const stacksPerTick = computingWorldPlazaFrostbiteStacksLostFromWarmSurplus(
          {
            warmthAboveComfortCelsius: warmthAboveComfort,
            stackCount: frostbite.stackCount,
          }
        );
        const stacksLost = stacksPerTick * warmTicks;

        if (stacksLost > 0) {
          const applied = applyingWorldPlazaEntityFrostbiteStack({
            state: nextState,
            stackCount: frostbite.stackCount - stacksLost,
            nowMs,
            attackerDamageRollModifiers: nextAttackerModifiers,
          });
          nextState = {
            ...applied.state,
            frostbite:
              applied.state.frostbite === null
                ? null
                : {
                    ...applied.state.frostbite,
                    lastDecayAtMs: lastDecayAtMs + warmTicks * tickIntervalMs,
                  },
          };
          nextAttackerModifiers = applied.attackerDamageRollModifiers;
        } else if (nextState.frostbite !== null) {
          nextState = {
            ...nextState,
            frostbite: {
              ...nextState.frostbite,
              lastDecayAtMs: lastDecayAtMs + warmTicks * tickIntervalMs,
            },
          };
        }
      }
    } else if (frostbite.lastDecayAtMs !== null) {
      nextState = {
        ...nextState,
        frostbite: {
          ...frostbite,
          lastDecayAtMs: null,
        },
      };
    }
  }

  const liveFrostbite = nextState.frostbite;

  if (liveFrostbite !== null) {
    const sleepThreshold = resolvingWorldPlazaEntityFrostbiteNextSleepSpellThreshold(
      liveFrostbite.stackCount,
      liveFrostbite.lastSleepSpellAtStacks
    );

    if (sleepThreshold !== null) {
      const durationMs = rollingWorldPlazaEntityFrostbiteSleepSpellDurationMs(
        random
      );
      nextState = addingWorldPlazaEntityHealthSleepEffect(nextState, {
        id: FROSTBITE_SLEEP_SPELL_EFFECT_ID,
        appliedAtMs: nowMs,
        expiresAtMs: nowMs + durationMs,
        wakeBonusDamage:
          DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_SLEEP_SPELL_WAKE_BONUS_DAMAGE,
      });
      nextState = {
        ...nextState,
        frostbite: {
          ...liveFrostbite,
          lastSleepSpellAtStacks: sleepThreshold,
        },
      };
    }
  }

  return {
    state: nextState,
    attackerDamageRollModifiers: nextAttackerModifiers,
  };
}
