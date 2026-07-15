/**
 * Target keys for timed campfire tea brew progress rings.
 *
 * @module components/world/tea-brewing/domains/formattingWorldPlazaTeaPotCampfireBrewProgressTargetKey
 */

import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { resolvingWorldBuildingPlacedBlockWorldLayer } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';

export function formattingWorldPlazaTeaPotCampfireBrewProgressTargetKey(
  block: DefiningWorldBuildingPlacedBlock
): string {
  const worldLayer = resolvingWorldBuildingPlacedBlockWorldLayer(block);

  return `tea-pot-campfire-brew:${block.tilePosition.tileX}:${block.tilePosition.tileY}:${worldLayer}`;
}
