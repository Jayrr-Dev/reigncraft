/**
 * Resolves player-facing hint copy for a locked chest click.
 *
 * @module components/world/chest/domains/resolvingWorldPlazaChestLockedHintToastMessage
 */

import type { DefiningWorldPlazaChestInstance } from '@/components/world/chest/domains/definingWorldPlazaChestTypes';
import {
  LABELING_WORLD_PLAZA_CHEST_LOCKED_HINT_LONG_GRASS,
  LABELING_WORLD_PLAZA_CHEST_LOCKED_HINT_SHRUB,
  LABELING_WORLD_PLAZA_CHEST_LOCKED_HINT_WILDLIFE,
  LABELING_WORLD_PLAZA_CHEST_LOCKED_HINT_WILDLIFE_STRONGEST,
} from '@/components/world/chest/domains/definingWorldPlazaProceduralChestConstants';
import { resolvingWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';

/**
 * Returns the toast shown when the player clicks a locked chest without a key.
 */
export function resolvingWorldPlazaChestLockedHintToastMessage(
  instance: DefiningWorldPlazaChestInstance
): string {
  switch (instance.keySource) {
    case 'wildlife-strongest':
      return LABELING_WORLD_PLAZA_CHEST_LOCKED_HINT_WILDLIFE_STRONGEST;
    case 'wildlife-species': {
      const speciesId = instance.keyWildlifeSpeciesId;
      const speciesName =
        (speciesId
          ? resolvingWildlifeSpeciesDefinition(speciesId)?.displayName
          : null) ?? 'marked animal';

      return `Hunt the ${speciesName}.`;
    }
    case 'shrub':
      return LABELING_WORLD_PLAZA_CHEST_LOCKED_HINT_SHRUB;
    case 'long-grass':
      return LABELING_WORLD_PLAZA_CHEST_LOCKED_HINT_LONG_GRASS;
    case 'wildlife':
    default:
      return LABELING_WORLD_PLAZA_CHEST_LOCKED_HINT_WILDLIFE;
  }
}
