/** Study tier ids for clover entries in the Herbarium (shared progress pool). */
export type PlazaHerbariumCloverStudyTierId =
  | 'sighted'
  | 'fieldNotes'
  | 'properties'
  | 'habitats'
  | 'fiveLeaf'
  | 'full';

/** Minimum Study points required to reach each clover study tier. */
export const DEFINING_PLAZA_HERBARIUM_CLOVER_STUDY_TIER_THRESHOLDS: Record<
  PlazaHerbariumCloverStudyTierId,
  number
> = {
  sighted: 0,
  fieldNotes: 1,
  properties: 5,
  habitats: 15,
  /** Five-leaf charm details unlock. */
  fiveLeaf: 500,
  /** Four-leaf numbers + six-leaf surprise details unlock. */
  full: 1000,
};

/** Ordered clover tiers from lowest to highest unlock. */
export const DEFINING_PLAZA_HERBARIUM_CLOVER_STUDY_TIER_ORDER: readonly PlazaHerbariumCloverStudyTierId[] =
  ['sighted', 'fieldNotes', 'properties', 'habitats', 'fiveLeaf', 'full'];

/** Max combined clover study count shown in progress UI. */
export const DEFINING_PLAZA_HERBARIUM_CLOVER_STUDY_FULL_COUNT =
  DEFINING_PLAZA_HERBARIUM_CLOVER_STUDY_TIER_THRESHOLDS.full;

/** Study count that unlocks five-leaf Lucky potency details. */
export const DEFINING_PLAZA_HERBARIUM_CLOVER_STUDY_FIVE_LEAF_DETAILS_COUNT =
  DEFINING_PLAZA_HERBARIUM_CLOVER_STUDY_TIER_THRESHOLDS.fiveLeaf;

/** Book icons by highest unlocked clover study tier. */
export const DEFINING_PLAZA_HERBARIUM_CLOVER_STUDY_TIER_BOOK_ICONS: Record<
  PlazaHerbariumCloverStudyTierId,
  string
> = {
  sighted: 'mdi:book-outline',
  fieldNotes: 'mdi:book-open-page-variant',
  properties: 'mdi:book-open-page-variant',
  habitats: 'mdi:book-open-page-variant',
  fiveLeaf: 'mdi:book-open-page-variant',
  full: 'mdi:book-check-outline',
};

/** Player-facing section titles for each clover tier block. */
export const LABELING_PLAZA_HERBARIUM_CLOVER_STUDY_TIER_SECTION_TITLES: Record<
  Exclude<PlazaHerbariumCloverStudyTierId, 'sighted'>,
  string
> = {
  fieldNotes: 'Field notes',
  properties: 'Properties',
  habitats: 'Habitats',
  fiveLeaf: 'Five-leaf notes',
  full: 'Full dossier',
};

/** One-line teasers shown before a clover tier unlocks. */
export const LABELING_PLAZA_HERBARIUM_CLOVER_STUDY_TIER_TEASERS: Record<
  Exclude<PlazaHerbariumCloverStudyTierId, 'sighted'>,
  string
> = {
  fieldNotes: 'Search long grass once to unlock field notes.',
  properties: 'Study 5 clovers to reveal what each leaf might do.',
  habitats: 'Study 15 clovers to reveal where they hide.',
  fiveLeaf: 'Study 500 clovers to learn what a five-leaf charm does.',
  full: 'Study 1000 clovers for full charm numbers and six-leaf secrets.',
};
