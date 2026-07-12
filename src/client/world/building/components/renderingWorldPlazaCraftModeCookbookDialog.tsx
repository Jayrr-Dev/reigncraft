'use client';

/**
 * Book-styled dialog for one craft-mode cookbook (blank pages until recipes).
 *
 * @module components/world/building/components/renderingWorldPlazaCraftModeCookbookDialog
 */

import { playingPlazaBookSfx } from '@/components/home/domains/playingPlazaBookSfx';
import { Icon } from '@/components/ui/icon';
import {
  LABELING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_BLANK_PAGE,
  resolvingWorldPlazaCraftModeCookbookSpriteSheetIcon,
  type DefiningWorldPlazaCraftModeCookbookDefinition,
} from '@/components/world/building/domains/definingWorldPlazaCraftModeCookbookRegistry';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import { DEFINING_WORLD_PLAZA_CODEX_OVERLAY_CLASS_NAME } from '@/components/world/domains/definingWorldPlazaCodexConstants';
import { useCallback, useEffect, useState, type SyntheticEvent } from 'react';
import { createPortal } from 'react-dom';

const COOKBOOK_HEADER_BUTTON_CLASS_NAME =
  'plaza-btn-3d flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-md border-2 border-poster-gold/60 bg-[linear-gradient(180deg,#2c4a52_0%,#223a42_100%)] text-parchment shadow-[0_4px_0_0_#14252b] [--plaza-edge:#14252b]';

const COOKBOOK_PAGER_BUTTON_CLASS_NAME =
  'flex cursor-pointer items-center gap-1 rounded-sm border border-poster-teal/25 bg-parchment/50 px-2 py-1 text-xs font-bold uppercase tracking-wide text-poster-teal-deep transition hover:bg-parchment/80 disabled:cursor-default disabled:opacity-35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-poster-teal/40';

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
      className="block size-8 shrink-0 [image-rendering:pixelated]"
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

function RenderingWorldPlazaCraftModeCookbookBlankLeaf({
  cookbookDefinition,
  side,
}: {
  readonly cookbookDefinition: DefiningWorldPlazaCraftModeCookbookDefinition;
  readonly side: 'left' | 'right';
}): React.JSX.Element {
  return (
    <div
      className={`lore-book-page h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden ${
        side === 'left'
          ? 'lore-book-page--left hidden rounded-l-md rounded-r-sm sm:flex'
          : 'lore-book-page--right flex rounded-r-md rounded-l-sm'
      }`}
    >
      <div className="lore-book-page-turn flex min-h-0 flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
        <Icon
          icon={cookbookDefinition.emblemIconifyIcon}
          className="size-8 text-ink-soft/25"
          aria-hidden
        />
        <p className="max-w-56 text-sm font-medium italic leading-relaxed text-ink-soft/60">
          {LABELING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_BLANK_PAGE}
        </p>
      </div>
    </div>
  );
}

/** Props for {@link RenderingWorldPlazaCraftModeCookbookDialog}. */
export type RenderingWorldPlazaCraftModeCookbookDialogProps = {
  readonly cookbookDefinition: DefiningWorldPlazaCraftModeCookbookDefinition | null;
  readonly onClose: () => void;
};

/**
 * Modal book dialog: cookbook cover chrome around a blank two-page spread.
 */
export function RenderingWorldPlazaCraftModeCookbookDialog({
  cookbookDefinition,
  onClose,
}: RenderingWorldPlazaCraftModeCookbookDialogProps): React.JSX.Element | null {
  const isOpen = cookbookDefinition !== null;
  const [leafIndex, setLeafIndex] = useState(0);
  const leafCount = Math.max(1, cookbookDefinition?.blankPageCount ?? 1);

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
      <div className="lore-book-cover plaza-pop-in flex h-[min(80dvh,36rem)] w-full max-w-3xl flex-col gap-3 overflow-hidden rounded-lg p-3 font-body sm:p-4">
        <div className="relative flex shrink-0 items-center gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-md border-2 border-poster-gold/50 bg-black/25">
            <RenderingWorldPlazaCraftModeCookbookCoverGlyph
              cookbookDefinition={cookbookDefinition}
            />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-xl font-bold tracking-wide text-parchment">
              {cookbookDefinition.title}
            </h2>
            <p className="truncate text-xs font-medium italic text-parchment/65 sm:text-sm">
              {cookbookDefinition.subtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className={COOKBOOK_HEADER_BUTTON_CLASS_NAME}
          >
            <Icon icon="mdi:close" className="size-5" aria-hidden />
          </button>
        </div>

        <div
          key={`${cookbookDefinition.id}-leaf-${leafIndex}`}
          className="relative flex min-h-0 flex-1 gap-1.5 overflow-hidden"
        >
          <RenderingWorldPlazaCraftModeCookbookBlankLeaf
            cookbookDefinition={cookbookDefinition}
            side="left"
          />
          <RenderingWorldPlazaCraftModeCookbookBlankLeaf
            cookbookDefinition={cookbookDefinition}
            side="right"
          />
        </div>

        <footer className="flex shrink-0 items-center justify-between gap-2 px-1">
          <button
            type="button"
            onClick={() => turningCookbookLeaf(-1)}
            disabled={leafIndex <= 0}
            className={COOKBOOK_PAGER_BUTTON_CLASS_NAME}
          >
            <Icon icon="mdi:chevron-left" className="size-4" aria-hidden />
            <span className="hidden sm:inline">Previous</span>
          </button>
          <span className="font-mono text-[11px] font-medium text-parchment/70">
            Page {leafIndex + 1} of {leafCount}
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
      </div>
    </div>,
    document.body
  );
}
