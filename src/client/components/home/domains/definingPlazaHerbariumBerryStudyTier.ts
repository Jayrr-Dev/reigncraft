import {
  DEFINING_PLAZA_HERBARIUM_FLOWER_STUDY_FULL_COUNT,
  DEFINING_PLAZA_HERBARIUM_FLOWER_STUDY_TIER_BOOK_ICONS,
  DEFINING_PLAZA_HERBARIUM_FLOWER_STUDY_TIER_ORDER,
  DEFINING_PLAZA_HERBARIUM_FLOWER_STUDY_TIER_THRESHOLDS,
  type PlazaHerbariumFlowerStudyTierId,
} from '@/components/home/domains/definingPlazaHerbariumFlowerStudyTier';

/** Berry study reuses the flower tier ids and thresholds (0/1/5/15/100). */
export type PlazaHerbariumBerryStudyTierId = PlazaHerbariumFlowerStudyTierId;

/** Minimum Study points required to reach each berry study tier. */
export const DEFINING_PLAZA_HERBARIUM_BERRY_STUDY_TIER_THRESHOLDS =
  DEFINING_PLAZA_HERBARIUM_FLOWER_STUDY_TIER_THRESHOLDS;

/** Ordered berry tiers from lowest to highest unlock. */
export const DEFINING_PLAZA_HERBARIUM_BERRY_STUDY_TIER_ORDER =
  DEFINING_PLAZA_HERBARIUM_FLOWER_STUDY_TIER_ORDER;

/** Max berry study count shown in progress UI. */
export const DEFINING_PLAZA_HERBARIUM_BERRY_STUDY_FULL_COUNT =
  DEFINING_PLAZA_HERBARIUM_FLOWER_STUDY_FULL_COUNT;

/** Book icons by highest unlocked berry study tier. */
export const DEFINING_PLAZA_HERBARIUM_BERRY_STUDY_TIER_BOOK_ICONS =
  DEFINING_PLAZA_HERBARIUM_FLOWER_STUDY_TIER_BOOK_ICONS;

/** Player-facing section titles for each berry tier block. */
export const LABELING_PLAZA_HERBARIUM_BERRY_STUDY_TIER_SECTION_TITLES: Record<
  Exclude<PlazaHerbariumBerryStudyTierId, 'sighted'>,
  string
> = {
  fieldNotes: 'Field notes',
  properties: 'Properties',
  habitats: 'Habitats',
  full: 'Full dossier',
};

/** One-line teasers shown before a berry tier unlocks. */
export const LABELING_PLAZA_HERBARIUM_BERRY_STUDY_TIER_TEASERS: Record<
  Exclude<PlazaHerbariumBerryStudyTierId, 'sighted'>,
  string
> = {
  fieldNotes: 'Pick one specimen to unlock field notes.',
  properties: 'Study 5 specimens to reveal what it does when gathered.',
  habitats: 'Study 15 specimens to reveal where it grows.',
  full: 'Study 100 specimens for the full dossier.',
};
