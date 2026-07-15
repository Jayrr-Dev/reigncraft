/**
 * Resolves a Spritcore ground-drop payload when the local player kills wildlife.
 *
 * @module components/world/spritcore/domains/resolvingWorldPlazaSpritcoreWildlifeKillDrop
 */

import { DEFINING_WORLD_PLAZA_GENERATION_FEATURE } from '@/components/world/domains/definingWorldPlazaGenerationFeatureRegistry';
import { checkingWorldPlazaGenerationFeatureEnabled } from '@/components/world/domains/managingWorldPlazaGenerationFeatureStore';
import { resolvingWorldPlazaSpritcoreDropTierDefinition } from '@/components/world/spritcore/domains/resolvingWorldPlazaSpritcoreDropTier';
import { resolvingWorldPlazaSpritcoreWildlifeDrop } from '@/components/world/spritcore/domains/resolvingWorldPlazaSpritcoreWildlifeDrop';
import type { DefiningWildlifeMeatDropKillContext } from '@/components/world/wildlife/domains/attemptingWildlifeMeatGroundDropOnDeath';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';

export type ResolvingWorldPlazaSpritcoreWildlifeKillDrop = {
  readonly amount: number;
  readonly itemTypeId: string;
  readonly displayName: string;
};

export type ResolvingWorldPlazaSpritcoreWildlifeKillDropInput = {
  readonly species: DefiningWildlifeSpeciesDefinition;
  readonly killContext?: DefiningWildlifeMeatDropKillContext | null;
  readonly playerTargetId: string | null;
};

/**
 * Returns the tiered Spritcore stack for a player kill, or null when no drop.
 */
export function resolvingWorldPlazaSpritcoreWildlifeKillDrop(
  input: ResolvingWorldPlazaSpritcoreWildlifeKillDropInput
): ResolvingWorldPlazaSpritcoreWildlifeKillDrop | null {
  if (
    !checkingWorldPlazaGenerationFeatureEnabled(
      DEFINING_WORLD_PLAZA_GENERATION_FEATURE.SPRITCORE_LEVELING
    )
  ) {
    return null;
  }

  const killerTargetId = input.killContext?.killerTargetId;

  if (
    !killerTargetId ||
    !input.playerTargetId ||
    killerTargetId !== input.playerTargetId
  ) {
    return null;
  }

  const dropAmount = resolvingWorldPlazaSpritcoreWildlifeDrop(input.species);

  if (dropAmount <= 0) {
    return null;
  }

  const tierDefinition =
    resolvingWorldPlazaSpritcoreDropTierDefinition(dropAmount);

  return {
    amount: dropAmount,
    itemTypeId: tierDefinition.itemTypeId,
    displayName: tierDefinition.displayName,
  };
}
