/**
 * Flavor copy for fishing-catch meats (wildlife meat species ids = catch ids).
 *
 * @module components/world/wildlife/domains/definingWildlifeFishMeatItemDescriptionCorpus
 */

import { resolvingWorldPlazaEntityBuffDescriptor } from '@/components/world/health/domains/definingWorldPlazaEntityBuffRegistry';
import {
  resolvingWorldPlazaEntityDiseaseDescriptor,
  type DefiningWorldPlazaEntityDiseaseId,
} from '@/components/world/health/domains/definingWorldPlazaEntityDiseaseRegistry';
import { DEFINING_WILDLIFE_FISH_MEAT_CATALOG } from '@/components/world/wildlife/domains/definingWildlifeFishMeatCatalog';
import type { DefiningWildlifeMeatItemDescriptionEntry } from '@/components/world/wildlife/domains/definingWildlifeMeatItemDescriptionCorpus';
import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';

function formattingCatchShortName(rawDisplayName: string): string {
  return rawDisplayName.replace(/^Raw\s+/u, '');
}

function buildingFishMeatDescriptionEntry(
  speciesId: string,
  rawDisplayName: string,
  rawDiseaseId: string,
  rawDiseaseChance: number,
  cookedWellFedBuffId: string,
  cookedWellFedChance: number
): DefiningWildlifeMeatItemDescriptionEntry {
  const shortName = formattingCatchShortName(rawDisplayName);
  const diseaseLabel = resolvingWorldPlazaEntityDiseaseDescriptor(
    rawDiseaseId as DefiningWorldPlazaEntityDiseaseId
  ).label;
  const buffLabel =
    resolvingWorldPlazaEntityBuffDescriptor(cookedWellFedBuffId)?.label ??
    'a short well-fed buff';
  const rawRisk =
    rawDiseaseChance > 0
      ? `Eating raw risks ${diseaseLabel.toLowerCase()}.`
      : 'Surprisingly mild raw, but fire still makes it safer.';
  const cookedBuff =
    cookedWellFedChance > 0
      ? `Safe after the fire; may grant ${buffLabel}.`
      : 'Safe after the fire.';

  return {
    speciesId,
    rawDescription: `${shortName} pulled from Corpus water, still wet and cold. ${rawRisk}`,
    cookedDescription: `Cooked ${shortName.toLowerCase()}, firm and filling. ${cookedBuff}`,
  };
}

/** Per-catch fish meat descriptions derived from the fishing/wildlife fish catalog. */
export const DEFINING_WILDLIFE_FISH_MEAT_ITEM_DESCRIPTION_ENTRIES: readonly DefiningWildlifeMeatItemDescriptionEntry[] =
  DEFINING_WILDLIFE_FISH_MEAT_CATALOG.map((entry) =>
    buildingFishMeatDescriptionEntry(
      entry.speciesId,
      entry.rawDisplayName,
      entry.rawDiseaseId,
      entry.rawDiseaseChance,
      entry.cookedWellFedBuffId,
      entry.cookedWellFedChance
    )
  );

const DEFINING_WILDLIFE_FISH_MEAT_ITEM_DESCRIPTION_BY_SPECIES =
  Object.fromEntries(
    DEFINING_WILDLIFE_FISH_MEAT_ITEM_DESCRIPTION_ENTRIES.map((entry) => [
      entry.speciesId,
      entry,
    ])
  ) as Record<
    DefiningWildlifeSpeciesId,
    DefiningWildlifeMeatItemDescriptionEntry
  >;

/** Resolves fish meat flavor copy by catch / species id. */
export function resolvingWildlifeFishMeatItemDescriptionEntry(
  speciesId: DefiningWildlifeSpeciesId
): DefiningWildlifeMeatItemDescriptionEntry | null {
  return (
    DEFINING_WILDLIFE_FISH_MEAT_ITEM_DESCRIPTION_BY_SPECIES[speciesId] ?? null
  );
}
