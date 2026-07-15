'use client';

import { useUserData } from '@/components/hooks/useAuth';
import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import { checkingWorldPlazaAvatarTransformControlVisible } from '@/components/world/domains/checkingWorldPlazaAvatarTransformControlVisible';
import {
  DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID,
  type DefiningWorldPlazaHudToolbarModeId,
} from '@/components/world/domains/definingWorldPlazaHudToolbarModeRegistry';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { listingWorldPlazaAvatarSkinOptionsForUser } from '@/components/world/domains/listingWorldPlazaAvatarSkinOptionsForUser';
import {
  gettingWorldPlazaBestiaryStudyCountsSnapshot,
  subscribingWorldPlazaBestiaryDiscovery,
} from '@/components/world/domains/managingWorldPlazaBestiaryDiscoveryStore';
import type { DefiningWorldPlazaEntityTemperatureComfortBand } from '@/components/world/health/domains/definingWorldPlazaTemperatureTypes';
import { usingWorldPlazaMinimapEnabled } from '@/components/world/hooks/usingWorldPlazaMinimapEnabled';
import { usingWorldPlazaSelectedAvatarSkin } from '@/components/world/hooks/usingWorldPlazaSelectedAvatarSkin';
import { checkingWorldPlazaInventoryItemIsWeaponOrTool } from '@/components/world/inventory/domains/checkingWorldPlazaInventoryItemIsWeaponOrTool';
import { DEFINING_WORLD_PLAZA_INVENTORY_WEAPON_TOOL_SLOT_INDEX } from '@/components/world/inventory/domains/definingWorldPlazaInventoryConstants';
import {
  peekingWorldPlazaSpawnTerrainReady,
  subscribingWorldPlazaSpawnTerrainReady,
} from '@/components/world/loading/domains/managingWorldPlazaSpawnTerrainReadyStore';
import { checkingWorldPlazaInventoryHasEquippedPickaxe } from '@/components/world/onboarding/domains/checkingWorldPlazaInventoryHasEquippedPickaxe';
import { checkingWorldPlazaInventoryHasRawCookableMeat } from '@/components/world/onboarding/domains/checkingWorldPlazaInventoryHasRawCookableMeat';
import { checkingWorldPlazaInventoryHasUnequippedTool } from '@/components/world/onboarding/domains/checkingWorldPlazaInventoryHasUnequippedTool';
import { checkingWorldPlazaOnboardingHostileWildlifeNearby } from '@/components/world/onboarding/domains/checkingWorldPlazaOnboardingHostileWildlifeNearby';
import {
  DEFINING_WORLD_PLAZA_ONBOARDING_ANCHOR_ATTRIBUTE,
  type WorldPlazaOnboardingCoachmarkDefinition,
} from '@/components/world/onboarding/domains/definingWorldPlazaOnboardingCoachmarkConstants';
import {
  completingWorldPlazaOnboardingCoachmarkStep,
  gettingWorldPlazaOnboardingCoachmarkSnapshot,
  initializingWorldPlazaOnboardingCoachmarkStore,
  notifyingWorldPlazaOnboardingActionBarClicked,
  notifyingWorldPlazaOnboardingBuildModeSelected,
  notifyingWorldPlazaOnboardingClaimModeSelected,
  notifyingWorldPlazaOnboardingCodexOpened,
  notifyingWorldPlazaOnboardingCraftModeSelected,
  notifyingWorldPlazaOnboardingHotbarClicked,
  notifyingWorldPlazaOnboardingHungerClicked,
  notifyingWorldPlazaOnboardingLootPickup,
  notifyingWorldPlazaOnboardingMinimapOpened,
  notifyingWorldPlazaOnboardingPetsOpened,
  notifyingWorldPlazaOnboardingPlayerMoved,
  notifyingWorldPlazaOnboardingProfileOpened,
  notifyingWorldPlazaOnboardingSprinted,
  notifyingWorldPlazaOnboardingStaminaDepleted,
  notifyingWorldPlazaOnboardingStatusEffectClicked,
  notifyingWorldPlazaOnboardingTemperatureClicked,
  notifyingWorldPlazaOnboardingTransformOpened,
  subscribingWorldPlazaOnboardingCoachmarks,
} from '@/components/world/onboarding/domains/managingWorldPlazaOnboardingCoachmarkStore';
import {
  checkingWorldPlazaOnboardingChopLabelVisibleFromSelectionKeys,
  checkingWorldPlazaOnboardingCoachmarkAdvanceSatisfied,
  checkingWorldPlazaOnboardingCorpseStudyLabelVisibleFromSelectionKeys,
  checkingWorldPlazaOnboardingForageLabelVisibleFromSelectionKeys,
  checkingWorldPlazaOnboardingRockMineLabelVisibleFromSelectionKeys,
  resolvingWorldPlazaOnboardingActiveCoachmark,
  type ResolvingWorldPlazaOnboardingCoachmarkLiveSignals,
} from '@/components/world/onboarding/domains/resolvingWorldPlazaOnboardingActiveCoachmark';
import { countingWorldPlazaSpritcoreInventoryQuantity } from '@/components/world/spritcore/domains/countingWorldPlazaSpritcoreInventoryQuantity';
import type { ManagingWildlifeInstanceStore } from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import {
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type RefObject,
} from 'react';

export type UsingWorldPlazaOnboardingCoachmarksParams = {
  readonly storageOwnerId: string | null;
  readonly isEnabled: boolean;
  readonly playerUserId: string | null;
  readonly playerPositionRef: RefObject<DefiningWorldPlazaWorldPoint>;
  readonly wildlifeStoreRef: RefObject<ManagingWildlifeInstanceStore>;
  readonly selectedInteractableBlockKeysRef: RefObject<ReadonlySet<string>>;
  readonly inventoryState: DefiningInventoryState;
  readonly hudToolbarMode: DefiningWorldPlazaHudToolbarModeId;
  readonly isEditEnabled: boolean;
  readonly hungerRatio: number | null;
  readonly localTemperatureCelsius: number | null;
  readonly temperatureComfortBand: DefiningWorldPlazaEntityTemperatureComfortBand | null;
  readonly hasAnyPets: boolean;
  readonly staminaRatio: number;
  readonly isRunning: boolean;
  readonly isStaminaDepleted: boolean;
  readonly statusEffectCount: number;
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
  playerUserId,
  playerPositionRef,
  wildlifeStoreRef,
  selectedInteractableBlockKeysRef,
  inventoryState,
  hudToolbarMode,
  isEditEnabled,
  hungerRatio,
  localTemperatureCelsius,
  temperatureComfortBand,
  hasAnyPets,
  staminaRatio,
  isRunning,
  isStaminaDepleted,
  statusEffectCount,
}: UsingWorldPlazaOnboardingCoachmarksParams): UsingWorldPlazaOnboardingCoachmarksResult {
  const { data: userData } = useUserData();
  const selectedAvatarSkinId = usingWorldPlazaSelectedAvatarSkin();
  const studyCountsBySpeciesId = useSyncExternalStore(
    subscribingWorldPlazaBestiaryDiscovery,
    gettingWorldPlazaBestiaryStudyCountsSnapshot,
    gettingWorldPlazaBestiaryStudyCountsSnapshot
  );
  const unlockedAvatarSkinOptions = useMemo(
    () =>
      listingWorldPlazaAvatarSkinOptionsForUser(
        userData?.username,
        userData?.alias,
        studyCountsBySpeciesId
      ),
    [studyCountsBySpeciesId, userData?.alias, userData?.username]
  );
  const isTransformControlVisible =
    checkingWorldPlazaAvatarTransformControlVisible(
      unlockedAvatarSkinOptions,
      selectedAvatarSkinId
    );
  const { isMinimapPreferenceEnabled: isMinimapOpen } =
    usingWorldPlazaMinimapEnabled();
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
  const [isForageLabelVisible, setIsForageLabelVisible] = useState(false);
  const [isMineLabelVisible, setIsMineLabelVisible] = useState(false);
  const [isCorpseStudyLabelVisible, setIsCorpseStudyLabelVisible] =
    useState(false);
  const [isHostileWildlifeNearby, setIsHostileWildlifeNearby] = useState(false);

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    // Hydrate owner only. Play-session restart (session-signal clear) lives in
    // PixiScene so enabling tips mid-run cannot wipe move/mode signals.
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

    if (hudToolbarMode === DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.CRAFT) {
      notifyingWorldPlazaOnboardingCraftModeSelected();
    }

    if (hudToolbarMode === DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.BUILD) {
      notifyingWorldPlazaOnboardingBuildModeSelected();
    }

    if (hudToolbarMode === DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.CLAIM) {
      notifyingWorldPlazaOnboardingClaimModeSelected();
    }
  }, [hudToolbarMode, isEnabled]);

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    const intervalId = window.setInterval(() => {
      const selectedInteractableBlockKeys =
        selectedInteractableBlockKeysRef.current;

      setIsChopLabelVisible(
        checkingWorldPlazaOnboardingChopLabelVisibleFromSelectionKeys(
          selectedInteractableBlockKeys
        )
      );
      setIsForageLabelVisible(
        checkingWorldPlazaOnboardingForageLabelVisibleFromSelectionKeys(
          selectedInteractableBlockKeys
        )
      );
      setIsMineLabelVisible(
        checkingWorldPlazaOnboardingRockMineLabelVisibleFromSelectionKeys(
          selectedInteractableBlockKeys
        )
      );
      setIsCorpseStudyLabelVisible(
        checkingWorldPlazaOnboardingCorpseStudyLabelVisibleFromSelectionKeys(
          selectedInteractableBlockKeys
        )
      );
      setIsHostileWildlifeNearby(
        checkingWorldPlazaOnboardingHostileWildlifeNearby(
          wildlifeStoreRef.current,
          playerPositionRef.current,
          playerUserId
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
  }, [
    isEnabled,
    playerPositionRef,
    playerUserId,
    selectedInteractableBlockKeysRef,
    wildlifeStoreRef,
  ]);

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    if (isRunning) {
      notifyingWorldPlazaOnboardingSprinted();
    }

    if (isStaminaDepleted) {
      notifyingWorldPlazaOnboardingStaminaDepleted();
    }
  }, [isEnabled, isRunning, isStaminaDepleted]);

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    if (isMinimapOpen) {
      notifyingWorldPlazaOnboardingMinimapOpened();
    }
  }, [isEnabled, isMinimapOpen]);

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

      if (
        target.closest(
          `[${DEFINING_WORLD_PLAZA_ONBOARDING_ANCHOR_ATTRIBUTE}="hunger-orb"]`
        )
      ) {
        notifyingWorldPlazaOnboardingHungerClicked();
      }

      if (
        target.closest(
          `[${DEFINING_WORLD_PLAZA_ONBOARDING_ANCHOR_ATTRIBUTE}="temperature-orb"]`
        )
      ) {
        notifyingWorldPlazaOnboardingTemperatureClicked();
      }

      if (
        target.closest(
          `[${DEFINING_WORLD_PLAZA_ONBOARDING_ANCHOR_ATTRIBUTE}="codex-book"]`
        )
      ) {
        notifyingWorldPlazaOnboardingCodexOpened();
      }

      if (
        target.closest(
          `[${DEFINING_WORLD_PLAZA_ONBOARDING_ANCHOR_ATTRIBUTE}="profile-panel"]`
        )
      ) {
        notifyingWorldPlazaOnboardingProfileOpened();
      }

      if (
        target.closest(
          `[${DEFINING_WORLD_PLAZA_ONBOARDING_ANCHOR_ATTRIBUTE}="pets-roster"]`
        )
      ) {
        notifyingWorldPlazaOnboardingPetsOpened();
      }

      if (
        target.closest(
          `[${DEFINING_WORLD_PLAZA_ONBOARDING_ANCHOR_ATTRIBUTE}="transform-control"]`
        )
      ) {
        notifyingWorldPlazaOnboardingTransformOpened();
      }

      if (
        target.closest(
          `[${DEFINING_WORLD_PLAZA_ONBOARDING_ANCHOR_ATTRIBUTE}="hud-toolbar-craft"]`
        )
      ) {
        notifyingWorldPlazaOnboardingCraftModeSelected();
      }

      if (
        target.closest(
          `[${DEFINING_WORLD_PLAZA_ONBOARDING_ANCHOR_ATTRIBUTE}="hud-toolbar-build-claim"]`
        )
      ) {
        if (hudToolbarMode === DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.BUILD) {
          notifyingWorldPlazaOnboardingBuildModeSelected();
        }

        if (hudToolbarMode === DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.CLAIM) {
          notifyingWorldPlazaOnboardingClaimModeSelected();
        }
      }

      if (
        target.closest(
          `[${DEFINING_WORLD_PLAZA_ONBOARDING_ANCHOR_ATTRIBUTE}="minimap-orb"]`
        )
      ) {
        notifyingWorldPlazaOnboardingMinimapOpened();
      }

      if (
        target.closest(
          `[${DEFINING_WORLD_PLAZA_ONBOARDING_ANCHOR_ATTRIBUTE}="status-effect-stack"]`
        )
      ) {
        notifyingWorldPlazaOnboardingStatusEffectClicked();
      }
    };

    document.addEventListener('click', handlingDocumentClick, true);

    return () => {
      document.removeEventListener('click', handlingDocumentClick, true);
    };
  }, [hudToolbarMode, isEnabled]);

  const hasUnequippedTool =
    checkingWorldPlazaInventoryHasUnequippedTool(inventoryState);
  const hasEquippedTool =
    checkingWorldPlazaInventoryHasEquippedTool(inventoryState);
  const hasEquippedPickaxe =
    checkingWorldPlazaInventoryHasEquippedPickaxe(inventoryState);
  const hasRawCookableMeat =
    checkingWorldPlazaInventoryHasRawCookableMeat(inventoryState);
  const spritcoreInventoryQuantity =
    countingWorldPlazaSpritcoreInventoryQuantity(inventoryState);

  const liveSignals: ResolvingWorldPlazaOnboardingCoachmarkLiveSignals = {
    sessionSignals: onboardingSnapshot.sessionSignals,
    hudToolbarMode,
    isEditEnabled,
    hungerRatio,
    localTemperatureCelsius,
    temperatureComfortBand,
    spritcoreInventoryQuantity,
    hasAnyPets,
    isChopLabelVisible,
    isForageLabelVisible,
    isMineLabelVisible,
    isCorpseStudyLabelVisible,
    hasUnequippedTool,
    hasEquippedTool,
    hasEquippedPickaxe,
    isHostileWildlifeNearby,
    hasRawCookableMeat,
    isMinimapOpen,
    isTransformControlVisible,
    staminaRatio,
    isRunning,
    isStaminaDepleted,
    statusEffectCount,
  };

  const activeCoachmark =
    isEnabled && isSpawnTerrainReady && storageOwnerId !== null
      ? resolvingWorldPlazaOnboardingActiveCoachmark(
          onboardingSnapshot.completedStepIds,
          liveSignals
        )
      : null;

  const forageCoachmarkSeenRef = useRef(false);

  useEffect(() => {
    if (activeCoachmark?.id === 'forage') {
      forageCoachmarkSeenRef.current = true;
    }
  }, [activeCoachmark?.id]);

  useEffect(() => {
    if (
      !forageCoachmarkSeenRef.current ||
      isForageLabelVisible ||
      onboardingSnapshot.completedStepIds.has('forage')
    ) {
      return;
    }

    completingWorldPlazaOnboardingCoachmarkStep('forage');
  }, [isForageLabelVisible, onboardingSnapshot.completedStepIds]);

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
    hasAnyPets,
    hasEquippedPickaxe,
    hasEquippedTool,
    hasRawCookableMeat,
    hasUnequippedTool,
    hudToolbarMode,
    hungerRatio,
    isChopLabelVisible,
    isCorpseStudyLabelVisible,
    isEditEnabled,
    isForageLabelVisible,
    isHostileWildlifeNearby,
    isMineLabelVisible,
    isMinimapOpen,
    isRunning,
    isStaminaDepleted,
    isTransformControlVisible,
    localTemperatureCelsius,
    spritcoreInventoryQuantity,
    staminaRatio,
    statusEffectCount,
    temperatureComfortBand,
    liveSignals.sessionSignals.hasActionBarClicked,
    liveSignals.sessionSignals.hasBuildModeSelected,
    liveSignals.sessionSignals.hasChopStarted,
    liveSignals.sessionSignals.hasClaimModeSelected,
    liveSignals.sessionSignals.hasCodexOpened,
    liveSignals.sessionSignals.hasCookStarted,
    liveSignals.sessionSignals.hasCraftModeSelected,
    liveSignals.sessionSignals.hasForagePicked,
    liveSignals.sessionSignals.hasHerbariumCodexOpened,
    liveSignals.sessionSignals.hasHotbarClicked,
    liveSignals.sessionSignals.hasHungerClicked,
    liveSignals.sessionSignals.hasLootPickup,
    liveSignals.sessionSignals.hasMeleeSwung,
    liveSignals.sessionSignals.hasMineStarted,
    liveSignals.sessionSignals.hasMinimapOpened,
    liveSignals.sessionSignals.hasMoved,
    liveSignals.sessionSignals.hasPetsOpened,
    liveSignals.sessionSignals.hasProfileOpened,
    liveSignals.sessionSignals.hasSprinted,
    liveSignals.sessionSignals.hasStaminaDepleted,
    liveSignals.sessionSignals.hasStatusEffectClicked,
    liveSignals.sessionSignals.hasStudyStarted,
    liveSignals.sessionSignals.hasTemperatureClicked,
    liveSignals.sessionSignals.hasTransformOpened,
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
