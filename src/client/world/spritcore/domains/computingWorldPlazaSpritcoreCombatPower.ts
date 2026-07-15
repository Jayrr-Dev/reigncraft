/**
 * Direct combat power comparison helper for Spritcore leveling.
 *
 * @module components/world/spritcore/domains/computingWorldPlazaSpritcoreCombatPower
 */

import {
  DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_BASE_DPS,
  DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_BASE_HP,
} from '@/components/world/spritcore/domains/definingWorldPlazaSpritcoreLevelingConstants';

/** P = (H / BASE_HP) * (DPS / BASE_DPS). Starting character has P = 1. */
export function computingWorldPlazaSpritcoreCombatPower(
  health: number,
  damage: number,
  attackSpeed: number
): number {
  const dps = damage * attackSpeed;

  return (
    (health / DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_BASE_HP) *
    (dps / DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_BASE_DPS)
  );
}
