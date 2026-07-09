/**
 * Whether two wildlife instances spawned as one multi-member pack.
 *
 * @module components/world/wildlife/domains/checkingWildlifeShareSpawnPack
 */

import { checkingWildlifeSameStalkPackSpecies } from '@/components/world/wildlife/domains/definingWildlifeOmegaWolfConstants';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { parsingWildlifeProceduralAnchorId } from '@/components/world/wildlife/domains/parsingWildlifeProceduralAnchorId';

/** True when both instances share the same spawn tile pack (same species or Omega escorts). */
export function checkingWildlifeShareSpawnPack(
  left: DefiningWildlifeInstance,
  right: DefiningWildlifeInstance
): boolean {
  if (!checkingWildlifeSameStalkPackSpecies(left.speciesId, right.speciesId)) {
    return false;
  }

  const leftAnchor = parsingWildlifeProceduralAnchorId(left.anchorId);
  const rightAnchor = parsingWildlifeProceduralAnchorId(right.anchorId);

  if (!leftAnchor || !rightAnchor) {
    return false;
  }

  return (
    leftAnchor.tileX === rightAnchor.tileX &&
    leftAnchor.tileY === rightAnchor.tileY
  );
}
