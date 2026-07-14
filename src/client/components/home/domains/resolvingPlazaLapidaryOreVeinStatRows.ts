/**
 * Builds Lapidary full-dossier vein rows with raw spawn numbers.
 *
 * @module components/home/domains/resolvingPlazaLapidaryOreVeinStatRows
 */

import { DEFINING_WORLD_PLAZA_ORE_SPECIES_HABITAT_LABEL } from '@/components/world/domains/definingWorldPlazaOreBiomeRarityConstants';
import {
  resolvingWorldOreSpeciesRarityEntry,
  WORLD_ORE_SPECIES_RARITY_LABELS,
  type WorldOreSpeciesId,
} from '../../../../shared/worldOreRarity';

export type PlazaLapidaryOreVeinStatRow = {
  readonly label: string;
  readonly value: string;
};

/**
 * Full-dossier numeric rows for one ore species.
 */
export function resolvingPlazaLapidaryOreVeinStatRows(
  speciesId: WorldOreSpeciesId
): readonly PlazaLapidaryOreVeinStatRow[] {
  const rarityEntry = resolvingWorldOreSpeciesRarityEntry(speciesId);

  return [
    {
      label: 'Rarity',
      value: WORLD_ORE_SPECIES_RARITY_LABELS[rarityEntry.rarity],
    },
    {
      label: 'Habitat',
      value: DEFINING_WORLD_PLAZA_ORE_SPECIES_HABITAT_LABEL[speciesId],
    },
    {
      label: 'Base weight',
      value: `${rarityEntry.weight} (ladder reference)`,
    },
  ];
}
