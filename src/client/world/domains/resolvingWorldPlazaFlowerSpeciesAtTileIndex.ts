import { resolvingWorldPlazaPlayerDiscoveryLuckMultiplier } from '@/components/world/inventory/domains/resolvingWorldPlazaPlayerDiscoveryLuckMultiplier';
import {
  resolvingWorldFlowerSpeciesAtTileIndexWithDiscoveryLuck,
  type WorldFlowerSpeciesId,
} from '../../../shared/worldFlowerRarity';

export type { WorldFlowerSpeciesId };

/**
 * Resolves biome flower species for one tile, including lucky-charm discovery boosts.
 */
export function resolvingWorldPlazaFlowerSpeciesAtTileIndex(
  tileX: number,
  tileY: number
): WorldFlowerSpeciesId {
  return resolvingWorldFlowerSpeciesAtTileIndexWithDiscoveryLuck(
    tileX,
    tileY,
    resolvingWorldPlazaPlayerDiscoveryLuckMultiplier()
  );
}
