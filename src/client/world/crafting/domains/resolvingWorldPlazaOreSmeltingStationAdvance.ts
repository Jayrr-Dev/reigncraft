/**
 * Pure smelting-station state transitions (deposit start / unit complete).
 *
 * @module components/world/crafting/domains/resolvingWorldPlazaOreSmeltingStationAdvance
 */

import {
  resolvingWorldPlazaOreSmeltingFuelUnitsCostForRecipe,
  type DefiningWorldPlazaOreSmeltingRecipe,
} from '@/components/world/crafting/domains/definingWorldPlazaOreSmeltingRegistry';
import { resolvingWorldPlazaOreSmeltingStationCapacity } from '@/components/world/crafting/domains/resolvingWorldPlazaOreSmeltingStationCapacity';

export type DefiningWorldPlazaOreSmeltingStationState = {
  readonly inputItemTypeId: string | null;
  readonly inputQuantity: number;
  readonly fuelItemTypeId: string | null;
  readonly fuelQuantity: number;
  readonly outputItemTypeId: string | null;
  readonly outputDisplayName: string | null;
  readonly outputQuantity: number;
  readonly startedAtMs: number | null;
  readonly endsAtMs: number | null;
};

export const DEFINING_WORLD_PLAZA_EMPTY_ORE_SMELTING_STATION_STATE: DefiningWorldPlazaOreSmeltingStationState =
  {
    inputItemTypeId: null,
    inputQuantity: 0,
    fuelItemTypeId: null,
    fuelQuantity: 0,
    outputItemTypeId: null,
    outputDisplayName: null,
    outputQuantity: 0,
    startedAtMs: null,
    endsAtMs: null,
  };

function resolvingOutputFreeSpace(
  stationState: DefiningWorldPlazaOreSmeltingStationState,
  recipe: DefiningWorldPlazaOreSmeltingRecipe
): number {
  if (stationState.outputItemTypeId === null) {
    return resolvingWorldPlazaOreSmeltingStationCapacity(
      recipe.outputItemTypeId
    );
  }

  if (stationState.outputItemTypeId !== recipe.outputItemTypeId) {
    return 0;
  }

  return Math.max(
    0,
    resolvingWorldPlazaOreSmeltingStationCapacity(recipe.outputItemTypeId) -
      stationState.outputQuantity
  );
}

/**
 * True when the station can begin one unit (not already running, enough fuel,
 * input present, output chamber has room for this recipe).
 */
export function checkingWorldPlazaOreSmeltingCanStartUnit(
  stationState: DefiningWorldPlazaOreSmeltingStationState,
  recipe: DefiningWorldPlazaOreSmeltingRecipe | null
): boolean {
  if (!recipe || stationState.endsAtMs !== null) {
    return false;
  }

  if (
    stationState.inputItemTypeId !== recipe.inputItemTypeId ||
    stationState.inputQuantity < 1 ||
    stationState.fuelItemTypeId === null
  ) {
    return false;
  }

  const fuelCost = resolvingWorldPlazaOreSmeltingFuelUnitsCostForRecipe(
    stationState.fuelItemTypeId,
    recipe
  );

  if (fuelCost === null || stationState.fuelQuantity < fuelCost) {
    return false;
  }

  return resolvingOutputFreeSpace(stationState, recipe) >= 1;
}

/**
 * Consumes fuel for one unit and starts the smelt timer. Input stays until
 * completion so the chamber still shows what is cooking.
 */
export function resolvingWorldPlazaOreSmeltingStationAfterStart(
  stationState: DefiningWorldPlazaOreSmeltingStationState,
  recipe: DefiningWorldPlazaOreSmeltingRecipe,
  nowMs: number
): DefiningWorldPlazaOreSmeltingStationState {
  if (!checkingWorldPlazaOreSmeltingCanStartUnit(stationState, recipe)) {
    return stationState;
  }

  const fuelItemTypeId = stationState.fuelItemTypeId;

  if (fuelItemTypeId === null) {
    return stationState;
  }

  const fuelCost = resolvingWorldPlazaOreSmeltingFuelUnitsCostForRecipe(
    fuelItemTypeId,
    recipe
  );

  if (fuelCost === null) {
    return stationState;
  }

  const nextFuelQuantity = stationState.fuelQuantity - fuelCost;

  return {
    ...stationState,
    fuelQuantity: nextFuelQuantity,
    fuelItemTypeId: nextFuelQuantity > 0 ? fuelItemTypeId : null,
    startedAtMs: nowMs,
    endsAtMs: nowMs + recipe.durationMs,
  };
}

/**
 * Finishes one unit into the output chamber, then starts the next if possible.
 */
export function resolvingWorldPlazaOreSmeltingStationAfterUnitComplete(
  stationState: DefiningWorldPlazaOreSmeltingStationState,
  recipe: DefiningWorldPlazaOreSmeltingRecipe,
  nowMs: number
): DefiningWorldPlazaOreSmeltingStationState {
  if (
    stationState.inputItemTypeId !== recipe.inputItemTypeId ||
    stationState.inputQuantity < 1
  ) {
    return {
      ...stationState,
      startedAtMs: null,
      endsAtMs: null,
    };
  }

  const nextInputQuantity = stationState.inputQuantity - 1;
  const completedState: DefiningWorldPlazaOreSmeltingStationState = {
    ...stationState,
    inputQuantity: nextInputQuantity,
    inputItemTypeId: nextInputQuantity > 0 ? stationState.inputItemTypeId : null,
    outputItemTypeId: recipe.outputItemTypeId,
    outputDisplayName: recipe.outputDisplayName,
    outputQuantity: stationState.outputQuantity + 1,
    startedAtMs: null,
    endsAtMs: null,
  };

  if (!checkingWorldPlazaOreSmeltingCanStartUnit(completedState, recipe)) {
    return completedState;
  }

  return resolvingWorldPlazaOreSmeltingStationAfterStart(
    completedState,
    recipe,
    nowMs
  );
}

/**
 * Starts a unit if idle and ready; otherwise returns the state unchanged.
 */
export function resolvingWorldPlazaOreSmeltingStationMaybeStart(
  stationState: DefiningWorldPlazaOreSmeltingStationState,
  recipe: DefiningWorldPlazaOreSmeltingRecipe | null,
  nowMs: number
): DefiningWorldPlazaOreSmeltingStationState {
  if (!recipe || !checkingWorldPlazaOreSmeltingCanStartUnit(stationState, recipe)) {
    return stationState;
  }

  return resolvingWorldPlazaOreSmeltingStationAfterStart(
    stationState,
    recipe,
    nowMs
  );
}

/** Safety cap so a huge offline catch-up cannot loop forever. */
const DEFINING_WORLD_PLAZA_ORE_SMELTING_CATCH_UP_MAX_UNITS = 256;

/**
 * Advances one station to wall-clock `nowMs`, finishing every unit whose
 * `endsAtMs` has already passed and chaining the next while resources allow.
 *
 * Keeps furnaces cooking while the player is away (UI closed / elsewhere).
 */
export function resolvingWorldPlazaOreSmeltingStationCatchUpToNow(
  stationState: DefiningWorldPlazaOreSmeltingStationState,
  recipe: DefiningWorldPlazaOreSmeltingRecipe | null,
  nowMs: number
): DefiningWorldPlazaOreSmeltingStationState {
  if (stationState.endsAtMs === null || stationState.endsAtMs > nowMs) {
    return stationState;
  }

  if (!recipe) {
    return {
      ...stationState,
      startedAtMs: null,
      endsAtMs: null,
    };
  }

  let nextState = stationState;

  for (
    let unitIndex = 0;
    unitIndex < DEFINING_WORLD_PLAZA_ORE_SMELTING_CATCH_UP_MAX_UNITS;
    unitIndex += 1
  ) {
    if (nextState.endsAtMs === null || nextState.endsAtMs > nowMs) {
      break;
    }

    nextState = resolvingWorldPlazaOreSmeltingStationAfterUnitComplete(
      nextState,
      recipe,
      nextState.endsAtMs
    );
  }

  return nextState;
}
