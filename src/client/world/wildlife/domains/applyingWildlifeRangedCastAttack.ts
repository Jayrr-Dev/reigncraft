/**
 * Applies a wildlife ranged cast: advances attack cooldown and returns a
 * projectile spawn request when the cast is ready.
 *
 * @module components/world/wildlife/domains/applyingWildlifeRangedCastAttack
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaScaledAttackIntervalMs } from '@/components/world/domains/resolvingWorldPlazaGlobalAttackSpeedScale';
import { resolvingWorldPlazaEntityHealthAttackSpeedMultiplier } from '@/components/world/health/domains/resolvingWorldPlazaEntityHealthAttackSpeedMultiplier';
import type { SpawningWorldPlazaProjectileRequest } from '@/components/world/projectile/domains/definingWorldPlazaProjectileTypes';
import {
  resolvingWildlifeRangedCastArchetypeId,
  type DefiningWildlifeSpeciesRangedCastProfile,
} from '@/components/world/wildlife/domains/definingWildlifeSpeciesRangedCastRegistry';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';

export type ApplyingWildlifeRangedCastAttackResult = {
  readonly attacker: DefiningWildlifeInstance;
  readonly spawnRequest: SpawningWorldPlazaProjectileRequest | null;
};

function checkingWildlifeRangedCastReady(
  attacker: DefiningWildlifeInstance,
  attackerSpecies: DefiningWildlifeSpeciesDefinition,
  nowMs: number
): boolean {
  const lastAttackAtMs = attacker.aiState.lastAttackAtMs;
  const attackSpeedMultiplier =
    resolvingWorldPlazaEntityHealthAttackSpeedMultiplier(
      attacker.healthState,
      nowMs
    );
  const attackIntervalMs =
    resolvingWorldPlazaScaledAttackIntervalMs(
      attackerSpecies.vitals.attackIntervalMs
    ) / attackSpeedMultiplier;

  return lastAttackAtMs === null || nowMs - lastAttackAtMs >= attackIntervalMs;
}

/**
 * Casts the next projectile in the species cycle when attack is ready and the
 * target is within cast range.
 */
export function applyingWildlifeRangedCastAttack(params: {
  attacker: DefiningWildlifeInstance;
  attackerSpecies: DefiningWildlifeSpeciesDefinition;
  rangedCast: DefiningWildlifeSpeciesRangedCastProfile;
  targetPosition: DefiningWorldPlazaWorldPoint;
  nowMs: number;
}): ApplyingWildlifeRangedCastAttackResult {
  const { attacker, attackerSpecies, rangedCast, targetPosition, nowMs } =
    params;

  const distance = Math.hypot(
    attacker.position.x - targetPosition.x,
    attacker.position.y - targetPosition.y
  );

  if (distance > rangedCast.castRangeGrid) {
    return {
      attacker: {
        ...attacker,
        aiState: {
          ...attacker.aiState,
          isMoving: false,
          motionClip: 'idle',
        },
      },
      spawnRequest: null,
    };
  }

  if (!checkingWildlifeRangedCastReady(attacker, attackerSpecies, nowMs)) {
    return {
      attacker: {
        ...attacker,
        aiState: {
          ...attacker.aiState,
          isMoving: false,
          motionClip: 'attack',
        },
      },
      spawnRequest: null,
    };
  }

  const castComboIndex = attacker.aiState.attackComboIndex ?? 0;
  const archetypeId = resolvingWildlifeRangedCastArchetypeId(
    rangedCast,
    castComboIndex
  );

  if (!archetypeId) {
    return { attacker, spawnRequest: null };
  }

  const nextComboIndex = castComboIndex + 1;

  return {
    attacker: {
      ...attacker,
      aiState: {
        ...attacker.aiState,
        isMoving: false,
        motionClip: 'attack',
        lastAttackAtMs: nowMs,
        attackComboIndex: nextComboIndex,
      },
    },
    spawnRequest: {
      archetypeId,
      origin: { x: attacker.position.x, y: attacker.position.y },
      targetPoint: { x: targetPosition.x, y: targetPosition.y },
      spawnedAtMs: nowMs,
      seed: Math.floor(nowMs + castComboIndex * 97),
      spawnerUserId: null,
    },
  };
}
