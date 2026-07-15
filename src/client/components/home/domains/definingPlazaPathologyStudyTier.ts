/**
 * Legacy Pathology study tier ids (shim over unified codex ladder).
 *
 * @module components/home/domains/definingPlazaPathologyStudyTier
 */

import {
  DEFINING_PLAZA_CODEX_STUDY_BASE_THRESHOLDS,
  DEFINING_PLAZA_CODEX_STUDY_FULL_COUNT,
  DEFINING_PLAZA_CODEX_STUDY_TIER_BOOK_ICONS,
  LABELING_PLAZA_CODEX_STUDY_DEFAULT_TEASERS,
  type PlazaCodexStudyTierId,
} from '@/components/home/domains/definingPlazaCodexStudyTier';
import { labelingPlazaCodexStudySectionTitle } from '@/components/home/domains/definingPlazaCodexStudyTrackRegistry';

/** @deprecated Prefer PlazaCodexStudyTierId. Kept for existing call sites. */
export type PlazaPathologyStudyTierId =
  | 'sighted'
  | 'fieldNotes'
  | 'properties'
  | 'habitats'
  | 'full';

/**
 * Maps legacy pathology tier ids onto the unified ladder.
 * Points still come from infection hours plus linked creature Study.
 */
export const DEFINING_PLAZA_PATHOLOGY_STUDY_TIER_TO_CODEX: Record<
  PlazaPathologyStudyTierId,
  PlazaCodexStudyTierId
> = {
  sighted: 'awareness',
  fieldNotes: 'understanding',
  properties: 'application',
  habitats: 'proficiency',
  full: 'mastery',
};

/**
 * Minimum Pathology study points required to reach each tier.
 * Points come from infection hours (1 per in-game hour) plus linked creature
 * Study: floor(linkedCreatureStudies / 3).
 */
export const DEFINING_PLAZA_PATHOLOGY_STUDY_TIER_THRESHOLDS: Record<
  PlazaPathologyStudyTierId,
  number
> = {
  sighted:
    DEFINING_PLAZA_CODEX_STUDY_BASE_THRESHOLDS[
      DEFINING_PLAZA_PATHOLOGY_STUDY_TIER_TO_CODEX.sighted
    ],
  fieldNotes:
    DEFINING_PLAZA_CODEX_STUDY_BASE_THRESHOLDS[
      DEFINING_PLAZA_PATHOLOGY_STUDY_TIER_TO_CODEX.fieldNotes
    ],
  properties:
    DEFINING_PLAZA_CODEX_STUDY_BASE_THRESHOLDS[
      DEFINING_PLAZA_PATHOLOGY_STUDY_TIER_TO_CODEX.properties
    ],
  habitats:
    DEFINING_PLAZA_CODEX_STUDY_BASE_THRESHOLDS[
      DEFINING_PLAZA_PATHOLOGY_STUDY_TIER_TO_CODEX.habitats
    ],
  full: DEFINING_PLAZA_CODEX_STUDY_BASE_THRESHOLDS[
    DEFINING_PLAZA_PATHOLOGY_STUDY_TIER_TO_CODEX.full
  ],
};

/** Ordered tiers from lowest to highest unlock. */
export const DEFINING_PLAZA_PATHOLOGY_STUDY_TIER_ORDER: readonly PlazaPathologyStudyTierId[] =
  ['sighted', 'fieldNotes', 'properties', 'habitats', 'full'];

/** Max study count shown in progress UI (full dossier unlock). */
export const DEFINING_PLAZA_PATHOLOGY_STUDY_FULL_COUNT =
  DEFINING_PLAZA_CODEX_STUDY_FULL_COUNT;

/** Book icons by highest unlocked study tier. */
export const DEFINING_PLAZA_PATHOLOGY_STUDY_TIER_BOOK_ICONS: Record<
  PlazaPathologyStudyTierId,
  string
> = {
  sighted:
    DEFINING_PLAZA_CODEX_STUDY_TIER_BOOK_ICONS[
      DEFINING_PLAZA_PATHOLOGY_STUDY_TIER_TO_CODEX.sighted
    ],
  fieldNotes:
    DEFINING_PLAZA_CODEX_STUDY_TIER_BOOK_ICONS[
      DEFINING_PLAZA_PATHOLOGY_STUDY_TIER_TO_CODEX.fieldNotes
    ],
  properties:
    DEFINING_PLAZA_CODEX_STUDY_TIER_BOOK_ICONS[
      DEFINING_PLAZA_PATHOLOGY_STUDY_TIER_TO_CODEX.properties
    ],
  habitats:
    DEFINING_PLAZA_CODEX_STUDY_TIER_BOOK_ICONS[
      DEFINING_PLAZA_PATHOLOGY_STUDY_TIER_TO_CODEX.habitats
    ],
  full: DEFINING_PLAZA_CODEX_STUDY_TIER_BOOK_ICONS[
    DEFINING_PLAZA_PATHOLOGY_STUDY_TIER_TO_CODEX.full
  ],
};

/** Player-facing section titles for each tier block on the detail page. */
export const LABELING_PLAZA_PATHOLOGY_STUDY_TIER_SECTION_TITLES: Record<
  Exclude<PlazaPathologyStudyTierId, 'sighted'>,
  string
> = {
  fieldNotes: labelingPlazaCodexStudySectionTitle('pathology', 'understanding'),
  properties: labelingPlazaCodexStudySectionTitle('pathology', 'application'),
  habitats: labelingPlazaCodexStudySectionTitle('pathology', 'proficiency'),
  full: labelingPlazaCodexStudySectionTitle('pathology', 'mastery'),
};

/** One-line teasers shown before a tier unlocks. */
export const LABELING_PLAZA_PATHOLOGY_STUDY_TIER_TEASERS: Record<
  Exclude<PlazaPathologyStudyTierId, 'sighted'>,
  string
> = {
  fieldNotes: LABELING_PLAZA_CODEX_STUDY_DEFAULT_TEASERS.understanding,
  properties: LABELING_PLAZA_CODEX_STUDY_DEFAULT_TEASERS.application,
  habitats: LABELING_PLAZA_CODEX_STUDY_DEFAULT_TEASERS.proficiency,
  full: LABELING_PLAZA_CODEX_STUDY_DEFAULT_TEASERS.mastery,
};
