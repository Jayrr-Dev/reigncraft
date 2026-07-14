/** Study tier ids unlocked by Pathology points on one disease entry. */
export type PlazaPathologyStudyTierId =
  | 'sighted'
  | 'fieldNotes'
  | 'properties'
  | 'habitats'
  | 'full';

/**
 * Minimum Pathology study points required to reach each tier.
 * Points come from infection hours (1 per in-game hour) plus linked creature
 * Study: floor(linkedCreatureStudies / 3).
 */
export const DEFINING_PLAZA_PATHOLOGY_STUDY_TIER_THRESHOLDS: Record<
  PlazaPathologyStudyTierId,
  number
> = {
  sighted: 0,
  fieldNotes: 1,
  properties: 5,
  habitats: 15,
  full: 25,
};

/** Ordered tiers from lowest to highest unlock. */
export const DEFINING_PLAZA_PATHOLOGY_STUDY_TIER_ORDER: readonly PlazaPathologyStudyTierId[] =
  ['sighted', 'fieldNotes', 'properties', 'habitats', 'full'];

/** Max study count shown in progress UI (full dossier unlock). */
export const DEFINING_PLAZA_PATHOLOGY_STUDY_FULL_COUNT =
  DEFINING_PLAZA_PATHOLOGY_STUDY_TIER_THRESHOLDS.full;

/** Book icons by highest unlocked study tier. */
export const DEFINING_PLAZA_PATHOLOGY_STUDY_TIER_BOOK_ICONS: Record<
  PlazaPathologyStudyTierId,
  string
> = {
  sighted: 'mdi:book-outline',
  fieldNotes: 'mdi:book-open-page-variant',
  properties: 'mdi:book-open-page-variant',
  habitats: 'mdi:book-open-page-variant',
  full: 'mdi:book-check-outline',
};

/** Player-facing section titles for each tier block on the detail page. */
export const LABELING_PLAZA_PATHOLOGY_STUDY_TIER_SECTION_TITLES: Record<
  Exclude<PlazaPathologyStudyTierId, 'sighted'>,
  string
> = {
  fieldNotes: 'Field notes',
  properties: 'Symptoms',
  habitats: 'Carriers',
  full: 'Full dossier',
};

/** One-line teasers shown before a tier unlocks. */
export const LABELING_PLAZA_PATHOLOGY_STUDY_TIER_TEASERS: Record<
  Exclude<PlazaPathologyStudyTierId, 'sighted'>,
  string
> = {
  fieldNotes:
    'Earn 1 Pathology point (1 in-game hour infected, or 3 linked creature studies) to unlock field notes.',
  properties:
    'Earn 5 Pathology points to reveal the symptom stages.',
  habitats:
    'Earn 15 Pathology points to list the creatures that carry it.',
  full: 'Earn 25 Pathology points for incubation windows and the full dossier.',
};
