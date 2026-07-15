/**
 * Legacy Lapidary study tier ids (shim over unified codex ladder).
 *
 * @module components/home/domains/definingPlazaLapidaryStudyTier
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
export type PlazaLapidaryStudyTierId =
  | 'sighted'
  | 'fieldNotes'
  | 'properties'
  | 'habitats'
  | 'full';

/** Maps legacy lapidary tier ids onto the unified ladder. */
export const DEFINING_PLAZA_LAPIDARY_STUDY_TIER_TO_CODEX: Record<
  PlazaLapidaryStudyTierId,
  PlazaCodexStudyTierId
> = {
  sighted: 'awareness',
  fieldNotes: 'understanding',
  properties: 'application',
  habitats: 'proficiency',
  full: 'mastery',
};

/** Minimum Study points required to reach each study tier. */
export const DEFINING_PLAZA_LAPIDARY_STUDY_TIER_THRESHOLDS: Record<
  PlazaLapidaryStudyTierId,
  number
> = {
  sighted:
    DEFINING_PLAZA_CODEX_STUDY_BASE_THRESHOLDS[
      DEFINING_PLAZA_LAPIDARY_STUDY_TIER_TO_CODEX.sighted
    ],
  fieldNotes:
    DEFINING_PLAZA_CODEX_STUDY_BASE_THRESHOLDS[
      DEFINING_PLAZA_LAPIDARY_STUDY_TIER_TO_CODEX.fieldNotes
    ],
  properties:
    DEFINING_PLAZA_CODEX_STUDY_BASE_THRESHOLDS[
      DEFINING_PLAZA_LAPIDARY_STUDY_TIER_TO_CODEX.properties
    ],
  habitats:
    DEFINING_PLAZA_CODEX_STUDY_BASE_THRESHOLDS[
      DEFINING_PLAZA_LAPIDARY_STUDY_TIER_TO_CODEX.habitats
    ],
  full: DEFINING_PLAZA_CODEX_STUDY_BASE_THRESHOLDS[
    DEFINING_PLAZA_LAPIDARY_STUDY_TIER_TO_CODEX.full
  ],
};

/** Ordered tiers from lowest to highest unlock. */
export const DEFINING_PLAZA_LAPIDARY_STUDY_TIER_ORDER: readonly PlazaLapidaryStudyTierId[] =
  ['sighted', 'fieldNotes', 'properties', 'habitats', 'full'];

/** Max study count shown in progress UI (full dossier unlock). */
export const DEFINING_PLAZA_LAPIDARY_STUDY_FULL_COUNT =
  DEFINING_PLAZA_CODEX_STUDY_FULL_COUNT;

/** Book icons by highest unlocked study tier. */
export const DEFINING_PLAZA_LAPIDARY_STUDY_TIER_BOOK_ICONS: Record<
  PlazaLapidaryStudyTierId,
  string
> = {
  sighted:
    DEFINING_PLAZA_CODEX_STUDY_TIER_BOOK_ICONS[
      DEFINING_PLAZA_LAPIDARY_STUDY_TIER_TO_CODEX.sighted
    ],
  fieldNotes:
    DEFINING_PLAZA_CODEX_STUDY_TIER_BOOK_ICONS[
      DEFINING_PLAZA_LAPIDARY_STUDY_TIER_TO_CODEX.fieldNotes
    ],
  properties:
    DEFINING_PLAZA_CODEX_STUDY_TIER_BOOK_ICONS[
      DEFINING_PLAZA_LAPIDARY_STUDY_TIER_TO_CODEX.properties
    ],
  habitats:
    DEFINING_PLAZA_CODEX_STUDY_TIER_BOOK_ICONS[
      DEFINING_PLAZA_LAPIDARY_STUDY_TIER_TO_CODEX.habitats
    ],
  full: DEFINING_PLAZA_CODEX_STUDY_TIER_BOOK_ICONS[
    DEFINING_PLAZA_LAPIDARY_STUDY_TIER_TO_CODEX.full
  ],
};

/** Player-facing section titles for each tier block on the detail page. */
export const LABELING_PLAZA_LAPIDARY_STUDY_TIER_SECTION_TITLES: Record<
  Exclude<PlazaLapidaryStudyTierId, 'sighted'>,
  string
> = {
  fieldNotes: labelingPlazaCodexStudySectionTitle('lapidary', 'understanding'),
  properties: labelingPlazaCodexStudySectionTitle('lapidary', 'application'),
  habitats: labelingPlazaCodexStudySectionTitle('lapidary', 'proficiency'),
  full: labelingPlazaCodexStudySectionTitle('lapidary', 'mastery'),
};

/** One-line teasers shown before a tier unlocks. */
export const LABELING_PLAZA_LAPIDARY_STUDY_TIER_TEASERS: Record<
  Exclude<PlazaLapidaryStudyTierId, 'sighted'>,
  string
> = {
  fieldNotes: LABELING_PLAZA_CODEX_STUDY_DEFAULT_TEASERS.understanding,
  properties: LABELING_PLAZA_CODEX_STUDY_DEFAULT_TEASERS.application,
  habitats: LABELING_PLAZA_CODEX_STUDY_DEFAULT_TEASERS.proficiency,
  full: LABELING_PLAZA_CODEX_STUDY_DEFAULT_TEASERS.mastery,
};
