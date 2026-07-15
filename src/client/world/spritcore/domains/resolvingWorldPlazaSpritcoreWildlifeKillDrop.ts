/**
 * Resolves a Spritcore ground-drop payload for a wildlife corpse.
 *
 * @module components/world/spritcore/domains/resolvingWorldPlazaSpritcoreWildlifeKillDrop
 */

import { DEFINING_WORLD_PLAZA_GENERATION_FEATURE } from '@/components/world/domains/definingWorldPlazaGenerationFeatureRegistry';
import { checkingWorldPlazaGenerationFeatureEnabled } from '@/components/world/domains/managingWorldPlazaGenerationFeatureStore';
import { resolvingWorldPlazaSpritcoreDropTierDefinition } from '@/components/world/spritcore/domains/resolvingWorldPlazaSpritcoreDropTier';
import { resolvingWorldPlazaSpritcoreWildlifeDrop } from '@/components/world/spritcore/domains/resolvingWorldPlazaSpritcoreWildlifeDrop';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';

export type ResolvingWorldPlazaSpritcoreWildlifeKillDrop = {
  readonly amount: number;
  readonly itemTypeId: string;
  readonly displayName: string;
};

/**
 * Returns the tiered Spritcore stack for one wildlife death, or null when disabled.
 */
export function resolvingWorldPlazaSpritcoreWildlifeKillDrop(
  species: DefiningWildlifeSpeciesDefinition
): ResolvingWorldPlazaSpritcoreWildlifeKillDrop | null {
  if (
    !checkingWorldPlazaGenerationFeatureEnabled(
      DEFINING_WORLD_PLAZA_GENERATION_FEATURE.SPRITCORE_LEVELING
    )
  ) {
    return null;
  }

  const dropAmount = resolvingWorldPlazaSpritcoreWildlifeDrop(species);

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
