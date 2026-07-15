'use client';

/**
 * Pixel open-book dialog for one craft-mode cookbook.
 *
 * @module components/world/building/components/renderingWorldPlazaCraftModeCookbookDialog
 */

import { RenderingPlazaOpenBookFrame } from '@/components/home/components/renderingPlazaOpenBookFrame';
import {
  DEFINING_PLAZA_BUTTON_SFX_KIND,
  definingPlazaButtonSfxDataAttributes,
} from '@/components/home/domains/definingPlazaDefaultButtonSfxConstants';
import { DEFINING_PLAZA_OPEN_BOOK_PAGER_BUTTON_CLASS_NAME } from '@/components/home/domains/definingPlazaOpenBookUiConstants';
import { playingPlazaBookSfx } from '@/components/home/domains/playingPlazaBookSfx';
import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import { Icon } from '@/components/ui/icon';
import { RenderingWorldPlazaCraftModeRecipeSpreadLeftPage } from '@/components/world/building/components/renderingWorldPlazaCraftModeRecipeSpreadLeftPage';
import { RenderingWorldPlazaCraftModeRecipeSpreadRightPage } from '@/components/world/building/components/renderingWorldPlazaCraftModeRecipeSpreadRightPage';
import {
  LABELING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_BLANK_PAGE,
  resolvingWorldPlazaCraftModeCookbookSpriteSheetIcon,
  type DefiningWorldPlazaCraftModeCookbookDefinition,
} from '@/components/world/building/domains/definingWorldPlazaCraftModeCookbookRegistry';
import type { DefiningWorldPlazaCraftModeRecipeId } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeTypes';
import { LABELING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_NO_RECIPES_PAGE } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeUiConstants';
import { listingWorldPlazaCraftRecipesForCookbook } from '@/components/world/crafting/domains/listingWorldPlazaCraftRecipesForCookbook';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import { DEFINING_WORLD_PLAZA_CODEX_OVERLAY_CLASS_NAME } from '@/components/world/domains/definingWorldPlazaCodexConstants';
import {
  gettingWorldPlazaRecipeAttachedSnapshot,
  subscribingWorldPlazaRecipeDiscovery,
} from '@/components/world/domains/managingWorldPlazaRecipeDiscoveryStore';
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type SyntheticEvent,
} from 'react';
import { createPortal } from 'react-dom';

function RenderingWorldPlazaCraftModeCookbookCoverGlyph({
  cookbookDefinition,
}: {
  readonly cookbookDefinition: DefiningWorldPlazaCraftModeCookbookDefinition;
}): React.JSX.Element {
  const spriteSheet =
    resolvingWorldPlazaCraftModeCookbookSpriteSheetIcon(cookbookDefinition);
  const backgroundPositionX =
    spriteSheet.columnCount <= 1
      ? 0
      : (spriteSheet.columnIndex / (spriteSheet.columnCount - 1)) * 100;

  return (
    <span
      className="inline-block size-12 shrink-0 [image-rendering:pixelated] sm:size-14"
      style={{
        backgroundImage: `url("${spriteSheet.spriteSheetUrl}")`,
        backgroundPosition: `${backgroundPositionX}% 0%`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: `${spriteSheet.columnCount * 100}% ${spriteSheet.rowCount * 100}%`,
      }}
      aria-hidden
    />
  );
}

/** Props for {@link RenderingWorldPlazaCraftModeCookbookDialog}. */
export type RenderingWorldPlazaCraftModeCookbookDialogProps = {
  readonly cookbookDefinition: DefiningWorldPlazaCraftModeCookbookDefinition | null;
  readonly inventoryState: DefiningInventoryState;
  readonly isCraftingEnabled: boolean;
  readonly onCraftRecipe: (
    recipeId: DefiningWorldPlazaCraftModeRecipeId
  ) => void;
  readonly onClose: () => void;
};

/**
 * Modal dialog: pixel open-book art with recipe spreads or blank pages.
 */
export function RenderingWorldPlazaCraftModeCookbookDialog({
  cookbookDefinition,
  inventoryState,
  isCraftingEnabled,
  onCraftRecipe,
  onClose,
}: RenderingWorldPlazaCraftModeCookbookDialogProps): React.JSX.Element | null {
  const isOpen = cookbookDefinition !== null;
  const [leafIndex, setLeafIndex] = useState(0);
  const attachedRecipeIds = useSyncExternalStore(
    subscribingWorldPlazaRecipeDiscovery,
    gettingWorldPlazaRecipeAttachedSnapshot,
    gettingWorldPlazaRecipeAttachedSnapshot
  );
  const attachedRecipeIdSet = useMemo(
    () => new Set(attachedRecipeIds),
    [attachedRecipeIds]
  );

  const cookbookRecipes = useMemo(
    () =>
      cookbookDefinition === null
        ? []
        : listingWorldPlazaCraftRecipesForCookbook(cookbookDefinition.id, {
            attachedRecipeIds: attachedRecipeIdSet,
          }),
    [attachedRecipeIdSet, cookbookDefinition]
  );

  const leafCount =
    isCraftingEnabled && cookbookRecipes.length > 0
      ? cookbookRecipes.length
      : 1;
  const showCookbookPager = leafCount > 1;
  const activeRecipe =
    isCraftingEnabled && cookbookRecipes.length > 0
      ? (cookbookRecipes[leafIndex] ?? null)
      : null;

  const stoppingPlazaWalkPointerPropagation = useCallback(
    (event: SyntheticEvent<HTMLElement>): void => {
      event.stopPropagation();
    },
    []
  );

  const closingDialogOnBackdropClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>): void => {
      if (event.target !== event.currentTarget) {
        return;
      }

      onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setLeafIndex(0);
    playingPlazaBookSfx({ actionId: 'open' });

    return () => {
      playingPlazaBookSfx({ actionId: 'close' });
    };
  }, [isOpen, cookbookDefinition?.id]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const dismissingDialogOnEscape = (event: KeyboardEvent): void => {
      if (event.key !== 'Escape') {
        return;
      }

      onClose();
    };

    document.addEventListener('keydown', dismissingDialogOnEscape);

    return () => {
      document.removeEventListener('keydown', dismissingDialogOnEscape);
    };
  }, [isOpen, onClose]);

  if (cookbookDefinition === null || typeof document === 'undefined') {
    return null;
  }

  const turningCookbookLeaf = (direction: -1 | 1): void => {
    const nextLeafIndex = Math.min(
      leafCount - 1,
      Math.max(0, leafIndex + direction)
    );

    if (nextLeafIndex === leafIndex) {
      return;
    }

    setLeafIndex(nextLeafIndex);
  };

  const blankPageCopy =
    isCraftingEnabled && cookbookRecipes.length === 0
      ? LABELING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_NO_RECIPES_PAGE
      : LABELING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_BLANK_PAGE;

  const renderingBlankPage = (
    iconClassName: string,
    copyClassName: string
  ): React.JSX.Element => (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-2 text-center">
      <Icon
        icon={cookbookDefinition.emblemIconifyIcon}
        className={`size-7 sm:size-8 ${iconClassName}`}
        aria-hidden
      />
      <p
        className={`max-w-[16rem] text-[11px] font-medium italic leading-relaxed sm:text-xs ${copyClassName}`}
      >
        {blankPageCopy}
      </p>
    </div>
  );

  return createPortal(
    <div
      {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
      role="dialog"
      aria-modal="true"
      aria-label={cookbookDefinition.title}
      className={DEFINING_WORLD_PLAZA_CODEX_OVERLAY_CLASS_NAME}
      onPointerDown={stoppingPlazaWalkPointerPropagation}
      onClick={closingDialogOnBackdropClick}
    >
      <RenderingPlazaOpenBookFrame
        title={cookbookDefinition.title}
        subtitle={cookbookDefinition.subtitle}
        onClose={onClose}
        headerLeading={
          <RenderingWorldPlazaCraftModeCookbookCoverGlyph
            cookbookDefinition={cookbookDefinition}
          />
        }
        leftPage={
          activeRecipe ? (
            <RenderingWorldPlazaCraftModeRecipeSpreadLeftPage
              recipeDefinition={activeRecipe}
            />
          ) : (
            renderingBlankPage('text-[#6b4e2e]/25', 'text-[#6b4e2e]/70')
          )
        }
        rightPage={
          activeRecipe ? (
            <RenderingWorldPlazaCraftModeRecipeSpreadRightPage
              recipeDefinition={activeRecipe}
              inventoryState={inventoryState}
              isCraftingEnabled={isCraftingEnabled}
              onCraftRecipe={onCraftRecipe}
            />
          ) : (
            renderingBlankPage('text-[#6b4e2e]/20', 'text-[#6b4e2e]/60')
          )
        }
        leftPageKey={`${cookbookDefinition.id}-leaf-${leafIndex}-left`}
        rightPageKey={`${cookbookDefinition.id}-leaf-${leafIndex}-right`}
        footer={
          showCookbookPager ? (
            <footer className="flex items-center justify-center gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() => turningCookbookLeaf(-1)}
                disabled={leafIndex <= 0}
                {...definingPlazaButtonSfxDataAttributes(
                  DEFINING_PLAZA_BUTTON_SFX_KIND.bookPageTurn
                )}
                className={DEFINING_PLAZA_OPEN_BOOK_PAGER_BUTTON_CLASS_NAME}
              >
                <Icon icon="mdi:chevron-left" className="size-4" aria-hidden />
                <span className="hidden sm:inline">Prev</span>
              </button>
              <span className="font-mono text-xs font-medium text-parchment/75 sm:text-sm">
                {leafIndex + 1}/{leafCount}
              </span>
              <button
                type="button"
                onClick={() => turningCookbookLeaf(1)}
                disabled={leafIndex >= leafCount - 1}
                {...definingPlazaButtonSfxDataAttributes(
                  DEFINING_PLAZA_BUTTON_SFX_KIND.bookPageTurn
                )}
                className={DEFINING_PLAZA_OPEN_BOOK_PAGER_BUTTON_CLASS_NAME}
              >
                <span className="hidden sm:inline">Next</span>
                <Icon icon="mdi:chevron-right" className="size-4" aria-hidden />
              </button>
            </footer>
          ) : null
        }
      />
    </div>,
    document.body
  );
}
