/**
 * Resolves prey vitals for stalk shadowing checks when damage lands.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeStalkShadowingAtDamageContext
 */

import { computingWildlifePreyStillDurationMs } from '@/components/world/wildlife/domains/computingWildlifePreyStillDurationMs';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';

export type ResolvingWildlifeStalkShadowingAtDamageContextParams = {
  preyTargetId: string;
  playerUserId: string | null;
  playerHealthRatio: number | null;
  playerStaminaRatio: number | null;
  playerStaminaIsDepleted: boolean;
  playerStillDurationMs: number;
  nearbyInstances: readonly DefiningWildlifeInstance[];
};

export type ResolvingWildlifeStalkShadowingAtDamageContextResult = {
  preyHealthRatio: number | null;
  preyStaminaRatio: number | null;
  preyStaminaIsDepleted: boolean;
  preyStillDurationMs: number;
};

/** Maps the active stalk target to the vitals used by the shadowing predicate. */
export function resolvingWildlifeStalkShadowingAtDamageContext({
  preyTargetId,
  playerUserId,
  playerHealthRatio,
  playerStaminaRatio,
  playerStaminaIsDepleted,
  playerStillDurationMs,
  nearbyInstances,
}: ResolvingWildlifeStalkShadowingAtDamageContextParams): ResolvingWildlifeStalkShadowingAtDamageContextResult {
  if (playerUserId && preyTargetId === playerUserId) {
    return {
      preyHealthRatio: playerHealthRatio,
      preyStaminaRatio: playerStaminaRatio,
      preyStaminaIsDepleted: playerStaminaIsDepleted,
      preyStillDurationMs: playerStillDurationMs,
    };
  }

  const prey = nearbyInstances.find(
    (candidate) => candidate.instanceId === preyTargetId
  );

  if (!prey || prey.isDead) {
    return {
      preyHealthRatio: null,
      preyStaminaRatio: null,
      preyStaminaIsDepleted: false,
      preyStillDurationMs: 0,
    };
  }

  const maxHealth = prey.healthState.baseMaxHealth;

  return {
    preyHealthRatio:
      maxHealth > 0 ? prey.healthState.currentHealth / maxHealth : null,
    preyStaminaRatio: prey.staminaState.staminaRatio,
    preyStaminaIsDepleted: prey.staminaState.isExhausted,
    preyStillDurationMs: computingWildlifePreyStillDurationMs(prey),
  };
}
