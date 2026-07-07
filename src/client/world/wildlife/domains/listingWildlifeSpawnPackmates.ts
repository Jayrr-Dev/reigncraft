/**
 * Lists wildlife instances that spawned as one multi-member pack.
 *
 * @module components/world/wildlife/domains/listingWildlifeSpawnPackmates
 */

import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { parsingWildlifeProceduralAnchorId } from '@/components/world/wildlife/domains/parsingWildlifeProceduralAnchorId';

export type ListingWildlifeSpawnPackmatesParams = {
  instance: DefiningWildlifeInstance;
  instances: readonly DefiningWildlifeInstance[];
  includeDead?: boolean;
};

/**
 * Returns same-species instances sharing the spawn tile anchor group.
 */
export function listingWildlifeSpawnPackmates({
  instance,
  instances,
  includeDead = false,
}: ListingWildlifeSpawnPackmatesParams): DefiningWildlifeInstance[] {
  const parsedAnchor = parsingWildlifeProceduralAnchorId(instance.anchorId);

  if (!parsedAnchor) {
    return includeDead || !instance.isDead ? [instance] : [];
  }

  const packmates: DefiningWildlifeInstance[] = [];

  for (const candidate of instances) {
    if (!includeDead && candidate.isDead) {
      continue;
    }

    if (candidate.speciesId !== instance.speciesId) {
      continue;
    }

    const candidateAnchor = parsingWildlifeProceduralAnchorId(
      candidate.anchorId
    );

    if (!candidateAnchor) {
      continue;
    }

    if (
      candidateAnchor.tileX !== parsedAnchor.tileX ||
      candidateAnchor.tileY !== parsedAnchor.tileY
    ) {
      continue;
    }

    packmates.push(candidate);
  }

  return packmates.sort((left, right) =>
    left.instanceId.localeCompare(right.instanceId)
  );
}
