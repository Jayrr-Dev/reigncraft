/**
 * Study-gated reveal flags for clover inspect UI.
 *
 * Combined clover study (three-leaf + four-leaf) gates four-leaf Lucky details.
 *
 * @module components/world/inventory/domains/definingWorldPlazaInventoryCloverDetailRevealConstants
 */

import type { PlazaHerbariumCloverStudyTierId } from '@/components/home/domains/definingPlazaHerbariumCloverStudyTier';

/** Which clover inspect fields are visible at one knowledge tier. */
export type DefiningWorldPlazaInventoryCloverDetailReveal = {
  readonly descriptionTier: 0 | 1 | 2 | 3;
  readonly showStudyProgress: boolean;
  readonly showPropertiesSummary: boolean;
  readonly showLuckyEffectLabels: boolean;
  readonly showLuckyEffectNumbers: boolean;
  readonly showGenericItemMeta: boolean;
};

export const DEFINING_WORLD_PLAZA_INVENTORY_CLOVER_DETAIL_REVEAL_BY_TIER: Readonly<
  Record<
    PlazaHerbariumCloverStudyTierId,
    DefiningWorldPlazaInventoryCloverDetailReveal
  >
> = {
  sighted: {
    descriptionTier: 0,
    showStudyProgress: true,
    showPropertiesSummary: false,
    showLuckyEffectLabels: false,
    showLuckyEffectNumbers: false,
    showGenericItemMeta: true,
  },
  fieldNotes: {
    descriptionTier: 1,
    showStudyProgress: true,
    showPropertiesSummary: false,
    showLuckyEffectLabels: false,
    showLuckyEffectNumbers: false,
    showGenericItemMeta: true,
  },
  properties: {
    descriptionTier: 2,
    showStudyProgress: true,
    showPropertiesSummary: true,
    showLuckyEffectLabels: false,
    showLuckyEffectNumbers: false,
    showGenericItemMeta: true,
  },
  habitats: {
    descriptionTier: 3,
    showStudyProgress: true,
    showPropertiesSummary: true,
    showLuckyEffectLabels: true,
    showLuckyEffectNumbers: false,
    showGenericItemMeta: true,
  },
  full: {
    descriptionTier: 3,
    showStudyProgress: true,
    showPropertiesSummary: true,
    showLuckyEffectLabels: true,
    showLuckyEffectNumbers: true,
    showGenericItemMeta: true,
  },
};
