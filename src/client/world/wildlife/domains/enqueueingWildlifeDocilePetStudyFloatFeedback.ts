/**
 * Marks a living companion with a rising +N study float after Pet completes.
 *
 * @module components/world/wildlife/domains/enqueueingWildlifeDocilePetStudyFloatFeedback
 */

import { enqueueingWorldPlazaEntityHealthFloatText } from '@/components/world/health/domains/managingWorldPlazaEntityHealthFloatTexts';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';

/**
 * Appends a study float on a living animal without marking corpse Study state.
 */
export function enqueueingWildlifeDocilePetStudyFloatFeedback({
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
    outcomeTier: 'normal',
    deviationScore: awardedStudyPoints - 1,
  });

  return {
    ...instance,
    floatingTexts: enqueueResult.floats,
  };
}
