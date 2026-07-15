/**
 * Legacy Herbarium tree study tier ids (shim over unified codex ladder).
 *
 * @module components/home/domains/definingPlazaHerbariumStudyTier
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
export type PlazaHerbariumStudyTierId =
  | 'sighted'
  | 'fieldNotes'
  | 'properties'
  | 'habitats'
  | 'full';

/** Maps legacy tree tier ids onto the unified ladder. */
export const DEFINING_PLAZA_HERBARIUM_STUDY_TIER_TO_CODEX: Record<
  PlazaHerbariumStudyTierId,
  PlazaCodexStudyTierId
> = {
  sighted: 'awareness',
  fieldNotes: 'understanding',
  properties: 'application',
  habitats: 'proficiency',
  full: 'mastery',
};

/** Minimum Study points required to reach each study tier. */
export const DEFINING_PLAZA_HERBARIUM_STUDY_TIER_THRESHOLDS: Record<
  PlazaHerbariumStudyTierId,
  number
> = {
  sighted:
    DEFINING_PLAZA_CODEX_STUDY_BASE_THRESHOLDS[
      DEFINING_PLAZA_HERBARIUM_STUDY_TIER_TO_CODEX.sighted
    ],
  fieldNotes:
    DEFINING_PLAZA_CODEX_STUDY_BASE_THRESHOLDS[
      DEFINING_PLAZA_HERBARIUM_STUDY_TIER_TO_CODEX.fieldNotes
    ],
  properties:
    DEFINING_PLAZA_CODEX_STUDY_BASE_THRESHOLDS[
      DEFINING_PLAZA_HERBARIUM_STUDY_TIER_TO_CODEX.properties
    ],
  habitats:
    DEFINING_PLAZA_CODEX_STUDY_BASE_THRESHOLDS[
      DEFINING_PLAZA_HERBARIUM_STUDY_TIER_TO_CODEX.habitats
    ],
  full: DEFINING_PLAZA_CODEX_STUDY_BASE_THRESHOLDS[
    DEFINING_PLAZA_HERBARIUM_STUDY_TIER_TO_CODEX.full
  ],
};

/** Ordered tiers from lowest to highest unlock. */
export const DEFINING_PLAZA_HERBARIUM_STUDY_TIER_ORDER: readonly PlazaHerbariumStudyTierId[] =
  ['sighted', 'fieldNotes', 'properties', 'habitats', 'full'];

/** Max study count shown in progress UI (full dossier unlock). */
export const DEFINING_PLAZA_HERBARIUM_STUDY_FULL_COUNT =
  DEFINING_PLAZA_CODEX_STUDY_FULL_COUNT;

/** Book icons by highest unlocked study tier. */
export const DEFINING_PLAZA_HERBARIUM_STUDY_TIER_BOOK_ICONS: Record<
  PlazaHerbariumStudyTierId,
  string
> = {
  sighted:
    DEFINING_PLAZA_CODEX_STUDY_TIER_BOOK_ICONS[
      DEFINING_PLAZA_HERBARIUM_STUDY_TIER_TO_CODEX.sighted
    ],
  fieldNotes:
    DEFINING_PLAZA_CODEX_STUDY_TIER_BOOK_ICONS[
      DEFINING_PLAZA_HERBARIUM_STUDY_TIER_TO_CODEX.fieldNotes
    ],
  properties:
    DEFINING_PLAZA_CODEX_STUDY_TIER_BOOK_ICONS[
      DEFINING_PLAZA_HERBARIUM_STUDY_TIER_TO_CODEX.properties
    ],
  habitats:
    DEFINING_PLAZA_CODEX_STUDY_TIER_BOOK_ICONS[
      DEFINING_PLAZA_HERBARIUM_STUDY_TIER_TO_CODEX.habitats
    ],
  full: DEFINING_PLAZA_CODEX_STUDY_TIER_BOOK_ICONS[
    DEFINING_PLAZA_HERBARIUM_STUDY_TIER_TO_CODEX.full
  ],
};

/** Player-facing section titles for each tier block on the detail page. */
export const LABELING_PLAZA_HERBARIUM_STUDY_TIER_SECTION_TITLES: Record<
  Exclude<PlazaHerbariumStudyTierId, 'sighted'>,
  string
> = {
  fieldNotes: labelingPlazaCodexStudySectionTitle(
    'herbarium-tree',
    'understanding'
  ),
  properties: labelingPlazaCodexStudySectionTitle(
    'herbarium-tree',
    'application'
  ),
  habitats: labelingPlazaCodexStudySectionTitle('herbarium-tree', 'proficiency'),
  full: labelingPlazaCodexStudySectionTitle('herbarium-tree', 'mastery'),
};

/** One-line teasers shown before a tier unlocks. */
export const LABELING_PLAZA_HERBARIUM_STUDY_TIER_TEASERS: Record<
  Exclude<PlazaHerbariumStudyTierId, 'sighted'>,
  string
> = {
  fieldNotes: LABELING_PLAZA_CODEX_STUDY_DEFAULT_TEASERS.understanding,
  properties: LABELING_PLAZA_CODEX_STUDY_DEFAULT_TEASERS.application,
  habitats: LABELING_PLAZA_CODEX_STUDY_DEFAULT_TEASERS.proficiency,
  full: LABELING_PLAZA_CODEX_STUDY_DEFAULT_TEASERS.mastery,
};
