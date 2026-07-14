/** Study tier ids unlocked by cumulative Study on one ore species. */
export type PlazaLapidaryStudyTierId =
  | 'sighted'
  | 'fieldNotes'
  | 'properties'
  | 'habitats'
  | 'full';

/** Minimum Study points required to reach each study tier. */
export const DEFINING_PLAZA_LAPIDARY_STUDY_TIER_THRESHOLDS: Record<
  PlazaLapidaryStudyTierId,
  number
> = {
  sighted: 0,
  fieldNotes: 1,
  properties: 5,
  habitats: 15,
  full: 25,
};

/** Ordered tiers from lowest to highest unlock. */
export const DEFINING_PLAZA_LAPIDARY_STUDY_TIER_ORDER: readonly PlazaLapidaryStudyTierId[] =
  ['sighted', 'fieldNotes', 'properties', 'habitats', 'full'];

/** Max study count shown in progress UI (full dossier unlock). */
export const DEFINING_PLAZA_LAPIDARY_STUDY_FULL_COUNT =
  DEFINING_PLAZA_LAPIDARY_STUDY_TIER_THRESHOLDS.full;

/** Book icons by highest unlocked study tier. */
export const DEFINING_PLAZA_LAPIDARY_STUDY_TIER_BOOK_ICONS: Record<
  PlazaLapidaryStudyTierId,
  string
> = {
  sighted: 'mdi:book-outline',
  fieldNotes: 'mdi:book-open-page-variant',
  properties: 'mdi:book-open-page-variant',
  habitats: 'mdi:book-open-page-variant',
  full: 'mdi:book-check-outline',
};

/** Player-facing section titles for each tier block on the detail page. */
export const LABELING_PLAZA_LAPIDARY_STUDY_TIER_SECTION_TITLES: Record<
  Exclude<PlazaLapidaryStudyTierId, 'sighted'>,
  string
> = {
  fieldNotes: 'Field notes',
  properties: 'Properties',
  habitats: 'Habitats',
  full: 'Full dossier',
};

/** One-line teasers shown before a tier unlocks. */
export const LABELING_PLAZA_LAPIDARY_STUDY_TIER_TEASERS: Record<
  Exclude<PlazaLapidaryStudyTierId, 'sighted'>,
  string
> = {
  fieldNotes: 'Mine one ore chunk or study one specimen to unlock field notes.',
  properties: 'Study 5 specimens to reveal how the ore is worked.',
  habitats: 'Study 15 specimens to reveal where veins turn up.',
  full: 'Study 25 specimens for full vein odds and raw numbers.',
};
