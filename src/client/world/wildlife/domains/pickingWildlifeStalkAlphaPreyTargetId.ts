/**
 * Deterministic random prey pick for stalker alphas.
 *
 * @module components/world/wildlife/domains/pickingWildlifeStalkAlphaPreyTargetId
 */

import { computingWildlifeInstanceSeedFraction } from '@/components/world/wildlife/domains/computingWildlifeInstanceSeedFraction';
import { DEFINING_WILDLIFE_STALK_PREY_PICK_BUCKET_MS } from '@/components/world/wildlife/domains/definingWildlifeStalkConstants';

/** Picks one prey id from the candidate list using a stable per-bucket roll. */
export function pickingWildlifeStalkAlphaPreyTargetId(
  instanceId: string,
  candidateTargetIds: readonly string[],
  nowMs: number
): string | null {
  if (candidateTargetIds.length === 0) {
    return null;
  }

  const pickBucket = Math.floor(
    nowMs / DEFINING_WILDLIFE_STALK_PREY_PICK_BUCKET_MS
  );
  const fraction = computingWildlifeInstanceSeedFraction(
    instanceId,
    pickBucket
  );
  const index = Math.min(
    candidateTargetIds.length - 1,
    Math.floor(fraction * candidateTargetIds.length)
  );

  return candidateTargetIds[index] ?? null;
}
