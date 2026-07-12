/**
 * Sprite-sheet cells for plaza hunger-tier drumstick icons (action bar orb).
 *
 * @module components/world/hunger/domains/definingWorldPlazaHungerTierSpriteSheetConstants
 */

import type { DefiningWorldPlazaHungerTier } from '@/components/world/hunger/domains/definingWorldPlazaHungerConstants';

/** 5×1 sheet: well_fed → starving, left → right. */
export const DEFINING_WORLD_PLAZA_HUNGER_TIER_SPRITE_SHEET_URL =
  '/hunger/sprites/hunger-tier-sprites.webp' as const;

export const DEFINING_WORLD_PLAZA_HUNGER_TIER_SPRITE_SHEET_COLUMN_COUNT = 5;
export const DEFINING_WORLD_PLAZA_HUNGER_TIER_SPRITE_SHEET_ROW_COUNT = 1;

/** Column index per hunger tier (matches sheet order). */
export const DEFINING_WORLD_PLAZA_HUNGER_TIER_SPRITE_COLUMN_INDEX: Record<
  DefiningWorldPlazaHungerTier,
  number
> = {
  well_fed: 0,
  content: 1,
  peckish: 2,
  hungry: 3,
  starving: 4,
};
