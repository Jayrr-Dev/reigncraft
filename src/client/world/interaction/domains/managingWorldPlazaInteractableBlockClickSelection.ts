import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { formattingWorldPlazaInteractableBlockSelectionKey } from '@/components/world/interaction/domains/formattingWorldPlazaInteractableBlockSelectionKey';
import { formattingWorldPlazaInteractableTreeSelectionKey } from '@/components/world/interaction/domains/formattingWorldPlazaInteractableTreeSelectionKey';
import type { RefObject } from 'react';

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
 * Selects one tree tile for popover-style chop interaction.
 */
export function selectingWorldPlazaInteractableTreeForClickAction(
  selectedBlockKeysRef: RefObject<Set<string>>,
  tileX: number,
  tileY: number
): void {
  const selectionKey = formattingWorldPlazaInteractableTreeSelectionKey(
    tileX,
    tileY
  );

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
