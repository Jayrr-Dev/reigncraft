/**
 * Resolves wildlife meat catalog entries from a live instance.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeMeatCatalogEntryForInstance
 */

import { checkingWildlifeIsAggressiveChicken } from '@/components/world/wildlife/domains/checkingWildlifeIsAggressiveChicken';
import type { DefiningWildlifeMeatCatalogEntry } from '@/components/world/wildlife/domains/definingWildlifeMeatRegistry';
import { resolvingWildlifeMeatCatalogEntry } from '@/components/world/wildlife/domains/definingWildlifeMeatRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { resolvingWildlifeVariantMeatCatalogEntry } from '@/components/world/wildlife/domains/definingWildlifeVariantMeatRegistry';

const DEFINING_WILDLIFE_AGGRESSIVE_CHICKEN_MEAT_VARIANT_ID =
  'aggressive-chicken';

/** Meat loot entry for one wildlife instance (species default or variant). */
export function resolvingWildlifeMeatCatalogEntryForInstance(
  instance: Pick<DefiningWildlifeInstance, 'speciesId' | 'aggressionLevel'>
): DefiningWildlifeMeatCatalogEntry | null {
  if (checkingWildlifeIsAggressiveChicken(instance)) {
    return resolvingWildlifeVariantMeatCatalogEntry(
      DEFINING_WILDLIFE_AGGRESSIVE_CHICKEN_MEAT_VARIANT_ID
    );
  }

  return resolvingWildlifeMeatCatalogEntry(instance.speciesId);
}

/** Raw meat item type id dropped when this instance dies. */
export function resolvingWildlifeMeatDropRawItemTypeId(
  instance: Pick<DefiningWildlifeInstance, 'speciesId' | 'aggressionLevel'>,
  fallbackRawMeatItemTypeId: string
): string {
  return (
    resolvingWildlifeMeatCatalogEntryForInstance(instance)?.rawItemTypeId ??
    fallbackRawMeatItemTypeId
  );
}
