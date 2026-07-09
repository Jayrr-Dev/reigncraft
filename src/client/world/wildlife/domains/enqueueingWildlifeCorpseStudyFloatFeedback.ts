/**
 * Enqueues a rising +N study float on a corpse after Study completes.
 *
 * @module components/world/wildlife/domains/enqueueingWildlifeCorpseStudyFloatFeedback
 */

import { enqueueingWorldPlazaEntityHealthFloatText } from '@/components/world/health/domains/managingWorldPlazaEntityHealthFloatTexts';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';

/**
 * Marks the corpse studied and appends a combat-style study float (+1 to +3).
 */
export function enqueueingWildlifeCorpseStudyFloatFeedback({
  instance,
  studyPoints,
  nowMs,
}: {
  instance: DefiningWildlifeInstance;
  studyPoints: number;
  nowMs: number;
}): DefiningWildlifeInstance {
  const awardedStudyPoints = Math.max(1, Math.floor(studyPoints));
  const enqueueResult = enqueueingWorldPlazaEntityHealthFloatText({
    floats: instance.floatingTexts,
    kind: 'study',
    amount: awardedStudyPoints,
    nowMs,
    // Larger awards read as stronger rolls for float size helpers.
    outcomeTier:
      awardedStudyPoints >= 3
        ? 'lethal'
        : awardedStudyPoints >= 2
          ? 'critical'
          : 'normal',
    deviationScore: awardedStudyPoints - 1,
  });

  return {
    ...instance,
    hasBeenStudied: true,
    floatingTexts: enqueueResult.floats,
  };
}
