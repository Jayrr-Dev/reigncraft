'use client';

import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import type { DefiningWorldPlazaOreSmeltingStationSlotKind } from '@/components/world/crafting/domains/definingWorldPlazaOreSmeltingDndIds';
import {
  checkingWorldPlazaOreSmeltingFuelItemTypeId,
  resolvingWorldPlazaOreSmeltingFuelUnitsCostForRecipe,
  resolvingWorldPlazaOreSmeltingRecipe,
} from '@/components/world/crafting/domains/definingWorldPlazaOreSmeltingRegistry';
import {
  DEFINING_WORLD_PLAZA_EMPTY_ORE_SMELTING_STATION_STATE,
  checkingWorldPlazaOreSmeltingCanStartUnit,
  resolvingWorldPlazaOreSmeltingStationCatchUpToNow,
  resolvingWorldPlazaOreSmeltingStationMaybeStart,
  type DefiningWorldPlazaOreSmeltingStationState,
} from '@/components/world/crafting/domains/resolvingWorldPlazaOreSmeltingStationAdvance';
import { resolvingWorldPlazaOreSmeltingStationCapacity } from '@/components/world/crafting/domains/resolvingWorldPlazaOreSmeltingStationCapacity';
import { consumingWorldPlazaInventoryItemFromSlot } from '@/components/world/inventory/domains/consumingWorldPlazaInventoryItemFromSlot';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_CLAY,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export type { DefiningWorldPlazaOreSmeltingStationState };

/** How often idle / distant stations catch up to wall clock. */
const DEFINING_WORLD_PLAZA_ORE_SMELTING_CATCH_UP_INTERVAL_MS = 250;

export type UsingWorldPlazaOreSmeltingStationsParams = {
  readonly inventoryState: DefiningInventoryState;
  readonly updatingInventoryState: (
    updater: (
      currentState: DefiningInventoryState
    ) => DefiningInventoryState | null
  ) => void;
  readonly addingItemWithStacking: (itemInput: {
    readonly id: string;
    readonly itemTypeId: string;
    readonly quantity: number;
  }) => {
    readonly quantityAccepted: number;
    readonly quantityOverflow: number;
  };
  readonly showingToast: (message: string) => void;
};

export function usingWorldPlazaOreSmeltingStations({
  inventoryState,
  updatingInventoryState,
  addingItemWithStacking,
  showingToast,
}: UsingWorldPlazaOreSmeltingStationsParams) {
  const [selectedStationBlock, setSelectedStationBlock] =
    useState<DefiningWorldBuildingPlacedBlock | null>(null);
  const [stationStateByBlockId, setStationStateByBlockId] = useState<
    ReadonlyMap<string, DefiningWorldPlazaOreSmeltingStationState>
  >(new Map());
  const stationStateByBlockIdRef = useRef(stationStateByBlockId);
  stationStateByBlockIdRef.current = stationStateByBlockId;

  const selectingStation = useCallback(
    (block: DefiningWorldBuildingPlacedBlock): void => {
      setSelectedStationBlock(block);
    },
    []
  );

  const closingStation = useCallback((): void => {
    setSelectedStationBlock(null);
  }, []);

  const collectingSelectedStationOutput = useCallback((): void => {
    if (!selectedStationBlock) {
      return;
    }

    const stationState = stationStateByBlockId.get(
      selectedStationBlock.blockId
    );

    if (!stationState?.outputItemTypeId || stationState.outputQuantity < 1) {
      return;
    }

    const addResult = addingItemWithStacking({
      id: crypto.randomUUID(),
      itemTypeId: stationState.outputItemTypeId,
      quantity: stationState.outputQuantity,
    });

    if (addResult.quantityAccepted === 0) {
      showingToast('Inventory is full.');
      return;
    }

    const remainingQuantity = addResult.quantityOverflow;
    const recipe = resolvingWorldPlazaOreSmeltingRecipe(
      stationState.inputItemTypeId ?? ''
    );

    setStationStateByBlockId((currentStates) => {
      const previousState =
        currentStates.get(selectedStationBlock.blockId) ??
        DEFINING_WORLD_PLAZA_EMPTY_ORE_SMELTING_STATION_STATE;
      const afterCollect: DefiningWorldPlazaOreSmeltingStationState = {
        ...previousState,
        outputItemTypeId:
          remainingQuantity > 0 ? previousState.outputItemTypeId : null,
        outputDisplayName:
          remainingQuantity > 0 ? previousState.outputDisplayName : null,
        outputQuantity: remainingQuantity,
      };
      const nextState = resolvingWorldPlazaOreSmeltingStationMaybeStart(
        afterCollect,
        recipe,
        Date.now()
      );
      const nextStates = new Map(currentStates);
      nextStates.set(selectedStationBlock.blockId, nextState);
      return nextStates;
    });

    const collectedLabel = stationState.outputDisplayName ?? 'Smelted item';
    showingToast(
      remainingQuantity > 0
        ? `Grabbed ${addResult.quantityAccepted} ${collectedLabel}. Inventory full for the rest.`
        : `Grabbed ${addResult.quantityAccepted} ${collectedLabel}.`
    );
  }, [
    addingItemWithStacking,
    selectedStationBlock,
    showingToast,
    stationStateByBlockId,
  ]);

  const droppingInventorySlotIntoStationBlock = useCallback(
    (
      block: DefiningWorldBuildingPlacedBlock,
      inventorySlotIndex: number,
      slotKind: DefiningWorldPlazaOreSmeltingStationSlotKind
    ): void => {
      const inventoryItem = inventoryState.slots[inventorySlotIndex];

      if (!inventoryItem) {
        return;
      }

      const recipeForStation = resolvingWorldPlazaOreSmeltingRecipe(
        inventoryItem.itemTypeId,
        block.definitionId
      );
      const recipeAnywhere = resolvingWorldPlazaOreSmeltingRecipe(
        inventoryItem.itemTypeId
      );
      const isValid =
        slotKind === 'ore'
          ? recipeForStation !== null
          : checkingWorldPlazaOreSmeltingFuelItemTypeId(
              inventoryItem.itemTypeId
            );

      if (!isValid) {
        showingToast(
          slotKind === 'ore'
            ? inventoryItem.itemTypeId ===
              DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_CLAY
              ? 'Needs wet clay ware.'
              : recipeAnywhere !== null
                ? 'Fire wet clay ware in a clay kiln.'
                : 'That item cannot be smelted.'
            : 'Fuel must be wood or coal.'
        );
        return;
      }

      const currentStationState =
        stationStateByBlockId.get(block.blockId) ??
        DEFINING_WORLD_PLAZA_EMPTY_ORE_SMELTING_STATION_STATE;

      const chamberItemTypeId =
        slotKind === 'ore'
          ? currentStationState.inputItemTypeId
          : currentStationState.fuelItemTypeId;
      const chamberQuantity =
        slotKind === 'ore'
          ? currentStationState.inputQuantity
          : currentStationState.fuelQuantity;

      if (
        chamberItemTypeId !== null &&
        chamberItemTypeId !== inventoryItem.itemTypeId
      ) {
        showingToast('That station slot is occupied.');
        return;
      }

      const capacity = resolvingWorldPlazaOreSmeltingStationCapacity(
        inventoryItem.itemTypeId
      );
      const freeSpace = capacity - chamberQuantity;

      if (freeSpace <= 0) {
        showingToast('That station slot is full.');
        return;
      }

      const depositQuantity = Math.min(inventoryItem.quantity, freeSpace);

      if (depositQuantity <= 0) {
        return;
      }

      let didConsume = false;
      updatingInventoryState((currentInventoryState) => {
        const consumeResult = consumingWorldPlazaInventoryItemFromSlot(
          currentInventoryState,
          inventorySlotIndex,
          depositQuantity
        );
        didConsume = consumeResult.consumed;
        return consumeResult.consumed ? consumeResult.nextState : null;
      });

      if (!didConsume) {
        return;
      }

      const previousState =
        stationStateByBlockId.get(block.blockId) ??
        DEFINING_WORLD_PLAZA_EMPTY_ORE_SMELTING_STATION_STATE;
      const slottedState: DefiningWorldPlazaOreSmeltingStationState = {
        ...previousState,
        inputItemTypeId:
          slotKind === 'ore'
            ? inventoryItem.itemTypeId
            : previousState.inputItemTypeId,
        inputQuantity:
          slotKind === 'ore'
            ? previousState.inputQuantity + depositQuantity
            : previousState.inputQuantity,
        fuelItemTypeId:
          slotKind === 'fuel'
            ? inventoryItem.itemTypeId
            : previousState.fuelItemTypeId,
        fuelQuantity:
          slotKind === 'fuel'
            ? previousState.fuelQuantity + depositQuantity
            : previousState.fuelQuantity,
      };
      const recipe = slottedState.inputItemTypeId
        ? resolvingWorldPlazaOreSmeltingRecipe(
            slottedState.inputItemTypeId,
            block.definitionId
          )
        : null;
      const nextState = resolvingWorldPlazaOreSmeltingStationMaybeStart(
        slottedState,
        recipe,
        Date.now()
      );

      if (
        previousState.endsAtMs === null &&
        nextState.endsAtMs === null &&
        recipe &&
        slottedState.inputQuantity >= 1 &&
        !checkingWorldPlazaOreSmeltingCanStartUnit(slottedState, recipe)
      ) {
        if (slottedState.fuelItemTypeId === null) {
          showingToast('Add wood or coal fuel to start.');
        } else {
          const fuelCost = resolvingWorldPlazaOreSmeltingFuelUnitsCostForRecipe(
            slottedState.fuelItemTypeId,
            recipe
          );
          if (fuelCost !== null && slottedState.fuelQuantity < fuelCost) {
            const fuelLabel =
              slottedState.fuelItemTypeId ===
              DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD
                ? 'wood'
                : 'coal';
            showingToast(
              `Need ${fuelCost} ${fuelLabel} for this ${recipe.outputDisplayName.toLowerCase()}.`
            );
          } else if (
            slottedState.outputItemTypeId !== null &&
            slottedState.outputItemTypeId !== recipe.outputItemTypeId
          ) {
            showingToast('Grab the output chamber first.');
          } else if (
            slottedState.outputQuantity >=
            resolvingWorldPlazaOreSmeltingStationCapacity(
              recipe.outputItemTypeId
            )
          ) {
            showingToast('Output chamber is full. Grab before smelting more.');
          }
        }
      }

      setStationStateByBlockId((currentStates) => {
        const nextStates = new Map(currentStates);
        nextStates.set(block.blockId, nextState);
        return nextStates;
      });
    },
    [
      inventoryState.slots,
      showingToast,
      stationStateByBlockId,
      updatingInventoryState,
    ]
  );

  const droppingInventorySlotIntoStation = useCallback(
    (
      inventorySlotIndex: number,
      slotKind: DefiningWorldPlazaOreSmeltingStationSlotKind
    ): void => {
      if (!selectedStationBlock) {
        return;
      }

      droppingInventorySlotIntoStationBlock(
        selectedStationBlock,
        inventorySlotIndex,
        slotKind
      );
    },
    [droppingInventorySlotIntoStationBlock, selectedStationBlock]
  );

  /**
   * Deposits into the open station, or opens + fills the nearest reachable one.
   */
  const depositingInventorySlotIntoReachableStation = useCallback(
    (
      inventorySlotIndex: number,
      slotKind: DefiningWorldPlazaOreSmeltingStationSlotKind,
      nearbyStation: DefiningWorldBuildingPlacedBlock | null
    ): void => {
      const targetStation = selectedStationBlock ?? nearbyStation;

      if (!targetStation) {
        showingToast('Stand near a bloomery, Bessemer forge, kiln, or stove.');
        return;
      }

      if (
        !selectedStationBlock ||
        selectedStationBlock.blockId !== targetStation.blockId
      ) {
        setSelectedStationBlock(targetStation);
      }

      droppingInventorySlotIntoStationBlock(
        targetStation,
        inventorySlotIndex,
        slotKind
      );
    },
    [droppingInventorySlotIntoStationBlock, selectedStationBlock, showingToast]
  );

  /**
   * Wall-clock catch-up for every station, including when the UI is closed and
   * the player is elsewhere. Also flushes overdue units when the tab wakes.
   */
  useEffect(() => {
    const catchingUpAllStations = (): void => {
      const nowMs = Date.now();
      const currentStates = stationStateByBlockIdRef.current;
      let changed = false;
      const nextStates = new Map(currentStates);

      for (const [blockId, stationState] of currentStates) {
        if (stationState.endsAtMs === null || stationState.endsAtMs > nowMs) {
          continue;
        }

        const recipe = stationState.inputItemTypeId
          ? resolvingWorldPlazaOreSmeltingRecipe(stationState.inputItemTypeId)
          : null;
        const caughtUpState = resolvingWorldPlazaOreSmeltingStationCatchUpToNow(
          stationState,
          recipe,
          nowMs
        );

        if (caughtUpState !== stationState) {
          changed = true;
          nextStates.set(blockId, caughtUpState);
        }
      }

      if (changed) {
        setStationStateByBlockId(nextStates);
      }
    };

    const intervalId = window.setInterval(
      catchingUpAllStations,
      DEFINING_WORLD_PLAZA_ORE_SMELTING_CATCH_UP_INTERVAL_MS
    );
    const handlingVisibilityChange = (): void => {
      if (document.visibilityState === 'visible') {
        catchingUpAllStations();
      }
    };

    document.addEventListener('visibilitychange', handlingVisibilityChange);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener(
        'visibilitychange',
        handlingVisibilityChange
      );
    };
  }, []);

  const activeBlockIds = useMemo(
    () =>
      new Set(
        [...stationStateByBlockId.entries()]
          .filter(([, state]) => state.endsAtMs !== null)
          .map(([blockId]) => blockId)
      ),
    [stationStateByBlockId]
  );

  const selectedStationState = selectedStationBlock
    ? (stationStateByBlockId.get(selectedStationBlock.blockId) ??
      DEFINING_WORLD_PLAZA_EMPTY_ORE_SMELTING_STATION_STATE)
    : null;

  return {
    selectedStationBlock,
    selectedStationState,
    activeBlockIds,
    selectingStation,
    closingStation,
    collectingSelectedStationOutput,
    droppingInventorySlotIntoStation,
    depositingInventorySlotIntoReachableStation,
  };
}
