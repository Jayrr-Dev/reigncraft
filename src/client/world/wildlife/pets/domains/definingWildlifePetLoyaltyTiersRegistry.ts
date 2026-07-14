/**
 * Declarative loyalty tier thresholds and capability unlocks.
 *
 * @module components/world/wildlife/pets/domains/definingWildlifePetLoyaltyTiersRegistry
 */

import type {
  DefiningWildlifePetCapabilityId,
  DefiningWildlifePetLoyaltyTierId,
} from '@/components/world/wildlife/pets/domains/definingWildlifePetTypes';

/** Maximum loyalty points a companion can earn. */
export const DEFINING_WILDLIFE_PET_MAX_LOYALTY = 1000 as const;

/** Loyalty granted by one completed pet interaction (comfortable+). */
export const DEFINING_WILDLIFE_PET_PETTING_LOYALTY_GRANT = 17 as const;

/** Loyalty granted when a curious companion first chooses to follow. */
export const DEFINING_WILDLIFE_PET_CURIOUS_FOLLOW_LOYALTY_GRANT = 1 as const;

/** Up to three living companions may be deployed (active) at once. */
export const DEFINING_WILDLIFE_PET_MAX_ACTIVE = 3 as const;

/** Idle prompt label when the companion is namable but unnamed. */
export const DEFINING_WILDLIFE_PET_NAME_PROMPT_LABEL = 'Name?' as const;

export type DefiningWildlifePetLoyaltyTierDefinition = {
  tierId: DefiningWildlifePetLoyaltyTierId;
  displayName: string;
  minLoyalty: number;
  capabilities: readonly DefiningWildlifePetCapabilityId[];
};

/** Ordered loyalty tiers from first follow through bonded. */
export const DEFINING_WILDLIFE_PET_LOYALTY_TIER_REGISTRY: readonly DefiningWildlifePetLoyaltyTierDefinition[] =
  [
    {
      tierId: 'curious',
      displayName: 'Curious',
      minLoyalty: 1,
      capabilities: [],
    },
    {
      tierId: 'comfortable',
      displayName: 'Comfortable',
      minLoyalty: 13,
      capabilities: ['pettingLoyalty'],
    },
    {
      tierId: 'familiar',
      displayName: 'Familiar',
      minLoyalty: 50,
      // hungerUi: Companion panel Feed + hunger bar after the pet is named.
      capabilities: ['namable', 'persistent', 'allied', 'hungerUi'],
    },
    {
      tierId: 'accepting',
      displayName: 'Accepting',
      minLoyalty: 112,
      capabilities: ['basicUi'],
    },
    {
      tierId: 'friendly',
      displayName: 'Friendly',
      minLoyalty: 198,
      capabilities: ['commandsStayFollow'],
    },
    {
      tierId: 'trusting',
      displayName: 'Trusting',
      minLoyalty: 309,
      capabilities: ['commandsAttackDefend'],
    },
    {
      tierId: 'attached',
      displayName: 'Attached',
      minLoyalty: 445,
      capabilities: ['advancedStatsUi'],
    },
    {
      tierId: 'loyal',
      displayName: 'Loyal',
      minLoyalty: 605,
      capabilities: ['equipment'],
    },
    {
      tierId: 'devoted',
      displayName: 'Devoted',
      minLoyalty: 790,
      capabilities: ['teachSpells'],
    },
    {
      tierId: 'bonded',
      displayName: 'Bonded',
      minLoyalty: 1000,
      capabilities: ['soulsave'],
    },
  ];
