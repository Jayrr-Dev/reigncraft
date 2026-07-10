/**
 * Discovers biome kinds within a search ring around a world position.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeNearbyBiomeKindsAtWorldPoint
 */

import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaBiomeAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaBiomeAtTileIndex';
import { resolvingWorldPlazaIsometricTileIndexAtGridPoint } from '@/components/world/domains/resolvingWorldPlazaIsometricTileIndexAtGridPoint';
import { DEFINING_WILDLIFE_BIOME_PROXIMITY_SAMPLE_TILE_OFFSETS } from '@/components/world/wildlife/domains/definingWildlifeBiomeProximityTextureConstants';

/**
 * Returns the distinct biome kinds under the player tile and sample ring.
 */
export function resolvingWildlifeNearbyBiomeKindsAtWorldPoint(
  worldPoint: DefiningWorldPlazaWorldPoint
): readonly DefiningWorldPlazaBiomeKind[] {
  const { tileX, tileY } =
    resolvingWorldPlazaIsometricTileIndexAtGridPoint(worldPoint);
  const biomeKinds = new Set<DefiningWorldPlazaBiomeKind>();

  for (const offset of DEFINING_WILDLIFE_BIOME_PROXIMITY_SAMPLE_TILE_OFFSETS) {
    biomeKinds.add(
      resolvingWorldPlazaBiomeAtTileIndex(
        tileX + offset.tileX,
        tileY + offset.tileY
      ).kind
    );
  }

  return [...biomeKinds];
}
