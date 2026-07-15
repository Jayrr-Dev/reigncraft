import {
  DEFINING_WORLD_PLAZA_EMPTY_ORE_SMELTING_STATION_STATE,
  checkingWorldPlazaOreSmeltingCanStartUnit,
  resolvingWorldPlazaOreSmeltingStationAfterStart,
  resolvingWorldPlazaOreSmeltingStationAfterUnitComplete,
  resolvingWorldPlazaOreSmeltingStationCatchUpToNow,
} from '@/components/world/crafting/domains/resolvingWorldPlazaOreSmeltingStationAdvance';
import { resolvingWorldPlazaOreSmeltingRecipe } from '@/components/world/crafting/domains/definingWorldPlazaOreSmeltingRegistry';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_IRON,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_COAL,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_IRON,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaOreSmeltingStationAdvance', () => {
  const ironRecipe = resolvingWorldPlazaOreSmeltingRecipe(
    DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_IRON
  )!;

  it('starts a unit by consuming recipe fuel and leaving input until complete', () => {
    const readyState = {
      ...DEFINING_WORLD_PLAZA_EMPTY_ORE_SMELTING_STATION_STATE,
      inputItemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_IRON,
      inputQuantity: 3,
      fuelItemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_COAL,
      fuelQuantity: 5,
    };

    expect(checkingWorldPlazaOreSmeltingCanStartUnit(readyState, ironRecipe)).toBe(
      true
    );

    const started = resolvingWorldPlazaOreSmeltingStationAfterStart(
      readyState,
      ironRecipe,
      1_000
    );

    expect(started.inputQuantity).toBe(3);
    expect(started.fuelQuantity).toBe(3);
    expect(started.startedAtMs).toBe(1_000);
    expect(started.endsAtMs).toBe(1_000 + ironRecipe.durationMs);
  });

  it('moves finished units into the output chamber and chains the next unit', () => {
    const smeltingState = {
      ...DEFINING_WORLD_PLAZA_EMPTY_ORE_SMELTING_STATION_STATE,
      inputItemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_IRON,
      inputQuantity: 2,
      fuelItemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_COAL,
      fuelQuantity: 4,
      startedAtMs: 1_000,
      endsAtMs: 7_000,
    };

    const afterComplete = resolvingWorldPlazaOreSmeltingStationAfterUnitComplete(
      smeltingState,
      ironRecipe,
      7_000
    );

    expect(afterComplete.outputItemTypeId).toBe(
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_IRON
    );
    expect(afterComplete.outputQuantity).toBe(1);
    expect(afterComplete.inputQuantity).toBe(1);
    expect(afterComplete.fuelQuantity).toBe(2);
    expect(afterComplete.endsAtMs).toBe(7_000 + ironRecipe.durationMs);
  });

  it('stops chaining when the output chamber is full after a unit finishes', () => {
    const almostFullState = {
      ...DEFINING_WORLD_PLAZA_EMPTY_ORE_SMELTING_STATION_STATE,
      inputItemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_IRON,
      inputQuantity: 2,
      fuelItemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_COAL,
      fuelQuantity: 4,
      outputItemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_IRON,
      outputDisplayName: 'Iron ingot',
      outputQuantity: 98,
      startedAtMs: 1_000,
      endsAtMs: 7_000,
    };

    const afterComplete = resolvingWorldPlazaOreSmeltingStationAfterUnitComplete(
      almostFullState,
      ironRecipe,
      7_000
    );

    expect(afterComplete.outputQuantity).toBe(99);
    expect(afterComplete.inputQuantity).toBe(1);
    expect(afterComplete.endsAtMs).toBeNull();
    expect(
      checkingWorldPlazaOreSmeltingCanStartUnit(afterComplete, ironRecipe)
    ).toBe(false);
  });

  it('catch-up finishes overdue units while the player is away', () => {
    const startedAtMs = 1_000;
    const awayState = {
      ...DEFINING_WORLD_PLAZA_EMPTY_ORE_SMELTING_STATION_STATE,
      inputItemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_IRON,
      inputQuantity: 3,
      fuelItemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_COAL,
      fuelQuantity: 6,
      startedAtMs,
      endsAtMs: startedAtMs + ironRecipe.durationMs,
    };

    const afterAway = resolvingWorldPlazaOreSmeltingStationCatchUpToNow(
      awayState,
      ironRecipe,
      startedAtMs + ironRecipe.durationMs * 2 + 500
    );

    // Two units finished; third still cooking (started at t+2d, ends at t+3d).
    expect(afterAway.outputQuantity).toBe(2);
    expect(afterAway.inputQuantity).toBe(1);
    expect(afterAway.fuelQuantity).toBe(2);
    expect(afterAway.endsAtMs).toBe(
      startedAtMs + ironRecipe.durationMs * 3
    );
  });
});
