/**
 * Frostnip+ percent-of-max-HP frost damage from stack count.
 *
 * @module components/world/health/domains/computingWorldPlazaFrostbitePercentMaxHealthDamage
 */

import {
  DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_PERCENT_DAMAGE_BASE,
  DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_PERCENT_DAMAGE_PER_STACK,
} from '@/components/world/health/domains/definingWorldPlazaEntityFrostbiteConstants';

/**
 * Extra HP damage on a cold tick: `(base + stacks * 0.01)%` of effective max health.
 */
export function computingWorldPlazaFrostbitePercentMaxHealthDamage(
  stackCount: number,
  effectiveMaxHealth: number
): number {
  if (stackCount <= 0 || effectiveMaxHealth <= 0) {
    return 0;
  }

  const percentOfMax =
    DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_PERCENT_DAMAGE_BASE +
    stackCount * DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_PERCENT_DAMAGE_PER_STACK;

  return (effectiveMaxHealth * percentOfMax) / 100;
}
