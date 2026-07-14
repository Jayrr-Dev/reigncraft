/** Study tier ids for clover entries in the Herbarium (shared progress pool). */
export type PlazaHerbariumCloverStudyTierId =
  | 'sighted'
  | 'fieldNotes'
  | 'properties'
  | 'habitats'
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
  full: 100,
};

/** Ordered clover tiers from lowest to highest unlock. */
export const DEFINING_PLAZA_HERBARIUM_CLOVER_STUDY_TIER_ORDER: readonly PlazaHerbariumCloverStudyTierId[] =
  ['sighted', 'fieldNotes', 'properties', 'habitats', 'full'];

/** Max combined clover study count shown in progress UI. */
export const DEFINING_PLAZA_HERBARIUM_CLOVER_STUDY_FULL_COUNT =
  DEFINING_PLAZA_HERBARIUM_CLOVER_STUDY_TIER_THRESHOLDS.full;

/** Book icons by highest unlocked clover study tier. */
export const DEFINING_PLAZA_HERBARIUM_CLOVER_STUDY_TIER_BOOK_ICONS: Record<
  PlazaHerbariumCloverStudyTierId,
  string
> = {
  sighted: 'mdi:book-outline',
  fieldNotes: 'mdi:book-open-page-variant',
  properties: 'mdi:book-open-page-variant',
  habitats: 'mdi:book-open-page-variant',
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
  full: 'Full dossier',
};

/** One-line teasers shown before a clover tier unlocks. */
export const LABELING_PLAZA_HERBARIUM_CLOVER_STUDY_TIER_TEASERS: Record<
  Exclude<PlazaHerbariumCloverStudyTierId, 'sighted'>,
  string
> = {
  fieldNotes: 'Needs more study....',
  properties: 'Needs more study....',
  habitats: 'Needs more study....',
  full: 'Needs more study....',
};
