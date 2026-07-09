/**
 * Resolves the active frostbite stage from stack count.
 *
 * @module components/world/health/domains/resolvingWorldPlazaEntityFrostbiteStage
 */

import {
  DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_STAGE_REGISTRY,
  type DefiningWorldPlazaEntityFrostbiteStageDescriptor,
} from '@/components/world/health/domains/definingWorldPlazaEntityFrostbiteStageRegistry';

/**
 * Highest stage whose minStacks is at or below stackCount, or null below Chilled.
 */
export function resolvingWorldPlazaEntityFrostbiteStage(
  stackCount: number
): DefiningWorldPlazaEntityFrostbiteStageDescriptor | null {
  let matched: DefiningWorldPlazaEntityFrostbiteStageDescriptor | null = null;

  for (const stage of DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_STAGE_REGISTRY) {
    if (stackCount >= stage.minStacks) {
      matched = stage;
    }
  }

  return matched;
}
