/**
 * Grants Spiritcore to the player when they kill wildlife.
 *
 * @module components/world/spritcore/domains/grantingWorldPlazaSpritcoreOnWildlifeKill
 */

import { DEFINING_WORLD_PLAZA_GENERATION_FEATURE } from '@/components/world/domains/definingWorldPlazaGenerationFeatureRegistry';
import { checkingWorldPlazaGenerationFeatureEnabled } from '@/components/world/domains/managingWorldPlazaGenerationFeatureStore';
import { resolvingWorldPlazaSpritcoreDropTierDefinition } from '@/components/world/spritcore/domains/resolvingWorldPlazaSpritcoreDropTier';
import { resolvingWorldPlazaSpritcoreWildlifeDrop } from '@/components/world/spritcore/domains/resolvingWorldPlazaSpritcoreWildlifeDrop';
import type { DefiningWildlifeMeatDropKillContext } from '@/components/world/wildlife/domains/attemptingWildlifeMeatGroundDropOnDeath';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';

export type GrantingWorldPlazaSpritcoreOnWildlifeKillGrant = {
  readonly amount: number;
  readonly itemTypeId: string;
  readonly displayName: string;
};

export type GrantingWorldPlazaSpritcoreOnWildlifeKillInput = {
  readonly species: DefiningWildlifeSpeciesDefinition;
  readonly killContext?: DefiningWildlifeMeatDropKillContext | null;
  readonly playerTargetId: string | null;
  readonly onGrant: (
    grant: GrantingWorldPlazaSpritcoreOnWildlifeKillGrant
  ) => void;
};

/**
 * Grants Spiritcore when the local player killed the wildlife instance.
 */
export function grantingWorldPlazaSpritcoreOnWildlifeKill(
  input: GrantingWorldPlazaSpritcoreOnWildlifeKillInput
): number {
  if (
    !checkingWorldPlazaGenerationFeatureEnabled(
      DEFINING_WORLD_PLAZA_GENERATION_FEATURE.SPRITCORE_LEVELING
    )
  ) {
    return 0;
  }

  const killerTargetId = input.killContext?.killerTargetId;

  if (
    !killerTargetId ||
    !input.playerTargetId ||
    killerTargetId !== input.playerTargetId
  ) {
    return 0;
  }

  const dropAmount = resolvingWorldPlazaSpritcoreWildlifeDrop(input.species);

  if (dropAmount <= 0) {
    return 0;
  }

  const tierDefinition =
    resolvingWorldPlazaSpritcoreDropTierDefinition(dropAmount);

  input.onGrant({
    amount: dropAmount,
    itemTypeId: tierDefinition.itemTypeId,
    displayName: tierDefinition.displayName,
  });

  return dropAmount;
}
