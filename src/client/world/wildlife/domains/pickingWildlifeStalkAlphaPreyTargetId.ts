/**
 * Deterministic mass-weighted prey pick for stalker alphas.
 *
 * @module components/world/wildlife/domains/pickingWildlifeStalkAlphaPreyTargetId
 */

import { computingWildlifeInstanceSeedFraction } from '@/components/world/wildlife/domains/computingWildlifeInstanceSeedFraction';
import { DEFINING_WILDLIFE_STALK_PREY_PICK_BUCKET_MS } from '@/components/world/wildlife/domains/definingWildlifeStalkConstants';
import type { DefiningWildlifeStalkPreyPickCandidate } from '@/components/world/wildlife/domains/definingWildlifeStalkPreyPickCandidate';
import { resolvingWildlifeStalkPreyPickWeight } from '@/components/world/wildlife/domains/resolvingWildlifeStalkPreyPickWeight';

/** Picks one prey id from the candidate list using a stable mass-weighted roll. */
export function pickingWildlifeStalkAlphaPreyTargetId(
  instanceId: string,
  candidates: readonly DefiningWildlifeStalkPreyPickCandidate[],
  nowMs: number
): string | null {
  if (candidates.length === 0) {
    return null;
  }

  const pickBucket = Math.floor(
    nowMs / DEFINING_WILDLIFE_STALK_PREY_PICK_BUCKET_MS
  );
  const fraction = computingWildlifeInstanceSeedFraction(
    instanceId,
    pickBucket
  );

  let totalWeight = 0;
  const weights: number[] = [];

  for (const candidate of candidates) {
    const weight = resolvingWildlifeStalkPreyPickWeight({
      massKg: candidate.massKg,
      isFavoritePrey: candidate.isFavoritePrey,
    });
    weights.push(weight);
    totalWeight += weight;
  }

  if (totalWeight <= 0) {
    return candidates[0]?.targetId ?? null;
  }

  let cursor = fraction * totalWeight;

  for (let index = 0; index < candidates.length; index += 1) {
    cursor -= weights[index] ?? 0;

    if (cursor < 0) {
      return candidates[index]?.targetId ?? null;
    }
  }

  return candidates[candidates.length - 1]?.targetId ?? null;
}
