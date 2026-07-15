'use client';

import type { DefiningInventoryItem } from '@/components/inventory/domains/definingInventoryItem';
import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import {
  creatingEmptyWorldPlazaArmorLoadoutState,
  type DefiningWorldPlazaArmorLoadoutState,
} from '@/components/world/equipment/domains/definingWorldPlazaArmorLoadoutTypes';
import {
  equippingWorldPlazaArmorItemFromInventory,
  unequippingWorldPlazaArmorSlotToInventory,
} from '@/components/world/equipment/domains/equippingWorldPlazaArmorItemFromInventory';
import {
  readingWorldPlazaArmorLoadoutFromStorage,
  resolvingWorldPlazaArmorLoadoutStorageKey,
  writingWorldPlazaArmorLoadoutToStorage,
} from '@/components/world/equipment/domains/managingWorldPlazaArmorLoadoutStore';
import type { DefiningWorldPlazaArmorSlotId } from '@/components/world/equipment/domains/definingWorldPlazaArmorSlotRegistry';
import { resolvingWorldPlazaArmorSlotsForAvatarSkin } from '@/components/world/equipment/domains/resolvingWorldPlazaArmorSlotsForAvatarSkin';
import { syncingWorldPlazaArmorWornTemperatureModifiers } from '@/components/world/equipment/domains/syncingWorldPlazaArmorWornTemperatureModifiers';
import type { DefiningWorldPlazaEntityHealthState } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import { usingWorldPlazaSelectedAvatarSkin } from '@/components/world/hooks/usingWorldPlazaSelectedAvatarSkin';
import type { PlazaSaveSlotIndex } from '../../../../shared/plazaGameSession';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export type UsingWorldPlazaArmorLoadoutParams = {
  readonly localPersistenceOwnerId: string | null;
  readonly saveSlotIndex?: PlazaSaveSlotIndex | null;
  readonly healthStateRef: React.RefObject<DefiningWorldPlazaEntityHealthState>;
  readonly syncingHealthHudFromStateRef: React.MutableRefObject<
    (state: DefiningWorldPlazaEntityHealthState) => void
  >;
};

export type UsingWorldPlazaArmorLoadoutResult = {
  readonly loadoutState: DefiningWorldPlazaArmorLoadoutState;
  readonly equippingArmorItem: (
    inventoryState: DefiningInventoryState,
    item: DefiningInventoryItem
  ) => {
    inventoryState: DefiningInventoryState;
    errorMessage: string | null;
  };
  readonly unequippingArmorSlot: (
    inventoryState: DefiningInventoryState,
    slotId: DefiningWorldPlazaArmorSlotId
  ) => {
    inventoryState: DefiningInventoryState;
    errorMessage: string | null;
  };
  readonly isArmorItemEquipped: (itemTypeId: string) => boolean;
};

export function usingWorldPlazaArmorLoadout({
  localPersistenceOwnerId,
  saveSlotIndex,
  healthStateRef,
  syncingHealthHudFromStateRef,
}: UsingWorldPlazaArmorLoadoutParams): UsingWorldPlazaArmorLoadoutResult {
  const selectedAvatarSkinId = usingWorldPlazaSelectedAvatarSkin();
  const bodyPlanId = useMemo(() => {
    const slots = resolvingWorldPlazaArmorSlotsForAvatarSkin(selectedAvatarSkinId);
    return slots.some((slot) => slot.id === 'torso') ? 'animal' : 'humanoid';
  }, [selectedAvatarSkinId]);

  const storageKey = useMemo(() => {
    if (!localPersistenceOwnerId) {
      return null;
    }

    return resolvingWorldPlazaArmorLoadoutStorageKey(
      localPersistenceOwnerId,
      saveSlotIndex
    );
  }, [localPersistenceOwnerId, saveSlotIndex]);

  const [loadoutState, setLoadoutState] =
    useState<DefiningWorldPlazaArmorLoadoutState>(
      creatingEmptyWorldPlazaArmorLoadoutState
    );

  const loadoutStateRef = useRef(loadoutState);
  loadoutStateRef.current = loadoutState;

  const applyingLoadoutTemperatureModifiers = useCallback(
    (nextLoadout: DefiningWorldPlazaArmorLoadoutState) => {
      const nowMs = performance.now();
      healthStateRef.current = syncingWorldPlazaArmorWornTemperatureModifiers(
        healthStateRef.current,
        nextLoadout,
        nowMs
      );
      syncingHealthHudFromStateRef.current(healthStateRef.current);
    },
    [healthStateRef, syncingHealthHudFromStateRef]
  );

  useEffect(() => {
    if (!storageKey) {
      setLoadoutState(creatingEmptyWorldPlazaArmorLoadoutState());
      return;
    }

    const stored = readingWorldPlazaArmorLoadoutFromStorage(storageKey);
    const hydrated = stored ?? creatingEmptyWorldPlazaArmorLoadoutState();
    setLoadoutState(hydrated);
    applyingLoadoutTemperatureModifiers(hydrated);
  }, [storageKey, applyingLoadoutTemperatureModifiers]);

  const persistLoadout = useCallback(
    (nextLoadout: DefiningWorldPlazaArmorLoadoutState) => {
      if (storageKey) {
        writingWorldPlazaArmorLoadoutToStorage(storageKey, nextLoadout);
      }
    },
    [storageKey]
  );

  const equippingArmorItem = useCallback(
    (inventoryState: DefiningInventoryState, item: DefiningInventoryItem) => {
      const result = equippingWorldPlazaArmorItemFromInventory({
        inventoryState,
        loadoutState: loadoutStateRef.current,
        item,
        bodyPlanId,
      });

      if (!result.errorMessage) {
        setLoadoutState(result.loadoutState);
        persistLoadout(result.loadoutState);
        applyingLoadoutTemperatureModifiers(result.loadoutState);
      }

      return {
        inventoryState: result.inventoryState,
        errorMessage: result.errorMessage,
      };
    },
    [applyingLoadoutTemperatureModifiers, bodyPlanId, persistLoadout]
  );

  const unequippingArmorSlot = useCallback(
    (
      inventoryState: DefiningInventoryState,
      slotId: DefiningWorldPlazaArmorSlotId
    ) => {
      const result = unequippingWorldPlazaArmorSlotToInventory({
        inventoryState,
        loadoutState: loadoutStateRef.current,
        slotId,
      });

      if (!result.errorMessage) {
        setLoadoutState(result.loadoutState);
        persistLoadout(result.loadoutState);
        applyingLoadoutTemperatureModifiers(result.loadoutState);
      }

      return {
        inventoryState: result.inventoryState,
        errorMessage: result.errorMessage,
      };
    },
    [applyingLoadoutTemperatureModifiers, persistLoadout]
  );

  const isArmorItemEquipped = useCallback((itemTypeId: string) => {
    return Object.values(loadoutStateRef.current).some(
      (slot) => slot?.itemTypeId === itemTypeId
    );
  }, []);

  return {
    loadoutState,
    equippingArmorItem,
    unequippingArmorSlot,
    isArmorItemEquipped,
  };
}
