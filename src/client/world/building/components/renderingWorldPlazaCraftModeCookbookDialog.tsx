'use client';

/**
 * Pixel open-book dialog for one craft-mode cookbook.
 *
 * @module components/world/building/components/renderingWorldPlazaCraftModeCookbookDialog
 */

import { playingPlazaBookSfx } from '@/components/home/domains/playingPlazaBookSfx';
import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import { Icon } from '@/components/ui/icon';
import { RenderingWorldPlazaCraftModeRecipeSpreadLeftPage } from '@/components/world/building/components/renderingWorldPlazaCraftModeRecipeSpreadLeftPage';
import { RenderingWorldPlazaCraftModeRecipeSpreadRightPage } from '@/components/world/building/components/renderingWorldPlazaCraftModeRecipeSpreadRightPage';
import {
  DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_OPEN_BOOK_ASPECT_RATIO,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_OPEN_BOOK_URL,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_PAGE_LAYOUT,
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
  type CSSProperties,
  type SyntheticEvent,
} from 'react';
import { createPortal } from 'react-dom';

const COOKBOOK_CLOSE_BUTTON_CLASS_NAME =
  'flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-sm border border-parchment/40 bg-parchment text-ink shadow-[0_2px_0_0_rgba(46,36,22,0.55)] transition hover:bg-parchment-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-parchment/60 sm:size-9';

const COOKBOOK_PAGER_BUTTON_CLASS_NAME =
  'flex cursor-pointer items-center gap-1 rounded-sm border border-parchment/40 bg-parchment px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-ink shadow-[0_2px_0_0_rgba(46,36,22,0.55)] transition hover:bg-parchment-100 disabled:cursor-default disabled:opacity-35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-parchment/60';

function resolvingCookbookPageBoxStyle(side: 'left' | 'right'): CSSProperties {
  const layout = DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_PAGE_LAYOUT[side];

  return {
    top: `${layout.topPercent}%`,
    left: `${layout.leftPercent}%`,
    width: `${layout.widthPercent}%`,
    height: `${layout.heightPercent}%`,
  };
}

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

    playingPlazaBookSfx({ actionId: 'page_turn' });
    setLeafIndex(nextLeafIndex);
  };

  const blankPageCopy =
    isCraftingEnabled && cookbookRecipes.length === 0
      ? LABELING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_NO_RECIPES_PAGE
      : LABELING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_BLANK_PAGE;

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
      <div className="plaza-pop-in relative flex max-h-[calc(100dvh-3rem)] w-full max-w-[min(94vw,52rem)] flex-col items-center gap-3 overflow-y-auto font-body sm:gap-4">
        <header className="flex w-full items-center gap-3 px-2 sm:px-4">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <RenderingWorldPlazaCraftModeCookbookCoverGlyph
              cookbookDefinition={cookbookDefinition}
            />
            <div className="min-w-0">
              <h2 className="font-display text-base font-bold uppercase leading-tight tracking-wide text-parchment sm:text-lg md:text-xl">
                {cookbookDefinition.title}
              </h2>
              <p className="mt-1 text-xs font-medium italic leading-snug text-parchment/70 sm:text-sm">
                {cookbookDefinition.subtitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className={COOKBOOK_CLOSE_BUTTON_CLASS_NAME}
          >
            <Icon icon="mdi:close" className="size-4 sm:size-5" aria-hidden />
          </button>
        </header>

        <div
          className="relative w-full"
          style={{
            aspectRatio: String(
              DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_OPEN_BOOK_ASPECT_RATIO
            ),
          }}
        >
          <img
            src={DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_OPEN_BOOK_URL}
            alt=""
            draggable={false}
            className="pointer-events-none absolute inset-0 size-full select-none object-contain [image-rendering:pixelated]"
            aria-hidden
          />

          <div
            key={`${cookbookDefinition.id}-leaf-${leafIndex}-left`}
            className="scrollbar-none absolute flex flex-col overflow-y-auto overscroll-contain p-2 sm:p-3"
            style={resolvingCookbookPageBoxStyle('left')}
          >
            {activeRecipe ? (
              <RenderingWorldPlazaCraftModeRecipeSpreadLeftPage
                recipeDefinition={activeRecipe}
              />
            ) : (
              <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-2 text-center">
                <Icon
                  icon={cookbookDefinition.emblemIconifyIcon}
                  className="size-7 text-[#6b4e2e]/25 sm:size-8"
                  aria-hidden
                />
                <p className="max-w-[16rem] text-[11px] font-medium italic leading-relaxed text-[#6b4e2e]/70 sm:text-xs">
                  {blankPageCopy}
                </p>
              </div>
            )}
          </div>

          <div
            key={`${cookbookDefinition.id}-leaf-${leafIndex}-right`}
            className="scrollbar-none absolute flex flex-col overflow-y-auto overscroll-contain p-2 sm:p-3"
            style={resolvingCookbookPageBoxStyle('right')}
          >
            {activeRecipe ? (
              <RenderingWorldPlazaCraftModeRecipeSpreadRightPage
                recipeDefinition={activeRecipe}
                inventoryState={inventoryState}
                isCraftingEnabled={isCraftingEnabled}
                onCraftRecipe={onCraftRecipe}
              />
            ) : (
              <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-2 text-center">
                <Icon
                  icon={cookbookDefinition.emblemIconifyIcon}
                  className="size-7 text-[#6b4e2e]/20 sm:size-8"
                  aria-hidden
                />
                <p className="max-w-[16rem] text-[11px] font-medium italic leading-relaxed text-[#6b4e2e]/60 sm:text-xs">
                  {blankPageCopy}
                </p>
              </div>
            )}
          </div>
        </div>

        {showCookbookPager ? (
          <footer className="flex items-center justify-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => turningCookbookLeaf(-1)}
              disabled={leafIndex <= 0}
              className={COOKBOOK_PAGER_BUTTON_CLASS_NAME}
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
              className={COOKBOOK_PAGER_BUTTON_CLASS_NAME}
            >
              <span className="hidden sm:inline">Next</span>
              <Icon icon="mdi:chevron-right" className="size-4" aria-hidden />
            </button>
          </footer>
        ) : null}
      </div>
    </div>,
    document.body
  );
}
