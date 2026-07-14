/**
 * Resolves the idle interaction label above a bonded companion.
 *
 * @module components/world/wildlife/pets/domains/resolvingWildlifePetIdleInteractionLabel
 */

import {
  DEFINING_WILDLIFE_PET_LOYALTY_TIER_REGISTRY,
  DEFINING_WILDLIFE_PET_NAME_PROMPT_LABEL,
} from '@/components/world/wildlife/pets/domains/definingWildlifePetLoyaltyTiersRegistry';
import { checkingWildlifePetHasCapability } from '@/components/world/wildlife/pets/domains/resolvingWildlifePetLoyaltyTier';
import { resolvingWildlifeDocilePetKind } from '@/components/world/wildlife/domains/checkingWildlifeSpeciesIsPettable';
import { resolvingWildlifeDocilePetIdleLabel } from '@/components/world/wildlife/domains/resolvingWildlifeDocilePetLabel';
import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';

export type ResolvingWildlifePetIdleInteractionLabelParams = {
  speciesId: DefiningWildlifeSpeciesId | string;
  loyalty: number;
  displayName: string | null | undefined;
};

const DEFINING_WILDLIFE_PET_FAMILIAR_MIN_LOYALTY =
  DEFINING_WILDLIFE_PET_LOYALTY_TIER_REGISTRY.find(
    (tier) => tier.tierId === 'familiar'
  )?.minLoyalty ?? 50;

/** Idle label: Pet the Cat/Dog, Name?, or the chosen pet name. */
export function resolvingWildlifePetIdleInteractionLabel(
  params: ResolvingWildlifePetIdleInteractionLabelParams
): string {
  const trimmedName = params.displayName?.trim() ?? '';

  if (
    params.loyalty >= DEFINING_WILDLIFE_PET_FAMILIAR_MIN_LOYALTY &&
    checkingWildlifePetHasCapability(params.loyalty, 'namable')
  ) {
    if (trimmedName.length > 0) {
      return trimmedName;
    }

    return DEFINING_WILDLIFE_PET_NAME_PROMPT_LABEL;
  }

  const petKind = resolvingWildlifeDocilePetKind(params.speciesId);

  if (petKind) {
    return resolvingWildlifeDocilePetIdleLabel(petKind);
  }

  return '';
}
