'use client';

/**
 * Dev Pets tab: grant loyalty to nearest dog and toggle overhead readout.
 *
 * @module components/world/wildlife/pets/components/renderingWorldPlazaDevModePetControls
 */

import {
  STYLING_WORLD_PLAZA_DEV_MODE_PANEL_ACTION_BUTTON_ACTIVE_CLASS_NAME,
  STYLING_WORLD_PLAZA_DEV_MODE_PANEL_ACTION_BUTTON_CLASS_NAME,
  STYLING_WORLD_PLAZA_DEV_MODE_PANEL_HINT_CLASS_NAME,
  STYLING_WORLD_PLAZA_DEV_MODE_PANEL_SECTION_LABEL_CLASS_NAME,
  STYLING_WORLD_PLAZA_DEV_MODE_PANEL_SURFACE_CLASS_NAME,
} from '@/components/world/domains/definingWorldPlazaDevModePanelConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { ManagingWildlifeInstanceStore } from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import type { ApplyingWildlifePetDevLoyaltyGrantKind } from '@/components/world/wildlife/pets/domains/applyingWildlifePetDevLoyaltyGrant';
import {
  DEFINING_WILDLIFE_PET_DEV_LOYALTY_GRANT_LARGE,
  DEFINING_WILDLIFE_PET_DEV_LOYALTY_GRANT_MEDIUM,
  DEFINING_WILDLIFE_PET_DEV_LOYALTY_GRANT_PETTING,
  LABELING_WILDLIFE_PET_DEV_HINT,
  LABELING_WILDLIFE_PET_DEV_LOYALTY_OVERLAY_TOGGLE,
  LABELING_WILDLIFE_PET_DEV_SECTION,
} from '@/components/world/wildlife/pets/domains/definingWildlifePetDevLoyaltyConstants';
import { findingWildlifeNearestPettableInstance } from '@/components/world/wildlife/pets/domains/findingWildlifeNearestPettableInstance';
import { formattingWildlifePetLoyaltyDebugLabel } from '@/components/world/wildlife/pets/domains/formattingWildlifePetLoyaltyDebugLabel';
import { usingWildlifePetLoyaltyDebugVisibleState } from '@/components/world/wildlife/pets/hooks/usingWildlifePetLoyaltyDebugVisibleState';
import { useSyncExternalStore } from 'react';

export type RenderingWorldPlazaDevModePetControlsProps = {
  readonly wildlifeStoreRef: React.RefObject<ManagingWildlifeInstanceStore>;
  readonly playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>;
  readonly onApplyNearestDogLoyalty: (
    grant: ApplyingWildlifePetDevLoyaltyGrantKind
  ) => void;
};

function readingNearestDogLoyaltySnapshot(
  wildlifeStoreRef: React.RefObject<ManagingWildlifeInstanceStore>,
  playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>
): string {
  const store = wildlifeStoreRef.current;
  const playerPosition = playerPositionRef.current;

  if (!store || !playerPosition) {
    return 'No player position.';
  }

  const nearestDog = findingWildlifeNearestPettableInstance({
    store,
    origin: playerPosition,
    petKind: 'dog',
  });

  if (!nearestDog) {
    return 'No living dog nearby. Spawn one from Wildlife → Spawner.';
  }

  const species = resolvingWildlifeSpeciesDefinition(nearestDog.speciesId);
  const speciesLabel = species?.displayName ?? nearestDog.speciesId;
  const loyaltyLabel = formattingWildlifePetLoyaltyDebugLabel(
    nearestDog.petBond?.loyalty
  );

  return `${speciesLabel}: ${loyaltyLabel}`;
}

/**
 * Pets QA controls: overhead loyalty toggle + nearest-dog loyalty grants.
 */
export function RenderingWorldPlazaDevModePetControls({
  wildlifeStoreRef,
  playerPositionRef,
  onApplyNearestDogLoyalty,
}: RenderingWorldPlazaDevModePetControlsProps): React.JSX.Element {
  const { isLoyaltyDebugVisible, togglingLoyaltyDebugVisible } =
    usingWildlifePetLoyaltyDebugVisibleState();

  // Poll nearest-dog readout while the Pets view is open.
  const nearestDogReadout = useSyncExternalStore(
    (onStoreChange) => {
      const intervalId = window.setInterval(onStoreChange, 400);
      return () => {
        window.clearInterval(intervalId);
      };
    },
    () => readingNearestDogLoyaltySnapshot(wildlifeStoreRef, playerPositionRef),
    () => 'No living dog nearby.'
  );

  return (
    <div className="flex flex-col gap-2">
      <span
        className={STYLING_WORLD_PLAZA_DEV_MODE_PANEL_SECTION_LABEL_CLASS_NAME}
      >
        {LABELING_WILDLIFE_PET_DEV_SECTION}
      </span>

      <div className={STYLING_WORLD_PLAZA_DEV_MODE_PANEL_HINT_CLASS_NAME}>
        {LABELING_WILDLIFE_PET_DEV_HINT}
      </div>

      <div className={STYLING_WORLD_PLAZA_DEV_MODE_PANEL_SURFACE_CLASS_NAME}>
        {nearestDogReadout}
      </div>

      <button
        type="button"
        aria-pressed={isLoyaltyDebugVisible}
        className={`${STYLING_WORLD_PLAZA_DEV_MODE_PANEL_ACTION_BUTTON_CLASS_NAME} ${
          isLoyaltyDebugVisible
            ? STYLING_WORLD_PLAZA_DEV_MODE_PANEL_ACTION_BUTTON_ACTIVE_CLASS_NAME
            : ''
        }`}
        onClick={togglingLoyaltyDebugVisible}
      >
        {LABELING_WILDLIFE_PET_DEV_LOYALTY_OVERLAY_TOGGLE}
      </button>

      <button
        type="button"
        className={STYLING_WORLD_PLAZA_DEV_MODE_PANEL_ACTION_BUTTON_CLASS_NAME}
        onClick={() => {
          onApplyNearestDogLoyalty({
            kind: 'add',
            amount: DEFINING_WILDLIFE_PET_DEV_LOYALTY_GRANT_PETTING,
          });
        }}
      >
        +{DEFINING_WILDLIFE_PET_DEV_LOYALTY_GRANT_PETTING} loyalty (pet)
      </button>

      <button
        type="button"
        className={STYLING_WORLD_PLAZA_DEV_MODE_PANEL_ACTION_BUTTON_CLASS_NAME}
        onClick={() => {
          onApplyNearestDogLoyalty({
            kind: 'add',
            amount: DEFINING_WILDLIFE_PET_DEV_LOYALTY_GRANT_MEDIUM,
          });
        }}
      >
        +{DEFINING_WILDLIFE_PET_DEV_LOYALTY_GRANT_MEDIUM} loyalty
      </button>

      <button
        type="button"
        className={STYLING_WORLD_PLAZA_DEV_MODE_PANEL_ACTION_BUTTON_CLASS_NAME}
        onClick={() => {
          onApplyNearestDogLoyalty({
            kind: 'add',
            amount: DEFINING_WILDLIFE_PET_DEV_LOYALTY_GRANT_LARGE,
          });
        }}
      >
        +{DEFINING_WILDLIFE_PET_DEV_LOYALTY_GRANT_LARGE} loyalty
      </button>

      <button
        type="button"
        className={STYLING_WORLD_PLAZA_DEV_MODE_PANEL_ACTION_BUTTON_CLASS_NAME}
        onClick={() => {
          onApplyNearestDogLoyalty({ kind: 'next-tier' });
        }}
      >
        Jump to next tier
      </button>

      <button
        type="button"
        className={STYLING_WORLD_PLAZA_DEV_MODE_PANEL_ACTION_BUTTON_CLASS_NAME}
        onClick={() => {
          onApplyNearestDogLoyalty({ kind: 'max' });
        }}
      >
        Max loyalty (Bonded)
      </button>
    </div>
  );
}
