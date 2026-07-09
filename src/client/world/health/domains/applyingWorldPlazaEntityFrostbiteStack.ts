/**
 * Sets frostbite stacks and syncs the matching stage effects.
 *
 * @module components/world/health/domains/applyingWorldPlazaEntityFrostbiteStack
 */

import { syncingWorldPlazaEntityFrostbiteStageEffects } from '@/components/world/health/domains/applyingWorldPlazaEntityFrostbiteStageEffects';
import { DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_MAX_STACKS } from '@/components/world/health/domains/definingWorldPlazaEntityFrostbiteConstants';
import type {
  DefiningWorldPlazaEntityHealthDamageRollModifier,
  DefiningWorldPlazaEntityHealthState,
} from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import { resolvingWorldPlazaEntityFrostbiteStage } from '@/components/world/health/domains/resolvingWorldPlazaEntityFrostbiteStage';

export type ApplyingWorldPlazaEntityFrostbiteStackResult = {
  state: DefiningWorldPlazaEntityHealthState;
  attackerDamageRollModifiers: DefiningWorldPlazaEntityHealthDamageRollModifier[];
};

function clampingWorldPlazaEntityFrostbiteStacks(stackCount: number): number {
  if (stackCount <= 0) {
    return 0;
  }

  return Math.min(
    DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_MAX_STACKS,
    stackCount
  );
}

/**
 * Absolute set of frostbite stacks (dev tools, decay, gain).
 */
export function applyingWorldPlazaEntityFrostbiteStack({
  state,
  stackCount,
  nowMs,
  attackerDamageRollModifiers = [],
  preserveSleepSpellProgress = true,
}: {
  state: DefiningWorldPlazaEntityHealthState;
  stackCount: number;
  nowMs: number;
  attackerDamageRollModifiers?: readonly DefiningWorldPlazaEntityHealthDamageRollModifier[];
  preserveSleepSpellProgress?: boolean;
}): ApplyingWorldPlazaEntityFrostbiteStackResult {
  const clampedStacks = clampingWorldPlazaEntityFrostbiteStacks(stackCount);
  const stage = resolvingWorldPlazaEntityFrostbiteStage(clampedStacks);
  const previous = state.frostbite;

  const frostbiteState =
    clampedStacks <= 0
      ? null
      : {
          stackCount: clampedStacks,
          activeStageId: stage?.id ?? null,
          lastGainAtMs: previous?.lastGainAtMs ?? null,
          lastDecayAtMs: previous?.lastDecayAtMs ?? null,
          lastSleepSpellAtStacks: preserveSleepSpellProgress
            ? (previous?.lastSleepSpellAtStacks ?? null)
            : null,
        };

  const synced = syncingWorldPlazaEntityFrostbiteStageEffects({
    state: {
      ...state,
      frostbite: frostbiteState,
    },
    stage,
    nowMs,
    attackerDamageRollModifiers,
  });

  return synced;
}

/**
 * Adds stacks from one environmental cold tick (after severity scaling).
 */
export function gainingWorldPlazaEntityFrostbiteStacksFromColdTick({
  state,
  stacksToAdd,
  nowMs,
  attackerDamageRollModifiers = [],
}: {
  state: DefiningWorldPlazaEntityHealthState;
  stacksToAdd: number;
  nowMs: number;
  attackerDamageRollModifiers?: readonly DefiningWorldPlazaEntityHealthDamageRollModifier[];
}): ApplyingWorldPlazaEntityFrostbiteStackResult {
  const currentStacks = state.frostbite?.stackCount ?? 0;
  const result = applyingWorldPlazaEntityFrostbiteStack({
    state,
    stackCount: currentStacks + stacksToAdd,
    nowMs,
    attackerDamageRollModifiers,
  });

  if (result.state.frostbite === null) {
    return result;
  }

  return {
    ...result,
    state: {
      ...result.state,
      frostbite: {
        ...result.state.frostbite,
        lastGainAtMs: nowMs,
      },
    },
  };
}
