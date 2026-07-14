/** Study tier ids for flower species in the Herbarium. */
export type PlazaHerbariumFlowerStudyTierId =
  | 'sighted'
  | 'fieldNotes'
  | 'properties'
  | 'habitats'
  | 'full';

/** Minimum Study points required to reach each flower study tier. */
export const DEFINING_PLAZA_HERBARIUM_FLOWER_STUDY_TIER_THRESHOLDS: Record<
  PlazaHerbariumFlowerStudyTierId,
  number
> = {
  sighted: 0,
  fieldNotes: 1,
  properties: 5,
  habitats: 15,
  full: 100,
};

/** Ordered flower tiers from lowest to highest unlock. */
export const DEFINING_PLAZA_HERBARIUM_FLOWER_STUDY_TIER_ORDER: readonly PlazaHerbariumFlowerStudyTierId[] =
  ['sighted', 'fieldNotes', 'properties', 'habitats', 'full'];

/** Max flower study count shown in progress UI. */
export const DEFINING_PLAZA_HERBARIUM_FLOWER_STUDY_FULL_COUNT =
  DEFINING_PLAZA_HERBARIUM_FLOWER_STUDY_TIER_THRESHOLDS.full;

/** Book icons by highest unlocked flower study tier. */
export const DEFINING_PLAZA_HERBARIUM_FLOWER_STUDY_TIER_BOOK_ICONS: Record<
  PlazaHerbariumFlowerStudyTierId,
  string
> = {
  sighted: 'mdi:book-outline',
  fieldNotes: 'mdi:book-open-page-variant',
  properties: 'mdi:book-open-page-variant',
  habitats: 'mdi:book-open-page-variant',
  full: 'mdi:book-check-outline',
};

/** Player-facing section titles for each flower tier block. */
export const LABELING_PLAZA_HERBARIUM_FLOWER_STUDY_TIER_SECTION_TITLES: Record<
  Exclude<PlazaHerbariumFlowerStudyTierId, 'sighted'>,
  string
> = {
  fieldNotes: 'Field notes',
  properties: 'Properties',
  habitats: 'Habitats',
  full: 'Full dossier',
};

/** One-line teasers shown before a flower tier unlocks. */
export const LABELING_PLAZA_HERBARIUM_FLOWER_STUDY_TIER_TEASERS: Record<
  Exclude<PlazaHerbariumFlowerStudyTierId, 'sighted'>,
  string
> = {
  fieldNotes: 'Pick one specimen to unlock field notes.',
  properties: 'Study 5 specimens to reveal what it does when eaten.',
  habitats: 'Study 15 specimens to reveal where it grows.',
  full: 'Study 100 specimens for full effects and raw numbers.',
};
