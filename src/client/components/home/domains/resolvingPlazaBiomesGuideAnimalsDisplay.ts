import {
  DEFINING_PLAZA_BESTIARY_GUIDE_ENTRIES,
  LABELING_PLAZA_BESTIARY_UNDISCOVERED_NAME,
} from '@/components/home/domains/definingPlazaBestiaryGuideConstants';
import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';
import { resolvingWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { resolvingWildlifeSpeciesIdsForBiome } from '@/components/world/wildlife/domains/resolvingWildlifeSpeciesBiomeMembership';

const PLAZA_BIOMES_GUIDE_ANIMAL_FALLBACK_ICON = 'mdi:paw' as const;

const plazaBestiaryGuideIconBySpeciesId = new Map(
  DEFINING_PLAZA_BESTIARY_GUIDE_ENTRIES.map((entry) => [
    entry.speciesId,
    entry.icon,
  ])
);

export type PlazaBiomesGuideAnimalDisplayTag = {
  id: DefiningWildlifeSpeciesId;
  label: string;
  icon: string;
  isSighted: boolean;
};

/**
 * Resolves Animals chips for an explored biome detail page.
 * Sighted species show their name; unsighted slots stay `???`.
 */
export function resolvingPlazaBiomesGuideAnimalsDisplay(
  kind: DefiningWorldPlazaBiomeKind,
  sightedSpeciesIds: ReadonlySet<DefiningWildlifeSpeciesId>
): PlazaBiomesGuideAnimalDisplayTag[] {
  return resolvingWildlifeSpeciesIdsForBiome(kind).map((speciesId) => {
    const isSighted = sightedSpeciesIds.has(speciesId);
    const speciesDefinition = resolvingWildlifeSpeciesDefinition(speciesId);

    return {
      id: speciesId,
      isSighted,
      icon:
        plazaBestiaryGuideIconBySpeciesId.get(speciesId) ??
        PLAZA_BIOMES_GUIDE_ANIMAL_FALLBACK_ICON,
      label: isSighted
        ? (speciesDefinition?.displayName ?? speciesId)
        : LABELING_PLAZA_BESTIARY_UNDISCOVERED_NAME,
    };
  });
}
