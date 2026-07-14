/**
 * Study-gated reveal flags for ore item inspect UI.
 *
 * Thresholds match Lapidary study tiers so bag tooltips unlock with the same
 * Study progress as the Guide dossier.
 *
 * @module components/world/inventory/domains/definingWorldPlazaInventoryOreDetailRevealConstants
 */

import type { PlazaLapidaryStudyTierId } from '@/components/home/domains/definingPlazaLapidaryStudyTier';

/** Which ore inspect fields are visible at one knowledge tier. */
export type DefiningWorldPlazaInventoryOreDetailReveal = {
  /**
   * Flavor copy depth:
   * 0 hidden, 1 sighting summary, 2 studied notes, 3 studied + properties line.
   */
  readonly descriptionTier: 0 | 1 | 2 | 3;
  readonly showStudyProgress: boolean;
  readonly showPropertiesSummary: boolean;
  readonly showHabitatLabel: boolean;
  readonly showVeinStatLabels: boolean;
  readonly showVeinStatNumbers: boolean;
  readonly showGenericItemMeta: boolean;
};

/**
 * Progressive ore inspect unlocks keyed by highest Lapidary study tier.
 *
 * - sighted (0): rarity + stack; study tease
 * - fieldNotes (1): sighting summary
 * - properties (5): studied notes + work/use hint
 * - habitats (15): habitat line, vein labels without numbers
 * - full (25): full vein dossier numbers
 */
export const DEFINING_WORLD_PLAZA_INVENTORY_ORE_DETAIL_REVEAL_BY_TIER: Readonly<
  Record<PlazaLapidaryStudyTierId, DefiningWorldPlazaInventoryOreDetailReveal>
> = {
  sighted: {
    descriptionTier: 0,
    showStudyProgress: true,
    showPropertiesSummary: false,
    showHabitatLabel: false,
    showVeinStatLabels: false,
    showVeinStatNumbers: false,
    showGenericItemMeta: true,
  },
  fieldNotes: {
    descriptionTier: 1,
    showStudyProgress: true,
    showPropertiesSummary: false,
    showHabitatLabel: false,
    showVeinStatLabels: false,
    showVeinStatNumbers: false,
    showGenericItemMeta: true,
  },
  properties: {
    descriptionTier: 2,
    showStudyProgress: true,
    showPropertiesSummary: true,
    showHabitatLabel: false,
    showVeinStatLabels: false,
    showVeinStatNumbers: false,
    showGenericItemMeta: true,
  },
  habitats: {
    descriptionTier: 3,
    showStudyProgress: true,
    showPropertiesSummary: true,
    showHabitatLabel: true,
    showVeinStatLabels: true,
    showVeinStatNumbers: false,
    showGenericItemMeta: true,
  },
  full: {
    descriptionTier: 3,
    showStudyProgress: true,
    showPropertiesSummary: true,
    showHabitatLabel: true,
    showVeinStatLabels: true,
    showVeinStatNumbers: true,
    showGenericItemMeta: true,
  },
};
