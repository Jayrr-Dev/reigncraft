import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';

export type PlazaBestiaryDiscoveryMergeSnapshot = {
  readonly sightedSpeciesIds: ReadonlySet<DefiningWildlifeSpeciesId>;
  readonly studyCountsBySpeciesId: ReadonlyMap<
    DefiningWildlifeSpeciesId,
    number
  >;
};

/**
 * Merges local + remote bestiary progress without losing study counts.
 *
 * Sighted ids are unioned. Per-species study totals take the higher value so a
 * stale Redis snapshot cannot wipe fresher localStorage progress (and vice
 * versa).
 */
export function mergingPlazaSinglePlayerSaveBestiaryDiscovery(
  left: PlazaBestiaryDiscoveryMergeSnapshot,
  right: PlazaBestiaryDiscoveryMergeSnapshot
): PlazaBestiaryDiscoveryMergeSnapshot {
  const sightedSpeciesIds = new Set<DefiningWildlifeSpeciesId>([
    ...left.sightedSpeciesIds,
    ...right.sightedSpeciesIds,
  ]);
  const studyCountsBySpeciesId = new Map<DefiningWildlifeSpeciesId, number>();

  const applyingStudyCounts = (
    studyCounts: ReadonlyMap<DefiningWildlifeSpeciesId, number>
  ): void => {
    for (const [speciesId, studyCount] of studyCounts) {
      const normalizedStudyCount = Math.max(0, Math.floor(studyCount));

      if (normalizedStudyCount <= 0) {
        continue;
      }

      const previousStudyCount = studyCountsBySpeciesId.get(speciesId) ?? 0;
      studyCountsBySpeciesId.set(
        speciesId,
        Math.max(previousStudyCount, normalizedStudyCount)
      );
      sightedSpeciesIds.add(speciesId);
    }
  };

  applyingStudyCounts(left.studyCountsBySpeciesId);
  applyingStudyCounts(right.studyCountsBySpeciesId);

  return {
    sightedSpeciesIds,
    studyCountsBySpeciesId,
  };
}
