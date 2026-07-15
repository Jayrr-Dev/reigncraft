/**
 * Monster combat value and Spiritcore drop helpers.
 *
 * @module components/world/spritcore/domains/computingWorldPlazaSpritcoreMonsterDrop
 */

import {
  DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_MONSTER_CV_DPS_COEFFICIENT,
  DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_MONSTER_CV_HEALTH_COEFFICIENT,
  DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_MONSTER_DROP_RATE,
} from '@/components/world/spritcore/domains/definingWorldPlazaSpritcoreLevelingConstants';

/** CV = 0.8H + (800/BASE_DPS) * DPS. */
export function computingWorldPlazaSpritcoreMonsterCombatValue(
  health: number,
  damage: number,
  attackSpeed: number
): number {
  const dps = damage * attackSpeed;

  return (
    DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_MONSTER_CV_HEALTH_COEFFICIENT *
      health +
    DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_MONSTER_CV_DPS_COEFFICIENT * dps
  );
}

/** Rounded 5% Spiritcore drop from monster combat stats. */
export function computingWorldPlazaSpritcoreMonsterDrop(
  health: number,
  damage: number,
  attackSpeed: number
): number {
  return Math.round(
    computingWorldPlazaSpritcoreMonsterCombatValue(
      health,
      damage,
      attackSpeed
    ) * DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_MONSTER_DROP_RATE
  );
}

/** Ceil of upgrade cost divided by per-kill drop. */
export function computingWorldPlazaSpritcoreMonstersRequired(
  upgradeCost: number,
  dropPerMonster: number
): number {
  if (upgradeCost <= 0) {
    return 0;
  }

  if (dropPerMonster <= 0) {
    return Number.POSITIVE_INFINITY;
  }

  return Math.ceil(upgradeCost / dropPerMonster);
}
