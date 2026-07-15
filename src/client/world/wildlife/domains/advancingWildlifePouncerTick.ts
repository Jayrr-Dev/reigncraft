/**
 * Sunhead pouncer phase machine and jump-scare cast lock.
 *
 * @module components/world/wildlife/domains/advancingWildlifePouncerTick
 */

import { checkingWildlifePouncerSpecies } from '@/components/world/wildlife/domains/checkingWildlifePouncerSpecies';
import {
  resolvingWildlifeSpeciesPouncerConfig,
  type DefiningWildlifePouncerPhase,
} from '@/components/world/wildlife/domains/definingWildlifeSpeciesPouncerRegistry';
import type {
  DefiningWildlifeBehaviorIntent,
  DefiningWildlifeInstance,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';
import {
  checkingWildlifePouncerRetreatComplete,
  resolvingWildlifePouncerRetreatIntent,
} from '@/components/world/wildlife/domains/resolvingWildlifePouncerRetreatIntent';
import { encodingWorldPlazaEntityHealthDamageRollForcedTierValue } from '@/components/world/health/domains/resolvingWorldPlazaEntityHealthDamageRollForcedTier';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';

/** True while jump-scare taunt cast is playing. */
export function checkingWildlifeInstanceIsJumpScareCasting(
  instance: DefiningWildlifeInstance,
  nowMs: number
): boolean {
  const untilMs = instance.aiState.jumpScareUntilMs ?? null;

  return untilMs !== null && untilMs > nowMs;
}

/** True when the next melee should force fatal EV tier. */
export function checkingWildlifeJumpScareFatalMeleeArmed(
  instance: DefiningWildlifeInstance,
  nowMs: number
): boolean {
  const untilMs = instance.aiState.jumpScareFatalUntilMs ?? null;

  return untilMs !== null && untilMs > nowMs;
}

/** Forced fatal-tier options for a jump-scare melee hit. */
export function resolvingWildlifeJumpScareFatalDamageOptions(): {
  forcedDeviationScore: number;
} {
  return {
    forcedDeviationScore:
      encodingWorldPlazaEntityHealthDamageRollForcedTierValue('fatal'),
  };
}

/** Clears the fatal melee arm after it is spent. */
export function clearingWildlifeJumpScareFatalArm(
  instance: DefiningWildlifeInstance
): DefiningWildlifeInstance {
  if (instance.aiState.jumpScareFatalUntilMs === null) {
    return instance;
  }

  return {
    ...instance,
    aiState: {
      ...instance.aiState,
      jumpScareFatalUntilMs: null,
      jumpScareArmed: false,
    },
  };
}

/** Keeps the taunt clip visible during jump-scare cast. */
export function applyingWildlifeJumpScareCastPresentation(
  instance: DefiningWildlifeInstance,
  nowMs: number
): DefiningWildlifeInstance {
  if (!checkingWildlifePouncerSpecies(instance.speciesId)) {
    return instance;
  }

  if (checkingWildlifeInstanceIsJumpScareCasting(instance, nowMs)) {
    return {
      ...instance,
      aiState: {
        ...instance.aiState,
        motionClip: 'taunt',
        isMoving: false,
        pouncerPhase: 'cast',
      },
    };
  }

  if (instance.aiState.jumpScareUntilMs != null) {
    return {
      ...instance,
      aiState: {
        ...instance.aiState,
        jumpScareUntilMs: null,
      },
    };
  }

  return instance;
}

export type AdvancingWildlifePouncerThinkParams = {
  instance: DefiningWildlifeInstance;
  intent: DefiningWildlifeBehaviorIntent;
  playerPosition: DefiningWorldPlazaWorldPoint | null;
  playerUserId: string | null;
  nowMs: number;
};

export type AdvancingWildlifePouncerThinkResult = {
  instance: DefiningWildlifeInstance;
  intent: DefiningWildlifeBehaviorIntent;
};

function resolvingWildlifePouncerPreyTargetId(
  intent: DefiningWildlifeBehaviorIntent,
  playerUserId: string | null
): string | null {
  if (
    intent.mode === 'chase' ||
    intent.mode === 'attack' ||
    intent.mode === 'stalk'
  ) {
    return intent.targetInstanceId ?? playerUserId;
  }

  return null;
}

function checkingWildlifePouncerCombatIntent(
  intent: DefiningWildlifeBehaviorIntent
): boolean {
  return (
    intent.mode === 'chase' ||
    intent.mode === 'attack' ||
    intent.mode === 'stalk'
  );
}

/**
 * Advances pouncer phases on think ticks and may override the resolved intent
 * into a backwards retreat or hold for jump-scare cast.
 */
export function advancingWildlifePouncerThink({
  instance,
  intent,
  playerPosition,
  playerUserId,
  nowMs,
}: AdvancingWildlifePouncerThinkParams): AdvancingWildlifePouncerThinkResult {
  const config = resolvingWildlifeSpeciesPouncerConfig(instance.speciesId);

  if (!config || !playerPosition || !playerUserId) {
    return { instance, intent };
  }

  if (!checkingWildlifePouncerCombatIntent(intent)) {
    if ((instance.aiState.pouncerPhase ?? 'idle') === 'idle') {
      return { instance, intent };
    }

    return {
      instance: {
        ...instance,
        aiState: {
          ...instance.aiState,
          pouncerPhase: 'idle',
          pouncerRetreatFromX: null,
          pouncerRetreatFromY: null,
          jumpScareArmed: false,
        },
      },
      intent,
    };
  }

  const preyTargetId = resolvingWildlifePouncerPreyTargetId(
    intent,
    playerUserId
  );

  if (preyTargetId !== playerUserId) {
    return { instance, intent };
  }

  const distanceToPlayer = Math.hypot(
    instance.position.x - playerPosition.x,
    instance.position.y - playerPosition.y
  );
  let phase: DefiningWildlifePouncerPhase =
    instance.aiState.pouncerPhase ?? 'idle';
  let nextInstance = instance;

  if (checkingWildlifeInstanceIsJumpScareCasting(nextInstance, nowMs)) {
    return {
      instance: {
        ...nextInstance,
        aiState: {
          ...nextInstance.aiState,
          pouncerPhase: 'cast',
        },
      },
      intent: { mode: 'idle' },
    };
  }

  // Cast done when untilMs is null or already expired (presentation may clear
  // the stamp one frame later; do not stay stuck in cast forever).
  const jumpScareUntilMs = nextInstance.aiState.jumpScareUntilMs ?? null;
  const jumpScareCastActive =
    jumpScareUntilMs !== null && jumpScareUntilMs > nowMs;

  if (phase === 'cast' && !jumpScareCastActive) {
    phase = 'pounce';
    nextInstance = {
      ...nextInstance,
      aiState: {
        ...nextInstance.aiState,
        pouncerPhase: 'pounce',
        jumpScareArmed: true,
        jumpScareUntilMs: null,
        pouncerRetreatFromX: null,
        pouncerRetreatFromY: null,
      },
    };
  }

  if (phase === 'retreat') {
    const retreatFromX = nextInstance.aiState.pouncerRetreatFromX ?? null;
    const retreatFromY = nextInstance.aiState.pouncerRetreatFromY ?? null;

    if (retreatFromX === null || retreatFromY === null) {
      phase = 'idle';
    } else if (
      checkingWildlifePouncerRetreatComplete({
        position: nextInstance.position,
        retreatFromX,
        retreatFromY,
        retreatDistanceGrid: config.retreatDistanceGrid,
      })
    ) {
      const lastJumpScareAtMs = nextInstance.aiState.lastJumpScareAtMs ?? null;
      const jumpScareReady =
        lastJumpScareAtMs === null ||
        nowMs - lastJumpScareAtMs >= config.jumpScareCooldownMs;

      if (jumpScareReady) {
        nextInstance = {
          ...nextInstance,
          aiState: {
            ...nextInstance.aiState,
            pouncerPhase: 'cast',
            jumpScareUntilMs: nowMs + config.jumpScareCastDurationMs,
            lastJumpScareAtMs: nowMs,
            jumpScareArmed: true,
            pouncerRetreatFromX: null,
            pouncerRetreatFromY: null,
          },
        };

        return {
          instance: nextInstance,
          intent: { mode: 'idle' },
        };
      }

      phase = 'pounce';
      nextInstance = {
        ...nextInstance,
        aiState: {
          ...nextInstance.aiState,
          pouncerPhase: 'pounce',
          jumpScareArmed: false,
          pouncerRetreatFromX: null,
          pouncerRetreatFromY: null,
        },
      };
    } else {
      return {
        instance: {
          ...nextInstance,
          aiState: {
            ...nextInstance.aiState,
            pouncerPhase: 'retreat',
          },
        },
        intent: resolvingWildlifePouncerRetreatIntent({
          position: nextInstance.position,
          preyTargetId: playerUserId,
          preyPosition: playerPosition,
          retreatFromX,
          retreatFromY,
          retreatDistanceGrid: config.retreatDistanceGrid,
        }),
      };
    }
  }

  if (phase === 'pounce') {
    if (intent.mode === 'attack' || distanceToPlayer <= 1.6) {
      return {
        instance: {
          ...nextInstance,
          aiState: {
            ...nextInstance.aiState,
            pouncerPhase: 'idle',
          },
        },
        intent,
      };
    }

    return {
      instance: nextInstance,
      intent:
        intent.mode === 'chase'
          ? intent
          : {
              mode: 'chase',
              targetInstanceId: playerUserId,
              targetPoint: playerPosition,
            },
    };
  }

  const canStartRetreat =
    phase === 'idle' &&
    distanceToPlayer >= config.retreatTriggerMinDistanceGrid &&
    distanceToPlayer <= config.retreatTriggerMaxDistanceGrid &&
    (intent.mode === 'chase' || intent.mode === 'attack');

  if (canStartRetreat) {
    return {
      instance: {
        ...nextInstance,
        aiState: {
          ...nextInstance.aiState,
          pouncerPhase: 'retreat',
          pouncerRetreatFromX: nextInstance.position.x,
          pouncerRetreatFromY: nextInstance.position.y,
        },
      },
      intent: resolvingWildlifePouncerRetreatIntent({
        position: nextInstance.position,
        preyTargetId: playerUserId,
        preyPosition: playerPosition,
        retreatFromX: nextInstance.position.x,
        retreatFromY: nextInstance.position.y,
        retreatDistanceGrid: config.retreatDistanceGrid,
      }),
    };
  }

  return { instance: nextInstance, intent };
}

/**
 * After a jump-scare-armed pounce lands, opens the fatal melee window.
 */
export function armingWildlifeJumpScareFatalOnPounceLanding(
  instance: DefiningWildlifeInstance,
  nowMs: number
): DefiningWildlifeInstance {
  const config = resolvingWildlifeSpeciesPouncerConfig(instance.speciesId);

  if (!config || !instance.aiState.jumpScareArmed) {
    return instance;
  }

  return {
    ...instance,
    aiState: {
      ...instance.aiState,
      jumpScareFatalUntilMs: nowMs + config.jumpScareMeleeWindowMs,
      jumpScareArmed: false,
      pouncerPhase: 'idle',
    },
  };
}

/** Jump distance multiplier while jump scare is armed for the upcoming pounce. */
export function resolvingWildlifePouncerJumpRangeMultiplier(
  instance: DefiningWildlifeInstance
): number {
  const config = resolvingWildlifeSpeciesPouncerConfig(instance.speciesId);

  if (!config || !instance.aiState.jumpScareArmed) {
    return 1;
  }

  return config.jumpScareRangeMultiplier;
}
