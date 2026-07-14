'use client';

/**
 * Left-page content for one craft cookbook recipe spread.
 *
 * @module components/world/building/components/renderingWorldPlazaCraftModeRecipeSpreadLeftPage
 */

import { Icon } from '@/components/ui/icon';
import { RenderingWorldPlazaCampfireRecipePreview } from '@/components/world/building/components/renderingWorldPlazaCampfireRecipePreview';
import { RenderingWorldPlazaCraftModeRecipeSpriteSheetPreview } from '@/components/world/building/components/renderingWorldPlazaCraftModeRecipeSpriteSheetPreview';
import type { DefiningWorldPlazaCraftModeRecipeDefinition } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeTypes';

export type RenderingWorldPlazaCraftModeRecipeSpreadLeftPageProps = {
  readonly recipeDefinition: DefiningWorldPlazaCraftModeRecipeDefinition;
};

/**
 * Renders title, recipe art, and description on the cookbook left page.
 */
export function RenderingWorldPlazaCraftModeRecipeSpreadLeftPage({
  recipeDefinition,
}: RenderingWorldPlazaCraftModeRecipeSpreadLeftPageProps): React.JSX.Element {
  return (
    <div className="flex min-h-0 flex-1 flex-col items-center gap-2 text-center">
      <h3 className="font-display text-sm font-bold uppercase tracking-wide text-[#4a3728] sm:text-base">
        {recipeDefinition.title}
      </h3>
      {recipeDefinition.recipeVisual.visualKind === 'world-plaza-campfire' ? (
        <RenderingWorldPlazaCampfireRecipePreview />
      ) : recipeDefinition.recipeVisual.visualKind === 'sprite-sheet' ? (
        <RenderingWorldPlazaCraftModeRecipeSpriteSheetPreview
          spriteSheetIcon={recipeDefinition.recipeVisual.spriteSheetIcon}
        />
      ) : (
        <Icon
          icon={recipeDefinition.recipeVisual.recipeEmblemIconifyIcon}
          className="size-16 text-[#8b5a2b] sm:size-20"
          aria-hidden
        />
      )}
      <p className="max-w-[15rem] text-[11px] font-medium leading-relaxed text-[#6b4e2e]/85 sm:text-xs">
        {recipeDefinition.description}
      </p>
    </div>
  );
}
