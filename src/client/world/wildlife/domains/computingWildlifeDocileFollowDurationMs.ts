/**
 * Rolls temporary follow duration for docile approach reactions.
 *
 * @module components/world/wildlife/domains/computingWildlifeDocileFollowDurationMs
 */

import { seedingWorldPlazaGrassTileDecorationFromTileIndex } from '@/components/world/domains/seedingWorldPlazaGrassTileDecorationFromTileIndex';
import {
  DEFINING_WILDLIFE_DOCILE_FOLLOW_DURATION_MAX_MS,
  DEFINING_WILDLIFE_DOCILE_FOLLOW_DURATION_MIN_MS,
  DEFINING_WILDLIFE_DOCILE_FOLLOW_DURATION_SEED_SALT,
} from '@/components/world/wildlife/domains/definingWildlifeDocileConstants';
import type { DefiningWildlifeSpawnAnchor } from '@/components/world/wildlife/domains/definingWildlifeTypes';

/**
 * Uniform follow duration in [30s, 90s], stable per anchor and react salt.
 */
export function computingWildlifeDocileFollowDurationMs(
  anchor: Pick<DefiningWildlifeSpawnAnchor, 'tileX' | 'tileY' | 'packIndex'>,
  reactSalt = 0
): number {
  const uniform = seedingWorldPlazaGrassTileDecorationFromTileIndex(
    anchor.tileX,
    anchor.tileY,
    DEFINING_WILDLIFE_DOCILE_FOLLOW_DURATION_SEED_SALT +
      anchor.packIndex +
      reactSalt
  );

  return (
    DEFINING_WILDLIFE_DOCILE_FOLLOW_DURATION_MIN_MS +
    uniform *
      (DEFINING_WILDLIFE_DOCILE_FOLLOW_DURATION_MAX_MS -
        DEFINING_WILDLIFE_DOCILE_FOLLOW_DURATION_MIN_MS)
  );
}
