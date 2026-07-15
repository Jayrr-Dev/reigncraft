/**
 * Watered teapot + ingredients → brewed teapot at a lit campfire.
 *
 * @module components/world/tea-brewing/domains/brewingWorldPlazaTeaPotAtCampfire
 */

import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BREWED_CLAY_TEAPOT } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WATERED_CLAY_TEAPOT } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { DEFINING_WORLD_PLAZA_TEA_BREWING_POURS_PER_POT } from '@/components/world/tea-brewing/domains/definingWorldPlazaTeaBrewingConstants';
import { countingWorldPlazaTeaPotFilledIngredientSlots } from '@/components/world/tea-brewing/domains/mutatingWorldPlazaTeaPotIngredientSlots';
import { resolvingWorldPlazaTeaBrewingRecipe } from '@/components/world/tea-brewing/domains/resolvingWorldPlazaTeaBrewingRecipe';
import {
  resolvingWorldPlazaTeaPotIngredientSlots,
  writingWorldPlazaTeaBrewingMetadata,
  writingWorldPlazaTeaPotRemainingPours,
} from '@/components/world/tea-brewing/domains/resolvingWorldPlazaTeaBrewingMetadata';

export type BrewingWorldPlazaTeaPotAtCampfireResult =
  | {
      readonly outcome: 'brewed';
      readonly nextState: DefiningInventoryState;
      readonly displayName: string;
    }
  | {
      readonly outcome: 'no-watered-teapot';
    }
  | {
      readonly outcome: 'no-ingredients';
    }
  | {
      readonly outcome: 'invalid-recipe';
    };

/**
 * Converts the first ready watered teapot (or a preferred slot) into a brewed pot.
 */
export function brewingWorldPlazaTeaPotAtCampfire(
  inventoryState: DefiningInventoryState,
  preferredSlotIndex?: number
): BrewingWorldPlazaTeaPotAtCampfireResult {
  const potSlotIndex =
    preferredSlotIndex !== undefined &&
    inventoryState.slots[preferredSlotIndex]?.itemTypeId ===
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WATERED_CLAY_TEAPOT
      ? preferredSlotIndex
      : inventoryState.slots.findIndex((slot) => {
          if (
            !slot ||
            slot.itemTypeId !==
              DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WATERED_CLAY_TEAPOT
          ) {
            return false;
          }

          return countingWorldPlazaTeaPotFilledIngredientSlots(slot.metadata) > 0;
        });

  if (potSlotIndex < 0) {
    const hasWatered = inventoryState.slots.some(
      (slot) =>
        slot !== null &&
        slot.itemTypeId ===
          DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WATERED_CLAY_TEAPOT
    );
    return {
      outcome: hasWatered ? 'no-ingredients' : 'no-watered-teapot',
    };
  }

  const potItem = inventoryState.slots[potSlotIndex];

  if (!potItem) {
    return { outcome: 'no-watered-teapot' };
  }

  const ingredientSlots = resolvingWorldPlazaTeaPotIngredientSlots(
    potItem.metadata
  );
  const ingredientTypeIds = ingredientSlots.filter(
    (slot): slot is string => typeof slot === 'string'
  );

  if (ingredientTypeIds.length === 0) {
    return { outcome: 'no-ingredients' };
  }

  const recipe = resolvingWorldPlazaTeaBrewingRecipe(ingredientTypeIds);

  if (!recipe || recipe.effects.length === 0) {
    return { outcome: 'invalid-recipe' };
  }

  const brewedMetadata = writingWorldPlazaTeaPotRemainingPours(
    writingWorldPlazaTeaBrewingMetadata(undefined, recipe),
    DEFINING_WORLD_PLAZA_TEA_BREWING_POURS_PER_POT
  );

  const slots = [...inventoryState.slots];
  slots[potSlotIndex] = {
    ...potItem,
    itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BREWED_CLAY_TEAPOT,
    metadata: brewedMetadata,
  };

  return {
    outcome: 'brewed',
    nextState: {
      capacity: inventoryState.capacity,
      slots,
    },
    displayName: recipe.displayName,
  };
}

export function checkingWorldPlazaInventoryHasBrewableTeaPot(
  inventoryState: DefiningInventoryState
): boolean {
  return inventoryState.slots.some(
    (slot) =>
      slot !== null &&
      slot.itemTypeId ===
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WATERED_CLAY_TEAPOT &&
      countingWorldPlazaTeaPotFilledIngredientSlots(slot.metadata) > 0
  );
}

export function checkingWorldPlazaInventoryHasBrewedTeaPot(
  inventoryState: DefiningInventoryState
): boolean {
  return inventoryState.slots.some(
    (slot) =>
      slot !== null &&
      slot.itemTypeId ===
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BREWED_CLAY_TEAPOT &&
      slot.quantity > 0
  );
}
