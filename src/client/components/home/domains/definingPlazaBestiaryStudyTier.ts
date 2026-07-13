/** Study tier ids unlocked by cumulative corpse studies on one species. */
export type PlazaBestiaryStudyTierId =
  | 'sighted'
  | 'studied'
  | 'combat'
  | 'procs'
  | 'ecology'
  | 'full'
  | 'playable';

/** Minimum studies required to reach each study tier. */
export const DEFINING_PLAZA_BESTIARY_STUDY_TIER_THRESHOLDS: Record<
  PlazaBestiaryStudyTierId,
  number
> = {
  sighted: 0,
  studied: 1,
  combat: 10,
  procs: 20,
  ecology: 50,
  full: 75,
  playable: 100,
};

/** Ordered tiers from lowest to highest unlock. */
export const DEFINING_PLAZA_BESTIARY_STUDY_TIER_ORDER: readonly PlazaBestiaryStudyTierId[] =
  ['sighted', 'studied', 'combat', 'procs', 'ecology', 'full', 'playable'];

/** Max study count shown in progress UI (playable unlock). */
export const DEFINING_PLAZA_BESTIARY_STUDY_FULL_COUNT =
  DEFINING_PLAZA_BESTIARY_STUDY_TIER_THRESHOLDS.playable;

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
  playable: 'mdi:book-check-outline',
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
  playable: 'Playable form',
};

/** One-line teasers shown before a tier unlocks. */
export const LABELING_PLAZA_BESTIARY_STUDY_TIER_TEASERS: Record<
  Exclude<PlazaBestiaryStudyTierId, 'sighted'>,
  string
> = {
  studied: 'Study one corpse to unlock temperament, diet, and fuller notes.',
  combat: 'Study 10 corpses to reveal combat stats.',
  procs: 'Study 20 corpses to learn attack effects.',
  ecology: 'Study 50 corpses to reveal ecology and hunting behavior.',
  full: 'Study 75 corpses for loot, disease risk, and the full dossier.',
  playable: 'Study 100 corpses to unlock this species as a playable character.',
};

/** Unlocked copy for the playable-form section. */
export const LABELING_PLAZA_BESTIARY_PLAYABLE_UNLOCKED =
  'Unlocked. Choose this species in the Character selector.' as const;
