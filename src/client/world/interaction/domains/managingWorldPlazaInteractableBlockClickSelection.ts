import type { RefObject } from 'react';
import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { formattingWorldPlazaInteractableBlockSelectionKey } from '@/components/world/interaction/domains/formattingWorldPlazaInteractableBlockSelectionKey';

/**
 * Selects one interactable block for popover-style click actions.
 */
export function selectingWorldPlazaInteractableBlockForClickAction(
  selectedBlockKeysRef: RefObject<Set<string>>,
  block: DefiningWorldBuildingPlacedBlock
): void {
  const selectionKey = formattingWorldPlazaInteractableBlockSelectionKey(block);

  selectedBlockKeysRef.current.clear();
  selectedBlockKeysRef.current.add(selectionKey);
}

/**
 * Clears all popover-style interactable block selections.
 */
export function clearingWorldPlazaInteractableBlockClickSelection(
  selectedBlockKeysRef: RefObject<Set<string>>
): void {
  if (selectedBlockKeysRef.current.size === 0) {
    return;
  }

  selectedBlockKeysRef.current.clear();
}
