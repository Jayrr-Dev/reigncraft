/**
 * Legacy Herbarium clover study tier ids (shim over unified codex ladder).
 *
 * @module components/home/domains/definingPlazaHerbariumCloverStudyTier
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
export type PlazaHerbariumCloverStudyTierId =
  | 'sighted'
  | 'fieldNotes'
  | 'properties'
  | 'habitats'
  | 'full';

/** Maps legacy clover tier ids onto the unified ladder. */
export const DEFINING_PLAZA_HERBARIUM_CLOVER_STUDY_TIER_TO_CODEX: Record<
  PlazaHerbariumCloverStudyTierId,
  PlazaCodexStudyTierId
> = {
  sighted: 'awareness',
  fieldNotes: 'understanding',
  properties: 'application',
  habitats: 'proficiency',
  full: 'mastery',
};

/** Minimum Study points required to reach each clover study tier. */
export const DEFINING_PLAZA_HERBARIUM_CLOVER_STUDY_TIER_THRESHOLDS: Record<
  PlazaHerbariumCloverStudyTierId,
  number
> = {
  sighted:
    DEFINING_PLAZA_CODEX_STUDY_BASE_THRESHOLDS[
      DEFINING_PLAZA_HERBARIUM_CLOVER_STUDY_TIER_TO_CODEX.sighted
    ],
  fieldNotes:
    DEFINING_PLAZA_CODEX_STUDY_BASE_THRESHOLDS[
      DEFINING_PLAZA_HERBARIUM_CLOVER_STUDY_TIER_TO_CODEX.fieldNotes
    ],
  properties:
    DEFINING_PLAZA_CODEX_STUDY_BASE_THRESHOLDS[
      DEFINING_PLAZA_HERBARIUM_CLOVER_STUDY_TIER_TO_CODEX.properties
    ],
  habitats:
    DEFINING_PLAZA_CODEX_STUDY_BASE_THRESHOLDS[
      DEFINING_PLAZA_HERBARIUM_CLOVER_STUDY_TIER_TO_CODEX.habitats
    ],
  full: DEFINING_PLAZA_CODEX_STUDY_BASE_THRESHOLDS[
    DEFINING_PLAZA_HERBARIUM_CLOVER_STUDY_TIER_TO_CODEX.full
  ],
};

/** Ordered clover tiers from lowest to highest unlock. */
export const DEFINING_PLAZA_HERBARIUM_CLOVER_STUDY_TIER_ORDER: readonly PlazaHerbariumCloverStudyTierId[] =
  ['sighted', 'fieldNotes', 'properties', 'habitats', 'full'];

/** Max combined clover study count shown in progress UI. */
export const DEFINING_PLAZA_HERBARIUM_CLOVER_STUDY_FULL_COUNT =
  DEFINING_PLAZA_CODEX_STUDY_FULL_COUNT;

/** Book icons by highest unlocked clover study tier. */
export const DEFINING_PLAZA_HERBARIUM_CLOVER_STUDY_TIER_BOOK_ICONS: Record<
  PlazaHerbariumCloverStudyTierId,
  string
> = {
  sighted:
    DEFINING_PLAZA_CODEX_STUDY_TIER_BOOK_ICONS[
      DEFINING_PLAZA_HERBARIUM_CLOVER_STUDY_TIER_TO_CODEX.sighted
    ],
  fieldNotes:
    DEFINING_PLAZA_CODEX_STUDY_TIER_BOOK_ICONS[
      DEFINING_PLAZA_HERBARIUM_CLOVER_STUDY_TIER_TO_CODEX.fieldNotes
    ],
  properties:
    DEFINING_PLAZA_CODEX_STUDY_TIER_BOOK_ICONS[
      DEFINING_PLAZA_HERBARIUM_CLOVER_STUDY_TIER_TO_CODEX.properties
    ],
  habitats:
    DEFINING_PLAZA_CODEX_STUDY_TIER_BOOK_ICONS[
      DEFINING_PLAZA_HERBARIUM_CLOVER_STUDY_TIER_TO_CODEX.habitats
    ],
  full: DEFINING_PLAZA_CODEX_STUDY_TIER_BOOK_ICONS[
    DEFINING_PLAZA_HERBARIUM_CLOVER_STUDY_TIER_TO_CODEX.full
  ],
};

/** Player-facing section titles for each clover tier block. */
export const LABELING_PLAZA_HERBARIUM_CLOVER_STUDY_TIER_SECTION_TITLES: Record<
  Exclude<PlazaHerbariumCloverStudyTierId, 'sighted'>,
  string
> = {
  fieldNotes: labelingPlazaCodexStudySectionTitle(
    'herbarium-clover',
    'understanding'
  ),
  properties: labelingPlazaCodexStudySectionTitle(
    'herbarium-clover',
    'application'
  ),
  habitats: labelingPlazaCodexStudySectionTitle(
    'herbarium-clover',
    'proficiency'
  ),
  full: labelingPlazaCodexStudySectionTitle('herbarium-clover', 'mastery'),
};

/** One-line teasers shown before a clover tier unlocks. */
export const LABELING_PLAZA_HERBARIUM_CLOVER_STUDY_TIER_TEASERS: Record<
  Exclude<PlazaHerbariumCloverStudyTierId, 'sighted'>,
  string
> = {
  fieldNotes: LABELING_PLAZA_CODEX_STUDY_DEFAULT_TEASERS.understanding,
  properties: LABELING_PLAZA_CODEX_STUDY_DEFAULT_TEASERS.application,
  habitats: LABELING_PLAZA_CODEX_STUDY_DEFAULT_TEASERS.proficiency,
  full: LABELING_PLAZA_CODEX_STUDY_DEFAULT_TEASERS.mastery,
};
