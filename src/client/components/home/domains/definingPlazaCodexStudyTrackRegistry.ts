/**
 * Per-codex study track config: scale, section labels, and extra sections.
 *
 * @module components/home/domains/definingPlazaCodexStudyTrackRegistry
 */

import {
  DEFINING_PLAZA_CODEX_STUDY_DEFAULT_MULTIPLIER,
  LABELING_PLAZA_CODEX_STUDY_DEFAULT_SECTION_TITLES,
  type PlazaCodexStudyDetailSectionTierId,
  type PlazaCodexStudyTierId,
} from '@/components/home/domains/definingPlazaCodexStudyTier';

/** Identifies which codex collection an entry belongs to for study math. */
export type PlazaCodexStudyTrackId =
  | 'herbarium-flower'
  | 'herbarium-tree'
  | 'herbarium-clover'
  | 'herbarium-berry'
  | 'bestiary'
  | 'lapidary'
  | 'pathology';

/** Bestiary-only detail sections layered on unified tier gates. */
export type PlazaCodexBestiaryExtraSectionId =
  | 'behavior'
  | 'ecology'
  | 'combat'
  | 'attackEffects'
  | 'lootAndRisk'
  | 'playable';

/** Optional per-track section title overrides keyed by unified tier. */
export type PlazaCodexStudyTrackSectionTitleOverrides = Partial<
  Record<PlazaCodexStudyDetailSectionTierId, string>
>;

export type PlazaCodexStudyTrackDefinition = {
  trackId: PlazaCodexStudyTrackId;
  studyScaleMultiplier: number;
  sectionTitleOverrides: PlazaCodexStudyTrackSectionTitleOverrides;
  bestiaryExtraSections?: readonly PlazaCodexBestiaryExtraSectionId[];
};

/** Unified tier gate for each Bestiary-only section. */
export const DEFINING_PLAZA_CODEX_BESTIARY_EXTRA_SECTION_TIER_GATES: Record<
  PlazaCodexBestiaryExtraSectionId,
  PlazaCodexStudyDetailSectionTierId
> = {
  behavior: 'application',
  ecology: 'proficiency',
  combat: 'expertise',
  attackEffects: 'expertise',
  lootAndRisk: 'mastery',
  playable: 'mastery',
};

/** Player-facing titles for Bestiary-only sections. */
export const LABELING_PLAZA_CODEX_BESTIARY_EXTRA_SECTION_TITLES: Record<
  PlazaCodexBestiaryExtraSectionId,
  string
> = {
  behavior: 'Behavior',
  ecology: 'Ecology',
  combat: 'Combat',
  attackEffects: 'Attack effects',
  lootAndRisk: 'Loot and risk',
  playable: 'Playable form',
};

const HERBARIUM_SECTION_OVERRIDES: PlazaCodexStudyTrackSectionTitleOverrides = {
  application: 'Observed effects',
  proficiency: 'Properties',
  expertise: 'Mechanics',
  mastery: 'Full dossier',
};

const BESTIARY_SECTION_OVERRIDES: PlazaCodexStudyTrackSectionTitleOverrides = {
  application: 'Behavior',
  proficiency: 'Ecology',
  expertise: 'Combat',
  mastery: 'Full dossier',
};

const LAPIDARY_SECTION_OVERRIDES: PlazaCodexStudyTrackSectionTitleOverrides = {
  application: 'Occurrence',
  proficiency: 'Refinement',
  expertise: 'Vein traits',
  mastery: 'Full dossier',
};

const PATHOLOGY_SECTION_OVERRIDES: PlazaCodexStudyTrackSectionTitleOverrides = {
  application: 'Course',
  proficiency: 'Symptoms',
  expertise: 'Mechanism',
  mastery: 'Full dossier',
};

/** Registry row for every codex study track (all 1x per locked decision). */
export const DEFINING_PLAZA_CODEX_STUDY_TRACK_REGISTRY: Record<
  PlazaCodexStudyTrackId,
  PlazaCodexStudyTrackDefinition
> = {
  'herbarium-flower': {
    trackId: 'herbarium-flower',
    studyScaleMultiplier: DEFINING_PLAZA_CODEX_STUDY_DEFAULT_MULTIPLIER,
    sectionTitleOverrides: HERBARIUM_SECTION_OVERRIDES,
  },
  'herbarium-tree': {
    trackId: 'herbarium-tree',
    studyScaleMultiplier: DEFINING_PLAZA_CODEX_STUDY_DEFAULT_MULTIPLIER,
    sectionTitleOverrides: HERBARIUM_SECTION_OVERRIDES,
  },
  'herbarium-clover': {
    trackId: 'herbarium-clover',
    studyScaleMultiplier: DEFINING_PLAZA_CODEX_STUDY_DEFAULT_MULTIPLIER,
    sectionTitleOverrides: HERBARIUM_SECTION_OVERRIDES,
  },
  'herbarium-berry': {
    trackId: 'herbarium-berry',
    studyScaleMultiplier: DEFINING_PLAZA_CODEX_STUDY_DEFAULT_MULTIPLIER,
    sectionTitleOverrides: HERBARIUM_SECTION_OVERRIDES,
  },
  bestiary: {
    trackId: 'bestiary',
    studyScaleMultiplier: DEFINING_PLAZA_CODEX_STUDY_DEFAULT_MULTIPLIER,
    sectionTitleOverrides: BESTIARY_SECTION_OVERRIDES,
    bestiaryExtraSections: [
      'behavior',
      'ecology',
      'combat',
      'attackEffects',
      'lootAndRisk',
      'playable',
    ],
  },
  lapidary: {
    trackId: 'lapidary',
    studyScaleMultiplier: DEFINING_PLAZA_CODEX_STUDY_DEFAULT_MULTIPLIER,
    sectionTitleOverrides: LAPIDARY_SECTION_OVERRIDES,
  },
  pathology: {
    trackId: 'pathology',
    studyScaleMultiplier: DEFINING_PLAZA_CODEX_STUDY_DEFAULT_MULTIPLIER,
    sectionTitleOverrides: PATHOLOGY_SECTION_OVERRIDES,
  },
};

/** Resolves the section title for a track and tier (override or default). */
export function labelingPlazaCodexStudySectionTitle(
  trackId: PlazaCodexStudyTrackId,
  tierId: PlazaCodexStudyDetailSectionTierId
): string {
  const track = DEFINING_PLAZA_CODEX_STUDY_TRACK_REGISTRY[trackId];
  return (
    track.sectionTitleOverrides[tierId] ??
    LABELING_PLAZA_CODEX_STUDY_DEFAULT_SECTION_TITLES[tierId]
  );
}
