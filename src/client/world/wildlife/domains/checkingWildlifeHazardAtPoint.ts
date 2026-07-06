/**
 * Composes collision, water, and lava checks into one hazard verdict.
 *
 * @module components/world/wildlife/domains/checkingWildlifeHazardAtPoint
 */

import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { checkingWorldCollisionBlockedAtPoint } from '@/components/world/collision';
import { checkingWorldPlazaLavaAtTileIndex } from '@/components/world/domains/checkingWorldPlazaLavaAtTileIndex';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaBiomeAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaBiomeAtTileIndex';
import { resolvingWorldPlazaWaterAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaWaterAtTileIndex';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';

export type DefiningWildlifeHazardVerdict = 'safe' | 'blocked' | 'lethal';

export type CheckingWildlifeHazardAtPointParams = {
  point: DefiningWorldPlazaWorldPoint;
  species: DefiningWildlifeSpeciesDefinition;
  placedBlocks?: readonly DefiningWorldBuildingPlacedBlock[];
};

/**
 * Returns whether a grid point is safe for one species to enter.
 */
export function checkingWildlifeHazardAtPoint({
  point,
  species,
  placedBlocks = [],
}: CheckingWildlifeHazardAtPointParams): DefiningWildlifeHazardVerdict {
  const tileX = Math.floor(point.x);
  const tileY = Math.floor(point.y);

  if (
    species.hazards.treatsLavaAsLethal &&
    checkingWorldPlazaLavaAtTileIndex(tileX, tileY)
  ) {
    return 'lethal';
  }

  const waterKind = resolvingWorldPlazaWaterAtTileIndex(tileX, tileY);

  if (waterKind) {
    const biome = resolvingWorldPlazaBiomeAtTileIndex(tileX, tileY);

    if (species.hazards.treatsSwampWaterAsSafe && biome.kind === 'swamp') {
      return 'safe';
    }

    return 'blocked';
  }

  const isBlocked = checkingWorldCollisionBlockedAtPoint(
    { x: point.x, y: point.y },
    {
      applyBlockCollision: true,
      isJumping: false,
      jumpProgress: 0,
      placedBlocks,
      playerLayer: point.layer,
      playerRadiusGrid: species.collisionRadiusGrid,
    }
  );

  if (isBlocked) {
    return 'blocked';
  }

  return 'safe';
}
