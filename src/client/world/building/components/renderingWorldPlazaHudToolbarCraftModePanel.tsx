'use client';

/**
 * Craft-mode bottom toolbar: cookbook slots + book dialog (blank pages).
 *
 * @module components/world/building/components/renderingWorldPlazaHudToolbarCraftModePanel
 */

import { RenderingWorldPlazaCraftModeCookbookDialog } from '@/components/world/building/components/renderingWorldPlazaCraftModeCookbookDialog';
import { RenderingWorldPlazaHudModeToolBoard } from '@/components/world/building/components/renderingWorldPlazaHudModeToolBoard';
import {
  resolvingWorldPlazaCraftModeCookbookDefinition,
  type DefiningWorldPlazaCraftModeCookbookId,
} from '@/components/world/building/domains/definingWorldPlazaCraftModeCookbookRegistry';
import { DEFINING_WORLD_PLAZA_HUD_MODE_TOOL_BOARD_ID } from '@/components/world/building/domains/definingWorldPlazaHudModeToolBoardConstants';
import { usingWorldPlazaViewportHudScaleContext } from '@/components/world/components/providingWorldPlazaViewportHudScale';
import { DEFINING_WORLD_PLAZA_CRAFT_MODE_PAGE_COUNT } from '@/components/world/domains/definingWorldPlazaHudToolbarCraftModeConstants';
import { RenderingWorldPlazaInventoryPageArrowButtons } from '@/components/world/inventory/components/renderingWorldPlazaInventoryPageArrowButtons';
import { resolvingWorldPlazaInventoryHotbarViewportStyles } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryHotbarViewportStyles';
import { useCallback, useMemo, useState } from 'react';

/**
 * Renders the Craft badge body in the bottom HUD stack.
 */
export function RenderingWorldPlazaHudToolbarCraftModePanel(): React.JSX.Element {
  const [craftPageIndex, setCraftPageIndex] = useState(0);
  const [openCookbookId, setOpenCookbookId] =
    useState<DefiningWorldPlazaCraftModeCookbookId | null>(null);
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
    setOpenCookbookId(null);
  }, []);

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

          setOpenCookbookId(cookbookDefinition.id);
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
        onClose={closingCookbookDialog}
      />
    </>
  );
}
