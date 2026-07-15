/**
 * Unified study tier resolution for all codex tracks.
 *
 * @module components/home/domains/resolvingPlazaCodexStudyTier
 */

import {
  DEFINING_PLAZA_CODEX_STUDY_BASE_THRESHOLDS,
  DEFINING_PLAZA_CODEX_STUDY_TIER_BOOK_ICONS,
  DEFINING_PLAZA_CODEX_STUDY_TIER_ORDER,
  LABELING_PLAZA_CODEX_STUDY_AWARENESS,
  LABELING_PLAZA_CODEX_STUDY_DEFAULT_TEASERS,
  type PlazaCodexStudyDetailSectionTierId,
  type PlazaCodexStudyTierId,
} from '@/components/home/domains/definingPlazaCodexStudyTier';
import {
  DEFINING_PLAZA_CODEX_STUDY_TRACK_REGISTRY,
  labelingPlazaCodexStudySectionTitle,
  type PlazaCodexStudyTrackId,
} from '@/components/home/domains/definingPlazaCodexStudyTrackRegistry';

/** Effective study scale for a track (track default × optional per-entry). */
export function resolvingPlazaCodexStudyScaleMultiplier(
  trackId: PlazaCodexStudyTrackId,
  entryScaleMultiplier = 1
): number {
  const trackMultiplier =
    DEFINING_PLAZA_CODEX_STUDY_TRACK_REGISTRY[trackId].studyScaleMultiplier;
  return trackMultiplier * entryScaleMultiplier;
}

/** Threshold study count for one tier on a track. */
export function resolvingPlazaCodexStudyTierThreshold(
  trackId: PlazaCodexStudyTrackId,
  tierId: PlazaCodexStudyTierId,
  entryScaleMultiplier = 1
): number {
  return (
    DEFINING_PLAZA_CODEX_STUDY_BASE_THRESHOLDS[tierId] *
    resolvingPlazaCodexStudyScaleMultiplier(trackId, entryScaleMultiplier)
  );
}

/** Max study count shown in progress UI for a track. */
export function resolvingPlazaCodexStudyFullCount(
  trackId: PlazaCodexStudyTrackId,
  entryScaleMultiplier = 1
): number {
  return resolvingPlazaCodexStudyTierThreshold(
    trackId,
    'mastery',
    entryScaleMultiplier
  );
}

/** Returns the highest study tier reached for a study count. */
export function resolvingPlazaCodexStudyTierId(
  trackId: PlazaCodexStudyTrackId,
  studyCount: number,
  entryScaleMultiplier = 1
): PlazaCodexStudyTierId {
  let currentTier: PlazaCodexStudyTierId = 'awareness';

  for (const tierId of DEFINING_PLAZA_CODEX_STUDY_TIER_ORDER) {
    if (
      studyCount >=
      resolvingPlazaCodexStudyTierThreshold(
        trackId,
        tierId,
        entryScaleMultiplier
      )
    ) {
      currentTier = tierId;
    }
  }

  return currentTier;
}

/** True when the study count has reached a tier threshold. */
export function checkingPlazaCodexStudyTierUnlocked(
  trackId: PlazaCodexStudyTrackId,
  tierId: PlazaCodexStudyTierId,
  studyCount: number,
  entryScaleMultiplier = 1
): boolean {
  return (
    studyCount >=
    resolvingPlazaCodexStudyTierThreshold(
      trackId,
      tierId,
      entryScaleMultiplier
    )
  );
}

/** Study count needed for the next tier, or null when at mastery. */
export function resolvingPlazaCodexNextStudyTierUnlockCount(
  trackId: PlazaCodexStudyTrackId,
  studyCount: number,
  entryScaleMultiplier = 1
): number | null {
  for (const tierId of DEFINING_PLAZA_CODEX_STUDY_TIER_ORDER) {
    const threshold = resolvingPlazaCodexStudyTierThreshold(
      trackId,
      tierId,
      entryScaleMultiplier
    );

    if (studyCount < threshold) {
      return threshold;
    }
  }

  return null;
}

/** Formats study progress for detail headers. */
export function formattingPlazaCodexStudyProgressLabel(
  trackId: PlazaCodexStudyTrackId,
  studyCount: number,
  entryScaleMultiplier = 1
): string {
  const nextUnlockStudyCount = resolvingPlazaCodexNextStudyTierUnlockCount(
    trackId,
    studyCount,
    entryScaleMultiplier
  );

  if (nextUnlockStudyCount === null) {
    return `Studied ${studyCount} · Fully studied`;
  }

  return `Studied ${studyCount} · Next unlock at ${nextUnlockStudyCount}`;
}

/** Compact `current/full` progress label for cards and detail. */
export function formattingPlazaCodexStudyCountProgress(
  trackId: PlazaCodexStudyTrackId,
  studyCount: number,
  entryScaleMultiplier = 1
): string {
  const fullCount = resolvingPlazaCodexStudyFullCount(
    trackId,
    entryScaleMultiplier
  );
  return `${Math.min(studyCount, fullCount)}/${fullCount}`;
}

/** Book icon for the player's current knowledge tier. */
export function resolvingPlazaCodexStudyTierBookIcon(
  trackId: PlazaCodexStudyTrackId,
  studyCount: number,
  entryScaleMultiplier = 1
): string {
  return DEFINING_PLAZA_CODEX_STUDY_TIER_BOOK_ICONS[
    resolvingPlazaCodexStudyTierId(trackId, studyCount, entryScaleMultiplier)
  ];
}

/** Awareness label for the current tier (Awareness, Familiarity, …). */
export function labelingPlazaCodexAwarenessLabel(
  trackId: PlazaCodexStudyTrackId,
  studyCount: number,
  entryScaleMultiplier = 1
): string {
  return LABELING_PLAZA_CODEX_STUDY_AWARENESS[
    resolvingPlazaCodexStudyTierId(trackId, studyCount, entryScaleMultiplier)
  ];
}

/** Section title for a detail block on a track. */
export function labelingPlazaCodexStudyTierSectionTitle(
  trackId: PlazaCodexStudyTrackId,
  tierId: PlazaCodexStudyDetailSectionTierId
): string {
  return labelingPlazaCodexStudySectionTitle(trackId, tierId);
}

/** Teaser copy shown before a section tier unlocks. */
export function labelingPlazaCodexStudyTierTeaser(
  tierId: PlazaCodexStudyDetailSectionTierId
): string {
  return LABELING_PLAZA_CODEX_STUDY_DEFAULT_TEASERS[tierId];
}
