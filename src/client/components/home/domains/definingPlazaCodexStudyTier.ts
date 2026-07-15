/**
 * Unified study tier ladder for all codex items (not biomes).
 *
 * @module components/home/domains/definingPlazaCodexStudyTier
 */

/** Progressive knowledge tiers unlocked by cumulative study on one codex entry. */
export type PlazaCodexStudyTierId =
  | 'awareness'
  | 'familiarity'
  | 'understanding'
  | 'application'
  | 'proficiency'
  | 'expertise'
  | 'mastery';

/** Base study counts before per-track or per-entry scale multipliers. */
export const DEFINING_PLAZA_CODEX_STUDY_BASE_THRESHOLDS: Record<
  PlazaCodexStudyTierId,
  number
> = {
  awareness: 0,
  familiarity: 1,
  understanding: 5,
  application: 20,
  proficiency: 50,
  expertise: 75,
  mastery: 100,
};

/** Default scale when a track or entry does not override. */
export const DEFINING_PLAZA_CODEX_STUDY_DEFAULT_MULTIPLIER = 1;

/** Ordered tiers from lowest to highest unlock. */
export const DEFINING_PLAZA_CODEX_STUDY_TIER_ORDER: readonly PlazaCodexStudyTierId[] =
  [
    'awareness',
    'familiarity',
    'understanding',
    'application',
    'proficiency',
    'expertise',
    'mastery',
  ];

/** Full study count at default multiplier (mastery threshold). */
export const DEFINING_PLAZA_CODEX_STUDY_FULL_COUNT =
  DEFINING_PLAZA_CODEX_STUDY_BASE_THRESHOLDS.mastery;

/** Player-facing awareness labels for the current knowledge tier. */
export const LABELING_PLAZA_CODEX_STUDY_AWARENESS: Record<
  PlazaCodexStudyTierId,
  string
> = {
  awareness: 'Awareness',
  familiarity: 'Familiarity',
  understanding: 'Understanding',
  application: 'Application',
  proficiency: 'Proficiency',
  expertise: 'Expertise',
  mastery: 'Mastery',
};

/** Book icons by highest unlocked study tier. */
export const DEFINING_PLAZA_CODEX_STUDY_TIER_BOOK_ICONS: Record<
  PlazaCodexStudyTierId,
  string
> = {
  awareness: 'mdi:book-outline',
  familiarity: 'mdi:book-open-page-variant',
  understanding: 'mdi:book-open-page-variant',
  application: 'mdi:book-open-page-variant',
  proficiency: 'mdi:book-open-page-variant',
  expertise: 'mdi:book-open-page-variant',
  mastery: 'mdi:book-check-outline',
};

/** Default section titles for tiers that unlock authored or computed blocks. */
export const LABELING_PLAZA_CODEX_STUDY_DEFAULT_SECTION_TITLES: Record<
  Exclude<PlazaCodexStudyTierId, 'awareness' | 'familiarity'>,
  string
> = {
  understanding: 'Field notes',
  application: 'Observed effects',
  proficiency: 'Properties',
  expertise: 'Mechanics',
  mastery: 'Full dossier',
};

/** One-line teasers shown before a tier unlocks. */
export const LABELING_PLAZA_CODEX_STUDY_DEFAULT_TEASERS: Record<
  Exclude<PlazaCodexStudyTierId, 'awareness' | 'familiarity'>,
  string
> = {
  understanding: 'Needs more study....',
  application: 'Needs more study....',
  proficiency: 'Needs more study....',
  expertise: 'Needs more study....',
  mastery: 'Needs more study....',
};

/** Tiers that render a titled section on codex detail pages. */
export type PlazaCodexStudyDetailSectionTierId = Exclude<
  PlazaCodexStudyTierId,
  'awareness' | 'familiarity'
>;
