'use client';

/**
 * Right-page content for one craft cookbook recipe spread.
 *
 * @module components/world/building/components/renderingWorldPlazaCraftModeRecipeSpreadRightPage
 */

import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import type { DefiningWorldPlazaCraftModeRecipeDefinition } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeTypes';
import {
  LABELING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CRAFT_ACTION,
  LABELING_WORLD_PLAZA_CRAFT_MODE_RECIPE_REQUIRED_ITEMS,
} from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeUiConstants';
import { resolvingWorldPlazaCraftRecipeIngredientRows } from '@/components/world/crafting/domains/resolvingWorldPlazaCraftRecipeIngredientRows';
import { useMemo } from 'react';

const CRAFT_BUTTON_CLASS_NAME =
  'mt-auto min-h-11 w-full cursor-pointer rounded-sm border border-emerald-900/50 bg-emerald-700 px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-parchment shadow-[0_2px_0_0_rgba(20,83,45,0.65)] transition hover:bg-emerald-600 disabled:cursor-default disabled:border-stone-400/40 disabled:bg-stone-500/70 disabled:text-parchment/70 disabled:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60';

export type RenderingWorldPlazaCraftModeRecipeSpreadRightPageProps = {
  readonly recipeDefinition: DefiningWorldPlazaCraftModeRecipeDefinition;
  readonly inventoryState: DefiningInventoryState;
  readonly isCraftingEnabled: boolean;
  readonly onCraftRecipe: (
    recipeId: DefiningWorldPlazaCraftModeRecipeDefinition['id']
  ) => void;
};

/**
 * Renders required items and the Craft action on the cookbook right page.
 */
export function RenderingWorldPlazaCraftModeRecipeSpreadRightPage({
  recipeDefinition,
  inventoryState,
  isCraftingEnabled,
  onCraftRecipe,
}: RenderingWorldPlazaCraftModeRecipeSpreadRightPageProps): React.JSX.Element {
  const ingredientRows = useMemo(
    () =>
      resolvingWorldPlazaCraftRecipeIngredientRows(
        inventoryState,
        recipeDefinition
      ),
    [inventoryState, recipeDefinition]
  );
  const isAffordable = ingredientRows.every((row) => !row.isShort);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2">
      <h3 className="font-display text-xs font-bold uppercase tracking-wide text-[#4a3728] sm:text-sm">
        {LABELING_WORLD_PLAZA_CRAFT_MODE_RECIPE_REQUIRED_ITEMS}
      </h3>
      <ul className="flex flex-col gap-1.5">
        {ingredientRows.map((row) => (
          <li
            key={row.itemTypeId}
            className="flex items-center justify-between gap-2 text-[11px] font-semibold sm:text-xs"
          >
            <span className="text-[#5c4033]">{row.displayName}</span>
            <span
              className={
                row.isShort
                  ? 'font-mono text-red-800/90'
                  : 'font-mono text-[#3d5a2c]'
              }
            >
              {row.ownedQuantity}/{row.requiredQuantity}
            </span>
          </li>
        ))}
      </ul>
      <button
        type="button"
        disabled={!isCraftingEnabled || !isAffordable}
        onClick={() => onCraftRecipe(recipeDefinition.id)}
        className={CRAFT_BUTTON_CLASS_NAME}
      >
        {LABELING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CRAFT_ACTION}
      </button>
    </div>
  );
}
