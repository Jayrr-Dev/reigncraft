/**
 * Whether a species only appears via nightOnly biome spawn entries.
 *
 * @module components/world/wildlife/domains/checkingWildlifeSpeciesIsNightOnlySpawn
 */

import { DEFINING_WILDLIFE_BIOME_SPAWN_TABLE } from '@/components/world/wildlife/domains/definingWildlifeBiomeSpawnTable';

/**
 * True when any biome spawn entry for this species is marked `nightOnly`.
 * Used to skip daytime pending respawn and sunrise cleanup.
 */
export function checkingWildlifeSpeciesIsNightOnlySpawn(
  speciesId: string
): boolean {
  for (const config of Object.values(DEFINING_WILDLIFE_BIOME_SPAWN_TABLE)) {
    if (!config) {
      continue;
    }

    for (const entry of config.entries) {
      if (entry.speciesId === speciesId && entry.nightOnly) {
        return true;
      }
    }
  }

  return false;
}
