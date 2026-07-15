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
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';

export type ResolvingWorldPlazaSpritcoreWildlifeKillDrop = {
  readonly amount: number;
  readonly itemTypeId: string;
  readonly displayName: string;
};

/**
 * Returns the tiered Spritcore stack for one wildlife death, or null when disabled.
 * Uses the killed instance's effective combat strength when provided.
 */
export function resolvingWorldPlazaSpritcoreWildlifeKillDrop(
  species: DefiningWildlifeSpeciesDefinition,
  instance?: DefiningWildlifeInstance,
  nowMs: number = Date.now()
): ResolvingWorldPlazaSpritcoreWildlifeKillDrop | null {
  if (
    !checkingWorldPlazaGenerationFeatureEnabled(
      DEFINING_WORLD_PLAZA_GENERATION_FEATURE.SPRITCORE_LEVELING
    )
  ) {
    return null;
  }

  const dropAmount = resolvingWorldPlazaSpritcoreWildlifeDrop(
    species,
    instance,
    nowMs
  );

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
