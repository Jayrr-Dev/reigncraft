'use client';

/**
 * Craft-mode bottom toolbar: cookbook slots + recipe dialog.
 *
 * @module components/world/building/components/renderingWorldPlazaHudToolbarCraftModePanel
 */

import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import { RenderingWorldPlazaCraftModeCookbookDialog } from '@/components/world/building/components/renderingWorldPlazaCraftModeCookbookDialog';
import { RenderingWorldPlazaHudModeToolBoard } from '@/components/world/building/components/renderingWorldPlazaHudModeToolBoard';
import {
  resolvingWorldPlazaCraftModeCookbookDefinition,
  type DefiningWorldPlazaCraftModeCookbookId,
} from '@/components/world/building/domains/definingWorldPlazaCraftModeCookbookRegistry';
import { DEFINING_WORLD_PLAZA_HUD_MODE_TOOL_BOARD_ID } from '@/components/world/building/domains/definingWorldPlazaHudModeToolBoardConstants';
import { usingWorldPlazaViewportHudScaleContext } from '@/components/world/components/providingWorldPlazaViewportHudScale';
import type { DefiningWorldPlazaCraftModeRecipeId } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeTypes';
import { DEFINING_WORLD_PLAZA_CRAFT_MODE_PAGE_COUNT } from '@/components/world/domains/definingWorldPlazaHudToolbarCraftModeConstants';
import { RenderingWorldPlazaInventoryPageArrowButtons } from '@/components/world/inventory/components/renderingWorldPlazaInventoryPageArrowButtons';
import { resolvingWorldPlazaInventoryHotbarViewportStyles } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryHotbarViewportStyles';
import { useCallback, useMemo, useState } from 'react';

export type RenderingWorldPlazaHudToolbarCraftModePanelProps = {
  readonly inventoryState: DefiningInventoryState;
  readonly isCraftingEnabled: boolean;
  readonly openCookbookId: DefiningWorldPlazaCraftModeCookbookId | null;
  readonly onOpenCookbookIdChange: (
    cookbookId: DefiningWorldPlazaCraftModeCookbookId | null
  ) => void;
  readonly onCraftRecipe: (
    recipeId: DefiningWorldPlazaCraftModeRecipeId
  ) => void;
};

/**
 * Renders the Craft badge body in the bottom HUD stack.
 */
export function RenderingWorldPlazaHudToolbarCraftModePanel({
  inventoryState,
  isCraftingEnabled,
  openCookbookId,
  onOpenCookbookIdChange,
  onCraftRecipe,
}: RenderingWorldPlazaHudToolbarCraftModePanelProps): React.JSX.Element {
  const [craftPageIndex, setCraftPageIndex] = useState(0);
  const viewportHudScale = usingWorldPlazaViewportHudScaleContext();
  const viewportStyles = useMemo(
    () => resolvingWorldPlazaInventoryHotbarViewportStyles(viewportHudScale),
    [viewportHudScale]
  );

  const openCookbookDefinition =
    openCookbookId === null
      ? null
      : resolvingWorldPlazaCraftModeCookbookDefinition(openCookbookId);

  const closingCookbookDialog = useCallback((): void => {
    onOpenCookbookIdChange(null);
  }, [onOpenCookbookIdChange]);

  return (
    <>
      <RenderingWorldPlazaHudModeToolBoard
        boardId={DEFINING_WORLD_PLAZA_HUD_MODE_TOOL_BOARD_ID.CRAFT}
        activeToolId={openCookbookDefinition?.id ?? null}
        onActivateTool={(toolId) => {
          const cookbookDefinition =
            resolvingWorldPlazaCraftModeCookbookDefinition(toolId);

          if (cookbookDefinition === null) {
            return;
          }

          onOpenCookbookIdChange(cookbookDefinition.id);
        }}
        trailingContent={
          <RenderingWorldPlazaInventoryPageArrowButtons
            storagePageIndex={craftPageIndex}
            storagePageCount={DEFINING_WORLD_PLAZA_CRAFT_MODE_PAGE_COUNT}
            viewportStyles={viewportStyles}
            onStoragePageIndexChange={setCraftPageIndex}
          />
        }
      />
      <RenderingWorldPlazaCraftModeCookbookDialog
        cookbookDefinition={openCookbookDefinition}
        inventoryState={inventoryState}
        isCraftingEnabled={isCraftingEnabled}
        onCraftRecipe={onCraftRecipe}
        onClose={closingCookbookDialog}
      />
    </>
  );
}
