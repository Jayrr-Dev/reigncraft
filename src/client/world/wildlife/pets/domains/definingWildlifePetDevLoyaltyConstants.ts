/**
 * Dev tools constants for pet loyalty testing.
 *
 * @module components/world/wildlife/pets/domains/definingWildlifePetDevLoyaltyConstants
 */

import { DEFINING_WILDLIFE_PET_PETTING_LOYALTY_GRANT } from '@/components/world/wildlife/pets/domains/definingWildlifePetLoyaltyTiersRegistry';

/** Default loyalty bump matching one completed Pet. */
export const DEFINING_WILDLIFE_PET_DEV_LOYALTY_GRANT_PETTING =
  DEFINING_WILDLIFE_PET_PETTING_LOYALTY_GRANT;

/** Medium loyalty bump for faster tier climbs in QA. */
export const DEFINING_WILDLIFE_PET_DEV_LOYALTY_GRANT_MEDIUM = 50 as const;

/** Large loyalty bump for skipping several tiers. */
export const DEFINING_WILDLIFE_PET_DEV_LOYALTY_GRANT_LARGE = 200 as const;

/** Toggle button label for overhead loyalty readout. */
export const LABELING_WILDLIFE_PET_DEV_LOYALTY_OVERLAY_TOGGLE =
  'Show loyalty overhead' as const;

/** Section label inside the Pets dev view. */
export const LABELING_WILDLIFE_PET_DEV_SECTION = 'Pets' as const;

/** Hint copy under the Pets loyalty tools. */
export const LABELING_WILDLIFE_PET_DEV_HINT =
  'Targets the nearest living dog. Creates a provisional bond if needed.' as const;
