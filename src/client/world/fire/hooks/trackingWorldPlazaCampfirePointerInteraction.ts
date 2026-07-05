'use client';

import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CAMPFIRE } from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { trackingWorldPlazaInteractableBlockPointerInteraction } from '@/components/world/interaction/hooks/trackingWorldPlazaInteractableBlockPointerInteraction';

export type TrackingWorldPlazaCampfirePointerInteractionParams = {
  readonly isEnabled: boolean;
  readonly playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>;
  readonly placedBlocks: readonly DefiningWorldBuildingPlacedBlock[];
  readonly selectingCampfireForInteractionLabel: (
    block: DefiningWorldBuildingPlacedBlock
  ) => void;
};

export type TrackingWorldPlazaCampfirePointerInteractionResult = {
  readonly handlingCampfirePointerDown: (
    pointerGridPoint: DefiningWorldPlazaWorldPoint | null
  ) => boolean;
};

/**
 * Opens the campfire interaction popover on a forgiving click near a campfire.
 *
 * Thin wrapper over the shared interactable-block pointer dispatcher.
 */
export function trackingWorldPlazaCampfirePointerInteraction({
  isEnabled,
  playerPositionRef,
  placedBlocks,
  selectingCampfireForInteractionLabel,
}: TrackingWorldPlazaCampfirePointerInteractionParams): TrackingWorldPlazaCampfirePointerInteractionResult {
  const { handlingInteractableBlockPointerDown } =
    trackingWorldPlazaInteractableBlockPointerInteraction({
      isEnabled,
      actorUserId: null,
      playerPositionRef,
      placedBlocks,
      handlers: {
        [DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CAMPFIRE]:
          selectingCampfireForInteractionLabel,
      },
    });

  return {
    handlingCampfirePointerDown: handlingInteractableBlockPointerDown,
  };
}
