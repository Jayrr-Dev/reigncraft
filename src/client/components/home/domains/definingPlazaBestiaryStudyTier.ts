/** Study tier ids unlocked by cumulative kills on one species. */
export type PlazaBestiaryStudyTierId =
  | 'sighted'
  | 'studied'
  | 'combat'
  | 'procs'
  | 'ecology'
  | 'full';

/** Minimum kills required to reach each study tier. */
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
  studied: 'Kill one to unlock temperament, diet, and fuller notes.',
  combat: 'Kill 10 to reveal combat stats.',
  procs: 'Kill 50 to learn attack effects.',
  ecology: 'Kill 100 to reveal ecology and hunting behavior.',
  full: 'Kill 200 for loot, disease risk, and the full dossier.',
};
