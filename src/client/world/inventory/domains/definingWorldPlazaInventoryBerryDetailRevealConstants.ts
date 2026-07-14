/**
 * Study-gated reveal flags for berry and tea leaves inspect UI.
 *
 * Berries stay food (generic food badges show regardless of study), so this
 * only gates the herbarium flavor copy and forage/eaten properties line.
 *
 * @module components/world/inventory/domains/definingWorldPlazaInventoryBerryDetailRevealConstants
 */

import type { PlazaHerbariumBerryStudyTierId } from '@/components/home/domains/definingPlazaHerbariumBerryStudyTier';

/** Which berry/tea inspect fields are visible at one knowledge tier. */
export type DefiningWorldPlazaInventoryBerryDetailReveal = {
  readonly descriptionTier: 0 | 1 | 2;
  readonly showStudyProgress: boolean;
  readonly showPropertiesSummary: boolean;
  readonly showGenericItemMeta: boolean;
};

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
    showGenericItemMeta: true,
  },
  fieldNotes: {
    descriptionTier: 1,
    showStudyProgress: true,
    showPropertiesSummary: false,
    showGenericItemMeta: true,
  },
  properties: {
    descriptionTier: 2,
    showStudyProgress: true,
    showPropertiesSummary: true,
    showGenericItemMeta: true,
  },
  habitats: {
    descriptionTier: 2,
    showStudyProgress: true,
    showPropertiesSummary: true,
    showGenericItemMeta: true,
  },
  full: {
    descriptionTier: 2,
    showStudyProgress: true,
    showPropertiesSummary: true,
    showGenericItemMeta: true,
  },
};
