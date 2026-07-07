/**
 * Reads the alpha's stalk timer so followers stay phase-synced.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeSpawnPackAlphaStalkingSinceMs
 */

import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { resolvingWildlifeSpawnPackAlphaInstance } from '@/components/world/wildlife/domains/resolvingWildlifeSpawnPackAlphaInstance';

export type ResolvingWildlifeSpawnPackAlphaStalkingSinceMsParams = {
  instance: DefiningWildlifeInstance;
  instances: readonly DefiningWildlifeInstance[];
  preyTargetId: string;
  resolveSpecies: (
    speciesId: string
  ) => DefiningWildlifeSpeciesDefinition | null;
};

/** Returns the alpha's stalk start time when it is already hunting the prey. */
export function resolvingWildlifeSpawnPackAlphaStalkingSinceMs({
  instance,
  instances,
  preyTargetId,
  resolveSpecies,
}: ResolvingWildlifeSpawnPackAlphaStalkingSinceMsParams): number | null {
  const alpha = resolvingWildlifeSpawnPackAlphaInstance({
    instance,
    instances,
    resolveSpecies,
  });

  if (!alpha || alpha.aggroState.activeTargetId !== preyTargetId) {
    return null;
  }

  return alpha.aggroState.stalkingPreySinceMs ?? null;
}
