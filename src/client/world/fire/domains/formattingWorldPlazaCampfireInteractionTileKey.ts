import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { formattingWorldPlazaInteractableBlockSelectionKey } from '@/components/world/interaction/domains/formattingWorldPlazaInteractableBlockSelectionKey';

/**
 * Stable tile key for campfire interaction popover selection.
 */
export function formattingWorldPlazaCampfireInteractionTileKey(
  block: DefiningWorldBuildingPlacedBlock
): string {
  return formattingWorldPlazaInteractableBlockSelectionKey(block);
}
