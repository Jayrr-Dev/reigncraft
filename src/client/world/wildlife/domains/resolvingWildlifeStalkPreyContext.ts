/**
 * Resolves the active stalk target from player vitals or a wildlife instance.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeStalkPreyContext
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { computingWildlifePreyStillDurationMs } from '@/components/world/wildlife/domains/computingWildlifePreyStillDurationMs';
import type { DefiningWildlifeStalkPreyContext } from '@/components/world/wildlife/domains/definingWildlifeStalkPreyTypes';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';

export type ResolvingWildlifeStalkPreyContextParams = {
  activeTargetId: string | null;
  nearbyInstances: readonly DefiningWildlifeInstance[];
  playerUserId: string | null;
  playerPosition: DefiningWorldPlazaWorldPoint | null;
  playerHealthRatio: number | null;
  playerStaminaRatio: number | null;
  playerStaminaIsDepleted: boolean;
  playerStillDurationMs: number;
};

/** Returns stalk vitals for the active threat target, if known. */
export function resolvingWildlifeStalkPreyContext({
  activeTargetId,
  nearbyInstances,
  playerUserId,
  playerPosition,
  playerHealthRatio,
  playerStaminaRatio,
  playerStaminaIsDepleted,
  playerStillDurationMs,
}: ResolvingWildlifeStalkPreyContextParams): DefiningWildlifeStalkPreyContext | null {
  if (!activeTargetId) {
    return null;
  }

  if (activeTargetId === playerUserId && playerPosition) {
    return {
      targetId: activeTargetId,
      position: playerPosition,
      healthRatio: playerHealthRatio,
      staminaRatio: playerStaminaRatio,
      staminaIsDepleted: playerStaminaIsDepleted,
      stillDurationMs: playerStillDurationMs,
    };
  }

  const prey = nearbyInstances.find(
    (candidate) => candidate.instanceId === activeTargetId
  );

  if (!prey || prey.isDead) {
    return null;
  }

  const maxHealth = prey.healthState.baseMaxHealth;
  const healthRatio =
    maxHealth > 0 ? prey.healthState.currentHealth / maxHealth : null;

  return {
    targetId: activeTargetId,
    position: prey.position,
    healthRatio,
    staminaRatio: prey.staminaState.staminaRatio,
    staminaIsDepleted: prey.staminaState.isExhausted,
    stillDurationMs: computingWildlifePreyStillDurationMs(prey),
  };
}
