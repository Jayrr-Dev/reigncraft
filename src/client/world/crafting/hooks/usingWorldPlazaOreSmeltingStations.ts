'use client';

import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { computingWorldPlazaOreSmeltingBoostedEndsAtMs } from '@/components/world/crafting/domains/computingWorldPlazaOreSmeltingBoostedEndsAtMs';
import {
  checkingWorldPlazaOreSmeltingFuelItemTypeId,
  computingWorldPlazaOreSmeltingDurationMsFromComplexity,
  DEFINING_WORLD_PLAZA_ORE_SMELTING_DURATION_MS_MIN,
  resolvingWorldPlazaOreSmeltingFuelUnitsCost,
  resolvingWorldPlazaOreSmeltingRecipe,
} from '@/components/world/crafting/domains/definingWorldPlazaOreSmeltingRegistry';
import type { DefiningWorldPlazaOreSmeltingStationSlotKind } from '@/components/world/crafting/domains/definingWorldPlazaOreSmeltingDndIds';
import { consumingWorldPlazaInventoryItemFromSlot } from '@/components/world/inventory/domains/consumingWorldPlazaInventoryItemFromSlot';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { playingWildlifeStudySfx } from '@/components/world/wildlife/domains/playingWildlifeStudySfx';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export type DefiningWorldPlazaOreSmeltingStationState = {
  readonly inputItemTypeId: string | null;
  readonly fuelItemTypeId: string | null;
  readonly outputItemTypeId: string | null;
  readonly outputDisplayName: string | null;
  readonly startedAtMs: number | null;
  readonly endsAtMs: number | null;
  /** Wall-clock duration at craft start (before tap boosts). */
  readonly baseDurationMs: number | null;
};

const DEFINING_WORLD_PLAZA_EMPTY_ORE_SMELTING_STATION_STATE: DefiningWorldPlazaOreSmeltingStationState =
  {
    inputItemTypeId: null,
    fuelItemTypeId: null,
    outputItemTypeId: null,
    outputDisplayName: null,
    startedAtMs: null,
    endsAtMs: null,
    baseDurationMs: null,
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

export type DefiningWorldPlazaOreSmeltingActiveCraftHud = {
  readonly blockId: string;
  readonly displayName: string;
  readonly progressRatio: number;
  readonly remainingMs: number;
};

function computingProgressRatio(
  stationState: DefiningWorldPlazaOreSmeltingStationState,
  nowMs: number
): number {
  if (
    stationState.startedAtMs === null ||
    stationState.endsAtMs === null ||
    stationState.baseDurationMs === null ||
    stationState.baseDurationMs <= 0
  ) {
    return 0;
  }

  const remainingMs = Math.max(0, stationState.endsAtMs - nowMs);
  const elapsedMs = Math.max(
    0,
    stationState.baseDurationMs - remainingMs
  );

  return Math.min(1, Math.max(0, elapsedMs / stationState.baseDurationMs));
}

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
  const completingBlockIdsRef = useRef(new Set<string>());
  const [, setClockRevision] = useState(0);

  const selectingStation = useCallback(
    (block: DefiningWorldBuildingPlacedBlock): void => {
      setSelectedStationBlock(block);
    },
    []
  );

  const closingStation = useCallback((): void => {
    setSelectedStationBlock(null);
  }, []);

  const completingStationCraft = useCallback(
    (blockId: string): void => {
      if (completingBlockIdsRef.current.has(blockId)) {
        return;
      }

      const currentState = stationStateByBlockIdRef.current.get(blockId);
      const recipe = currentState?.inputItemTypeId
        ? resolvingWorldPlazaOreSmeltingRecipe(currentState.inputItemTypeId)
        : null;

      if (!currentState || !recipe || currentState.endsAtMs === null) {
        return;
      }

      if (Date.now() < currentState.endsAtMs) {
        return;
      }

      completingBlockIdsRef.current.add(blockId);

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

      completingBlockIdsRef.current.delete(blockId);
    },
    [addingItemWithStacking, showingToast]
  );

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
            ? recipeAnywhere !== null
              ? 'Fire wet clay ware in a clay kiln.'
              : 'That item cannot be smelted.'
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
        const inputRecipe =
          slottedState.inputItemTypeId === null
            ? null
            : resolvingWorldPlazaOreSmeltingRecipe(
                slottedState.inputItemTypeId,
                block.definitionId
              );
        const durationMs =
          inputRecipe === null
            ? DEFINING_WORLD_PLAZA_ORE_SMELTING_DURATION_MS_MIN
            : computingWorldPlazaOreSmeltingDurationMsFromComplexity(
                inputRecipe.complexity
              );
        const nextState: DefiningWorldPlazaOreSmeltingStationState = {
          ...slottedState,
          startedAtMs,
          endsAtMs:
            startedAtMs === null ? null : startedAtMs + durationMs,
          baseDurationMs: startedAtMs === null ? null : durationMs,
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

  const boostingActiveCraft = useCallback((): boolean => {
    const nowMs = Date.now();
    const selectedBlockId = selectedStationBlock?.blockId ?? null;
    let activeEntry:
      | readonly [string, DefiningWorldPlazaOreSmeltingStationState]
      | undefined;

    if (selectedBlockId !== null) {
      const selectedState =
        stationStateByBlockIdRef.current.get(selectedBlockId);
      if (
        selectedState &&
        selectedState.endsAtMs !== null &&
        selectedState.baseDurationMs !== null
      ) {
        activeEntry = [selectedBlockId, selectedState];
      }
    }

    if (!activeEntry) {
      activeEntry = [...stationStateByBlockIdRef.current.entries()].find(
        ([, state]) =>
          state.endsAtMs !== null && state.baseDurationMs !== null
      );
    }

    if (!activeEntry) {
      return false;
    }

    const [blockId, stationState] = activeEntry;

    if (stationState.endsAtMs === null || stationState.baseDurationMs === null) {
      return false;
    }

    const previewEndsAtMs = computingWorldPlazaOreSmeltingBoostedEndsAtMs({
      nowMs,
      endsAtMs: stationState.endsAtMs,
      baseDurationMs: stationState.baseDurationMs,
    });

    if (previewEndsAtMs >= stationState.endsAtMs) {
      return false;
    }

    playingWildlifeStudySfx();

    setStationStateByBlockId((currentStates) => {
      const currentState = currentStates.get(blockId);

      if (
        !currentState ||
        currentState.endsAtMs === null ||
        currentState.baseDurationMs === null
      ) {
        return currentStates;
      }

      const nextStates = new Map(currentStates);
      nextStates.set(blockId, {
        ...currentState,
        endsAtMs: computingWorldPlazaOreSmeltingBoostedEndsAtMs({
          nowMs: Date.now(),
          endsAtMs: currentState.endsAtMs,
          baseDurationMs: currentState.baseDurationMs,
        }),
      });
      return nextStates;
    });

    return true;
  }, [selectedStationBlock]);

  const hasActiveStation = [...stationStateByBlockId.values()].some(
    (state) => state.endsAtMs !== null
  );

  useEffect(() => {
    if (!hasActiveStation) {
      return;
    }

    const intervalId = setInterval(() => {
      setClockRevision((revision) => revision + 1);

      for (const [blockId, stationState] of stationStateByBlockIdRef.current) {
        if (
          stationState.endsAtMs !== null &&
          Date.now() >= stationState.endsAtMs
        ) {
          completingStationCraft(blockId);
        }
      }
    }, 100);

    return () => {
      clearInterval(intervalId);
    };
  }, [completingStationCraft, hasActiveStation]);

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

  const nowMs = Date.now();
  const progressRatio = selectedStationState
    ? computingProgressRatio(selectedStationState, nowMs)
    : 0;

  const activeCraftHud = useMemo((): DefiningWorldPlazaOreSmeltingActiveCraftHud | null => {
    const selectedBlockId = selectedStationBlock?.blockId ?? null;
    const selectedState =
      selectedBlockId === null
        ? null
        : (stationStateByBlockId.get(selectedBlockId) ?? null);
    const activeEntry =
      selectedState?.endsAtMs !== null && selectedState?.endsAtMs !== undefined
        ? ([selectedBlockId, selectedState] as const)
        : [...stationStateByBlockId.entries()].find(
            ([, state]) => state.endsAtMs !== null
          );

    if (!activeEntry || !activeEntry[0] || !activeEntry[1]) {
      return null;
    }

    const [blockId, stationState] = activeEntry;
    const recipe = stationState.inputItemTypeId
      ? resolvingWorldPlazaOreSmeltingRecipe(stationState.inputItemTypeId)
      : null;
    const liveNowMs = Date.now();

    return {
      blockId,
      displayName: recipe?.outputDisplayName ?? 'Crafting',
      progressRatio: computingProgressRatio(stationState, liveNowMs),
      remainingMs: Math.max(0, (stationState.endsAtMs ?? liveNowMs) - liveNowMs),
    };
  }, [selectedStationBlock, stationStateByBlockId]);

  return {
    selectedStationBlock,
    selectedStationState,
    activeBlockIds,
    progressRatio,
    activeCraftHud,
    selectingStation,
    closingStation,
    collectingSelectedStationOutput,
    droppingInventorySlotIntoStation,
    depositingInventorySlotIntoReachableStation,
    boostingActiveCraft,
  };
}
