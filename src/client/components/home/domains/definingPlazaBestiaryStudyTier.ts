/**
 * Legacy Bestiary study tier ids (shim over unified codex ladder).
 *
 * @module components/home/domains/definingPlazaBestiaryStudyTier
 */

import {
  DEFINING_PLAZA_CODEX_STUDY_BASE_THRESHOLDS,
  DEFINING_PLAZA_CODEX_STUDY_FULL_COUNT,
  DEFINING_PLAZA_CODEX_STUDY_TIER_BOOK_ICONS,
  LABELING_PLAZA_CODEX_STUDY_DEFAULT_TEASERS,
  type PlazaCodexStudyTierId,
} from '@/components/home/domains/definingPlazaCodexStudyTier';
import {
  LABELING_PLAZA_CODEX_BESTIARY_EXTRA_SECTION_TITLES,
  labelingPlazaCodexStudySectionTitle,
} from '@/components/home/domains/definingPlazaCodexStudyTrackRegistry';

/** @deprecated Prefer PlazaCodexStudyTierId. Kept for existing call sites. */
export type PlazaBestiaryStudyTierId =
  | 'sighted'
  | 'studied'
  | 'combat'
  | 'procs'
  | 'ecology'
  | 'full'
  | 'playable';

/** Maps legacy bestiary tier ids onto the unified ladder. */
export const DEFINING_PLAZA_BESTIARY_STUDY_TIER_TO_CODEX: Record<
  PlazaBestiaryStudyTierId,
  PlazaCodexStudyTierId
> = {
  sighted: 'awareness',
  studied: 'familiarity',
  combat: 'expertise',
  procs: 'expertise',
  ecology: 'proficiency',
  full: 'mastery',
  playable: 'mastery',
};

/**
 * Maps a unified tier back onto the nearest legacy bestiary id for progress UI.
 * Extra sections (combat/procs) both gate at expertise; ecology at proficiency.
 */
export const DEFINING_PLAZA_BESTIARY_CODEX_TIER_TO_LEGACY: Record<
  PlazaCodexStudyTierId,
  PlazaBestiaryStudyTierId
> = {
  awareness: 'sighted',
  familiarity: 'studied',
  understanding: 'studied',
  application: 'studied',
  proficiency: 'ecology',
  expertise: 'procs',
  mastery: 'playable',
};

/** Minimum studies required to reach each study tier. */
export const DEFINING_PLAZA_BESTIARY_STUDY_TIER_THRESHOLDS: Record<
  PlazaBestiaryStudyTierId,
  number
> = {
  sighted:
    DEFINING_PLAZA_CODEX_STUDY_BASE_THRESHOLDS[
      DEFINING_PLAZA_BESTIARY_STUDY_TIER_TO_CODEX.sighted
    ],
  studied:
    DEFINING_PLAZA_CODEX_STUDY_BASE_THRESHOLDS[
      DEFINING_PLAZA_BESTIARY_STUDY_TIER_TO_CODEX.studied
    ],
  combat:
    DEFINING_PLAZA_CODEX_STUDY_BASE_THRESHOLDS[
      DEFINING_PLAZA_BESTIARY_STUDY_TIER_TO_CODEX.combat
    ],
  procs:
    DEFINING_PLAZA_CODEX_STUDY_BASE_THRESHOLDS[
      DEFINING_PLAZA_BESTIARY_STUDY_TIER_TO_CODEX.procs
    ],
  ecology:
    DEFINING_PLAZA_CODEX_STUDY_BASE_THRESHOLDS[
      DEFINING_PLAZA_BESTIARY_STUDY_TIER_TO_CODEX.ecology
    ],
  full: DEFINING_PLAZA_CODEX_STUDY_BASE_THRESHOLDS[
    DEFINING_PLAZA_BESTIARY_STUDY_TIER_TO_CODEX.full
  ],
  playable:
    DEFINING_PLAZA_CODEX_STUDY_BASE_THRESHOLDS[
      DEFINING_PLAZA_BESTIARY_STUDY_TIER_TO_CODEX.playable
    ],
};

/** Ordered tiers from lowest to highest unlock (legacy section order). */
export const DEFINING_PLAZA_BESTIARY_STUDY_TIER_ORDER: readonly PlazaBestiaryStudyTierId[] =
  ['sighted', 'studied', 'combat', 'procs', 'ecology', 'full', 'playable'];

/** Max study count shown in progress UI (playable unlock). */
export const DEFINING_PLAZA_BESTIARY_STUDY_FULL_COUNT =
  DEFINING_PLAZA_CODEX_STUDY_FULL_COUNT;

/** Book icons by highest unlocked study tier. */
export const DEFINING_PLAZA_BESTIARY_STUDY_TIER_BOOK_ICONS: Record<
  PlazaBestiaryStudyTierId,
  string
> = {
  sighted:
    DEFINING_PLAZA_CODEX_STUDY_TIER_BOOK_ICONS[
      DEFINING_PLAZA_BESTIARY_STUDY_TIER_TO_CODEX.sighted
    ],
  studied:
    DEFINING_PLAZA_CODEX_STUDY_TIER_BOOK_ICONS[
      DEFINING_PLAZA_BESTIARY_STUDY_TIER_TO_CODEX.studied
    ],
  combat:
    DEFINING_PLAZA_CODEX_STUDY_TIER_BOOK_ICONS[
      DEFINING_PLAZA_BESTIARY_STUDY_TIER_TO_CODEX.combat
    ],
  procs:
    DEFINING_PLAZA_CODEX_STUDY_TIER_BOOK_ICONS[
      DEFINING_PLAZA_BESTIARY_STUDY_TIER_TO_CODEX.procs
    ],
  ecology:
    DEFINING_PLAZA_CODEX_STUDY_TIER_BOOK_ICONS[
      DEFINING_PLAZA_BESTIARY_STUDY_TIER_TO_CODEX.ecology
    ],
  full: DEFINING_PLAZA_CODEX_STUDY_TIER_BOOK_ICONS[
    DEFINING_PLAZA_BESTIARY_STUDY_TIER_TO_CODEX.full
  ],
  playable:
    DEFINING_PLAZA_CODEX_STUDY_TIER_BOOK_ICONS[
      DEFINING_PLAZA_BESTIARY_STUDY_TIER_TO_CODEX.playable
    ],
};

/** Player-facing section titles for each tier block on the detail page. */
export const LABELING_PLAZA_BESTIARY_STUDY_TIER_SECTION_TITLES: Record<
  Exclude<PlazaBestiaryStudyTierId, 'sighted'>,
  string
> = {
  studied: labelingPlazaCodexStudySectionTitle('bestiary', 'understanding'),
  combat: LABELING_PLAZA_CODEX_BESTIARY_EXTRA_SECTION_TITLES.combat,
  procs: LABELING_PLAZA_CODEX_BESTIARY_EXTRA_SECTION_TITLES.attackEffects,
  ecology: LABELING_PLAZA_CODEX_BESTIARY_EXTRA_SECTION_TITLES.ecology,
  full: LABELING_PLAZA_CODEX_BESTIARY_EXTRA_SECTION_TITLES.lootAndRisk,
  playable: LABELING_PLAZA_CODEX_BESTIARY_EXTRA_SECTION_TITLES.playable,
};

/** One-line teasers shown before a tier unlocks. */
export const LABELING_PLAZA_BESTIARY_STUDY_TIER_TEASERS: Record<
  Exclude<PlazaBestiaryStudyTierId, 'sighted'>,
  string
> = {
  studied: LABELING_PLAZA_CODEX_STUDY_DEFAULT_TEASERS.understanding,
  combat: LABELING_PLAZA_CODEX_STUDY_DEFAULT_TEASERS.expertise,
  procs: LABELING_PLAZA_CODEX_STUDY_DEFAULT_TEASERS.expertise,
  ecology: LABELING_PLAZA_CODEX_STUDY_DEFAULT_TEASERS.proficiency,
  full: LABELING_PLAZA_CODEX_STUDY_DEFAULT_TEASERS.mastery,
  playable: LABELING_PLAZA_CODEX_STUDY_DEFAULT_TEASERS.mastery,
};

/** Unlocked copy for the playable-form section. */
export const LABELING_PLAZA_BESTIARY_PLAYABLE_UNLOCKED =
  'Unlocked. Choose this species in the Character selector.';
