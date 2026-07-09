/** Study tier ids unlocked by cumulative corpse studies on one species. */
export type PlazaBestiaryStudyTierId =
  | 'sighted'
  | 'studied'
  | 'combat'
  | 'procs'
  | 'ecology'
  | 'full';

/** Minimum studies required to reach each study tier. */
export const DEFINING_PLAZA_BESTIARY_STUDY_TIER_THRESHOLDS: Record<
  PlazaBestiaryStudyTierId,
  number
> = {
  sighted: 0,
  studied: 1,
  combat: 10,
  procs: 50,
  ecology: 100,
  full: 200,
};

/** Ordered tiers from lowest to highest unlock. */
export const DEFINING_PLAZA_BESTIARY_STUDY_TIER_ORDER: readonly PlazaBestiaryStudyTierId[] =
  ['sighted', 'studied', 'combat', 'procs', 'ecology', 'full'];

/** Max study count shown in progress UI (full dossier). */
export const DEFINING_PLAZA_BESTIARY_STUDY_FULL_COUNT =
  DEFINING_PLAZA_BESTIARY_STUDY_TIER_THRESHOLDS.full;

/** Book icons by highest unlocked study tier. */
export const DEFINING_PLAZA_BESTIARY_STUDY_TIER_BOOK_ICONS: Record<
  PlazaBestiaryStudyTierId,
  string
> = {
  sighted: 'mdi:book-outline',
  studied: 'mdi:book-open-page-variant',
  combat: 'mdi:book-open-page-variant',
  procs: 'mdi:book-open-page-variant',
  ecology: 'mdi:book-open-page-variant',
  full: 'mdi:book-check-outline',
};

/** Player-facing section titles for each tier block on the detail page. */
export const LABELING_PLAZA_BESTIARY_STUDY_TIER_SECTION_TITLES: Record<
  Exclude<PlazaBestiaryStudyTierId, 'sighted'>,
  string
> = {
  studied: 'Field notes',
  combat: 'Combat',
  procs: 'Attack effects',
  ecology: 'Ecology',
  full: 'Loot and risk',
};

/** One-line teasers shown before a tier unlocks. */
export const LABELING_PLAZA_BESTIARY_STUDY_TIER_TEASERS: Record<
  Exclude<PlazaBestiaryStudyTierId, 'sighted'>,
  string
> = {
  studied: 'Study one corpse to unlock temperament, diet, and fuller notes.',
  combat: 'Study 10 corpses to reveal combat stats.',
  procs: 'Study 50 corpses to learn attack effects.',
  ecology: 'Study 100 corpses to reveal ecology and hunting behavior.',
  full: 'Study 200 corpses for loot, disease risk, and the full dossier.',
};
