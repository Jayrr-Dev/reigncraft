'use client';

/**
 * Detail view for one unlocked Recipes guide entry.
 *
 * @module components/home/components/renderingPlazaRecipesGuideDetailView
 */

import { RenderingWorldPlazaCampfireRecipePreview } from '@/components/world/building/components/renderingWorldPlazaCampfireRecipePreview';
import type { PlazaRecipesGuideDisplayEntry } from '@/components/home/domains/resolvingPlazaRecipesGuideDisplayEntries';
import { resolvingPlazaRecipesGuideCookbookTitle } from '@/components/home/domains/definingPlazaRecipesGuideConstants';
import { Icon } from '@/components/ui/icon';
import { RenderingWorldPlazaInventoryItemGlyph } from '@/components/world/inventory/components/renderingWorldPlazaInventoryItemGlyph';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypes';
import { DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_INGREDIENT_ICON_PX } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeUiConstants';
import { LABELING_WORLD_PLAZA_CRAFT_MODE_RECIPE_REQUIRED_ITEMS } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeUiConstants';

const PLAZA_RECIPES_PANEL_HEADER_BUTTON_CLASS_NAME =
  'plaza-btn-3d flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-md border-2 border-poster-gold/60 bg-[linear-gradient(180deg,#2c4a52_0%,#223a42_100%)] text-parchment shadow-[0_4px_0_0_#14252b] [--plaza-edge:#14252b]';

const INGREDIENT_ICON_STYLE = {
  width: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_INGREDIENT_ICON_PX,
  height: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_INGREDIENT_ICON_PX,
} as const;

export type RenderingPlazaRecipesGuideDetailViewProps = {
  readonly entry: PlazaRecipesGuideDisplayEntry;
  readonly onBack: () => void;
  readonly onClose?: () => void;
  readonly className?: string;
};

/**
 * Shows one attached recipe's art, cookbook, and ingredient list.
 */
export function RenderingPlazaRecipesGuideDetailView({
  entry,
  onBack,
  onClose,
  className = '',
}: RenderingPlazaRecipesGuideDetailViewProps): React.JSX.Element {
  return (
    <div
      className={`plaza-panel plaza-pop-in flex h-[min(90dvh,42rem)] w-full max-w-md flex-col gap-3 overflow-hidden rounded-md p-4 font-body sm:h-[min(85dvh,42rem)] sm:gap-4 sm:p-6 ${className}`.trim()}
    >
      <div className="flex shrink-0 items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back"
          className={PLAZA_RECIPES_PANEL_HEADER_BUTTON_CLASS_NAME}
        >
          <Icon icon="mdi:arrow-left" className="size-5" aria-hidden />
        </button>
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-xl font-bold tracking-wide text-poster-teal-deep">
            {entry.title}
          </h2>
          <p className="text-sm font-medium italic text-ink-soft">
            {resolvingPlazaRecipesGuideCookbookTitle(entry.cookbookId)}
          </p>
        </div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className={PLAZA_RECIPES_PANEL_HEADER_BUTTON_CLASS_NAME}
          >
            <Icon icon="mdi:close" className="size-5" aria-hidden />
          </button>
        ) : null}
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto">
        <div className="flex justify-center rounded-md border border-poster-teal/20 bg-parchment/40 p-4">
          {entry.recipeDefinition.recipeVisual.visualKind ===
          'world-plaza-campfire' ? (
            <RenderingWorldPlazaCampfireRecipePreview />
          ) : (
            <Icon
              icon={entry.silhouetteIconifyIcon}
              className="size-20 text-[#8b5a2b]"
              aria-hidden
            />
          )}
        </div>

        <p className="text-sm font-medium leading-relaxed text-ink-soft">
          {entry.description}
        </p>

        <div className="flex flex-col gap-2">
          <h3 className="font-display text-xs font-bold uppercase tracking-wide text-poster-teal-deep">
            {LABELING_WORLD_PLAZA_CRAFT_MODE_RECIPE_REQUIRED_ITEMS}
          </h3>
          <ul className="flex flex-col gap-2">
            {entry.recipeDefinition.ingredients.map((ingredient) => {
              const itemDefinition =
                DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY.resolvingItemType(
                  ingredient.itemTypeId
                );

              return (
                <li
                  key={ingredient.itemTypeId}
                  className="flex items-center gap-2 text-sm font-semibold text-ink"
                >
                  <span className="inline-flex size-7 shrink-0 items-center justify-center">
                    <RenderingWorldPlazaInventoryItemGlyph
                      itemTypeId={ingredient.itemTypeId}
                      registry={DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY}
                      iconStyle={INGREDIENT_ICON_STYLE}
                      emojiStyle={INGREDIENT_ICON_STYLE}
                      fallbackTextStyle={INGREDIENT_ICON_STYLE}
                      emojiClassName="flex size-full items-center justify-center text-[1.25rem] leading-none"
                    />
                  </span>
                  <span>
                    {itemDefinition?.name ?? ingredient.itemTypeId} ×
                    {ingredient.quantity}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
