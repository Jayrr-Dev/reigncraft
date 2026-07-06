import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import { addingInventoryItemWithStacking } from '@/components/inventory/domains/reducingInventoryState';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypes';
import type { DefiningWildlifeMeatCookRecipe } from '@/components/world/wildlife/domains/definingWildlifeMeatCookRecipes';
import { resolvingFirstWildlifeMeatCookRecipeInInventory } from '@/components/world/wildlife/domains/definingWildlifeMeatCookRecipes';

export type ValidatingWorldPlazaCampfireCookStartParams = {
  readonly isLit: boolean;
  readonly inventoryState: DefiningInventoryState;
  readonly recipe?: DefiningWildlifeMeatCookRecipe | null;
};

export type ValidatingWorldPlazaCampfireCookStartResult =
  | {
      readonly ok: true;
      readonly recipe: DefiningWildlifeMeatCookRecipe;
    }
  | {
      readonly ok: false;
      readonly message: string;
    };

/**
 * Validates that a campfire cook channel can begin for the first raw meat stack.
 */
export function validatingWorldPlazaCampfireCookStart({
  isLit,
  inventoryState,
  recipe: recipeOverride = null,
}: ValidatingWorldPlazaCampfireCookStartParams): ValidatingWorldPlazaCampfireCookStartResult {
  if (!isLit) {
    return {
      ok: false,
      message: 'Light the campfire before cooking.',
    };
  }

  const recipe =
    recipeOverride ??
    resolvingFirstWildlifeMeatCookRecipeInInventory(
      inventoryState.slots.filter(
        (slot): slot is NonNullable<typeof slot> => slot !== null
      )
    );

  if (!recipe) {
    return { ok: false, message: 'You need raw meat to cook.' };
  }

  const capacityProbe = addingInventoryItemWithStacking(
    inventoryState,
    {
      id: 'campfire-cook-start-capacity-probe',
      itemTypeId: recipe.cookedItemTypeId,
      quantity: 1,
    },
    DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
  );

  if (capacityProbe.quantityAccepted < 1) {
    return { ok: false, message: 'Inventory is full.' };
  }

  return { ok: true, recipe };
}
