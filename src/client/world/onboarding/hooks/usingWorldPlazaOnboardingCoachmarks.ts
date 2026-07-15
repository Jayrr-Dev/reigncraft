'use client';

import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { checkingWorldPlazaInventoryItemIsWeaponOrTool } from '@/components/world/inventory/domains/checkingWorldPlazaInventoryItemIsWeaponOrTool';
import { DEFINING_WORLD_PLAZA_INVENTORY_WEAPON_TOOL_SLOT_INDEX } from '@/components/world/inventory/domains/definingWorldPlazaInventoryConstants';
import {
  peekingWorldPlazaSpawnTerrainReady,
  subscribingWorldPlazaSpawnTerrainReady,
} from '@/components/world/loading/domains/managingWorldPlazaSpawnTerrainReadyStore';
import { checkingWorldPlazaInventoryHasUnequippedTool } from '@/components/world/onboarding/domains/checkingWorldPlazaInventoryHasUnequippedTool';
import {
  DEFINING_WORLD_PLAZA_ONBOARDING_ANCHOR_ATTRIBUTE,
  type WorldPlazaOnboardingCoachmarkDefinition,
} from '@/components/world/onboarding/domains/definingWorldPlazaOnboardingCoachmarkConstants';
import {
  completingWorldPlazaOnboardingCoachmarkStep,
  gettingWorldPlazaOnboardingCoachmarkSnapshot,
  initializingWorldPlazaOnboardingCoachmarkStore,
  notifyingWorldPlazaOnboardingActionBarClicked,
  notifyingWorldPlazaOnboardingHotbarClicked,
  notifyingWorldPlazaOnboardingLootPickup,
  notifyingWorldPlazaOnboardingPlayerMoved,
  subscribingWorldPlazaOnboardingCoachmarks,
} from '@/components/world/onboarding/domains/managingWorldPlazaOnboardingCoachmarkStore';
import {
  checkingWorldPlazaOnboardingChopLabelVisibleFromSelectionKeys,
  checkingWorldPlazaOnboardingCoachmarkAdvanceSatisfied,
  resolvingWorldPlazaOnboardingActiveCoachmark,
  type ResolvingWorldPlazaOnboardingCoachmarkLiveSignals,
} from '@/components/world/onboarding/domains/resolvingWorldPlazaOnboardingActiveCoachmark';
import {
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  useSyncExternalStore,
  type RefObject,
} from 'react';

export type UsingWorldPlazaOnboardingCoachmarksParams = {
  readonly storageOwnerId: string | null;
  readonly isEnabled: boolean;
  readonly playerPositionRef: RefObject<DefiningWorldPlazaWorldPoint>;
  readonly selectedInteractableBlockKeysRef: RefObject<ReadonlySet<string>>;
  readonly inventoryState: DefiningInventoryState;
};

export type UsingWorldPlazaOnboardingCoachmarksResult = {
  readonly activeCoachmark: WorldPlazaOnboardingCoachmarkDefinition | null;
  readonly dismissingActiveCoachmark: () => void;
};

function summingWorldPlazaInventoryItemQuantity(
  inventoryState: DefiningInventoryState
): number {
  let totalQuantity = 0;

  for (const slot of inventoryState.slots) {
    if (slot && slot.quantity > 0) {
      totalQuantity += slot.quantity;
    }
  }

  return totalQuantity;
}

function checkingWorldPlazaInventoryHasEquippedTool(
  inventoryState: DefiningInventoryState
): boolean {
  const equippedSlot =
    inventoryState.slots[DEFINING_WORLD_PLAZA_INVENTORY_WEAPON_TOOL_SLOT_INDEX];

  return (
    equippedSlot !== null &&
    equippedSlot.quantity > 0 &&
    checkingWorldPlazaInventoryItemIsWeaponOrTool(equippedSlot.itemTypeId)
  );
}

/**
 * Wires onboarding coachmark progression to live plaza signals.
 */
export function usingWorldPlazaOnboardingCoachmarks({
  storageOwnerId,
  isEnabled,
  playerPositionRef,
  selectedInteractableBlockKeysRef,
  inventoryState,
}: UsingWorldPlazaOnboardingCoachmarksParams): UsingWorldPlazaOnboardingCoachmarksResult {
  const onboardingSnapshot = useSyncExternalStore(
    subscribingWorldPlazaOnboardingCoachmarks,
    gettingWorldPlazaOnboardingCoachmarkSnapshot,
    gettingWorldPlazaOnboardingCoachmarkSnapshot
  );
  const isSpawnTerrainReady = useSyncExternalStore(
    subscribingWorldPlazaSpawnTerrainReady,
    peekingWorldPlazaSpawnTerrainReady,
    () => false
  );

  const spawnPositionRef = useRef<DefiningWorldPlazaWorldPoint | null>(null);
  const initialInventoryQuantityRef = useRef<number | null>(null);
  const [isChopLabelVisible, setIsChopLabelVisible] = useState(false);

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    initializingWorldPlazaOnboardingCoachmarkStore(storageOwnerId);
    spawnPositionRef.current = null;
    initialInventoryQuantityRef.current = null;
  }, [isEnabled, storageOwnerId]);

  useEffect(() => {
    if (!isEnabled || spawnPositionRef.current !== null) {
      return;
    }

    spawnPositionRef.current = {
      x: playerPositionRef.current.x,
      y: playerPositionRef.current.y,
      layer: playerPositionRef.current.layer,
    };
    initialInventoryQuantityRef.current =
      summingWorldPlazaInventoryItemQuantity(inventoryState);
  }, [inventoryState, isEnabled, playerPositionRef]);

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setIsChopLabelVisible(
        checkingWorldPlazaOnboardingChopLabelVisibleFromSelectionKeys(
          selectedInteractableBlockKeysRef.current
        )
      );

      const spawnPosition = spawnPositionRef.current;

      if (spawnPosition === null) {
        return;
      }

      const playerPosition = playerPositionRef.current;

      if (
        playerPosition.x !== spawnPosition.x ||
        playerPosition.y !== spawnPosition.y ||
        playerPosition.layer !== spawnPosition.layer
      ) {
        notifyingWorldPlazaOnboardingPlayerMoved();
      }
    }, 200);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isEnabled, playerPositionRef, selectedInteractableBlockKeysRef]);

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    const initialQuantity = initialInventoryQuantityRef.current;

    if (initialQuantity === null) {
      return;
    }

    const nextQuantity = summingWorldPlazaInventoryItemQuantity(inventoryState);

    if (nextQuantity > initialQuantity) {
      notifyingWorldPlazaOnboardingLootPickup();
    }
  }, [inventoryState, isEnabled]);

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    const handlingDocumentClick = (event: MouseEvent): void => {
      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      if (
        target.closest(
          `[${DEFINING_WORLD_PLAZA_ONBOARDING_ANCHOR_ATTRIBUTE}="hotbar"]`
        )
      ) {
        notifyingWorldPlazaOnboardingHotbarClicked();
      }

      if (
        target.closest(
          `[${DEFINING_WORLD_PLAZA_ONBOARDING_ANCHOR_ATTRIBUTE}="action-bar"]`
        )
      ) {
        notifyingWorldPlazaOnboardingActionBarClicked();
      }
    };

    document.addEventListener('click', handlingDocumentClick, true);

    return () => {
      document.removeEventListener('click', handlingDocumentClick, true);
    };
  }, [isEnabled]);

  const hasUnequippedTool =
    checkingWorldPlazaInventoryHasUnequippedTool(inventoryState);
  const hasEquippedTool =
    checkingWorldPlazaInventoryHasEquippedTool(inventoryState);

  const liveSignals: ResolvingWorldPlazaOnboardingCoachmarkLiveSignals = {
    sessionSignals: onboardingSnapshot.sessionSignals,
    isChopLabelVisible,
    hasUnequippedTool,
    hasEquippedTool,
  };

  const activeCoachmark =
    isEnabled && isSpawnTerrainReady
      ? resolvingWorldPlazaOnboardingActiveCoachmark(
          onboardingSnapshot.completedStepIds,
          liveSignals
        )
      : null;

  const completingActiveCoachmarkIfNeeded = useEffectEvent(() => {
    if (activeCoachmark === null) {
      return;
    }

    if (
      checkingWorldPlazaOnboardingCoachmarkAdvanceSatisfied(
        activeCoachmark,
        liveSignals
      )
    ) {
      completingWorldPlazaOnboardingCoachmarkStep(activeCoachmark.id);
    }
  });

  useEffect(() => {
    completingActiveCoachmarkIfNeeded();
  }, [
    activeCoachmark,
    liveSignals.hasEquippedTool,
    liveSignals.hasUnequippedTool,
    liveSignals.isChopLabelVisible,
    liveSignals.sessionSignals.hasActionBarClicked,
    liveSignals.sessionSignals.hasChopStarted,
    liveSignals.sessionSignals.hasHotbarClicked,
    liveSignals.sessionSignals.hasLootPickup,
    liveSignals.sessionSignals.hasMoved,
  ]);

  const dismissingActiveCoachmark = useEffectEvent(() => {
    if (activeCoachmark === null) {
      return;
    }

    completingWorldPlazaOnboardingCoachmarkStep(activeCoachmark.id);
  });

  return {
    activeCoachmark,
    dismissingActiveCoachmark,
  };
}
