/**
 * Bluff charge: first rush may abort at a stamina threshold and return home
 * when the player runs past the territory line.
 *
 * @module components/world/wildlife/domains/advancingWildlifeBluffCharge
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { checkingWildlifePointIsInsideTerritoryAnchor } from '@/components/world/wildlife/domains/checkingWildlifePointIsInsideTerritoryAnchor';
import { resolvingWildlifeSpeciesTerritoryConfig } from '@/components/world/wildlife/domains/checkingWildlifeTerritoryIntrusion';
import {
  resolvingWildlifeSpeciesBluffChargeConfig,
  resolvingWildlifeSpeciesChargeConfig,
} from '@/components/world/wildlife/domains/definingWildlifeSpeciesChargeRegistry';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type {
  DefiningWildlifeBehaviorIntent,
  DefiningWildlifeInstance,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';

export type AdvancingWildlifeBluffChargeInput = {
  instance: DefiningWildlifeInstance;
  species: DefiningWildlifeSpeciesDefinition;
  playerPosition: DefiningWorldPlazaWorldPoint | null;
  playerUserId: string | null;
  nowMs: number;
};

export type AdvancingWildlifeBluffChargeResult = {
  instance: DefiningWildlifeInstance;
  /** True when this tick aborted the charge into a home return. */
  didAbortBluff: boolean;
};

/** Walk-home completion radius after a bluff abort. */
export const DEFINING_WILDLIFE_BLUFF_RETURN_ARRIVAL_GRID = 0.75;

function checkingWildlifeIntentTargetsPlayerChase(
  intent: DefiningWildlifeBehaviorIntent,
  playerUserId: string | null
): boolean {
  if (!playerUserId) {
    return false;
  }

  return (
    (intent.mode === 'chase' || intent.mode === 'attack') &&
    intent.targetInstanceId === playerUserId
  );
}

function clearingWildlifeBluffChargeTracking(
  instance: DefiningWildlifeInstance,
  hasUsedBluffCharge: boolean
): DefiningWildlifeInstance {
  return {
    ...instance,
    aiState: {
      ...instance.aiState,
      hasUsedBluffCharge,
      bluffChargePlayerExitedTerritory: false,
      bluffReturnPoint: null,
    },
  };
}

/**
 * Marks the bluff return point when a bluff-capable charge wind-up starts.
 * Call after charge windup resolves on the think tick.
 */
export function seedingWildlifeBluffChargeReturnPoint(
  instance: DefiningWildlifeInstance,
  speciesId: DefiningWildlifeInstance['speciesId'],
  chargeWindupStartedAtMs: number | null
): DefiningWildlifeInstance {
  const bluff = resolvingWildlifeSpeciesBluffChargeConfig(speciesId);

  if (!bluff || instance.aiState.hasUsedBluffCharge) {
    return instance;
  }

  if (chargeWindupStartedAtMs === null) {
    return instance;
  }

  if (instance.aiState.bluffReturnPoint !== null) {
    return instance;
  }

  return {
    ...instance,
    aiState: {
      ...instance.aiState,
      bluffReturnPoint: {
        x: instance.position.x,
        y: instance.position.y,
        layer: instance.position.layer,
      },
      bluffChargePlayerExitedTerritory: false,
    },
  };
}

/**
 * Tracks whether the player left the home territory during a bluff-eligible
 * charge, aborts into a return-to-origin at the stamina threshold, or consumes
 * the one-shot bluff when the rush finishes without aborting.
 */
export function advancingWildlifeBluffCharge(
  input: AdvancingWildlifeBluffChargeInput
): AdvancingWildlifeBluffChargeResult {
  const { instance, species, playerPosition, playerUserId } = input;
  const bluff = resolvingWildlifeSpeciesBluffChargeConfig(species.speciesId);
  const chargeConfig = resolvingWildlifeSpeciesChargeConfig(species.speciesId);

  if (
    !bluff ||
    instance.aiState.hasUsedBluffCharge ||
    instance.aiState.bluffReturnPoint === null
  ) {
    return { instance, didAbortBluff: false };
  }

  const windupActive = instance.aiState.chargeWindupStartedAtMs !== null;
  const targetsPlayer = checkingWildlifeIntentTargetsPlayerChase(
    instance.aiState.intent,
    playerUserId
  );

  // Still winding up: keep the return point, do not abort yet.
  if (windupActive && instance.aiState.intent.mode === 'idle') {
    return { instance, didAbortBluff: false };
  }

  // Engagement dropped before a real sprint: drop tracking without consuming.
  if (!targetsPlayer && !windupActive) {
    return {
      instance: clearingWildlifeBluffChargeTracking(instance, false),
      didAbortBluff: false,
    };
  }

  if (!targetsPlayer) {
    return { instance, didAbortBluff: false };
  }

  const territory = resolvingWildlifeSpeciesTerritoryConfig(
    species,
    instance.aggressionLevel
  );

  let playerExitedTerritory =
    instance.aiState.bluffChargePlayerExitedTerritory;

  if (
    bluff.requiresPlayerExitedTerritory &&
    !playerExitedTerritory &&
    playerPosition &&
    territory
  ) {
    const playerStillInside = checkingWildlifePointIsInsideTerritoryAnchor(
      playerPosition,
      instance.spawnAnchor,
      territory
    );

    if (!playerStillInside) {
      playerExitedTerritory = true;
    }
  }

  const staminaRatio = instance.staminaState.staminaRatio;
  const mayAbort =
    staminaRatio <= bluff.staminaAbortThreshold &&
    (!bluff.requiresPlayerExitedTerritory || playerExitedTerritory);

  if (mayAbort) {
    const returnPoint = instance.aiState.bluffReturnPoint;

    return {
      didAbortBluff: true,
      instance: {
        ...instance,
        aggroState: {
          threats: [],
          activeTargetId: null,
          lastDamagedAtMs: instance.aggroState.lastDamagedAtMs,
          lastAggroedAtMs: instance.aggroState.lastAggroedAtMs ?? null,
          stalkingPreySinceMs: null,
          stalkConfidentSinceMs: null,
          stalkAttackingPreySinceMs: null,
          stalkPhase: 'idle',
          stalkPhaseEnteredAtMs: null,
          pendingStalkEvents: [],
          stalkPlayerApproachState: null,
          stalkPlayerApproachReactedAtMs: null,
          stalkLockedPreyTargetId: null,
        },
        aiState: {
          ...instance.aiState,
          intent: {
            mode: 'return',
            targetPoint: returnPoint,
          },
          chargeWindupStartedAtMs: null,
          hasUsedBluffCharge: true,
          bluffChargePlayerExitedTerritory: false,
          // Keep return point until arrival so the tree can finish the walk home.
          bluffReturnPoint: returnPoint,
          steeringCache: null,
        },
      },
    };
  }

  // Past the normal charge exit without a bluff: consume the one-shot.
  const chargeExit =
    chargeConfig?.chargeStaminaExitThreshold ?? bluff.staminaAbortThreshold;

  if (staminaRatio <= chargeExit) {
    return {
      instance: clearingWildlifeBluffChargeTracking(instance, true),
      didAbortBluff: false,
    };
  }

  if (playerExitedTerritory === instance.aiState.bluffChargePlayerExitedTerritory) {
    return { instance, didAbortBluff: false };
  }

  return {
    instance: {
      ...instance,
      aiState: {
        ...instance.aiState,
        bluffChargePlayerExitedTerritory: playerExitedTerritory,
      },
    },
    didAbortBluff: false,
  };
}

/** True while walking home to the bluff origin after an abort. */
export function checkingWildlifeShouldCompleteBluffReturn(
  instance: DefiningWildlifeInstance
): boolean {
  if (!instance.aiState.hasUsedBluffCharge) {
    return false;
  }

  const targetPoint =
    instance.aiState.bluffReturnPoint ??
    (instance.aiState.intent.mode === 'return'
      ? (instance.aiState.intent.targetPoint ?? null)
      : null);

  if (!targetPoint) {
    return false;
  }

  const distance = Math.hypot(
    instance.position.x - targetPoint.x,
    instance.position.y - targetPoint.y
  );

  return distance > DEFINING_WILDLIFE_BLUFF_RETURN_ARRIVAL_GRID;
}

/** Clears leftover bluff return tracking once the animal arrives home. */
export function clearingWildlifeBluffReturnOnArrival(
  instance: DefiningWildlifeInstance
): DefiningWildlifeInstance {
  if (
    instance.aiState.bluffReturnPoint === null ||
    !instance.aiState.hasUsedBluffCharge
  ) {
    return instance;
  }

  if (checkingWildlifeShouldCompleteBluffReturn(instance)) {
    return instance;
  }

  return {
    ...instance,
    aiState: {
      ...instance.aiState,
      bluffReturnPoint: null,
      bluffChargePlayerExitedTerritory: false,
      intent:
        instance.aiState.intent.mode === 'return'
          ? { mode: 'idle' }
          : instance.aiState.intent,
    },
  };
}
