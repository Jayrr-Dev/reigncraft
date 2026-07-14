/**
 * Study-gated reveal flags for berry and tea leaves inspect UI.
 *
 * Thresholds match Herbarium berry study tiers so bag tooltips unlock with the
 * same Study progress as the Guide dossier.
 *
 * @module components/world/inventory/domains/definingWorldPlazaInventoryBerryDetailRevealConstants
 */

import type { PlazaHerbariumBerryStudyTierId } from '@/components/home/domains/definingPlazaHerbariumBerryStudyTier';

/** Which berry/tea inspect fields are visible at one knowledge tier. */
export type DefiningWorldPlazaInventoryBerryDetailReveal = {
  /**
   * Flavor copy depth:
   * 0 hidden, 1 sighting summary, 2 studied notes.
   */
  readonly descriptionTier: 0 | 1 | 2;
  readonly showStudyProgress: boolean;
  readonly showPropertiesSummary: boolean;
  /** Hunger / heal badges from the generic food path. */
  readonly showFoodHungerBadge: boolean;
  /** Buff name without chance percent. */
  readonly showWellFedName: boolean;
  /** Append well-fed chance percent when known. */
  readonly showWellFedChance: boolean;
  readonly showGenericItemMeta: boolean;
};

/**
 * Progressive berry inspect unlocks keyed by highest Herbarium study tier.
 *
 * - sighted (0): rarity + stack; study tease
 * - fieldNotes (1): sighting summary
 * - properties (5): gathered/eaten properties line
 * - habitats (15): hunger/heal badges + buzz name
 * - full (100): buzz chance percent
 */
export const DEFINING_WORLD_PLAZA_INVENTORY_BERRY_DETAIL_REVEAL_BY_TIER: Readonly<
  Record<
    PlazaHerbariumBerryStudyTierId,
    DefiningWorldPlazaInventoryBerryDetailReveal
  >
> = {
  sighted: {
    descriptionTier: 0,
    showStudyProgress: true,
    showPropertiesSummary: false,
    showFoodHungerBadge: false,
    showWellFedName: false,
    showWellFedChance: false,
    showGenericItemMeta: true,
  },
  fieldNotes: {
    descriptionTier: 1,
    showStudyProgress: true,
    showPropertiesSummary: false,
    showFoodHungerBadge: false,
    showWellFedName: false,
    showWellFedChance: false,
    showGenericItemMeta: true,
  },
  properties: {
    descriptionTier: 2,
    showStudyProgress: true,
    showPropertiesSummary: true,
    showFoodHungerBadge: false,
    showWellFedName: false,
    showWellFedChance: false,
    showGenericItemMeta: true,
  },
  habitats: {
    descriptionTier: 2,
    showStudyProgress: true,
    showPropertiesSummary: true,
    showFoodHungerBadge: true,
    showWellFedName: true,
    showWellFedChance: false,
    showGenericItemMeta: true,
  },
  full: {
    descriptionTier: 2,
    showStudyProgress: true,
    showPropertiesSummary: true,
    showFoodHungerBadge: true,
    showWellFedName: true,
    showWellFedChance: true,
    showGenericItemMeta: true,
  },
};
