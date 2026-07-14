'use client';

import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import {
  checkingWorldPlazaOreSmeltingFuelItemTypeId,
  DEFINING_WORLD_PLAZA_ORE_SMELTING_DURATION_MS,
  resolvingWorldPlazaOreSmeltingFuelUnitsCost,
  resolvingWorldPlazaOreSmeltingRecipe,
} from '@/components/world/crafting/domains/definingWorldPlazaOreSmeltingRegistry';
import type { DefiningWorldPlazaOreSmeltingStationSlotKind } from '@/components/world/crafting/domains/definingWorldPlazaOreSmeltingDndIds';
import { consumingWorldPlazaInventoryItemFromSlot } from '@/components/world/inventory/domains/consumingWorldPlazaInventoryItemFromSlot';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export type DefiningWorldPlazaOreSmeltingStationState = {
  readonly inputItemTypeId: string | null;
  readonly fuelItemTypeId: string | null;
  readonly outputItemTypeId: string | null;
  readonly outputDisplayName: string | null;
  readonly startedAtMs: number | null;
  readonly endsAtMs: number | null;
};

const DEFINING_WORLD_PLAZA_EMPTY_ORE_SMELTING_STATION_STATE: DefiningWorldPlazaOreSmeltingStationState =
  {
    inputItemTypeId: null,
    fuelItemTypeId: null,
    outputItemTypeId: null,
    outputDisplayName: null,
    startedAtMs: null,
    endsAtMs: null,
  };

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
  const [, setClockRevision] = useState(0);
  const completionTimeoutByBlockIdRef = useRef(
    new Map<string, ReturnType<typeof setTimeout>>()
  );

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

    if (!stationState?.outputItemTypeId) {
      return;
    }

    const addResult = addingItemWithStacking({
      id: crypto.randomUUID(),
      itemTypeId: stationState.outputItemTypeId,
      quantity: 1,
    });

    if (addResult.quantityAccepted === 0) {
      showingToast('Inventory is full.');
      return;
    }

    setStationStateByBlockId((currentStates) => {
      const nextStates = new Map(currentStates);
      nextStates.set(
        selectedStationBlock.blockId,
        DEFINING_WORLD_PLAZA_EMPTY_ORE_SMELTING_STATION_STATE
      );
      return nextStates;
    });
    showingToast(`${stationState.outputDisplayName ?? 'Smelted item'} collected.`);
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

      const recipe = resolvingWorldPlazaOreSmeltingRecipe(
        inventoryItem.itemTypeId
      );
      const isValid =
        slotKind === 'ore'
          ? recipe !== null
          : checkingWorldPlazaOreSmeltingFuelItemTypeId(
              inventoryItem.itemTypeId
            );

      if (!isValid) {
        showingToast(
          slotKind === 'ore'
            ? 'That item cannot be smelted.'
            : 'Fuel must be wood or coal.'
        );
        return;
      }

      const fuelUnitsCost =
        slotKind === 'fuel'
          ? resolvingWorldPlazaOreSmeltingFuelUnitsCost(
              inventoryItem.itemTypeId
            )
          : null;

      if (slotKind === 'fuel' && fuelUnitsCost === null) {
        showingToast('Fuel must be wood or coal.');
        return;
      }

      const consumeQuantity = slotKind === 'fuel' ? (fuelUnitsCost ?? 1) : 1;

      if (
        slotKind === 'fuel' &&
        inventoryItem.quantity < consumeQuantity
      ) {
        const fuelLabel =
          inventoryItem.itemTypeId ===
          DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD
            ? 'wood'
            : 'coal';
        showingToast(
          `Need ${consumeQuantity} ${fuelLabel} to smelt (wood costs 3× coal).`
        );
        return;
      }

      const currentStationState =
        stationStateByBlockId.get(block.blockId) ??
        DEFINING_WORLD_PLAZA_EMPTY_ORE_SMELTING_STATION_STATE;

      if (
        currentStationState.startedAtMs !== null ||
        currentStationState.outputItemTypeId !== null ||
        (slotKind === 'ore' &&
          currentStationState.inputItemTypeId !== null) ||
        (slotKind === 'fuel' && currentStationState.fuelItemTypeId !== null)
      ) {
        showingToast('That station slot is occupied.');
        return;
      }

      let didConsume = false;
      updatingInventoryState((currentInventoryState) => {
        const consumeResult = consumingWorldPlazaInventoryItemFromSlot(
          currentInventoryState,
          inventorySlotIndex,
          consumeQuantity
        );
        didConsume = consumeResult.consumed;
        return consumeResult.consumed ? consumeResult.nextState : null;
      });

      if (!didConsume) {
        return;
      }

      setStationStateByBlockId((currentStates) => {
        const previousState =
          currentStates.get(block.blockId) ??
          DEFINING_WORLD_PLAZA_EMPTY_ORE_SMELTING_STATION_STATE;
        const slottedState = {
          ...previousState,
          inputItemTypeId:
            slotKind === 'ore'
              ? inventoryItem.itemTypeId
              : previousState.inputItemTypeId,
          fuelItemTypeId:
            slotKind === 'fuel'
              ? inventoryItem.itemTypeId
              : previousState.fuelItemTypeId,
        };
        const shouldStart =
          slottedState.inputItemTypeId !== null &&
          slottedState.fuelItemTypeId !== null;
        const startedAtMs = shouldStart ? Date.now() : null;
        const nextState: DefiningWorldPlazaOreSmeltingStationState = {
          ...slottedState,
          startedAtMs,
          endsAtMs:
            startedAtMs === null
              ? null
              : startedAtMs + DEFINING_WORLD_PLAZA_ORE_SMELTING_DURATION_MS,
        };
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
        showingToast('Stand near a bloomery, kiln, or stove.');
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
    [
      droppingInventorySlotIntoStationBlock,
      selectedStationBlock,
      showingToast,
    ]
  );

  useEffect(() => {
    for (const [blockId, stationState] of stationStateByBlockId) {
      if (
        stationState.endsAtMs === null ||
        completionTimeoutByBlockIdRef.current.has(blockId)
      ) {
        continue;
      }

      const timeoutId = setTimeout(() => {
        const currentState =
          stationStateByBlockIdRef.current.get(blockId);
        const recipe = currentState?.inputItemTypeId
          ? resolvingWorldPlazaOreSmeltingRecipe(
              currentState.inputItemTypeId
            )
          : null;

        if (!currentState || !recipe) {
          completionTimeoutByBlockIdRef.current.delete(blockId);
          return;
        }

        const addResult = addingItemWithStacking({
          id: crypto.randomUUID(),
          itemTypeId: recipe.outputItemTypeId,
          quantity: 1,
        });

        setStationStateByBlockId((currentStates) => {
          const nextStates = new Map(currentStates);

          if (addResult.quantityAccepted > 0) {
            nextStates.set(
              blockId,
              DEFINING_WORLD_PLAZA_EMPTY_ORE_SMELTING_STATION_STATE
            );
            showingToast(`${recipe.outputDisplayName} smelted.`);
          } else {
            nextStates.set(blockId, {
              ...DEFINING_WORLD_PLAZA_EMPTY_ORE_SMELTING_STATION_STATE,
              outputItemTypeId: recipe.outputItemTypeId,
              outputDisplayName: recipe.outputDisplayName,
            });
            showingToast('Inventory full. Output is waiting in the station.');
          }

          return nextStates;
        });
        completionTimeoutByBlockIdRef.current.delete(blockId);
      }, Math.max(0, stationState.endsAtMs - Date.now()));

      completionTimeoutByBlockIdRef.current.set(blockId, timeoutId);
    }
  }, [addingItemWithStacking, showingToast, stationStateByBlockId]);

  const hasActiveStation = [...stationStateByBlockId.values()].some(
    (state) => state.endsAtMs !== null
  );

  useEffect(() => {
    if (!hasActiveStation) {
      return;
    }

    const intervalId = setInterval(() => {
      setClockRevision((revision) => revision + 1);
    }, 100);

    return () => {
      clearInterval(intervalId);
    };
  }, [hasActiveStation]);

  useEffect(() => {
    const timeoutMap = completionTimeoutByBlockIdRef.current;
    return () => {
      for (const timeoutId of timeoutMap.values()) {
        clearTimeout(timeoutId);
      }
      timeoutMap.clear();
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
  const progressRatio =
    selectedStationState?.startedAtMs !== null &&
    selectedStationState?.startedAtMs !== undefined &&
    selectedStationState.endsAtMs !== null
      ? Math.min(
          1,
          Math.max(
            0,
            (Date.now() - selectedStationState.startedAtMs) /
              (selectedStationState.endsAtMs -
                selectedStationState.startedAtMs)
          )
        )
      : 0;

  return {
    selectedStationBlock,
    selectedStationState,
    activeBlockIds,
    progressRatio,
    selectingStation,
    closingStation,
    collectingSelectedStationOutput,
    droppingInventorySlotIntoStation,
    depositingInventorySlotIntoReachableStation,
  };
}
