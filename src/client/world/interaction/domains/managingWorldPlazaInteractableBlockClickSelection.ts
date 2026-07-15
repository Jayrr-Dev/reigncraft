import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { formattingWorldPlazaFarmlandTileSelectionKey } from '@/components/world/farming/domains/formattingWorldPlazaFarmlandTileSelectionKey';
import type { DefiningWorldPlazaFarmlandInteractionKind } from '@/components/world/farming/domains/listingWorldPlazaFarmlandTilesInInteractionRange';
import { formattingWorldPlazaFishingTileSelectionKey } from '@/components/world/fishing/domains/formattingWorldPlazaFishingTileSelectionKey';
import { formattingWorldPlazaWetClayTileSelectionKey } from '@/components/world/wet-clay/domains/formattingWorldPlazaWetClayTileSelectionKey';
import { formattingWorldPlazaTeaPotAddWaterTileSelectionKey } from '@/components/world/tea-brewing/domains/formattingWorldPlazaTeaPotAddWaterTileSelectionKey';
import { formattingWorldPlazaTreeStumpStudySelectionKey } from '@/components/world/harvest/domains/formattingWorldPlazaTreeStumpStudySelectionKey';
import { formattingWorldPlazaInteractableBlockSelectionKey } from '@/components/world/interaction/domains/formattingWorldPlazaInteractableBlockSelectionKey';
import { formattingWorldPlazaInteractableFlowerSelectionKey } from '@/components/world/interaction/domains/formattingWorldPlazaInteractableFlowerSelectionKey';
import { formattingWorldPlazaInteractableLongGrassSelectionKey } from '@/components/world/interaction/domains/formattingWorldPlazaInteractableLongGrassSelectionKey';
import { formattingWorldPlazaInteractablePebbleSelectionKey } from '@/components/world/interaction/domains/formattingWorldPlazaInteractablePebbleSelectionKey';
import { formattingWorldPlazaInteractableRockSelectionKey } from '@/components/world/interaction/domains/formattingWorldPlazaInteractableRockSelectionKey';
import { formattingWorldPlazaInteractableShrubSelectionKey } from '@/components/world/interaction/domains/formattingWorldPlazaInteractableShrubSelectionKey';
import { formattingWorldPlazaInteractableChestSelectionKey } from '@/components/world/chest/domains/formattingWorldPlazaInteractableChestSelectionKey';
import type { DefiningWorldPlazaChestId } from '@/components/world/chest/domains/definingWorldPlazaChestTypes';
import { formattingWorldPlazaInteractableTreeSelectionKey } from '@/components/world/interaction/domains/formattingWorldPlazaInteractableTreeSelectionKey';
import { formattingWildlifeCorpseStudySelectionKey } from '@/components/world/wildlife/domains/formattingWildlifeCorpseStudySelectionKey';
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
 * Selects one rock anchor tile for popover-style mine interaction.
 */
export function selectingWorldPlazaInteractableRockForClickAction(
  selectedBlockKeysRef: RefObject<Set<string>>,
  anchorTileX: number,
  anchorTileY: number
): void {
  const selectionKey = formattingWorldPlazaInteractableRockSelectionKey(
    anchorTileX,
    anchorTileY
  );

  selectedBlockKeysRef.current.clear();
  selectedBlockKeysRef.current.add(selectionKey);
}

/**
 * Selects one floor pebble tile for popover-style pick interaction.
 */
export function selectingWorldPlazaInteractablePebbleForClickAction(
  selectedBlockKeysRef: RefObject<Set<string>>,
  tileX: number,
  tileY: number
): void {
  const selectionKey = formattingWorldPlazaInteractablePebbleSelectionKey(
    tileX,
    tileY
  );

  selectedBlockKeysRef.current.clear();
  selectedBlockKeysRef.current.add(selectionKey);
}

/**
 * Selects one biome flower tile for popover-style pick interaction.
 */
export function selectingWorldPlazaInteractableFlowerForClickAction(
  selectedBlockKeysRef: RefObject<Set<string>>,
  tileX: number,
  tileY: number
): void {
  const selectionKey = formattingWorldPlazaInteractableFlowerSelectionKey(
    tileX,
    tileY
  );

  selectedBlockKeysRef.current.clear();
  selectedBlockKeysRef.current.add(selectionKey);
}

/**
 * Selects one long-grass tile for popover-style search interaction.
 */
export function selectingWorldPlazaInteractableLongGrassForClickAction(
  selectedBlockKeysRef: RefObject<Set<string>>,
  tileX: number,
  tileY: number
): void {
  const selectionKey = formattingWorldPlazaInteractableLongGrassSelectionKey(
    tileX,
    tileY
  );

  selectedBlockKeysRef.current.clear();
  selectedBlockKeysRef.current.add(selectionKey);
}

/**
 * Selects one berry-shrub tile for popover-style pick interaction.
 */
export function selectingWorldPlazaInteractableShrubForClickAction(
  selectedBlockKeysRef: RefObject<Set<string>>,
  tileX: number,
  tileY: number
): void {
  const selectionKey = formattingWorldPlazaInteractableShrubSelectionKey(
    tileX,
    tileY
  );

  selectedBlockKeysRef.current.clear();
  selectedBlockKeysRef.current.add(selectionKey);
}

/**
 * Selects one world chest for Open / Locked interaction labels.
 */
export function selectingWorldPlazaInteractableChestForClickAction(
  selectedBlockKeysRef: RefObject<Set<string>>,
  chestId: DefiningWorldPlazaChestId
): void {
  const selectionKey =
    formattingWorldPlazaInteractableChestSelectionKey(chestId);

  selectedBlockKeysRef.current.clear();
  selectedBlockKeysRef.current.add(selectionKey);
}

/**
 * Selects one wildlife corpse for the Study timed interaction.
 */
export function selectingWorldPlazaWildlifeCorpseForClickAction(
  selectedBlockKeysRef: RefObject<Set<string>>,
  instanceId: string
): void {
  const selectionKey = formattingWildlifeCorpseStudySelectionKey(instanceId);

  selectedBlockKeysRef.current.clear();
  selectedBlockKeysRef.current.add(selectionKey);
}

/**
 * Selects one felled-tree stump for the Study timed interaction.
 */
export function selectingWorldPlazaTreeStumpForClickAction(
  selectedBlockKeysRef: RefObject<Set<string>>,
  tileX: number,
  tileY: number
): void {
  const selectionKey = formattingWorldPlazaTreeStumpStudySelectionKey(
    tileX,
    tileY
  );

  selectedBlockKeysRef.current.clear();
  selectedBlockKeysRef.current.add(selectionKey);
}

/**
 * Selects one fishing water tile for popover-style cast interaction.
 */
export function selectingWorldPlazaFishingTileForClickAction(
  selectedBlockKeysRef: RefObject<Set<string>>,
  tileX: number,
  tileY: number
): void {
  const selectionKey = formattingWorldPlazaFishingTileSelectionKey(
    tileX,
    tileY
  );

  selectedBlockKeysRef.current.clear();
  selectedBlockKeysRef.current.add(selectionKey);
}

/**
 * Selects one water tile for popover-style wet-clay interaction.
 */
export function selectingWorldPlazaWetClayTileForClickAction(
  selectedBlockKeysRef: RefObject<Set<string>>,
  tileX: number,
  tileY: number
): void {
  const selectionKey = formattingWorldPlazaWetClayTileSelectionKey(
    tileX,
    tileY
  );

  selectedBlockKeysRef.current.clear();
  selectedBlockKeysRef.current.add(selectionKey);
}

/**
 * Selects one water tile for popover-style teapot Add Water interaction.
 */
export function selectingWorldPlazaTeaPotAddWaterTileForClickAction(
  selectedBlockKeysRef: RefObject<Set<string>>,
  tileX: number,
  tileY: number
): void {
  const selectionKey = formattingWorldPlazaTeaPotAddWaterTileSelectionKey(
    tileX,
    tileY
  );

  selectedBlockKeysRef.current.clear();
  selectedBlockKeysRef.current.add(selectionKey);
}

/**
 * Selects one farmland tile action for popover-style farming interaction.
 */
export function selectingWorldPlazaFarmlandTileForClickAction(
  selectedBlockKeysRef: RefObject<Set<string>>,
  tileX: number,
  tileY: number,
  interactionKind: DefiningWorldPlazaFarmlandInteractionKind
): void {
  const selectionKey = formattingWorldPlazaFarmlandTileSelectionKey(
    tileX,
    tileY,
    interactionKind
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
