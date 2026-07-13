/**
 * Declarative translation constants for character profile weight display.
 *
 * @module components/world/character/domains/definingWorldPlazaCharacterWeightDisplayConstants
 */

import { DEFINING_WILDLIFE_PLAYER_REFERENCE_MASS_KG } from '@/components/world/wildlife/domains/definingWildlifeFoodChain';

/** Default human playable mass when a definition omits `massKg`. */
export const DEFINING_WORLD_PLAZA_CHARACTER_DEFAULT_MASS_KG =
  DEFINING_WILDLIFE_PLAYER_REFERENCE_MASS_KG;

/** Profile attribute label for weight. */
export const LABELING_WORLD_PLAZA_CHARACTER_WEIGHT_ATTRIBUTE =
  'Weight' as const;

/** Iconify id for the weight attribute chip (bundled). */
export const DEFINING_WORLD_PLAZA_CHARACTER_WEIGHT_ATTRIBUTE_ICON =
  'mdi:scale-balance' as const;
