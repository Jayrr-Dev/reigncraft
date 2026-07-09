/**
 * Resolves per-meat raw disease intensity from catalog overrides or species registry.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeMeatRawDiseaseIntensity
 */

import { DEFINING_WILDLIFE_AGGRESSIVE_CHICKEN_RAW_MEAT_ITEM_TYPE_ID } from '@/components/world/wildlife/domains/definingWildlifeAggressiveChickenConstants';
import {
  DEFINING_WILDLIFE_CUCCO_MEAT_DISEASE_INTENSITY,
  DEFINING_WILDLIFE_MEAT_DISEASE_INTENSITY_BY_SPECIES,
  DEFINING_WILDLIFE_MEAT_DISEASE_INTENSITY_DEFAULT,
  type DefiningWildlifeMeatDiseaseIntensityEntry,
} from '@/components/world/wildlife/domains/definingWildlifeMeatDiseaseIntensityRegistry';
import type { DefiningWildlifeMeatCatalogEntry } from '@/components/world/wildlife/domains/definingWildlifeMeatRegistry';

export type ResolvingWildlifeMeatRawDiseaseIntensityResult =
  DefiningWildlifeMeatDiseaseIntensityEntry;

function resolvingWildlifeMeatSpeciesIntensity(
  speciesId: DefiningWildlifeMeatCatalogEntry['speciesId']
): DefiningWildlifeMeatDiseaseIntensityEntry {
  return (
    DEFINING_WILDLIFE_MEAT_DISEASE_INTENSITY_BY_SPECIES[speciesId] ??
    DEFINING_WILDLIFE_MEAT_DISEASE_INTENSITY_DEFAULT
  );
}

/** Resolves symptom and duration intensity for one meat catalog row. */
export function resolvingWildlifeMeatRawDiseaseIntensity(
  entry: DefiningWildlifeMeatCatalogEntry
): ResolvingWildlifeMeatRawDiseaseIntensityResult {
  if (
    entry.rawItemTypeId ===
    DEFINING_WILDLIFE_AGGRESSIVE_CHICKEN_RAW_MEAT_ITEM_TYPE_ID
  ) {
    return DEFINING_WILDLIFE_CUCCO_MEAT_DISEASE_INTENSITY;
  }

  const speciesIntensity = resolvingWildlifeMeatSpeciesIntensity(
    entry.speciesId
  );

  return {
    symptomIntensity:
      entry.rawSymptomIntensity ?? speciesIntensity.symptomIntensity,
    durationIntensity:
      entry.rawDurationIntensity ?? speciesIntensity.durationIntensity,
  };
}
