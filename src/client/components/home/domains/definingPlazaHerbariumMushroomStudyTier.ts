/**
 * Legacy Herbarium mushroom study tier ids (shim over flower / unified ladder).
 *
 * @module components/home/domains/definingPlazaHerbariumMushroomStudyTier
 */

import {
  DEFINING_PLAZA_HERBARIUM_FLOWER_STUDY_FULL_COUNT,
  DEFINING_PLAZA_HERBARIUM_FLOWER_STUDY_TIER_BOOK_ICONS,
  DEFINING_PLAZA_HERBARIUM_FLOWER_STUDY_TIER_ORDER,
  DEFINING_PLAZA_HERBARIUM_FLOWER_STUDY_TIER_THRESHOLDS,
  DEFINING_PLAZA_HERBARIUM_FLOWER_STUDY_TIER_TO_CODEX,
  LABELING_PLAZA_HERBARIUM_FLOWER_STUDY_TIER_SECTION_TITLES,
  LABELING_PLAZA_HERBARIUM_FLOWER_STUDY_TIER_TEASERS,
  type PlazaHerbariumFlowerStudyTierId,
} from '@/components/home/domains/definingPlazaHerbariumFlowerStudyTier';

/** @deprecated Prefer PlazaCodexStudyTierId. Kept for existing call sites. */
export type PlazaHerbariumMushroomStudyTierId = PlazaHerbariumFlowerStudyTierId;

/** Maps legacy mushroom tier ids onto the unified ladder. */
export const DEFINING_PLAZA_HERBARIUM_MUSHROOM_STUDY_TIER_TO_CODEX =
  DEFINING_PLAZA_HERBARIUM_FLOWER_STUDY_TIER_TO_CODEX;

/** Minimum Study points required to reach each mushroom study tier. */
export const DEFINING_PLAZA_HERBARIUM_MUSHROOM_STUDY_TIER_THRESHOLDS =
  DEFINING_PLAZA_HERBARIUM_FLOWER_STUDY_TIER_THRESHOLDS;

/** Ordered mushroom tiers from lowest to highest unlock. */
export const DEFINING_PLAZA_HERBARIUM_MUSHROOM_STUDY_TIER_ORDER =
  DEFINING_PLAZA_HERBARIUM_FLOWER_STUDY_TIER_ORDER;

/** Max mushroom study count shown in progress UI. */
export const DEFINING_PLAZA_HERBARIUM_MUSHROOM_STUDY_FULL_COUNT =
  DEFINING_PLAZA_HERBARIUM_FLOWER_STUDY_FULL_COUNT;

/** Book icons by highest unlocked mushroom study tier. */
export const DEFINING_PLAZA_HERBARIUM_MUSHROOM_STUDY_TIER_BOOK_ICONS =
  DEFINING_PLAZA_HERBARIUM_FLOWER_STUDY_TIER_BOOK_ICONS;

/** Player-facing section titles for each mushroom tier block. */
export const LABELING_PLAZA_HERBARIUM_MUSHROOM_STUDY_TIER_SECTION_TITLES =
  LABELING_PLAZA_HERBARIUM_FLOWER_STUDY_TIER_SECTION_TITLES;

/** One-line teasers shown before a mushroom tier unlocks. */
export const LABELING_PLAZA_HERBARIUM_MUSHROOM_STUDY_TIER_TEASERS =
  LABELING_PLAZA_HERBARIUM_FLOWER_STUDY_TIER_TEASERS;
