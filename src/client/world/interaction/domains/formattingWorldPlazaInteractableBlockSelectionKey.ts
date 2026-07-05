import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { resolvingWorldBuildingPlacedBlockWorldLayer } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';

/**
 * Stable selection key for an interactable placed block (tile + layer).
 */
export function formattingWorldPlazaInteractableBlockSelectionKey(
  block: DefiningWorldBuildingPlacedBlock
): string {
  const worldLayer = resolvingWorldBuildingPlacedBlockWorldLayer(block);

  return `${block.tilePosition.tileX}:${block.tilePosition.tileY}:${worldLayer}`;
}
