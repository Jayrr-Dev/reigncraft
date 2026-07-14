/**
 * Declarative links between wildlife species and diseases they can cause.
 *
 * Built from meat catalog + variant meat entries (raw / residual disease ids).
 * Flower-only diseases have no wildlife carriers.
 *
 * @module components/home/domains/resolvingPlazaPathologyCreatureDiseaseLinks
 */

import type { DefiningWorldPlazaEntityDiseaseId } from '@/components/world/health/domains/definingWorldPlazaEntityDiseaseRegistry';
import { DEFINING_WILDLIFE_MEAT_CATALOG } from '@/components/world/wildlife/domains/definingWildlifeMeatRegistry';
import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { DEFINING_WILDLIFE_VARIANT_MEAT_CATALOG } from '@/components/world/wildlife/domains/definingWildlifeVariantMeatRegistry';

function buildingPlazaPathologyDiseaseIdsBySpecies(): ReadonlyMap<
  DefiningWildlifeSpeciesId,
  readonly DefiningWorldPlazaEntityDiseaseId[]
> {
  const diseaseIdsBySpecies = new Map<
    DefiningWildlifeSpeciesId,
    Set<DefiningWorldPlazaEntityDiseaseId>
  >();

  const recordingLink = (
    speciesId: DefiningWildlifeSpeciesId,
    diseaseId: DefiningWorldPlazaEntityDiseaseId
  ): void => {
    const existing = diseaseIdsBySpecies.get(speciesId) ?? new Set();
    existing.add(diseaseId);
    diseaseIdsBySpecies.set(speciesId, existing);
  };

  for (const entry of DEFINING_WILDLIFE_MEAT_CATALOG) {
    recordingLink(entry.speciesId, entry.rawDiseaseId);

    if (entry.cookedResidualDiseaseId) {
      recordingLink(entry.speciesId, entry.cookedResidualDiseaseId);
    }
  }

  for (const entry of DEFINING_WILDLIFE_VARIANT_MEAT_CATALOG) {
    recordingLink(entry.speciesId, entry.rawDiseaseId);

    if (entry.cookedResidualDiseaseId) {
      recordingLink(entry.speciesId, entry.cookedResidualDiseaseId);
    }
  }

  return new Map(
    [...diseaseIdsBySpecies.entries()].map(([speciesId, diseaseIds]) => [
      speciesId,
      [...diseaseIds].sort(),
    ])
  );
}

function buildingPlazaPathologySpeciesIdsByDisease(
  diseaseIdsBySpecies: ReadonlyMap<
    DefiningWildlifeSpeciesId,
    readonly DefiningWorldPlazaEntityDiseaseId[]
  >
): ReadonlyMap<
  DefiningWorldPlazaEntityDiseaseId,
  readonly DefiningWildlifeSpeciesId[]
> {
  const speciesIdsByDisease = new Map<
    DefiningWorldPlazaEntityDiseaseId,
    Set<DefiningWildlifeSpeciesId>
  >();

  for (const [speciesId, diseaseIds] of diseaseIdsBySpecies.entries()) {
    for (const diseaseId of diseaseIds) {
      const existing = speciesIdsByDisease.get(diseaseId) ?? new Set();
      existing.add(speciesId);
      speciesIdsByDisease.set(diseaseId, existing);
    }
  }

  return new Map(
    [...speciesIdsByDisease.entries()].map(([diseaseId, speciesIds]) => [
      diseaseId,
      [...speciesIds].sort(),
    ])
  );
}

const PLAZA_PATHOLOGY_DISEASE_IDS_BY_SPECIES =
  buildingPlazaPathologyDiseaseIdsBySpecies();

const PLAZA_PATHOLOGY_SPECIES_IDS_BY_DISEASE =
  buildingPlazaPathologySpeciesIdsByDisease(
    PLAZA_PATHOLOGY_DISEASE_IDS_BY_SPECIES
  );

/** Diseases a wildlife species can cause via raw or residual meat. */
export function listingPlazaPathologyDiseaseIdsCausedBySpecies(
  speciesId: DefiningWildlifeSpeciesId
): readonly DefiningWorldPlazaEntityDiseaseId[] {
  return PLAZA_PATHOLOGY_DISEASE_IDS_BY_SPECIES.get(speciesId) ?? [];
}

/** Wildlife species that can cause one disease via meat. */
export function listingPlazaPathologySpeciesIdsCausingDisease(
  diseaseId: DefiningWorldPlazaEntityDiseaseId
): readonly DefiningWildlifeSpeciesId[] {
  return PLAZA_PATHOLOGY_SPECIES_IDS_BY_DISEASE.get(diseaseId) ?? [];
}

/** True when the disease has at least one wildlife meat carrier. */
export function checkingPlazaPathologyDiseaseHasWildlifeCarriers(
  diseaseId: DefiningWorldPlazaEntityDiseaseId
): boolean {
  return listingPlazaPathologySpeciesIdsCausingDisease(diseaseId).length > 0;
}
