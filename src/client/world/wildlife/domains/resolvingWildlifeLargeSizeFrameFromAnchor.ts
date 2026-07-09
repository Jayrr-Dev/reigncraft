/**
 * Deterministic obese/apex frame roll for large wildlife spawns.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeLargeSizeFrameFromAnchor
 */

import { seedingWorldPlazaGrassTileDecorationFromTileIndex } from '@/components/world/domains/seedingWorldPlazaGrassTileDecorationFromTileIndex';
import {
  DEFINING_WILDLIFE_LARGE_SIZE_FRAME_PICK_SALT,
  type DefiningWildlifeLargeSizeFrame,
  checkingWildlifeSizeTierHasLargeSizeFrame,
} from '@/components/world/wildlife/domains/definingWildlifeLargeSizeFrameConstants';
import type { DefiningWildlifeSizeTier } from '@/components/world/wildlife/domains/definingWildlifeNameTagConstants';
import type { DefiningWildlifeSpawnAnchor } from '@/components/world/wildlife/domains/definingWildlifeTypes';

/** Returns obese or apex for +1σ/+2σ/+3σ spawns; null for smaller tiers. */
export function resolvingWildlifeLargeSizeFrameFromAnchor(
  anchor: DefiningWildlifeSpawnAnchor,
  sizeTier: DefiningWildlifeSizeTier
): DefiningWildlifeLargeSizeFrame | null {
  if (!checkingWildlifeSizeTierHasLargeSizeFrame(sizeTier)) {
    return null;
  }

  const roll = seedingWorldPlazaGrassTileDecorationFromTileIndex(
    anchor.tileX,
    anchor.tileY,
    DEFINING_WILDLIFE_LARGE_SIZE_FRAME_PICK_SALT + sizeTier
  );

  return roll < 0.5 ? 'obese' : 'apex';
}
