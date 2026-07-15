/**
 * Study-gated flavor description tiers for wildlife meat inspect.
 *
 * Tier 1: sensory / vague (familiarity, 1 study)
 * Tier 2: cautious risk hint, no disease names (understanding, 5 studies)
 * Tier 3: full authored copy with disease and buff flavor (application, 20+)
 *
 * @module components/world/inventory/domains/resolvingWorldPlazaInventoryWildlifeMeatFlavorDescription
 */

import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_DESCRIPTION_TEMPLATES } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemDescriptionCorpus';
import { resolvingWildlifeMeatItemDescriptionEntry } from '@/components/world/wildlife/domains/definingWildlifeMeatItemDescriptionCorpus';
import { resolvingWildlifeVariantMeatItemDescriptionEntry } from '@/components/world/wildlife/domains/definingWildlifeVariantMeatItemDescriptionCorpus';
import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';

/** Flavor depth shown in the meat info dialog (0 = hidden). */
export type DefiningWorldPlazaInventoryWildlifeMeatFlavorDescriptionTier =
  | 0
  | 1
  | 2
  | 3;

function takingFirstSentence(text: string): string {
  const trimmed = text.trim();
  const match = trimmed.match(/^(.+?[.!?])(?:\s|$)/);

  if (!match) {
    return trimmed;
  }

  return match[1].trim();
}

function buildingDerivedFlavorTiers(
  fullDescription: string,
  meatKind: 'raw' | 'cooked'
): readonly [string, string, string] {
  const firstSentence = takingFirstSentence(fullDescription);
  const cautiousHint =
    meatKind === 'raw'
      ? `${firstSentence} Eating it raw is risky.`
      : `${firstSentence} Cooking made it safer to eat.`;

  return [firstSentence, cautiousHint, fullDescription];
}

function resolvingAuthoredFullDescription(
  itemTypeId: string,
  wildlifeSpeciesId: string | undefined,
  meatKind: 'raw' | 'cooked' | undefined,
  fallbackName: string
): string {
  if (wildlifeSpeciesId) {
    const speciesEntry = resolvingWildlifeMeatItemDescriptionEntry(
      wildlifeSpeciesId as DefiningWildlifeSpeciesId
    );

    if (speciesEntry) {
      if (meatKind === 'cooked') {
        return speciesEntry.cookedDescription;
      }

      return speciesEntry.rawDescription;
    }
  }

  const variantEntry =
    resolvingWildlifeVariantMeatItemDescriptionEntry(itemTypeId);

  if (variantEntry) {
    if (meatKind === 'cooked') {
      return variantEntry.cookedDescription;
    }

    return variantEntry.rawDescription;
  }

  if (meatKind === 'cooked') {
    return DEFINING_WORLD_PLAZA_INVENTORY_ITEM_DESCRIPTION_TEMPLATES.cookedWildlifeMeat;
  }

  if (meatKind === 'raw') {
    return DEFINING_WORLD_PLAZA_INVENTORY_ITEM_DESCRIPTION_TEMPLATES.rawWildlifeMeat;
  }

  return fallbackName;
}

/**
 * Resolves progressive flavor copy for wildlife meat at one description tier.
 */
export function resolvingWorldPlazaInventoryWildlifeMeatFlavorDescription(options: {
  readonly itemTypeId: string;
  readonly wildlifeSpeciesId?: string;
  readonly meatKind?: 'raw' | 'cooked';
  readonly descriptionTier: DefiningWorldPlazaInventoryWildlifeMeatFlavorDescriptionTier;
  readonly fallbackName: string;
}): string {
  if (options.descriptionTier <= 0) {
    return '';
  }

  const fullDescription = resolvingAuthoredFullDescription(
    options.itemTypeId,
    options.wildlifeSpeciesId,
    options.meatKind,
    options.fallbackName
  );
  const tiers = buildingDerivedFlavorTiers(
    fullDescription,
    options.meatKind === 'cooked' ? 'cooked' : 'raw'
  );
  const tierIndex = Math.min(options.descriptionTier, 3) - 1;

  return tiers[tierIndex] ?? '';
}
